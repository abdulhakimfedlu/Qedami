const express = require('express');
const { getNearbyOffices, getRegions, getRegionOffices } = require('../controllers/geoController');

const router = express.Router();

router.get('/nearby', getNearbyOffices);
router.get('/regions', getRegions);
router.get('/regions/:id/offices', getRegionOffices);

module.exports = router;
