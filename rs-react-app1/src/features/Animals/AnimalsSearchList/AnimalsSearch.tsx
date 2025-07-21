import { LocalStoragePersistor } from '~lib/Persistor';
import { animalsSearchFactory } from './animalsSearchFactory';

const AnimalsSearch = animalsSearchFactory(
  new LocalStoragePersistor('animals_search_state_persistor')
);

export default AnimalsSearch;
