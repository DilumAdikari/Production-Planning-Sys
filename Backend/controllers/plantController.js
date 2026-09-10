const Plant = require('../models/Plant');

exports.createPlant = async (req, res) => {
  try {
    const {
      code,
      name,
      district,
      capacity,
      phone,
      lat,
      lng,
      googleMapUrl,
      machineryAudit,
      complianceDocUrl
    } = req.body;

    const existing = await Plant.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Plant code already exists' });
    }

    const newPlant = new Plant({
      code: code.toUpperCase(),
      name,
      district,
      capacity: Number(capacity),
      phone,
      location: {
        lat: Number(lat),
        lng: Number(lng),
        googleMapUrl
      },
      machineryAudit,
      complianceDocUrl: complianceDocUrl || 'Compliance_Audit_2026.pdf'
    });

    await newPlant.save();
    res.status(201).json({ success: true, data: newPlant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPlants = async (req, res) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    res.status(200).json(plants);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePlant = async (req, res) => {
  try {
    await Plant.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Plant deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};