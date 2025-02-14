const feeAmount = (feeDetails, feeType, year, semester) => {
    const FeeAmount = feeDetails.FeeAmount;
    let amount = 0;
    if (feeType === 'CollegeFee' || feeType === 'TransportFee') {
      amount = FeeAmount[feeType][year];
    } else if (feeType === 'RegularFee' || feeType === 'SupplyFee' || feeType === 'Re-Evaluation') {
      const yearSem = `${year}-${semester}`;
      amount = FeeAmount[feeType][yearSem];
    }
    return amount;
  };
  
  const isFeeEnabled = (feeDetails, feeType, year, semester) => {
    const isEnabled = feeDetails.isEnabled;
    if (feeType === 'CollegeFee' || feeType === 'TransportFee') {
      return isEnabled[feeType][year];
    } else if (feeType === 'RegularFee' || feeType === 'SupplyFee' || feeType === 'Re-Evaluation') {
      const yearSem = `${year}-${semester}`;
      return isEnabled[feeType][yearSem];
    }
    return false;
  };
  
  const isFeePaid = (feeDetails, feeType, year, semester) => {
    const isPaid = feeDetails.isPaid;
    if (feeType === 'CollegeFee' || feeType === 'TransportFee') {
      return isPaid[feeType][year];
    } else if (feeType === 'RegularFee' || feeType === 'SupplyFee' || feeType === 'Re-Evaluation') {
      const yearSem = `${year}-${semester}`;
      return isPaid[feeType][yearSem];
    }
    return false;
  };
  
  module.exports = {
    feeAmount,
    isFeeEnabled,
    isFeePaid,
  };
  