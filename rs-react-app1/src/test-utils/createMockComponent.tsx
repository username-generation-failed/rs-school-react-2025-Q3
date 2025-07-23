export const createMockComponent = (testid: string) =>
  function MockComponent() {
    return <div data-testid={testid} />;
  };
