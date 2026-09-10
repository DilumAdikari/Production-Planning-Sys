const CutLoading = require('../models/CutLoading');

// අලුත් Cut Loading Dispatch එකක් record කිරීම
exports.createLoading = async (req, res) => {
  try {
    const {
      docNo,
      department,
      plantId,
      styleNo,
      garmentDesc,
      cutQty,
      loadDate,
      targetDate,
      ratioBreakdown,
      remarks
    } = req.body;

    // 1. Basic Validation
    if (!docNo || !plantId || !styleNo || !cutQty) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields (Doc No, Plant, Style, Cut Qty)'
      });
    }

    // 2. Duplicate Check
    const cleanDocNo = docNo.trim().toUpperCase();
    const existing = await CutLoading.findOne({ docNo: cleanDocNo });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Gate Pass / Doc No already exists'
      });
    }

    // 3. Create Document
    const newLoading = new CutLoading({
      docNo: cleanDocNo,
      department: department || 'General Cutting',
      plantId,
      styleNo: styleNo.trim().toUpperCase(),
      garmentDesc: garmentDesc || '',
      cutQty: Number(cutQty),
      loadDate: loadDate ? new Date(loadDate) : new Date(),
      // Empty string ආවොත් null කරනවා CastError නොවෙන්න
      targetDate: targetDate ? new Date(targetDate) : null,
      ratioBreakdown: ratioBreakdown || '',
      remarks: remarks || ''
    });

    await newLoading.save();
    res.status(201).json({ success: true, data: newLoading });
  } catch (error) {
    console.error('Create Loading Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// සියලුම Cut Loadings ලබා ගැනීම
exports.getLoadings = async (req, res) => {
  try {
    const loadings = await CutLoading.find()
      .populate('plantId', 'name code district')
      .sort({ createdAt: -1 });
    res.status(200).json(loadings);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Loading Batch එකක් Delete කිරීම
exports.deleteLoading = async (req, res) => {
  try {
    await CutLoading.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Loading batch deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};