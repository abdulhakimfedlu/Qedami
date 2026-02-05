const express = require('express');
const {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  getForms,
  getForm,
  createForm,
  deleteForm
} = require('../controllers/documentController');

const router = express.Router();

router.get('/documents', getDocuments);
router.get('/documents/:id', getDocument);
router.post('/documents', createDocument);
router.put('/documents/:id', updateDocument);
router.delete('/documents/:id', deleteDocument);

router.get('/forms', getForms);
router.get('/forms/:id', getForm);
router.post('/forms', createForm);
router.delete('/forms/:id', deleteForm);

module.exports = router;
