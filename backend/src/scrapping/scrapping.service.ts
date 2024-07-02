import { Injectable } from '@nestjs/common';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'path';
import * as _ from 'lodash';

import { PrismaService } from 'src/prisma.service';
import { indoDays } from 'src/constant';
import { SubdistrictService } from 'src/subdistrict/subdistrict.service';
import { slugify } from 'src/helper';

@Injectable()
export class ScrappingService {
  constructor(
    private prismaService: PrismaService,
    private subdistrictService: SubdistrictService,
  ) {}
  async scrap(query: string) {
    const filePath = join(__dirname, '../../data.json');
    const allResults: object[] = JSON.parse(
      await readFile(filePath, { encoding: 'utf-8' }),
    ); // Initialize an array to store all results
    let nextPageToken = null; // Initialize nextPageToken
    const url =
      'https://places.googleapis.com/v1/places:searchText?textQuery=' + query;

    try {
      do {
        // Construct the URL with nextPageToken if it exists
        const fetchUrl = nextPageToken
          ? `${url}&pageToken=${nextPageToken}`
          : url;
        const response = await fetch(fetchUrl, {
          headers: {
            Accept: 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
            'Content-Type': 'application/json',
            'X-Goog-FieldMask':
              'places.id,places.displayName,places.formattedAddress,places.addressComponents,places.location,places.regularOpeningHours,places.delivery,places.takeout,places.websiteUri,places.parkingOptions,places.liveMusic,places.servesCoffee,places.restroom,places.reservable,places.nationalPhoneNumber,places.photos,places.paymentOptions,nextPageToken',
          },
          method: 'POST',
        });
        const result = await response.json();

        //check if the result is exists in the data.json
        const data = JSON.parse(
          await readFile(filePath, { encoding: 'utf-8' }),
        );

        //filter result from data.json
        const filterResult = _.filter(result.places, (place) => {
          return !_.find(data.places, (dataPlace) => {
            return dataPlace.id === place.id;
          });
        });

        allResults.push(...filterResult); // Merge current page's results into allResults
        nextPageToken = result.nextPageToken; // Update nextPageToken for the next iteration
      } while (nextPageToken); // Continue if there's a nextPageToken

      // Once all pages have been fetched, write the results to data.json
      await writeFile(filePath, JSON.stringify(allResults, null, 2));
      return 'Success';
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async removeDuplicate() {
    const filePath = join(__dirname, '../../data.json');
    const allResults: object[] = JSON.parse(
      await readFile(filePath, { encoding: 'utf-8' }),
    );
    const uniqueResults = _.uniqBy(allResults, 'id');
    await writeFile(filePath, JSON.stringify(uniqueResults, null, 2));
  }

  async modify() {
    try {
      const filePath =
        'C:/Users/adiof/Documents/Mahasiswa Adi/PKM/json/raw/Candipuro.json';
      const filePathDestination =
        'C:/Users/adiof/Documents/Mahasiswa Adi/PKM/json/prettier-subdistrict/Candipuro.json';
      const contents = JSON.parse(
        await readFile(filePath, { encoding: 'utf-8' }),
      );
      const processContent = await Promise.all(
        _.map(contents, async (place) => {
          const formatPeriods = !!place.regularOpeningHours
            ? _.map(place.regularOpeningHours.periods, ({ open, close }) => {
                const formatHour = (hour: number) =>
                  hour < 10 ? `0${hour}` : hour;
                const formatMinute = (minute: number) =>
                  minute < 10 ? `0${minute}` : minute;

                const openTime = `${formatHour(open.hour)}:${formatMinute(open.minute)}`;
                const closeTime = close
                  ? `${formatHour(close.hour)}:${formatMinute(close.minute)}`
                  : null;

                return {
                  day: indoDays[open.day],
                  openHours: openTime,
                  closeHours: closeTime,
                };
              })
            : undefined;
          const subdistrict = _.find(place.addressComponents, (component) => {
            return component.types[0] === 'administrative_area_level_3';
          }).longText.split(' ')[1];
          const subdistrictId =
            await this.subdistrictService.findByName(subdistrict);
          const images = place.photos
            ? await Promise.all(
                place.photos.map(
                  async (image) =>
                    await this.getPlaceImage({
                      placeImage: image.name,
                      maxWidthPx: 1280,
                      maxHeightPx: 1280,
                    }),
                ),
              )
            : null;
          return {
            address: place.formattedAddress,
            location: place.location,
            name: place.displayName.text,
            phoneNumber: place.nationalPhoneNumber,
            subdistrict: subdistrictId,
            images: images,
            operational: formatPeriods,
          };
        }),
      );
      return [...processContent];
    } catch (err) {
      console.log(err);
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
              slug: slugify(item.name),
              phoneNumber: item.phoneNumber,
              subdistrictId: item.subdistrict.id,
              openingHours: item.operational,
            },
          });

          await Promise.all(
            _.forEach(item.images, async (image, index: number) => {
              await this.prismaService.placePhoto.create({
                data: {
                  type: index === 1 ? 'thumbnail' : 'gallery',
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

  async groupingBySubdistrict() {
    try {
      const filePath = join(__dirname, '../../data.json');
      const contents = JSON.parse(
        await readFile(filePath, { encoding: 'utf-8' }),
      );
      const groupedBySubdistrict = _.groupBy(contents, (place) => {
        const subdistrict = _.find(place.addressComponents, (component) => {
          return component.types[0] === 'administrative_area_level_3';
        }).longText.split(' ')[1];
        return subdistrict;
      });

      // Pastikan direktori tujuan ada
      const baseDir = 'C:/Users/adiof/Documents/Mahasiswa Adi/PKM/json/raw/';
      await mkdir(baseDir, { recursive: true });

      // Buat file untuk setiap kecamatan
      await Promise.all(
        _.map(groupedBySubdistrict, async (places, subdistrict) => {
          const subdistrictFilePath = join(baseDir, `${subdistrict}.json`);
          await writeFile(subdistrictFilePath, JSON.stringify(places, null, 2));
        }),
      );

      return 'success';
    } catch (error) {
      console.error('Error during grouping by subdistrict:', error);
      return error;
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
