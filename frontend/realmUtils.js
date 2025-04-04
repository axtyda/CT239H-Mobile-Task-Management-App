import Realm from 'realm';
import { SubGoalSchema, TaskSchema } from './realmSchema';

const realmConfig = {
  schema: [SubGoalSchema, TaskSchema],
  schemaVersion: 5, // or higher if you had previous versions
  path: 'myCustomRealm.realm',
};

export const wipeRealmData = async () => {
  const realm = await Realm.open(realmConfig);
  realm.write(() => {
    realm.deleteAll();
  });
  realm.close();
  console.log('Realm data wiped!');
};
