const Office = require('../models/Office');

// @desc    Get all offices
// @route   GET /api/v1/offices
exports.getOffices = async (req, res) => {
  try {
    const offices = await Office.find();
    res.status(200).json({ success: true, data: offices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single office
// @route   GET /api/v1/offices/:id
exports.getOffice = async (req, res) => {
  try {
    const office = await Office.findById(req.params.id).populate('services');
    if (!office) return res.status(404).json({ success: false, message: 'Office not found' });
    res.status(200).json({ success: true, data: office });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create office
// @route   POST /api/v1/offices
exports.createOffice = async (req, res) => {
  try {
    const office = await Office.create(req.body);
    res.status(201).json({ success: true, data: office });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update office
// @route   PUT /api/v1/offices/:id
exports.updateOffice = async (req, res) => {
  try {
    const office = await Office.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!office) return res.status(404).json({ success: false, message: 'Office not found' });
    res.status(200).json({ success: true, data: office });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete office
// @route   DELETE /api/v1/offices/:id
exports.deleteOffice = async (req, res) => {
  try {
    const office = await Office.findByIdAndDelete(req.params.id);
    if (!office) return res.status(404).json({ success: false, message: 'Office not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get office services
// @route   GET /api/v1/offices/:id/services
exports.getOfficeServices = async (req, res) => {
  try {
    const office = await Office.findById(req.params.id).populate('services');
    if (!office) return res.status(404).json({ success: false, message: 'Office not found' });
    res.status(200).json({ success: true, data: office.services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get office hours
// @route   GET /api/v1/offices/:id/hours
exports.getOfficeHours = async (req, res) => {
  try {
    const office = await Office.findById(req.params.id);
    if (!office) return res.status(404).json({ success: false, message: 'Office not found' });
    res.status(200).json({ success: true, data: office.hours });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get office availability
// @route   GET /api/v1/offices/:id/availability
exports.getOfficeAvailability = async (req, res) => {
  try {
    const office = await Office.findById(req.params.id);
    if (!office) return res.status(404).json({ success: false, message: 'Office not found' });
    // For MVP, we'll just return a placeholder or any specific availability field if added later
    res.status(200).json({ success: true, data: { status: 'Open', message: 'Standard operational hours' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get office documents
// @route   GET /api/v1/offices/:id/documents
exports.getOfficeDocuments = async (req, res) => {
  try {
    const office = await Office.findById(req.params.id).populate({
      path: 'services',
      populate: { path: 'requirements' }
    });
    if (!office) return res.status(404).json({ success: false, message: 'Office not found' });
    
    // Flatten all documents required by services at this office
    const documents = [...new Set(office.services.flatMap(s => s.requirements))];
    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
