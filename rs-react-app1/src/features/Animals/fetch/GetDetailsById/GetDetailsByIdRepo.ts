import { axiosClient, type IHTTPClient } from '~lib/HttpClient';
import type {
  GetDetailsByIdRequestDto,
  GetDetailsByIdResponceDto,
  IGetDetailsById,
} from './types';

type GetDetailsByIdResponce = string;

export class GetDetailsByIdRepo implements IGetDetailsById {
  httpClient: IHTTPClient;
  container?: undefined;

  constructor(httpClient: IHTTPClient) {
    this.httpClient = httpClient;
    this.container = undefined;
  }

  async exec(
    _params: GetDetailsByIdRequestDto,
    signal: AbortSignal
  ): Promise<GetDetailsByIdResponceDto> {
    const responce = await this.httpClient.get<GetDetailsByIdResponce>(
      'https://baconipsum.com/api/?type=meat-and-filler&paras=1&format=text',
      {
        signal,
      }
    );

    const responceDto: GetDetailsByIdResponceDto = {
      text: responce,
    };

    return responceDto;
  }
}

export const getDetailsByIdRepo = new GetDetailsByIdRepo(axiosClient);
