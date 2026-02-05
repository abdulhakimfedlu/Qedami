const express = require('express');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getServiceDocuments,
  getServiceChecklist,
  getServiceForms,
  getServiceOffices,
  getServiceAvailability
} = require('../controllers/serviceController');

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(createService);

router.route('/:id')
  .get(getService)
  .put(updateService)
  .delete(deleteService);

router.get('/:id/documents', getServiceDocuments);
router.get('/:id/checklist', getServiceChecklist);
router.get('/:id/forms', getServiceForms);
router.get('/:id/offices', getServiceOffices);
router.get('/:id/availability', getServiceAvailability);

module.exports = router;
