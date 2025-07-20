import Search from '~components/Search';
import { LocalStoragePersistor } from '~lib/Persistor';
import { withPersist } from '~components/Persist';

// eslint-disable-next-line react-refresh/only-export-components
export default withPersist(
  Search,
  { defaultValue: '' },
  {
    onSearch: (data) => (value) => {
      data.defaultValue = value;
    },
  },
  new LocalStoragePersistor('animals_search_state_persistor')
);
