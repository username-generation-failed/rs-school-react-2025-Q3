import { describe, expect, it } from 'vitest';
import type { IPersistor } from './IPersistor';
import { faker } from '@faker-js/faker';
import { LocalStoragePersistor as LocalStoragePersistorMock } from './__mocks__/LocalStoragePersistor';
import { LocalStoragePersistor } from './LocalStoragePersistor';

const testPersistor = (persistorFactory: () => IPersistor, name: string) => {
  describe(`Persistor ${name}`, { concurrent: true }, () => {
    it('Restores saved data', async () => {
      const persistor = persistorFactory();
      const data = Object.fromEntries(
        [...Array(10)].map(() => [faker.word.noun(), faker.word.noun()])
      );

      await persistor.persist(data);

      const restoredData = await persistor.restore();
      expect(data).toStrictEqual(restoredData);
    });
  });

  describe(`Persistor ${name}`, { concurrent: true }, () => {
    it('Overrides previous data', async () => {
      const persistor = persistorFactory();

      const data = Object.fromEntries(
        [...Array(10)].map(() => [faker.word.noun(), faker.word.noun()])
      );

      await persistor.persist({ overrideMePls: true });

      await persistor.persist(data);

      const restoredData = await persistor.restore();
      expect(data).toStrictEqual(restoredData);
    });
  });
};

testPersistor(
  () => new LocalStoragePersistorMock(),
  'LocalStoragePersistorMock'
);
let i = 0;
testPersistor(
  () => new LocalStoragePersistor(String(i++)),
  'LocalStoragePersistor'
);
