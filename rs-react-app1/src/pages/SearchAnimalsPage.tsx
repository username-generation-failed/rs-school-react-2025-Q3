import { Outlet } from 'react-router';
import Page from '~components/Page';
import AnimalsSearchList from '~features/Animals/AnimalsSearchList/AnimalsSearchList';

const SearchAnimalsPage = () => {
  return (
    <Page>
      <div className="flex min-h-full grow-1 items-stretch justify-center">
        <AnimalsSearchList />
        <Outlet />
      </div>
    </Page>
  );
};

export default SearchAnimalsPage;
