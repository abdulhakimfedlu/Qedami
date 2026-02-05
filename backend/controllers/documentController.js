const Document = require('../models/Document');
const Form = require('../models/Form');

// Document CRUD
exports.getDocuments = async (req, res) => {
  const docs = await Document.find();
  res.status(200).json({ success: true, data: docs });
};

exports.getDocument = async (req, res) => {
  const doc = await Document.findById(req.params.id);
  res.status(200).json({ success: true, data: doc });
};

exports.createDocument = async (req, res) => {
  const doc = await Document.create(req.body);
  res.status(201).json({ success: true, data: doc });
};

exports.updateDocument = async (req, res) => {
  const doc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
  res.status(200).json({ success: true, data: doc });
};

exports.deleteDocument = async (req, res) => {
  const doc = await Document.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
  res.status(200).json({ success: true, data: {} });
};

// Form CRUD
exports.getForms = async (req, res) => {
  const forms = await Form.find();
  res.status(200).json({ success: true, data: forms });
};

exports.getForm = async (req, res) => {
  const form = await Form.findById(req.params.id);
  if (!form) return res.status(404).json({ success: false, message: 'Form not found' });
  res.status(200).json({ success: true, data: form });
};

exports.createForm = async (req, res) => {
  const form = await Form.create(req.body);
  res.status(201).json({ success: true, data: form });
};

exports.deleteForm = async (req, res) => {
  const form = await Form.findByIdAndDelete(req.params.id);
  if (!form) return res.status(404).json({ success: false, message: 'Form not found' });
  res.status(200).json({ success: true, data: {} });
};
