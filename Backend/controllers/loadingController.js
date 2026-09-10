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

    const existing = await CutLoading.findOne({ docNo: docNo.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Gate Pass / Doc No already exists' });
    }

    const newLoading = new CutLoading({
      docNo: docNo.toUpperCase(),
      department,
      plantId,
      styleNo: styleNo.toUpperCase(),
      garmentDesc,
      cutQty: Number(cutQty),
      loadDate: loadDate || new Date(),
      targetDate: targetDate || null,
      ratioBreakdown,
      remarks
    });

    await newLoading.save();
    res.status(201).json({ success: true, data: newLoading });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// සියලුම Cut Loadings ලබා ගැනීම (Plant details populate කර)
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