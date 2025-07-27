import Page from '~features/App/Page';

const NotFoundPage = () => {
  return (
    <Page>
      <div className="flex min-h-full grow-1 flex-col items-center justify-center">
        <p>404: Not Found</p>
        <p>The page you are looking for doesn&apos;t exist</p>
      </div>
    </Page>
  );
};

export default NotFoundPage;
