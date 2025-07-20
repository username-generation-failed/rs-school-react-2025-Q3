import Search from '~components/Search';
import { LocalStoragePersistor } from '~lib/Persistor';
import { withPersist } from '~components/Persist';

const AnimalsSearch = withPersist(
  Search,
  { defaultValue: '' },
  {
    onSearch: (data) => (value) => {
      data.defaultValue = value;
    },
  },
  new LocalStoragePersistor('animals_search_state_persistor')
);

export default AnimalsSearch;
