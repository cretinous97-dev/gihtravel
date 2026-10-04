import * as migration_20261003_222140_initial from './20261003_222140_initial';

export const migrations = [
  {
    up: migration_20261003_222140_initial.up,
    down: migration_20261003_222140_initial.down,
    name: '20261003_222140_initial'
  },
];
