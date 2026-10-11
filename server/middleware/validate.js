const mongoose = require('mongoose');
const { STATUSES } = require('../models/Task');

// Validates the :id route param is a valid Mongo ObjectId.
const validateId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }
  next();
};

const isValidDateOnly = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

// Validates request body. For updates (partial = true) fields are optional,
// but any field that is present must still be valid.
const validateTaskBody = (partial = false) => (req, res, next) => {
  const { title, description, status, dueDate } = req.body || {};
  const errors = [];

  if (!partial || title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) errors.push('Title is required');
    else if (title.trim().length < 3) errors.push('Title must be at least 3 characters');
    else if (title.trim().length > 100) errors.push('Title must be at most 100 characters');
  }

  if (description !== undefined) {
    if (typeof description !== 'string') errors.push('Description must be a string');
    else if (description.trim().length > 500) errors.push('Description must be at most 500 characters');
  }

  if (status !== undefined && !STATUSES.includes(status)) {
    errors.push('Status must be one of: ' + STATUSES.join(', '));
  }

  if (dueDate !== undefined && dueDate !== '' && !isValidDateOnly(dueDate)) {
    errors.push('Due date must be a valid date in YYYY-MM-DD format');
  }

  if (partial && title === undefined && description === undefined && status === undefined && dueDate === undefined) {
    errors.push('Provide at least one field to update');
  }

  if (errors.length) return res.status(400).json({ message: 'Validation failed', errors });
  next();
};

module.exports = { validateId, validateTaskBody };
