import "../assess.css";
import React, { useState } from "react";


function AssessMedi() {
  const [weight, setW] = useState('');
  const [height, setH] = useState('');
  const [result, setResult] = useState('');
  const [resColor, setResColor] = useState('black');
  const [bmi2, setBmi2] = useState('');

  

  const handleResult = (value) => {
    setResult(value);
  }
  const handleWeightChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]+$/.test(value)) {
      setW(value);
    }
  }
  const handleHeightChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]+$/.test(value)) {
      setH(value);
    }
  }
  const calculateBMI = (weight, height) => {
    if (height && weight) {
      const HinMetres = height / 100;
      return (weight / (HinMetres * HinMetres));
    }
  };

  const bmi = calculateBMI(weight, height);

  const buttonClick = (e) => {
    e.preventDefault();
    try {
      console.log("Weight:", weight);
      console.log("Height:", height);
      console.log("BMI:", bmi.toFixed(1));
    } catch (error) {
      console.error("Please enter valid numbers for weight and height.");
    }

    if (!weight || !height) {
    return 0;
  }

  const bmiValue = calculateBMI(weight, height);
  const roundedBmi = bmiValue.toFixed(1);
  setBmi2(roundedBmi); // Save to state for display


    if (bmi < 18.5) {
      handleResult("Underweight");
      setResColor('blue');
    }
    else if (bmi >= 18.5 && bmi < 24.9) {
      handleResult("Normal weight");
      setResColor('green');
    }
    else if (bmi >= 25 && bmi < 29.9) {
      handleResult("Overweight");
      setResColor('orange');
    }
    else {
      handleResult("Obese");
      setResColor('red');
    }

    return bmi;
  }


  return (
    <div className="Home">
      <header className="container">
        <h1 className="a-header">Take a free analysis today</h1>
        <p>Receive an accurate BMI Index in seconds</p>
        <form className="assess-form">
          <div className="form-group">

            <div
          style={{
            display: 'flex',
            justifyContent: 'left',
            gap: '5rem',
          }}
        >
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              style={{ marginRight: '1rem'}}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              style={{ marginRight: '1rem'}}
            />
            Female
          </label>
        </div>
           
            <label>Weight (kg)
              <input style={{ marginLeft: '20px' }} type="text" id="weight" name="weight" value={weight} onChange={handleWeightChange} placeholder="Enter your weight" required />
            </label>
            <label>Height (cm)
              <input style={{ marginLeft: '20px' }} type="text" id="height" name="height" value={height} onChange={handleHeightChange} placeholder="Enter your height" required />
            </label>
            <div className="button-container">
              <button onClick={buttonClick}>Submit</button>
            </div>
          </div>
        </form>
        <div className="result" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <p>You Are</p>
  <h1 style={{ color: resColor }}>{result}</h1>
  {bmi2 && <h2 style={{ marginTop: '0.5rem' }}>BMI Index: {bmi2}</h2>}
</div>
        <h1 className="a-header">Tips & Guidance</h1>
        <p>Based on your result </p>
      </header>
    </div>
  );
}

export default AssessMedi;
