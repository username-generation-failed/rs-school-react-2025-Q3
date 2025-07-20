export type Animal = {
  uid: string;
  name: string;
  earthAnimal: boolean;
  earthInsect: boolean;
  avian: boolean;
  canine: boolean;
  feline: boolean;
};

export type PaginatedResponceDto = {
  count: number;
  pageSize: number;
  result: Animal[];
};
