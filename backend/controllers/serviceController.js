const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/v1/services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().populate('category');
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single service
// @route   GET /api/v1/services/:id
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('category')
      .populate('requirements')
      .populate('offices')
      .populate('forms');
    
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create service
// @route   POST /api/v1/services
exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/v1/services/:id
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/v1/services/:id
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get service documents
// @route   GET /api/v1/services/:id/documents
exports.getServiceDocuments = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('requirements');
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.status(200).json({ success: true, data: service.requirements });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get service checklist
// @route   GET /api/v1/services/:id/checklist
exports.getServiceChecklist = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.status(200).json({ success: true, data: service.checklist });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get service forms
// @route   GET /api/v1/services/:id/forms
exports.getServiceForms = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('forms');
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.status(200).json({ success: true, data: service.forms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get service offices
// @route   GET /api/v1/services/:id/offices
exports.getServiceOffices = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('offices');
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.status(200).json({ success: true, data: service.offices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get service availability
// @route   GET /api/v1/services/:id/availability
exports.getServiceAvailability = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.status(200).json({ success: true, data: { availabilityNotes: service.availabilityNotes } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
