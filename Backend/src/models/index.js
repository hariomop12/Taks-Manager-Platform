import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Task from './Task.js';
import Category from './Category.js';
import RefreshToken from './RefreshToken.js';

const TaskCategory = sequelize.define('TaskCategory', {
  task_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
}, {
  tableName: 'task_categories',
  timestamps: false,
});

User.hasMany(Task, { foreignKey: 'assigned_to', as: 'assignedTasks' });
User.hasMany(Task, { foreignKey: 'created_by', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedUser' });
Task.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(RefreshToken, { foreignKey: 'user_id' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

Task.belongsToMany(Category, { through: TaskCategory, foreignKey: 'task_id', otherKey: 'category_id' });
Category.belongsToMany(Task, { through: TaskCategory, foreignKey: 'category_id', otherKey: 'task_id' });

export { User, Task, Category, RefreshToken, TaskCategory };
