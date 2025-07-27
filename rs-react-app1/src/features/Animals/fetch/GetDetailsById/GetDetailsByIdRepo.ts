import { axiosClient, type IHTTPClient } from '~lib/HttpClient';
import type {
  GetDetailsByIdRequestDto,
  GetDetailsByIdResponceDto,
  IGetDetailsById,
} from './types';
import type { Animal } from '~features/Animals/types';

export class GetDetailsByIdRepo implements IGetDetailsById {
  httpClient: IHTTPClient;
  container?: undefined;

  constructor(httpClient: IHTTPClient) {
    this.httpClient = httpClient;
    this.container = undefined;
  }

  async exec(
    params: GetDetailsByIdRequestDto,
    signal: AbortSignal
  ): Promise<GetDetailsByIdResponceDto> {
    const text = await this.httpClient.get<string>(
      'https://baconipsum.com/api/?type=meat-and-filler&paras=1&format=text',
      {
        signal,
      }
    );

    const animal = await this.httpClient.get<{ animal: Animal }>(
      `https://stapi.co/api/v1/rest/animal/`,
      {
        params: { uid: params.id },
        signal,
      }
    );

    const responceDto: GetDetailsByIdResponceDto = {
      text,
      name: animal.animal.name,
    };

    return responceDto;
  }
}

export const getDetailsByIdRepo = new GetDetailsByIdRepo(axiosClient);
