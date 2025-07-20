import type { PaginatedResponceDto } from '~features/Animals/types';
import type { IAsyncCommand } from '~lib/types';

export type GetAnimalsRequestDto = {
  pageNumber: number;
  pageSize: number;
};

export type GetAnimalsResponceDto = PaginatedResponceDto;

export type IGetAnimals = IAsyncCommand<
  GetAnimalsRequestDto,
  GetAnimalsResponceDto
>;
