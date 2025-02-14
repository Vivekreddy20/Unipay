import React, { useState } from 'react';
import { RollNumberInput, DobInput, OptionInput, SubmitButton } from './FormInput';
import { handleRollNumberResponse, handleDobResponse, handleFeeTypeResponse } from './responseHandlers';
import { useNavigate } from 'react-router-dom';

function RollNumberForm() {
  const [rollNumber, setRollNumber] = useState('');
  const [dob, setDob] = useState('');
  const [feeType, setfeeType] = useState('');
  const [error, setError] = useState('');
  const [error1, setError1] = useState('');
  const [rollNumberSubmitted, setRollNumberSubmitted] = useState(false);
  const [dobSubmitted, setDobSubmitted] = useState(false);
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRollNumberSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/v1/api/roll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rollNumber: rollNumber.toUpperCase() }),
      });

      handleRollNumberResponse(response, setRollNumberSubmitted, setError);
    } catch (error) {
      setError('Error logging roll number on the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDobSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/v1/api/dob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rollNumber: rollNumber.toUpperCase(), dob }),
      });
      const data = await response.json();
      handleDobResponse(response, setDobSubmitted, setError1);
      if (data.ok) {
        
      }
    } catch (error) {
      setError1('Error logging DOB on the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeeTypeRequest = async () => {
    setLoading(true);

    try {
      const response = await fetch('/v1/api/fee/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rollNumber: rollNumber.toUpperCase(), dob , feeType , year, semester}),
      });
      const data = await response.json();
      await handleFeeTypeResponse(response, setError);
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setTimeout(() => {
          // Remove token from localStorage after 5 minutes
          localStorage.removeItem('token');
        }, 5 * 60 * 1000);
        navigate('/form'); // Pass token in state
      }
    } catch (error) {
      setError('Error fetching fee type options.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!rollNumberSubmitted) {
      await handleRollNumberSubmit(event);
    } else if (rollNumberSubmitted && !dobSubmitted) {
      await handleDobSubmit(event);
    } else if (rollNumberSubmitted && dobSubmitted) {
      await handleFeeTypeRequest();
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <RollNumberInput
        rollNumber={rollNumber}
        setRollNumber={setRollNumber}
        setRollNumberSubmitted={setRollNumberSubmitted}
        setDob={setDob}
      />
      {rollNumberSubmitted && (
        <>
          <DobInput dob={dob} setDob={setDob} />
          {error1 && <p style={{ color: 'red' }}>{error1}</p>}
          {dobSubmitted && <OptionInput
              feeType={feeType}
              setfeeType={setfeeType}
              year={year}
              setYear={setYear}
              semester={semester}
              setSemester={setSemester}
            />}
        </>
      )}
      {error && (
  <p
    style={{
      color: 'red',
      fontSize: '20px', // Increase font size
    }}
  >
    {error}
  </p>
)}
      <SubmitButton loading={loading} rollNumberSubmitted={rollNumberSubmitted} dobSubmitted={dobSubmitted} />
    </form>
  );
}

export default RollNumberForm;
