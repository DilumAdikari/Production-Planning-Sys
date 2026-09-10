const mongoose = require('mongoose');

const cutLoadingSchema = new mongoose.Schema({
  docNo: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  plantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Plant', 
    required: true 
  },
  styleNo: { 
    type: String, 
    required: true, 
    uppercase: true 
  },
  garmentDesc: { 
    type: String, 
    required: true 
  },
  cutQty: { 
    type: Number, 
    required: true 
  },
  loadDate: { 
    type: Date, 
    default: Date.now 
  },
  targetDate: { 
    type: Date 
  },
  ratioBreakdown: { 
    type: String 
  },
  remarks: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['In-Sewing', 'Completed'], 
    default: 'In-Sewing' 
  }
}, { timestamps: true });

module.exports = mongoose.model('CutLoading', cutLoadingSchema);