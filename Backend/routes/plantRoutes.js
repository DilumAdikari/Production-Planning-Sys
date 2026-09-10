const express = require('express');
const router = express.Router();
const { createPlant, getPlants, deletePlant } = require('../controllers/plantController');

router.post('/', createPlant);
router.get('/', getPlants);
router.delete('/:id', deletePlant);

module.exports = router;