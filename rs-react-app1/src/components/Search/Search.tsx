import React from 'react';
import { object, string, type InferType } from 'yup';

import FormManager from '~components/FormManager';

import { SearchView } from './SearchView';
import { omit } from '~utils/Object';

export type Props = {
  defaultValue?: string;
  onSearch: (query: string) => void;
} & Exclude<React.HTMLAttributes<HTMLInputElement>, 'defaultValue'>;

const SearchRequestBodySchema = object({
  query: string().defined(),
});

type SearchRequestBody = InferType<typeof SearchRequestBodySchema>;

export class Search extends React.PureComponent<Props> {
  handleSubmit = (data: SearchRequestBody) => {
    this.props.onSearch(data.query);
  };

  render() {
    const inputProps = omit(this.props, ['onSearch']);
    return (
      <FormManager
        schema={SearchRequestBodySchema}
        onSubmit={this.handleSubmit}
      >
        {({ InputWrap }) => (
          <InputWrap {...inputProps} Wrap={SearchView} name="query" />
        )}
      </FormManager>
    );
  }
}
