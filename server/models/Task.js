const mongoose = require('mongoose');

const STATUSES = ['Pending', 'In Progress', 'Completed'];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title must be at most 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description must be at most 500 characters'],
    },
    status: {
      type: String,
      enum: { values: STATUSES, message: 'Status must be one of: ' + STATUSES.join(', ') },
      default: 'Pending',
    },
    dueDate: {
      type: String,
      default: '',
      match: [/^(?:\d{4}-\d{2}-\d{2})?$/, 'Due date must be a valid date in YYYY-MM-DD format'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
module.exports.STATUSES = STATUSES;
