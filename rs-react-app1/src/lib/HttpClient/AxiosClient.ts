import axios, {
  isAxiosError,
  type AxiosResponse,
  type AxiosStatic,
} from 'axios';
import { RequestError, ResponceError } from '~lib/Errors';
import type { HttpOptios, IHTTPClient } from './IHTTPClient';
import { getReasonPhrase } from 'http-status-codes';

export class AxiosClient implements IHTTPClient {
  axios: AxiosStatic;
  constructor(axios: AxiosStatic) {
    this.axios = axios;
  }

  private async withErrorHandling<T>(
    promise: Promise<AxiosResponse<T>>
  ): Promise<T> {
    try {
      const responce = await promise;
      return responce.data;
    } catch (error) {
      console.log(error);
      if (!isAxiosError(error)) {
        throw error;
      }

      if (error.response) {
        throw new ResponceError(
          getReasonPhrase(error.response.status),
          error.response.data
            ? JSON.stringify(error.response.data, null, 2) // error responce is usually a string, but you never know
            : undefined
        );
      } else if (error.request) {
        throw new RequestError(error.message);
      }

      throw error;
    }
  }

  async post<T>(url: string, options: HttpOptios = {}): Promise<T> {
    const { body, ...rest } = options;
    return this.withErrorHandling(axios.post(url, body, rest));
  }
  async get<T>(url: string, options?: HttpOptios): Promise<T> {
    return this.withErrorHandling(axios.get(url, options));
  }
}

export const axiosClient = new AxiosClient(axios);
