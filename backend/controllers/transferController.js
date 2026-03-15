const { validationResult } = require('express-validator');
const TransferRequest = require('../models/TransferRequest');
const { findAndCreateMatches } = require('../services/matchService');

// @desc    Create a new transfer request
// @route   POST /api/transfers
// @access  Private
const createTransfer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { 
      department,
      subDepartment,
      designation, 
      modeOfSelection,
      basicPay,
      category,
      currentZone, 
      currentDivision, 
      currentStation, 
      desiredZone, 
      desiredDivision, 
      desiredStation 
    } = req.body;

    // Limit check
    const maxRequests = parseInt(process.env.MAX_TRANSFER_REQUESTS) || 3;
    const activeRequestsCount = await TransferRequest.countDocuments({
      userId: req.user._id,
      status: 'active'
    });

    if (activeRequestsCount >= maxRequests) {
      return res.status(400).json({ 
        message: `You have reached the maximum limit of ${maxRequests} active transfer requests. Please delete an existing request to create a new one.` 
      });
    }

    // Check if user already has an active transfer request for exact same details
    const existingRequest = await TransferRequest.findOne({
      userId: req.user._id,
      department,
      subDepartment,
      designation,
      currentStation: currentStation.toUpperCase(),
      desiredStation: desiredStation.toUpperCase(),
      status: 'active',
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have an identical active transfer request' });
    }

    const transferRequest = await TransferRequest.create({
      userId: req.user._id,
      department,
      subDepartment,
      designation,
      modeOfSelection,
      basicPay,
      category,
      currentZone,
      currentDivision,
      currentStation: currentStation.toUpperCase(),
      desiredZone,
      desiredDivision,
      desiredStation: desiredStation.toUpperCase(),
    });

    // Run the matching engine asynchronously
    const matches = await findAndCreateMatches(transferRequest);

    res.status(201).json({
      message: 'Transfer request created successfully',
      transferRequest,
      matchesFound: matches.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my transfer requests
// @route   GET /api/transfers/my
// @access  Private
const getMyTransfers = async (req, res, next) => {
  try {
    const transfers = await TransferRequest.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ transfers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transfer request by ID
// @route   GET /api/transfers/:id
// @access  Private
const getTransferById = async (req, res, next) => {
  try {
    const transfer = await TransferRequest.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({ message: 'Transfer request not found' });
    }

    // Only owner can view
    if (transfer.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this request' });
    }

    res.json(transfer);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a transfer request
// @route   PUT /api/transfers/:id
// @access  Private
const updateTransfer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    let transfer = await TransferRequest.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({ message: 'Transfer request not found' });
    }

    // Only owner can update
    if (transfer.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    // Update fields
    const updateData = { ...req.body };
    if (updateData.currentStation) updateData.currentStation = updateData.currentStation.toUpperCase();
    if (updateData.desiredStation) updateData.desiredStation = updateData.desiredStation.toUpperCase();

    transfer = await TransferRequest.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    // Re-run matching engine after update
    const matches = await findAndCreateMatches(transfer);

    res.json({
      message: 'Transfer request updated successfully',
      transfer,
      matchesFound: matches.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search transfer requests by zone/division/station
// @route   GET /api/transfers/search
// @access  Private
const searchTransfers = async (req, res, next) => {
  try {
    const { zone, division, station, page = 1, limit = 20 } = req.query;
    const query = { status: 'active', userId: { $ne: req.user._id } };

    if (zone) query.currentZone = { $regex: zone, $options: 'i' };
    if (division) query.currentDivision = { $regex: division, $options: 'i' };
    if (station) query.currentStation = { $regex: station.toUpperCase(), $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await TransferRequest.countDocuments(query);
    const transfers = await TransferRequest.find(query)
      .populate('userId', 'name designation railwayZone division station')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      transfers,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete (cancel) a transfer request
// @route   DELETE /api/transfers/:id
// @access  Private
const deleteTransfer = async (req, res, next) => {
  try {
    const transfer = await TransferRequest.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({ message: 'Transfer request not found' });
    }

    // Only owner can delete
    if (transfer.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this request' });
    }

    await transfer.deleteOne();

    res.json({ message: 'Transfer request cancelled successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public transfer requests for landing page
// @route   GET /api/transfers/public
// @access  Public
const getPublicTransfers = async (req, res, next) => {
  try {
    const transfers = await TransferRequest.find({ status: 'active' })
      .populate('userId', 'name designation')
      .sort({ createdAt: -1 })
      .limit(6);

    // Sanitize the names (only show first name)
    const sanitizedTransfers = transfers.map(transfer => {
      const transferObj = transfer.toObject();
      if (transferObj.userId && transferObj.userId.name) {
        transferObj.userId.name = transferObj.userId.name.split(' ')[0];
      }
      return transferObj;
    });

    res.json({ transfers: sanitizedTransfers });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  createTransfer, 
  getMyTransfers, 
  getTransferById, 
  updateTransfer, 
  searchTransfers, 
  getPublicTransfers, 
  deleteTransfer 
};

