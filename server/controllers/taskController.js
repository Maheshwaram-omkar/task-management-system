const Task = require('../models/Task');

// Wraps async handlers so rejected promises reach the error middleware.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// GET /api/tasks?status=Pending&search=api
exports.getTasks = wrap(async (req, res) => {
  const { status, search } = req.query;
  const filter = {};
  if (status && status !== 'All') filter.status = status;
  if (search) {
    const safe = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { title: { $regex: safe, $options: 'i' } },
      { description: { $regex: safe, $options: 'i' } },
    ];
  }
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json(tasks);
});

// GET /api/tasks/:id
exports.getTask = wrap(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

// POST /api/tasks
exports.createTask = wrap(async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  const task = await Task.create({ title, description, status, dueDate });
  res.status(201).json(task);
});

// PUT /api/tasks/:id
exports.updateTask = wrap(async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  const update = {};
  if (title !== undefined) update.title = title;
  if (description !== undefined) update.description = description;
  if (status !== undefined) update.status = status;
  if (dueDate !== undefined) update.dueDate = dueDate;

  const task = await Task.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

// DELETE /api/tasks/:id
exports.deleteTask = wrap(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted', id: task._id });
});
