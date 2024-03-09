import { Sequelize } from 'sequelize';
import { initTables } from './initTables';
const sequelize = new Sequelize('GameBlogV2', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
    // logging: (...msg) => console.log('Database log: ', msg),
  }); 
initTables(sequelize);
export default sequelize;