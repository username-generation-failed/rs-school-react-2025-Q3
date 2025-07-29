import { AppHeader } from './AppHeader';

const Page = (props: React.PropsWithChildren) => {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900 dark:text-white">
      <AppHeader />
      {props.children}
    </div>
  );
};

export default Page;
