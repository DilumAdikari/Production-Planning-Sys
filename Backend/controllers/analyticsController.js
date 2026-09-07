const Plant = require('../models/Plant');

exports.getPlantWipBalances = async (req, res) => {
  try {
    const balances = await Plant.aggregate([
      {
        $lookup: {
          from: 'cutloadings',
          localField: '_id',
          foreignField: 'plantId',
          as: 'loadings'
        }
      },
      {
        $lookup: {
          from: 'grnreceipts',
          localField: 'loadings._id',
          foreignField: 'loadingId',
          as: 'grns'
        }
      },
      {
        $project: {
          code: 1,
          name: 1,
          district: 1,
          capacity: 1,
          location: 1,
          totalCutLoaded: { $sum: '$loadings.cutQty' },
          totalPassed: { $sum: '$grns.passedQty' },
          totalRejected: { $sum: '$grns.rejectedQty' },
          wipBalance: {
            $subtract: [
              { $sum: '$loadings.cutQty' },
              { $add: [{ $sum: '$grns.passedQty' }, { $sum: '$grns.rejectedQty' }] }
            ]
          }
        }
      }
    ]);

    res.status(200).json(balances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};