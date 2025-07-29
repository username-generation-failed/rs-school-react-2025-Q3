import React, { useCallback } from 'react';
import { object, string, type InferType } from 'yup';

import FormManager from '~components/FormManager';

import { SearchView } from './SearchView';

export type Props = {
  defaultValue?: string;
  onSearch: (query: string) => void;
} & Exclude<React.HTMLAttributes<HTMLInputElement>, 'defaultValue'>;

const SearchRequestBodySchema = object({
  query: string().defined(),
});

type SearchRequestBody = InferType<typeof SearchRequestBodySchema>;

export const Search = (props: Props) => {
  const { onSearch, ...inputProps } = props;
  const handleSubmit = useCallback(
    (data: SearchRequestBody) => {
      onSearch(data.query);
    },
    [onSearch]
  );

  return (
    <FormManager schema={SearchRequestBodySchema} onSubmit={handleSubmit}>
      {({ InputWrap }) => (
        <InputWrap {...inputProps} Wrap={SearchView} name="query" />
      )}
    </FormManager>
  );
};
