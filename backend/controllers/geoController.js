const Office = require('../models/Office');
const Region = require('../models/Region');

// @desc    Find nearby offices
// @route   GET /api/v1/geo/nearby
exports.getNearbyOffices = async (req, res) => {
  try {
    const { lat, lng, serviceId } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Please provide lat and lng' });
    }

    let query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 50000 // 50km
        }
      }
    };

    if (serviceId) {
      query.services = serviceId;
    }

    const offices = await Office.find(query);
    res.status(200).json({ success: true, count: offices.length, data: offices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all regions
// @route   GET /api/v1/geo/regions
exports.getRegions = async (req, res) => {
  try {
    const regions = await Region.find();
    res.status(200).json({ success: true, data: regions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get offices in region
// @route   GET /api/v1/geo/regions/:id/offices
exports.getRegionOffices = async (req, res) => {
  try {
    const region = await Region.findById(req.params.id).populate('offices');
    if (!region) return res.status(404).json({ success: false, message: 'Region not found' });
    res.status(200).json({ success: true, data: region.offices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
