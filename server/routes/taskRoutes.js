const express = require('express');
const ctrl = require('../controllers/taskController');
const { validateId, validateTaskBody } = require('../middleware/validate');

const router = express.Router();

router.route('/').get(ctrl.getTasks).post(validateTaskBody(false), ctrl.createTask);

router
  .route('/:id')
  .get(validateId, ctrl.getTask)
  .put(validateId, validateTaskBody(true), ctrl.updateTask)
  .delete(validateId, ctrl.deleteTask);

module.exports = router;
