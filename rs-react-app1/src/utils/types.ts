export type ReactHTMLProps<T> = React.DetailedHTMLProps<
  React.HtmlHTMLAttributes<T>,
  T
>;

export type Values<O extends object> = O[keyof O];
export type Expand<T extends object> = T extends unknown
  ? {
      [K in keyof T]: T[K];
    }
  : never;

export type IsPartial<T, K extends keyof T> =
  object extends Pick<T, K> ? true : false;
