const express = require('express');
const router = express.Router();
const {
  createDepartment,
  getDepartments,
  deleteDepartment
} = require('../controllers/departmentController');

router.post('/', createDepartment);
router.get('/', getDepartments);
router.delete('/:id', deleteDepartment);

module.exports = router;