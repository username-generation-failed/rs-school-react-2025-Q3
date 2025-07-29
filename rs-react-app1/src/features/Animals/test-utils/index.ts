import type { PaginatedResponceDto } from '~features/Animals/types';
import { faker } from '@faker-js/faker';

export const generatePaginatedAnimals = (
  pageSize: number
): PaginatedResponceDto => ({
  count: faker.number.int({ min: pageSize }),
  pageSize,
  result: generateAnimals(pageSize),
});

export const generateAnimals = (n: number) =>
  faker.helpers.uniqueArray(faker.string.uuid, n).map((uid) => ({
    uid,
    name: faker.animal.type(),
    earthAnimal: faker.datatype.boolean(),
    earthInsect: faker.datatype.boolean(),
    avian: faker.datatype.boolean(),
    canine: faker.datatype.boolean(),
    feline: faker.datatype.boolean(),
  }));
