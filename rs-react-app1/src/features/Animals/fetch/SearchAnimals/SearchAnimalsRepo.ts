import { axiosClient, type IHTTPClient } from '~lib/HttpClient';
import type {
  ISearchAnimals,
  SearchAnimalsRequestDto,
  SearchAnimalsResponceDto,
} from './types';
import { pick } from '~utils/Object';
import omit from '~utils/Object/omit';
import { mapGetAnimalsResponceToDto } from '../GetAnimals/GetAnimalsRepo';

type SearchAnimalsResponce = {
  page: {
    pageNumber: number;
    pageSize: number;
    numberOfElements: number;
    totalElements: number;
    totalPages: number;
    firstPage: boolean;
    lastPage: boolean;
  };
  sort: {
    clauses: [];
  };
  animals: {
    uid: string;
    name: string;
    earthAnimal: boolean;
    earthInsect: boolean;
    avian: boolean;
    canine: boolean;
    feline: boolean;
  }[];
};

export class SearchAnimalsRepo implements ISearchAnimals {
  httpClient: IHTTPClient;
  container?: undefined;

  constructor(httpClient: IHTTPClient) {
    this.httpClient = httpClient;
    this.container = undefined;
  }

  async exec(
    params: SearchAnimalsRequestDto,
    signal?: AbortSignal
  ): Promise<SearchAnimalsResponceDto> {
    const queryParamsKeys = ['pageNumber', 'pageSize'] as const;
    const queryParams = pick(params, queryParamsKeys);
    const body = omit(params, queryParamsKeys);

    const responce = await this.httpClient.post<SearchAnimalsResponce>(
      'https://stapi.co/api/v1/rest/animal/search',
      {
        body,
        params: queryParams,
        signal,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const responceDto: SearchAnimalsResponceDto =
      mapGetAnimalsResponceToDto(responce);

    return responceDto;
  }
}

export const searchAnimalsRepo = new SearchAnimalsRepo(axiosClient);
