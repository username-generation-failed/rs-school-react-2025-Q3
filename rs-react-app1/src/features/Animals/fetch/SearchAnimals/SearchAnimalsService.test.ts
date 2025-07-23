import { describe, expect, it } from 'vitest';
import { SearchAnimalsService } from './SearchAnimalsService';
import { createMockAsyncCommand } from '~test-utils/createMockAsyncCommand';
import { faker } from '@faker-js/faker';
import type { IGetAnimals } from '../GetAnimals';
import type { ISearchAnimals } from './types';

const factory = () => {
  const getAnimalsRepoMock = createMockAsyncCommand() as IGetAnimals;
  const searchAnimalsRepoMock = createMockAsyncCommand() as ISearchAnimals;
  return {
    service: new SearchAnimalsService(
      searchAnimalsRepoMock,
      getAnimalsRepoMock
    ),
    getAnimalsRepoMock,
    searchAnimalsRepoMock,
  };
};

const getParams = (query: string): Parameters<ISearchAnimals['exec']> => {
  const signal = new AbortController().signal;
  const pageNumber = 9;
  const pageSize = 30;

  return [
    {
      name: query,
      pageNumber,
      pageSize,
    },
    signal,
  ];
};

describe('SearchAnimalsService', { concurrent: true }, async () => {
  it('Trims query', async () => {
    const name = faker.word.noun();
    const { service, searchAnimalsRepoMock, getAnimalsRepoMock } = factory();

    await service.exec(...getParams(name + '     '));

    expect(searchAnimalsRepoMock.exec).toBeCalledWith(...getParams(name));
    expect(getAnimalsRepoMock.exec).not.toBeCalled();
  });

  it('Get all animal when query is empty', async () => {
    const { service, searchAnimalsRepoMock, getAnimalsRepoMock } = factory();

    await service.exec(...getParams(''));

    expect(getAnimalsRepoMock.exec).toBeCalled();
    expect(searchAnimalsRepoMock.exec).not.toBeCalled();
  });
});
