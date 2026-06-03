const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const TaskModel = require('../models/Task');

router.get('/', authenticate, (req, res) => {
  const tasks = TaskModel.getAll(req.user.id);
  res.json({ tasks, count: tasks.length });
});

router.get('/stats', authenticate, (req, res) => {
  res.json(TaskModel.getStats(req.user.id));
});

router.get('/:id', authenticate, (req, res) => {
  const task = TaskModel.getById(req.params.id, req.user.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

router.post('/', authenticate, (req, res) => {
  try {
    res.status(201).json(TaskModel.create(req.body, req.user.id));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', authenticate, (req, res) => {
  try {
    const task = TaskModel.update(req.params.id, req.body, req.user.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, (req, res) => {
  if (!TaskModel.delete(req.params.id, req.user.id))
    return res.status(404).json({ error: 'Task not found' });

  res.status(204).send();
});

module.exports = router;
