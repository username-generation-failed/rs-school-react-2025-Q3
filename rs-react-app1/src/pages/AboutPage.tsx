import Page from '~components/Page';

const AboutPage = () => {
  return (
    <Page>
      <div className="flex min-h-full grow-1 flex-col items-center justify-center">
        <p>
          made by{' '}
          <a
            className="text-blue-600"
            href="https://github.com/username-generation-failed"
          >
            Egor Andreyuk
          </a>
        </p>
        <p>
          for{' '}
          <a className="text-blue-600" href="https://rs.school/courses/reactjs">
            rs.school react course
          </a>
        </p>
      </div>
    </Page>
  );
};

export default AboutPage;
