export type HttpOptios = {
  params?: object;
  body?: object;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export interface IHTTPClient {
  get<T>(url: string, options?: HttpOptios): Promise<T>;
  post<T>(url: string, options?: HttpOptios): Promise<T>;
}
