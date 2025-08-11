// src/pages/AssessMedi.js
import React, { useEffect, useState } from "react";
import { Activity, User, Scale, Ruler, AlertCircle, CheckCircle, Info } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import "../assess.css";

function AssessMedi() {
  // Inputs
  const [weight, setW] = useState("");
  const [height, setH] = useState("");
  const [gender, setGender] = useState("");

  // Results
  const [result, setResult] = useState("");
  const [resColor, setResColor] = useState("");
  const [bmi2, setBmi2] = useState("");
  const [showResult, setShowResult] = useState(false);

  // Auth + history
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);

  // ---------- Helpers ----------
  const handleWeightChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) setW(value);
  };

  const handleHeightChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) setH(value);
  };

  const calculateBMI = (weightKg, heightCm) => {
    const w = Number(weightKg);
    const h = Number(heightCm);
    if (!w || !h) return NaN;
    const meters = h / 100;
    return w / (meters * meters);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: "Underweight", color: "#3B82F6", icon: AlertCircle };
    if (bmi >= 18.5 && bmi < 25) return { category: "Normal weight", color: "#10B981", icon: CheckCircle };
    if (bmi >= 25 && bmi < 30) return { category: "Overweight", color: "#F59E0B", icon: AlertCircle };
    return { category: "Obese", color: "#EF4444", icon: AlertCircle };
  };

  const getTipsContent = () => {
    const tips = {
      Underweight: {
        title: "Healthy Weight Gain Guidelines",
        items: [
          "Consult with a healthcare provider for personalized nutrition advice",
          "Focus on nutrient-dense, calorie-rich foods like nuts, avocados, and lean proteins",
          "Eat frequent, smaller meals throughout the day",
          "Consider strength training to build healthy muscle mass",
        ],
        note:
          "Being underweight may indicate underlying health conditions that require medical attention.",
      },
      "Normal weight": {
        title: "Maintaining Your Healthy Weight",
        items: [
          "Continue balanced eating with variety from all food groups",
          "Engage in regular physical activity (150 minutes moderate exercise weekly)",
          "Stay hydrated and get adequate sleep",
          "Schedule regular health screenings and check-ups",
        ],
        note: "You're in the healthy weight range. Keep up the good work!",
      },
      Overweight: {
        title: "Weight Management Strategies",
        items: [
          "Create a modest caloric deficit through diet and exercise",
          "Focus on whole foods and limit processed items",
          "Incorporate both cardio and resistance training",
          "Consider consulting a registered dietitian for meal planning",
        ],
        note: "Small, sustainable changes are more effective than drastic measures.",
      },
      Obese: {
        title: "Comprehensive Weight Management",
        items: [
          "Seek guidance from healthcare professionals including doctors and dietitians",
          "Start with low-impact activities and gradually increase intensity",
          "Consider medically supervised weight loss programs",
          "Address any underlying conditions that may contribute to weight gain",
        ],
        note:
          "Professional medical support is recommended for safe and effective weight management.",
      },
    };
    return tips[result] || null;
  };

  // ---------- Supabase: auth + history ----------
  const refreshHistory = async () => {
    if (!user) return setHistory([]);
    const { data, error } = await supabase
      .from("bmi_measurements")
      .select("bmi, weight_kg, height_cm, gender, measured_at")
      .order("measured_at", { ascending: false })
      .limit(5);
    if (!error) setHistory(data || []);
  };

  useEffect(() => {
    // Get current user and listen to changes
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [user]);

  // ---------- Actions ----------
  const buttonClick = async (e) => {
    e.preventDefault();

    if (!weight || !height || !gender) {
      alert("Please fill in all fields");
      return;
    }

    const bmi = calculateBMI(weight, height);
    if (!isFinite(bmi)) {
      alert("Please enter valid numbers for weight and height.");
      return;
    }

    const roundedBmi = bmi.toFixed(1);
    setBmi2(roundedBmi);

    const bmiInfo = getBMICategory(bmi);
    setResult(bmiInfo.category);
    setResColor(bmiInfo.color);
    setShowResult(true);

    // Save to DB if logged in
    if (user) {
      await supabase.from("bmi_measurements").insert({
        user_id: user.id,
        weight_kg: Number(weight),
        height_cm: Number(height),
        gender,
      });
      await refreshHistory();
    }
  };

  const resetForm = () => {
    setW("");
    setH("");
    setGender("");
    setResult("");
    setBmi2("");
    setShowResult(false);
  };

  // ---------- UI ----------
  return (
    <div className="bmi-app">
      {/* Header Section */}
      <div className="bmi-header">
        <div className="bmi-header-content">
          <div className="bmi-icon-container">
            <div className="bmi-icon-circle">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="bmi-main-title">BMI Health Assessment</h1>
          <p className="bmi-subtitle">
            Get your Body Mass Index calculated with professional medical insights
          </p>
          {!user && (
            <p className="bmi-important" style={{ marginTop: "0.75rem" }}>
              Tip: <strong>Log in</strong> to save your BMI history and see recent results here.
            </p>
          )}
        </div>
      </div>

      <div className="bmi-main-content">
        {/* Calculator Form */}
        <div className="bmi-form-card">
          <div>
            {/* Gender Selection */}
            <div className="bmi-form-group">
              <label className="bmi-label">
                <User className="w-4 h-4 inline mr-2" />
                Gender
              </label>
              <div className="bmi-radio-group">
                <label className="bmi-radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={(e) => setGender(e.target.value)}
                    className="bmi-radio"
                  />
                  <span>Male</span>
                </label>
                <label className="bmi-radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={(e) => setGender(e.target.value)}
                    className="bmi-radio"
                  />
                  <span>Female</span>
                </label>
              </div>
            </div>

            {/* Weight and Height Inputs */}
            <div className="bmi-input-grid">
              <div>
                <label className="bmi-label">
                  <Scale className="w-4 h-4 inline mr-2" />
                  Weight (kg)
                </label>
                <input
                  type="text"
                  value={weight}
                  onChange={handleWeightChange}
                  placeholder="Enter your weight"
                  className="bmi-input"
                />
              </div>
              <div>
                <label className="bmi-label">
                  <Ruler className="w-4 h-4 inline mr-2" />
                  Height (cm)
                </label>
                <input
                  type="text"
                  value={height}
                  onChange={handleHeightChange}
                  placeholder="Enter your height"
                  className="bmi-input"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bmi-button-group">
              <button onClick={buttonClick} className="bmi-button-primary">
                Calculate BMI
              </button>
              {showResult && (
                <button onClick={resetForm} className="bmi-button-secondary">
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {showResult && (
          <>
            <div className="bmi-results-card">
              <h2 className="bmi-results-title">Your BMI Results</h2>
              <div className="bmi-result-display">
                <div className="bmi-value" style={{ color: resColor }}>
                  {bmi2}
                </div>
                <div className="bmi-index-label">BMI Index</div>
                <div className="bmi-category">
                  {React.createElement(getBMICategory(parseFloat(bmi2)).icon, {
                    className: "w-5 h-5",
                    style: { color: resColor },
                  })}
                  <span className="bmi-category-text" style={{ color: resColor }}>
                    {result}
                  </span>
                </div>
              </div>

              {/* BMI Scale Visualization */}
              <div className="bmi-scale"></div>
              <div className="bmi-scale-labels">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
              <div className="bmi-ranges">BMI ranges: &lt;18.5 | 18.5-24.9 | 25-29.9 | ≥30</div>
            </div>

            {/* Tips and Guidance */}
            <div className="bmi-tips-card">
              <h2 className="bmi-tips-title">Professional Health Guidance</h2>
              {getTipsContent() && (
                <div className="bmi-tips-content">
                  <div className="bmi-tips-box">
                    <div className="bmi-tips-header">
                      <Info className="bmi-tips-icon w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="bmi-tips-section-title">{getTipsContent().title}</h3>
                        <div className="bmi-tips-list">
                          {getTipsContent().items.map((item, index) => (
                            <p key={index} className="bmi-tips-text" style={{ marginBottom: "0.75rem" }}>
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bmi-disclaimer">
                    <p className="bmi-disclaimer-text">
                      <strong>Medical Disclaimer:</strong> {getTipsContent().note} This tool provides general guidance
                      only and should not replace professional medical advice.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Recent BMI history (if logged in) */}
            {user && history.length > 0 && (
              <div className="bmi-results-card">
                <h2 className="bmi-results-title">Your recent BMI history</h2>
                <div className="bmi-info-content">
                  {history.map((h, i) => (
                    <p key={i}>
                      {new Date(h.measured_at).toLocaleString()} — BMI {Number(h.bmi).toFixed(1)} ({h.weight_kg}kg,{" "}
                      {h.height_cm}cm, {h.gender})
                    </p>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Information Section */}
        <div className="bmi-info-card">
          <h2 className="bmi-info-title">About BMI</h2>
          <div className="bmi-info-content">
            <p>
              Body Mass Index (BMI) is a screening tool used to categorize individuals into weight status categories.
              While BMI is a useful population-level indicator, it has limitations and should be interpreted alongside
              other health markers.
            </p>
            <p className="bmi-important">
              <strong>Important:</strong> BMI does not directly measure body fat and may not accurately reflect health
              status for athletes, elderly individuals, or those with certain medical conditions. Always consult
              healthcare professionals for comprehensive health assessments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssessMedi;
