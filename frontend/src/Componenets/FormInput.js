import React from 'react';

export function RollNumberInput({ rollNumber, setRollNumber, setRollNumberSubmitted, setDob }) {
  return (
    <>
      <input
        className="input-field"
        type="text"
        placeholder="Drop your roll number"
        minLength={5}
        maxLength={12}
        required
        value={rollNumber}
        onChange={(e) => {
          setRollNumber(e.target.value);
          setRollNumberSubmitted(false);
          setDob('');
        }}
      />
      <br /><br />
    </>
  );
}

export function DobInput({ dob, setDob }) {
  return (
    <>
      <input
        className="input-field"
        type="date"
        placeholder="Choose your DOB"
        required
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />
      <br /><br />
    </>
  );
}

export function OptionInput({ feeType, setfeeType, year, setYear, semester, setSemester }) {
  const handleOptionChange = (e) => {
    setfeeType(e.target.value);
    setYear(''); // Reset year and semester when option changes
    setSemester('');
  };

  return (
    <div className="option-input">
      <select id="option" value={feeType} onChange={handleOptionChange} required>
      <option value="" disabled>Choose the type of fee</option>
        <option value="CollegeFee">College Fee</option>
        <option value="TransportFee">Transport</option>
        <option value="RegularFee">Exam Fee</option>
        <option value="SupplyFee">Supplementary Fee</option>
        <option value="Re-Evaluation">Re-evaluation fee</option>
        <option value="Fine">Fines</option><br></br>
      </select><br /><br />
      {(feeType === 'CollegeFee' || feeType === 'TransportFee') && (
        <>
        <select id="option" value={year} onChange={(e) => setYear(e.target.value)} required>
          <option value="" disabled>Choose for which year the payment</option>
          <option value="I">Ist Year</option>
          <option value="II">IInd Year</option>
          <option value="III">IIIrd Year</option>
          <option value="IV">IVth Year</option>
        </select>
      </>
      )}
      {(feeType === 'RegularFee' || feeType === 'SupplyFee' || feeType === 'Re-Evaluation') && (
        <>
          <select id="option" value={year} onChange={(e) => setYear(e.target.value)} required>
          <option value="" disabled>Choose for which year the payment</option>
          <option value="I">Ist Year</option>
          <option value="II">IInd Year</option>
          <option value="III">IIIrd Year</option>
          <option value="IV">IVth Year</option>
        </select><br /><br />
        <select id="option" value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="" disabled>Choose for which part of the year payment</option>
          <option value="I">Ist Part</option>
          <option value="II">IInd Part</option>
        </select>
          
        </>
      )}
      <br /><br />
    </div>
  );
}

export function SubmitButton({ loading, rollNumberSubmitted, dobSubmitted }) {
  return (
    <button className="submit-button" type="submit" disabled={loading}>
      {loading ? 'Loading...' : (rollNumberSubmitted ? (dobSubmitted ? 'Pay' : 'Submit Dob') : 'Submit Roll Number')}
    </button>
  );
}