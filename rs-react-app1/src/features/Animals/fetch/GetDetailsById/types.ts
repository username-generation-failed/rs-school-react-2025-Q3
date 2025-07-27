import type { IAsyncCommand } from '~lib/types';

export type GetDetailsByIdRequestDto = {
  id: string;
};

export type GetDetailsByIdResponceDto = {
  text: string;
};

export type IGetDetailsById = IAsyncCommand<
  GetDetailsByIdRequestDto,
  GetDetailsByIdResponceDto
>;
