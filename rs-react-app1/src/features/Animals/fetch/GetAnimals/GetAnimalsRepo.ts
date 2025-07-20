import { axiosClient, type IHTTPClient } from '~lib/HttpClient';
import type {
  GetAnimalsRequestDto,
  GetAnimalsResponceDto,
  IGetAnimals,
} from './types';

type GetAnimalsResponce = {
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

export const mapGetAnimalsResponceToDto = (
  responce: GetAnimalsResponce
): GetAnimalsResponceDto => {
  return {
    count: responce.page.numberOfElements,
    pageSize: responce.page.totalPages,
    result: responce.animals,
  };
};

export class GetAnimalsRepo implements IGetAnimals {
  httpClient: IHTTPClient;
  container?: undefined;

  constructor(httpClient: IHTTPClient) {
    this.httpClient = httpClient;
    this.container = undefined;
  }

  async exec(
    params: GetAnimalsRequestDto,
    signal: AbortSignal
  ): Promise<GetAnimalsResponceDto> {
    const responce = await this.httpClient.get<GetAnimalsResponce>(
      'https://stapi.co/api/v1/rest/animal/search',
      {
        params,
        signal,
      }
    );

    const responceDto: GetAnimalsResponceDto =
      mapGetAnimalsResponceToDto(responce);

    return responceDto;
  }
}

export const getAnimalsRepo = new GetAnimalsRepo(axiosClient);
