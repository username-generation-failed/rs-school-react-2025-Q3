import { expect, describe, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '~test-utils/testing-react';

import userEvent from '@testing-library/user-event';
import { animalsSearchFactory } from './animalsSearchFactory';
import { LocalStoragePersistor as LocalStoragePersistorMock } from '~lib/Persistor/__mocks__/LocalStoragePersistor';
import type { IPersistor } from '~lib/Persistor';
import { faker } from '@faker-js/faker';

const isVisible = (element: HTMLElement) =>
  window.getComputedStyle(element)['visibility'] !== 'hidden';

const QueryDao = (persistor: IPersistor) => {
  return {
    get: async () => {
      const data = await persistor.restore();
      if (data === undefined) return;
      if ('defaultValue' in data) {
        return data.defaultValue;
      }
    },
    save: async (query: string) => {
      return persistor.persist({ defaultValue: query });
    },
  };
};

type SetupConfig = {
  persistor?: IPersistor;
  onSearch?: (value: string) => void;
};

type CreateAnimalsTestSearchOptions = {
  persistorFactory: () => IPersistor;
};
const createAnimalsTestSearch = (options: CreateAnimalsTestSearchOptions) => {
  const { persistorFactory } = options;

  const setup = async (config: SetupConfig = {}) => {
    const { persistor = persistorFactory(), onSearch } = config;

    const AnimalsSearch = animalsSearchFactory(persistor);
    const utils = await act(async () =>
      render(<AnimalsSearch onSearch={onSearch} />)
    );

    const input = utils.container.getElementsByTagName('input')[0];
    const button = screen.getByText('Search');

    await waitFor(() => isVisible(input));

    return {
      input,
      button,
      utils,
      persistor,
      queryDao: QueryDao(persistor),
    };
  };

  describe('AnimalsSearch', { concurrent: false }, () => {
    it('Displays previously saved search term on mount', async () => {
      const previousQuery = faker.word.noun();

      const persistor = persistorFactory();
      await QueryDao(persistor).save(previousQuery);

      const { input } = await setup({ persistor });

      expect(input.value).toBe(previousQuery);
    });

    it('Persists search query on unmount', {}, async () => {
      const persistor = persistorFactory();
      const { input, utils } = await setup({ persistor });

      const query = faker.word.noun();

      await userEvent.click(input);
      await userEvent.keyboard(query);
      await userEvent.keyboard('{Enter}');

      expect(input.value).toBe(query);

      await act(async () => utils.unmount());

      const setup2 = await setup({ persistor });

      expect(setup2.input.value).toBe(query);
    });

    it('Persists search query on reload', {}, async () => {
      const persistor = persistorFactory();
      const { input, queryDao } = await setup({ persistor });

      const query = faker.word.noun();

      await userEvent.click(input);
      await userEvent.keyboard(query);
      await userEvent.keyboard('{Enter}');

      expect(input.value).toBe(query);

      // window.location.reload();
      // is not implemented and throws Error: Not implemented: navigation (except hash changes)
      // so, instead of reloading have to dispatch 'beforeunload' event

      const waitUnload = new Promise((res) => {
        window.addEventListener('beforeunload', res, { once: true });
      });
      fireEvent(window, new Event('beforeunload'));
      await waitUnload;

      const restoredQuery = await queryDao.get();
      expect(restoredQuery).toBe(query);
    });
  });
};

createAnimalsTestSearch({
  persistorFactory: () => new LocalStoragePersistorMock(),
});
