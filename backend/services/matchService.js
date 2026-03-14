const TransferRequest = require('../models/TransferRequest');
const Match = require('../models/Match');

/**
 * Core Matching Engine
 * When a new TransferRequest is created, looks for a reverse-matching request.
 * e.g. If new request: currentStation=DELHI, desiredStation=GUWAHATI
 *      Looks for:      currentStation=GUWAHATI, desiredStation=DELHI
 *
 * If found, creates a Match record linking both users.
 */
const findAndCreateMatches = async (newRequest) => {
  const createdMatches = [];

  try {
    // Find all active reverse-matching requests (exclude user's own requests)
    const reverseMatches = await TransferRequest.find({
      designation: newRequest.designation, // Must be same designation for mutual transfer
      currentStation: newRequest.desiredStation,
      desiredStation: newRequest.currentStation,
      status: 'active',
      userId: { $ne: newRequest.userId }, // Can't match with yourself
    }).populate('userId', 'name mobile');

    for (const reverseRequest of reverseMatches) {
      // Check if a match already exists between these two requests (either order)
      const existingMatch = await Match.findOne({
        $or: [
          { requestA: newRequest._id, requestB: reverseRequest._id },
          { requestA: reverseRequest._id, requestB: newRequest._id },
        ],
      });

      if (existingMatch) continue; // Skip duplicates

      // Create new match
      const match = await Match.create({
        userA: newRequest.userId,
        userB: reverseRequest.userId,
        requestA: newRequest._id,
        requestB: reverseRequest._id,
        contactRevealed: [],
      });

      // Update both transfer requests to "matched" status
      await TransferRequest.findByIdAndUpdate(newRequest._id, { status: 'matched' });
      await TransferRequest.findByIdAndUpdate(reverseRequest._id, { status: 'matched' });

      createdMatches.push(match);
    }
  } catch (error) {
    console.error('Matching engine error:', error.message);
    // Don't throw — matching failure should not break the transfer creation
  }

  return createdMatches;
};

module.exports = { findAndCreateMatches };
