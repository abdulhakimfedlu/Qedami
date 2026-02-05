const Service = require('../models/Service');
const Office = require('../models/Office');
const Category = require('../models/Category');

// @desc    Search for services or offices
// @route   GET /api/v1/scout/search
exports.search = async (req, res, next) => {
  try {
    const { q, category, location, serviceType, openNow, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (q) {
      query.name = { $regex: q, $options: 'i' };
    }
    if (category) query.category = category;
    if (serviceType) query.serviceType = serviceType;

    const skip = (page - 1) * limit;

    const services = await Service.find(query).skip(skip).limit(Number(limit)).populate('category');
    const offices = await Office.find({ name: { $regex: q || '', $options: 'i' } }).skip(skip).limit(Number(limit));

    res.status(200).json({
      success: true,
      count: services.length + offices.length,
      data: { services, offices }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get autocomplete suggestions
// @route   GET /api/v1/scout/suggestions
exports.getSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json([]);

    const services = await Service.find({ name: { $regex: q, $options: 'i' } }).limit(5).select('name');
    const offices = await Office.find({ name: { $regex: q, $options: 'i' } }).limit(5).select('name');

    const suggestions = [...services.map(s => s.name), ...offices.map(o => o.name)];
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/v1/scout/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Browse all services
// @route   GET /api/v1/scout/services
exports.getBrowseServices = async (req, res) => {
  try {
    const services = await Service.find().populate('category');
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single service (Browse)
// @route   GET /api/v1/scout/services/:id
exports.getBrowseService = async (req, res) => {
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

// @desc    Browse all offices
// @route   GET /api/v1/scout/offices
exports.getBrowseOffices = async (req, res) => {
  try {
    const offices = await Office.find();
    res.status(200).json({ success: true, count: offices.length, data: offices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single office (Browse)
// @route   GET /api/v1/scout/offices/:id
exports.getBrowseOffice = async (req, res) => {
  try {
    const office = await Office.findById(req.params.id).populate('services');
    if (!office) return res.status(404).json({ success: false, message: 'Office not found' });
    res.status(200).json({ success: true, data: office });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
