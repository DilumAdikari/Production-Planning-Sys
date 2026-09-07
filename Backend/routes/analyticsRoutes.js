const express = require('express');
const router = express.Router();
const { getPlantWipBalances } = require('../controllers/analyticsController');

// GET: /api/analytics/plant-wip
router.get('/plant-wip', getPlantWipBalances);

module.exports = router;