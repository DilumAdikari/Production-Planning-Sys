const Department = require('../models/Department');

// Create New Department
exports.createDepartment = async (req, res) => {
  try {
    const { code, name, division, inChargeName, phone } = req.body;

    if (!code || !name) {
      return res.status(400).json({ success: false, message: 'Department Code and Name are required' });
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = await Department.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Department code already exists' });
    }

    const dept = new Department({
      code: cleanCode,
      name: name.trim(),
      division: division || 'Cutting',
      inChargeName,
      phone
    });

    await dept.save();
    res.status(201).json({ success: true, data: dept });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Departments
exports.getDepartments = async (req, res) => {
  try {
    const depts = await Department.find().sort({ createdAt: -1 });
    res.status(200).json(depts);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Department
exports.deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};