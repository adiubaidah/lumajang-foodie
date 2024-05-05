import { Injectable } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { join } from 'path';
import * as _ from 'lodash';

import { PrismaService } from 'src/prisma.service';
import { indoDays } from 'src/constant';
import { SubdistrictService } from 'src/subdistrict/subdistrict.service';

@Injectable()
export class ScrappingService {
  constructor(
    private prismaService: PrismaService,
    private subdistrictService: SubdistrictService,
  ) {}
  async scrapping() {
    try {
      const filePath = join(__dirname, '../../data.json');

      const contents = JSON.parse(
        await readFile(filePath, { encoding: 'utf-8' }),
      ).places;
      const processContent = await Promise.all(
        _.map(contents, async (place) => {
          const formatPeriods = _.map(
            place.regularOpeningHours.periods,
            ({ open, close }) => {
              const formatHour = (hour: number) =>
                hour < 10 ? `0${hour}` : hour;
              const formatMinute = (minute: number) =>
                minute < 10 ? `0${minute}` : minute;

              const openTime = `${formatHour(open.hour)}:${formatMinute(open.minute)}`;
              const closeTime = `${formatHour(close.hour)}:${formatMinute(close.minute)}`;

              return {
                day: indoDays[open.day],
                openHours: openTime,
                closeHours: closeTime,
              };
            },
          );
          const subdistrict = _.find(place.addressComponents, (component) => {
            return component.types[0] === 'administrative_area_level_3';
          }).longText.split(' ')[1];
          const subdistrictId =
            await this.subdistrictService.findByName(subdistrict);
          const images = await Promise.all(
            place.photos.map(
              async (image) =>
                await this.getPlaceImage({
                  placeImage: image.name,
                  maxWidthPx: 1280,
                  maxHeightPx: 1280,
                }),
            ),
          );
          return {
            address: place.formattedAddress,
            location: place.location,
            name: place.displayName.text,
            phoneNumber: place.nationalPhoneNumber,
            subdistrict: subdistrictId,
            images: [...images],
            operational: [...formatPeriods],
          };
        }),
      );
      return processContent;
    } catch (err) {
      return err;
    }
  }

  async insert() {
    try {
      const filePath = join(__dirname, '../../data-pkm.json');
      const contents = JSON.parse(
        await readFile(filePath, { encoding: 'utf-8' }),
      );
      const processContent = await Promise.all(
        _.forEach(contents, async (item) => {
          const resultInsert = await this.prismaService.place.create({
            data: {
              address: item.address,
              location: {
                type: 'Point',
                coordinates: item.location.coordinates.reverse(),
              },
              name: item.name,
              slug: item.name,
              phoneNumber: item.phoneNumber,
              subdistrictId: item.subdistrict.id,
              openingHours: item.operational,
            },
          });

          await Promise.all(
            _.forEach(item.images, async (image) => {
              await this.prismaService.photo.create({
                data: {
                  type: 'gallery',
                  url: image,
                  placeId: resultInsert.id,
                },
              });
            }),
          );
        }),
      );
      return processContent;
    } catch (err) {
      return err;
    }
  }

  async getPlaceImage({
    placeImage,
    maxHeightPx,
    maxWidthPx,
  }: {
    placeImage: string;
    maxHeightPx: number;
    maxWidthPx: number;
  }) {
    const image = (
      await fetch(
        `https://places.googleapis.com/v1/${placeImage}/media?key=${process.env.GOOGLE_API_KEY}&maxHeightPx=${maxHeightPx}&maxWidthPx=${maxWidthPx}&skipHttpRedirect=true`,
      )
    ).json();
    return image.then((data) => data.photoUri);
  }
}
