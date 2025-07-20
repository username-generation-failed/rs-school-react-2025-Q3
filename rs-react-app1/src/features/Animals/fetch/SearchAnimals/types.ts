import type { PaginatedResponceDto } from '~features/Animals/types';
import type { IAsyncCommand } from '~lib/types';

export type ISearchAnimals = IAsyncCommand<
  SearchAnimalsRequestDto,
  SearchAnimalsResponceDto
>;

export type SearchAnimalsRequestDto = {
  pageNumber: number;
  pageSize: number;
  name: string;
  earthAnimal?: boolean;
  earthInsect?: boolean;
  avian?: boolean;
  canine?: boolean;
  feline?: boolean;
};

export type SearchAnimalsResponceDto = PaginatedResponceDto;
