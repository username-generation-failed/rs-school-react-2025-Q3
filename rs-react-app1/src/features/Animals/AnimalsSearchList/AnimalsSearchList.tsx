import React from 'react';
import AsyncCommandManager from '~components/AsyncCommandManager';
import type {
  ISearchAnimals,
  SearchAnimalsRequestDto,
} from '../fetch/SearchAnimals';
import AnimalsSearch from './AnimalsSearch';
import type { RequestFromCommand } from '~components/AsyncCommandManager/AsyncCommandManager';
import { injectProps } from '~utils/injectProps';
import searchAnimals from '../fetch/SearchAnimals';
import { AnimalsSearchListView } from './AnimalsSearchListView';
import clsx from 'clsx';
import { CardLoader } from '~components/Loader';
import { ErrorMessage } from '~components/ErrorMessage';

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
    this.request({ ...this.state, name: query });
  };

  setRequest = (request: SearchRequest) => {
    this.request = request;
  };

  render() {
    const { command } = this.props;

    return (
      <AsyncCommandManager command={command} exposeRequest={this.setRequest}>
        {(state) => {
          if (state.is('sucess') || state.is('pending')) {
            this.fullfilled = true;
          }

          return (
            <div
              className={clsx(
                'm-auto flex min-h-full w-lg max-w-lg grow-1 flex-col pb-6'
              )}
            >
              <div
                className={clsx(
                  'z-50',
                  this.fullfilled || state.is('pending')
                    ? 'sticky top-0 my-6'
                    : 'absolute top-[50%] w-lg translate-y-[-50%]'
                )}
              >
                <AnimalsSearch onSearch={this.handleSearch} />
              </div>

              <div className={clsx('relative grow-1')}>
                {state.is('pending') && (
                  <CardLoader sticky loaderWidthP={30} className="rounded-lg" />
                )}
                {state.is('sucess') && (
                  <AnimalsSearchListView
                    className="overflow-hidden rounded-lg"
                    items={state.result.result ?? []}
                  />
                )}

                {state.is('sucess') && state.result.result.length === 0 && (
                  <div className="absolute flex h-full w-full items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600">
                    <p>Nothing Found</p>
                  </div>
                )}

                {state.is('error') && <ErrorMessage error={state.error} />}
              </div>
            </div>
          );
        }}
      </AsyncCommandManager>
    );
  }
}

const AnimalsSearchListInjected = injectProps(AnimalsSearchList, {
  command: searchAnimals,
});
export default AnimalsSearchListInjected;
