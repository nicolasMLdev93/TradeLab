import { sequelize } from '../config/database';

export const truncateAll = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const models = Object.values(sequelize.models);

  await queryInterface.sequelize.query('PRAGMA foreign_keys = OFF;');

  for (const model of models) {
    await model.destroy({ where: {}, truncate: true, force: true });
  }

  await queryInterface.sequelize.query('PRAGMA foreign_keys = ON;');
};