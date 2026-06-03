const { v4: uuidv4 } = require('uuid');

let tasks = [];

const VALID_STATUS = ['todo', 'in-progress', 'done'];
const VALID_PRIORITY = ['low', 'medium', 'high'];

class TaskModel {
  static getAll(userId) {
    return tasks
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static getById(id, userId) {
    return tasks.find(t => t.id === id && t.userId === userId) || null;
  }

  static create(data, userId) {
    if (!data.title || !data.title.trim()) throw new Error('Title is required');
    if (data.status && !VALID_STATUS.includes(data.status)) throw new Error('Invalid status');
    if (data.priority && !VALID_PRIORITY.includes(data.priority)) throw new Error('Invalid priority');

    const task = {
      id: uuidv4(),
      title: data.title.trim(),
      description: data.description || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      dueDate: data.dueDate || null,
      tags: Array.isArray(data.tags) ? data.tags : [],
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.push(task);
    return task;
  }

  static update(id, data, userId) {
    const idx = tasks.findIndex(t => t.id === id && t.userId === userId);
    if (idx === -1) return null;

    if (data.status && !VALID_STATUS.includes(data.status)) throw new Error('Invalid status');
    if (data.priority && !VALID_PRIORITY.includes(data.priority)) throw new Error('Invalid priority');

    tasks[idx] = {
      ...tasks[idx],
      ...data,
      id,
      userId,
      updatedAt: new Date().toISOString()
    };

    return tasks[idx];
  }

  static delete(id, userId) {
    const idx = tasks.findIndex(t => t.id === id && t.userId === userId);
    if (idx === -1) return false;

    tasks.splice(idx, 1);
    return true;
  }

  static getStats(userId) {
    const ut = tasks.filter(t => t.userId === userId);
    return {
      total: ut.length,
      todo: ut.filter(t => t.status === 'todo').length,
      inProgress: ut.filter(t => t.status === 'in-progress').length,
      done: ut.filter(t => t.status === 'done').length,
      highPriority: ut.filter(t => t.priority === 'high').length,
      overdue: ut.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length
    };
  }

  static reset() {
    tasks = [];
  }
}

module.exports = TaskModel;
