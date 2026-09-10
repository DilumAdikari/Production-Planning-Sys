const express = require('express');
const router = express.Router();
const { createLoading, getLoadings, deleteLoading } = require('../controllers/loadingController');

router.post('/', createLoading);
router.get('/', getLoadings);
router.delete('/:id', deleteLoading);

module.exports = router;