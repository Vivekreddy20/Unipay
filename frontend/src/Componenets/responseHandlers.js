export const handleRollNumberResponse = async (response, setRollNumberSubmitted, setError) => {
  if (response.ok) {
    setRollNumberSubmitted(true);
    setError('');
  } else if (response.status === 429) {
    setError('Too many attempts, please try again after 15 minutes.');
  } else {
    const responseData = await response.json();
    setError(responseData.message || 'Roll number doesn\'t exist.');
    setRollNumberSubmitted(false);
  }
};

export const handleDobResponse = async (response, setDobSubmitted, setError1) => {
  if (response.ok) {
    setDobSubmitted(true);
    setError1('');
  } else if (response.status === 404) {
    setError1('Invalid DOB');
  } else if (response.status === 429) {
    setError1('Too many attempts, please try again after 15 minutes.');
  } else {
    const responseData = await response.json();
    setError1(responseData.message || 'Error logging DOB.');
  }
};

export const handleFeeTypeResponse = async (response, setError) => {
  if (response.ok) {
    console.log("ok")
  } else if (response.status === 429) {
    setError('Too many attempts, please try again after 15 minutes.');
  }  else if (response.status === 403) {
    setError('Fee option not enabled yet.');
  }else if (response.status === 409) {
    setError('Already paid');
  } else {
    const responseData = await response.json();
    setError(responseData.message || 'Err fetching fee type options.');
  }
};
