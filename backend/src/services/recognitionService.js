/**
 * Calculates Bronze / Silver / Gold recognition level from qualifying complaint count
 * Qualifying complaints = Non-rejected waste complaints submitted by the citizen
 */
const calculateRecognition = (qualifyingCount = 0) => {
  let medal = 'None';
  let badgeTitle = 'No medal yet';
  let currentTierMin = 0;
  let nextTierThreshold = 3;
  let progressPercentage = 0;

  if (qualifyingCount >= 10) {
    medal = 'Gold';
    badgeTitle = 'Gold';
    currentTierMin = 10;
    nextTierThreshold = 10;
    progressPercentage = 100;
  } else if (qualifyingCount >= 5) {
    medal = 'Silver';
    badgeTitle = 'Silver';
    currentTierMin = 5;
    nextTierThreshold = 10;
    progressPercentage = Math.min(100, Math.round(((qualifyingCount - 5) / (10 - 5)) * 100));
  } else if (qualifyingCount >= 3) {
    medal = 'Bronze';
    badgeTitle = 'Bronze';
    currentTierMin = 3;
    nextTierThreshold = 5;
    progressPercentage = Math.min(100, Math.round(((qualifyingCount - 3) / (5 - 3)) * 100));
  } else {
    medal = 'None';
    badgeTitle = 'No medal yet';
    currentTierMin = 0;
    nextTierThreshold = 3;
    progressPercentage = Math.min(100, Math.round((qualifyingCount / 3) * 100));
  }

  return {
    qualifyingCount,
    medal,
    badgeTitle,
    currentTierMin,
    nextTierThreshold,
    progressPercentage,
    complaintsNeededForNextTier: Math.max(0, nextTierThreshold - qualifyingCount),
  };
};

module.exports = {
  calculateRecognition,
};
