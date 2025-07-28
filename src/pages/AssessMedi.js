import "../assess.css";
import React, { useState } from "react";


function AssessMedi() {
  const [weight, setW] = useState('');
  const [height, setH] = useState('');
  const [result, setResult] = useState('');
  const [resColor, setResColor] = useState('black');

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
  }

  return (
    <div className="Home">
      <header className="container">
        <h1 className="a-header">Take a free analysis today</h1>
        <p>Receive personalised results in seconds</p>
        <form className="assess-form">
          <div className="form-group">
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
        <div className="result">
          <p>You Are</p>
          <h1 style={{ color: resColor }}>{result}</h1>
        </div>
      </header>
    </div>
  );
}

export default AssessMedi;
