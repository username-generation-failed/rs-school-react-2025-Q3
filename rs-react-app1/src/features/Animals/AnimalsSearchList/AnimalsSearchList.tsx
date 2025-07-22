import React from 'react';
import AsyncCommandManager from '~components/AsyncCommandManager';
import type {
  ISearchAnimals,
  SearchAnimalsRequestDto,
} from '../fetch/SearchAnimals';
import type { RequestFromCommand } from '~components/AsyncCommandManager/AsyncCommandManager';
import { injectProps } from '~utils/injectProps';
import searchAnimals from '../fetch/SearchAnimals';
import { AnimalsSearchListView } from './AnimalsSearchListView';

type Props = {
  command: ISearchAnimals;
};

type State = Omit<SearchAnimalsRequestDto, 'name'>;

type SearchRequest = RequestFromCommand<ISearchAnimals>;

export class AnimalsSearchList extends React.PureComponent<Props, State> {
  fullfilled = false;

  state: State = {
    pageNumber: 0,
    pageSize: 25,
  };

  request!: SearchRequest;

  handleSearch = (query: string) => {
    this.fullfilled = true;
    this.request({ ...this.state, name: query });
  };

  setRequest = (request: SearchRequest) => {
    this.request = request;
  };

  render() {
    const { command } = this.props;

    return (
      <AsyncCommandManager command={command} exposeRequest={this.setRequest}>
        {(state) => (
          <AnimalsSearchListView
            state={state}
            fullfilled={this.fullfilled}
            onSearch={this.handleSearch}
          />
        )}
      </AsyncCommandManager>
    );
  }
}

const AnimalsSearchListInjected = injectProps(AnimalsSearchList, {
  command: searchAnimals,
});
export default AnimalsSearchListInjected;
