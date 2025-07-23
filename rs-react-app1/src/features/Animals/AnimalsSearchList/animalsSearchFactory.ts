import Search from '~components/Search';
import { type IPersistor } from '~lib/Persistor';
import { withPersist } from '~components/Persist';

export const animalsSearchFactory = (persistor: IPersistor) =>
  withPersist(
    Search,
    { defaultValue: '' },
    {
      onSearch: (data) => (value) => {
        data.defaultValue = value;
      },
    },
    persistor
  );
