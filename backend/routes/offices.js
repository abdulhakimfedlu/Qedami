const express = require('express');
const {
  getOffices,
  getOffice,
  createOffice,
  updateOffice,
  deleteOffice,
  getOfficeServices,
  getOfficeHours,
  getOfficeAvailability,
  getOfficeDocuments
} = require('../controllers/officeController');

const router = express.Router();

router.route('/')
  .get(getOffices)
  .post(createOffice);

router.route('/:id')
  .get(getOffice)
  .put(updateOffice)
  .delete(deleteOffice);

router.get('/:id/services', getOfficeServices);
router.get('/:id/hours', getOfficeHours);
router.get('/:id/availability', getOfficeAvailability);
router.get('/:id/documents', getOfficeDocuments);

module.exports = router;
