import { Injectable } from '@nestjs/common';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'path';
import * as _ from 'lodash';

import { PrismaService } from 'src/prisma.service';
import { SubdistrictService } from 'src/subdistrict/subdistrict.service';
import { parseWeekdayDescriptions, slugify } from 'src/helper';

@Injectable()
export class ScrappingService {
  constructor(
    private prismaService: PrismaService,
    private subdistrictService: SubdistrictService,
  ) {}
  async scrap(query: string) {
    const filePath =
      'C:/Users/adiof/Documents/Mahasiswa Adi/PKM/json/raw/all-result.json';
    const allResults: any = JSON.parse(
      await readFile(filePath, { encoding: 'utf-8' }),
    ); // Initialize an array to store all results
    let nextPageToken = null; // Initialize nextPageToken
    const url =
      'https://places.googleapis.com/v1/places:searchText?languageCode=id&textQuery=' +
      query;
    const headers = [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.rating',
      'places.addressComponents',
      'places.location',
      'places.regularOpeningHours',
      'places.websiteUri',
      'places.nationalPhoneNumber',
      'places.parkingOptions',
      'places.accessibilityOptions',
      'places.liveMusic',
      'places.servesCoffee',
      'places.restroom',
      'places.reservable',
      'places.servesVegetarianFood',
      'places.servesCocktails',
      'places.allowsDogs',
      'places.curbsidePickup',
      'places.delivery',
      'places.goodForGroups',
      'places.menuForChildren',
      'places.outdoorSeating',
      'places.servesCoffee',
      'places.dineIn',
      'places.photos',
      'places.paymentOptions',
      'nextPageToken',
    ];

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
            'X-Goog-FieldMask': headers.join(','),
          },
          method: 'POST',
        });
        const result = await response.json();

        result.places.forEach((place) => {
          // Check if the place already exists in allResults
          if (
            !allResults.some((existingPlace) => existingPlace.id === place.id)
          ) {
            // If not, push it into allResults
            allResults.push(place);
          }
        });
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
    const filePath =
      'C:/Users/adiof/Documents/Mahasiswa Adi/PKM/json/raw/all-result.json';
    const allResults: object[] = JSON.parse(
      await readFile(filePath, { encoding: 'utf-8' }),
    );
    const uniqueResults = _.uniqBy(allResults, 'id');
    await writeFile(filePath, JSON.stringify(uniqueResults, null, 2));
  }

  async modify({ nameFile }: { nameFile: string }) {
    const preferences = [
      'allowsDogs',
      'curbsidePickup',
      'dineIn',
      'goodForGroups',
      'menuForChildren',
      'outdoorSeating',
      'servesCocktails',
      'servesVegetarianFood',
      'wifi',
      'takeout',
      'delivery',
      'liveMusic',
      'restRoom',
      'servesCoffee',
      'smokingArea',
      'reservable',
    ];
    try {
      const filePath = `C:/Users/adiof/Documents/Mahasiswa Adi/PKM/json/raw/${nameFile}.json`;
      const filePathDestination = `C:/Users/adiof/Documents/Mahasiswa Adi/PKM/json/modified/${nameFile}.json`;
      const contents = JSON.parse(
        await readFile(filePath, { encoding: 'utf-8' }),
      );
      const processContent = await Promise.all(
        _.map(contents, async (place) => {
          if (!place.regularOpeningHours) {
            return;
          }

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
                      maxWidth: image.widthPx,
                      maxHeight: image.heightPx,
                    }),
                ),
              )
            : null;
          return {
            address: place.formattedAddress,
            location: place.location,
            placeGoogleId: place.id,
            googleRating: place.rating,
            name: place.displayName.text,
            phoneNumber: place.nationalPhoneNumber,
            subdistrict: subdistrictId,
            images: images,
            operational: parseWeekdayDescriptions(
              place.regularOpeningHours.weekdayDescriptions,
            ),
            website: place.websiteUri,
            preferences: {
              ..._.pickBy(
                _.mapValues(place, (value, key) => {
                  return preferences.includes(key) && value;
                }),
              ),
              ...(place.paymentOptions &&
              'acceptsCashOnly' in place.paymentOptions
                ? !place.paymentOptions.acceptsCashOnly
                  ? _.pickBy(
                      _.mapValues(place.paymentOptions, (value, key) => {
                        return (
                          (key === 'acceptsDebitCards' ||
                            key === 'acceptsCreditCards') &&
                          value
                        );
                      }),
                    )
                  : { acceptsCashOnly: true }
                : { acceptsCashOnly: true }),
            },
          };
        }),
      );
      await writeFile(
        filePathDestination,
        JSON.stringify(processContent, null, 2),
      );
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async partialize({ nameFile, slice }: { nameFile: string; slice: number }) {
    try {
      const filePath = `C:/Users/adiof/Documents/Mahasiswa Adi/PKM/json/raw/${nameFile}.json`;
      const contents = JSON.parse(
        await readFile(filePath, { encoding: 'utf-8' }),
      );
      // Calculate chunk size for exactly 3 parts
      const chunkSize = Math.ceil(contents.length / slice);
      // Partialize the content to 3 files
      const partializeContent = _.chunk(contents, chunkSize);
      // Create a file for each partialized content ending with an index
      await Promise.all(
        _.map(partializeContent, async (partialContent, index) => {
          const filePathDestination = `C:/Users/adiof/Documents/Mahasiswa Adi/PKM/json/raw/${nameFile}-${index}.json`;
          await writeFile(
            filePathDestination,
            JSON.stringify(partialContent, null, 2),
          );
        }),
      );
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async addPreferences({ nameFile }: { nameFile: string }) {
    try {
      const filePath = `C:/Users/adiof/Documents/Mahasiswa Adi/PKM/json/modified/${nameFile}.json`;
      const sourceOrigin = `C:/Users/adiof/Documents/Mahasiswa Adi/PKM/json/raw/all-result.json`;
      const contents = JSON.parse(
        await readFile(filePath, { encoding: 'utf-8' }),
      );
      const sourceContent = JSON.parse(
        await readFile(sourceOrigin, { encoding: 'utf-8' }),
      );

      contents.forEach((place: any) => {
        const source = _.find(sourceContent, (placeOrigin: any) => {
          return placeOrigin.id === place.placeGoogleId;
        });
        contents.preferences = {
          ...contents.preferences,
          ...(!!source.allowsDogs && { allowsDogs: source.allowsDogs }),
          ...(!!source.restroom && { restroom: source.restroom }),
        };
      });
      await writeFile(filePath, JSON.stringify(contents, null, 2));
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async insert({ nameFile }: { nameFile: string }) {
    try {
      const filePath = `C:/Users/adiof/Documents/Mahasiswa Adi/PKM/json/modified/${nameFile}.json`;
      const contents = JSON.parse(
        await readFile(filePath, { encoding: 'utf-8' }),
      );
      const dataPreferenceHeap =
        await this.prismaService.placePreferences.findMany();
      const processContent = await Promise.all(
        _.forEach(contents, async (item) => {
          //check if item have phoneNumber or not, if not then skip it to next iteration
          if (!item || !item.phoneNumber) {
            return;
          }
          //check if item is exist in database or not, if exist then skip it to next iteration
          const isExist = await this.prismaService.place.findFirst({
            where: {
              placeGoogleId: item.placeGoogleId,
            },
          });
          if (isExist) {
            return;
          }

          const resultInsert = await this.prismaService.place.create({
            data: {
              slug: slugify(item.name),
              placeGoogleId: item.placeGoogleId,
              googleRating: item.googleRating,
              name: item.name,
              address: item.address,
              location: {
                type: 'Point',
                coordinates: [item.location.longitude, item.location.latitude],
              },
              openingHours: item.operational,
              websiteUri: item.website,
              phoneNumber: item.phoneNumber,
              subdistrictId: item.subdistrict.id,
            },
          });

          //get all key of preference
          const preferences = Object.keys(item.preferences);
          await Promise.all(
            Array.from(preferences).map(async (preference) => {
              const preferenceFind = _.find(
                dataPreferenceHeap,
                (preferenceHeap) => {
                  return preferenceHeap.value === preference;
                },
              );
              if (preferenceFind) {
                await this.prismaService.placePreferencesOnPlace.create({
                  data: {
                    placeId: resultInsert.id,
                    placePreferencesId: preferenceFind.id,
                  },
                });
              }
            }),
          );

          if (!!item.images) {
            await Promise.all(
              _.forEach(item.images, async (image, index: number) => {
                //if image is null then skip to next iteration
                if (!image) {
                  return;
                }
                await this.prismaService.placePhoto.create({
                  data: {
                    thumbnailPosition: index < 4 ? index + 1 : undefined,
                    type: index === 0 ? 'thumbnail' : 'gallery',
                    url: image,
                    place: {
                      connect: {
                        id: resultInsert.id,
                      },
                    },
                  },
                });
              }),
            );
          }
        }),
      );
      return processContent;
    } catch (err) {
      return err;
    }
  }

  async groupingBySubdistrict() {
    try {
      const filePath =
        'C:/Users/adiof/Documents/Mahasiswa Adi/PKM/json/raw/all-result.json';
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
    maxWidth,
    maxHeight,
  }: {
    placeImage: string;
    maxWidth: number;
    maxHeight: number;
  }) {
    const image = (
      await fetch(
        `https://places.googleapis.com/v1/${placeImage}/media?key=${process.env.GOOGLE_API_KEY}&maxHeightPx=${maxHeight}&maxWidthPx=${maxWidth}&skipHttpRedirect=true`,
      )
    ).json();
    return image.then((data) => data.photoUri);
  }
}
