import { PersistGate } from '~components/Persist';

export const RenderWrapper = ({ children }: { children: React.ReactNode }) => {
  return <PersistGate>{children}</PersistGate>;
};
