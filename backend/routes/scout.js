const express = require('express');
const {
  search,
  getSuggestions,
  getCategories,
  getBrowseServices,
  getBrowseService,
  getBrowseOffices,
  getBrowseOffice
} = require('../controllers/scoutController');

const router = express.Router();

router.get('/search', search);
router.get('/suggestions', getSuggestions);
router.get('/categories', getCategories);
router.get('/services', getBrowseServices);
router.get('/services/:id', getBrowseService);
router.get('/offices', getBrowseOffices);
router.get('/offices/:id', getBrowseOffice);

module.exports = router;
