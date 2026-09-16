const express = require('express');
const router = express.Router();
const GrnReceipt = require('../models/GrnReceipt');

// 1. Batch එකකට අදාළ සියලු Daily GRN logs fetch කිරීම
router.get('/loading/:loadingId', async (req, res) => {
  try {
    const receipts = await GrnReceipt.find({ loadingId: req.params.loadingId })
      .sort({ grnDate: -1 });
    res.status(200).json(receipts);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. අලුත් Daily GRN Output එකක් save කිරීම
router.post('/', async (req, res) => {
  try {
    const { grnNo, loadingId, passedQty, rejectedQty, grnDate, inspector, remarks } = req.body;

    if (!grnNo || !loadingId || !passedQty || !inspector) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields (GRN No, Passed Qty, Inspector)' 
      });
    }

    const cleanGrnNo = grnNo.trim().toUpperCase();
    const existing = await GrnReceipt.findOne({ grnNo: cleanGrnNo });
    if (existing) {
      return res.status(400).json({ success: false, message: 'GRN / Slip No already exists' });
    }

    const newGrn = new GrnReceipt({
      grnNo: cleanGrnNo,
      loadingId,
      passedQty: Number(passedQty),
      rejectedQty: Number(rejectedQty) || 0,
      grnDate: grnDate ? new Date(grnDate) : new Date(),
      inspector,
      remarks: remarks || ''
    });

    await newGrn.save();
    res.status(201).json({ success: true, data: newGrn });
  } catch (error) {
    console.error('GRN Save Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;