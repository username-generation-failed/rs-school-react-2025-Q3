import getAnimals, { type IGetAnimals } from '../GetAnimals';
import { searchAnimalsRepo } from './SearchAnimalsRepo';
import type {
  ISearchAnimals,
  SearchAnimalsRequestDto,
  SearchAnimalsResponceDto,
} from './types';
import { pick } from '~utils/Object';

export class SearchAnimalsService implements ISearchAnimals {
  searchAnimalsRepo: ISearchAnimals;
  getAnimals: IGetAnimals;

  constructor(searchAnimalsRepo: ISearchAnimals, getAnimals: IGetAnimals) {
    this.searchAnimalsRepo = searchAnimalsRepo;
    this.getAnimals = getAnimals;
  }

  async exec(
    params: SearchAnimalsRequestDto,
    signal: AbortSignal
  ): Promise<SearchAnimalsResponceDto> {
    params = {
      ...params,
      name: params.name.trim(),
    };

    if (params.name === '') {
      return this.getAnimals.exec(
        pick(params, ['pageSize', 'pageNumber']),
        signal
      );
    }

    return this.searchAnimalsRepo.exec(params, signal);
  }
}

export const searchAnimalsService = new SearchAnimalsService(
  searchAnimalsRepo,
  getAnimals
);
