
import { useEffect, useState } from "react";

import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Gauge,
  Landmark,
  LoaderCircle,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wallet,
  Database,
  GraduationCap
} from "lucide-react";

// Flask API URL
const API_URL = "http://127.0.0.1:5000";

// Initial form values
const initialForm = {
  Age: "39",
  Annual_Income: "412861",
  Credit_Score: "731",
  Debt_to_Income_Ratio: "0.18",
  Loan_Amount: "67047",
  Loan_Term_Months: "60",
  Past_Loans: "2",
  Defaults: "0"
};

// Model input features
const fields = [
  {
    key: "Age",
    label: "Applicant Age",
    icon: UserRound,
    hint: "Age in years",
    min: 18,
    max: 100,
    step: 1
  },
  {
    key: "Annual_Income",
    label: "Annual Income",
    icon: Banknote,
    hint: "Yearly income in INR",
    min: 0,
    step: 1000
  },
  {
    key: "Credit_Score",
    label: "Credit Score",
    icon: Gauge,
    hint: "Score between 300 and 900",
    min: 300,
    max: 900,
    step: 1
  },
  {
    key: "Debt_to_Income_Ratio",
    label: "Debt to Income Ratio",
    icon: Activity,
    hint: "Example: 0.18",
    min: 0,
    max: 1,
    step: 0.01
  },
  {
    key: "Loan_Amount",
    label: "Loan Amount",
    icon: Wallet,
    hint: "Requested amount in INR",
    min: 0,
    step: 1000
  },
  {
    key: "Loan_Term_Months",
    label: "Loan Term",
    icon: Clock3,
    hint: "Duration in months",
    min: 1,
    step: 1
  },
  {
    key: "Past_Loans",
    label: "Previous Loans",
    icon: Landmark,
    hint: "Number of previous loans",
    min: 0,
    step: 1
  },
  {
    key: "Defaults",
    label: "Previous Defaults",
    icon: ShieldAlert,
    hint: "Number of defaults",
    min: 0,
    step: 1
  }
];

function App() {
  const [form, setForm] = useState(initialForm);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [apiStatus, setApiStatus] = useState("checking");

  const [error, setError] = useState("");

  // Check Flask API connection
  useEffect(() => {
    let active = true;

    const checkAPI = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/health`
        );

        if (!response.ok) {
          throw new Error("API unavailable");
        }

        const data = await response.json();

        if (active) {
          setApiStatus(
            data.model_loaded ? "online" : "offline"
          );
        }
      } catch {
        if (active) {
          setApiStatus("offline");
        }
      }
    };

    checkAPI();

    const interval = setInterval(checkAPI, 15000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Update input fields
  const handleChange = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value
    }));

    setError("");
  };

  // Predict loan risk
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    const payload = Object.fromEntries(
      fields.map((field) => [
        field.key,
        Number(form[field.key])
      ])
    );

    try {
      const response = await fetch(
        `${API_URL}/api/predict`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Prediction failed"
        );
      }

      setResult(data);

    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Unable to connect to Flask. Please start your backend using python app.py."
          : err.message
      );

    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setForm(initialForm);
    setResult(null);
    setError("");
  };

  const isHighRisk = result?.prediction === 1;

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">
            <ShieldCheck size={23} />
          </div>

          <h2>
            Credence<span>.</span>
          </h2>
        </div>

        <div className="sidebar-label">
          MAIN MENU
        </div>

        <a href="#dashboard" className="nav-link active">
          <Gauge size={19} />
          Dashboard
        </a>

        <a href="#predictor" className="nav-link">
          <BrainCircuit size={19} />
          Risk Predictor
        </a>

        <a href="#about" className="nav-link">
          <Database size={19} />
          About Project
        </a>

        <div className="sidebar-bottom">

          <div className="connection-card">

            <div className="connection-title">
              <span
                className={`status-dot ${apiStatus}`}
              />

              BACKEND STATUS
            </div>

            <h4>
              {apiStatus === "online"
                ? "Connected"
                : apiStatus === "checking"
                ? "Checking..."
                : "Disconnected"}
            </h4>

            <p>
              Flask API · localhost:5000
            </p>

          </div>

          <div className="sidebar-footer">
            LOAN RISK INTELLIGENCE
          </div>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="main-content">

        {/* HEADER */}

        <header className="topbar">

          <div>
            <span className="breadcrumb">
              Workspace / Dashboard
            </span>

            <h3>Overview</h3>
          </div>

          <div className="topbar-right">

            <div className="system-status">
              <span
                className={`status-dot ${apiStatus}`}
              />

              {apiStatus === "online"
                ? "System Online"
                : "System Offline"}
            </div>

            <div className="profile-avatar">
              SQ
            </div>

          </div>

        </header>

        {/* HERO SECTION */}

        <section className="hero" id="dashboard">

          <div className="hero-content">

            <div className="hero-tag">
              <Sparkles size={15} />
              SMART LOAN RISK ANALYSIS
            </div>

            <h1>
              Intelligent insights.
              <br />

              <span>Smarter loan decisions.</span>
            </h1>

            <p>
              Analyze applicant information with machine
              learning and identify potential loan risk
              patterns within seconds.
            </p>

            <a href="#predictor" className="hero-button">
              Start Prediction
              <ArrowUpRight size={17} />
            </a>

          </div>

          <div className="hero-graphic">

            <div className="graphic-circle circle-one" />
            <div className="graphic-circle circle-two" />

            <div className="floating-card">

              <div className="floating-top">
                <ShieldCheck size={19} />
                AI POWERED ANALYSIS
              </div>

              <div className="floating-ai">
                AI <span>/ ML</span>
              </div>

              <p>
                Random Forest Classifier
              </p>

              <div className="graphic-bars">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      height: `${30 + ((i * 19) % 65)}%`
                    }}
                  />
                ))}
              </div>

            </div>

          </div>

        </section>

        {/* STATISTICS */}

        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon purple">
              <BrainCircuit size={21} />
            </div>

            <p>ALGORITHM</p>

            <h3>Random Forest</h3>

            <span>200 Decision Trees</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              <Database size={21} />
            </div>

            <p>DATASET SIZE</p>

            <h3>30,000</h3>

            <span>Bank Loan Records</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <Gauge size={21} />
            </div>

            <p>MODEL ACCURACY</p>

            <h3>97.83%</h3>

            <span>Test Dataset Accuracy</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Activity size={21} />
            </div>

            <p>INPUT FEATURES</p>

            <h3>08 Features</h3>

            <span>Customer Information</span>
          </div>

        </section>

        {/* PREDICTION WORKSPACE */}

        <section className="workspace" id="predictor">

          <div className="form-card">

            <div className="section-heading">

              <div>
                <span className="section-label">
                  PREDICTION WORKSPACE
                </span>

                <h2>Applicant Information</h2>

                <p>
                  Enter customer details to predict loan risk.
                </p>
              </div>

              <span className="step-number">
                01 / 01
              </span>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                {fields.map((field) => {

                  const Icon = field.icon;

                  return (
                    <div className="form-group" key={field.key}>

                      <label htmlFor={field.key}>
                        <Icon size={16} />
                        {field.label}
                      </label>

                      <input
                        id={field.key}
                        type="number"
                        value={form[field.key]}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        onChange={(e) =>
                          handleChange(
                            field.key,
                            e.target.value
                          )
                        }
                        required
                      />

                      <small>
                        {field.hint}
                      </small>

                    </div>
                  );
                })}

              </div>

              {/* ERROR */}

              {error && (
                <div className="error-box">
                  <CircleAlert size={18} />
                  {error}
                </div>
              )}

              {/* BUTTONS */}

              <div className="form-buttons">

                <button
                  type="button"
                  className="reset-button"
                  onClick={resetForm}
                >
                  <RotateCcw size={16} />
                  Reset
                </button>

                <button
                  type="submit"
                  className="predict-button"
                  disabled={
                    loading || apiStatus !== "online"
                  }
                >

                  {loading ? (
                    <>
                      <LoaderCircle className="spin" size={18} />
                      Analysing...
                    </>
                  ) : (
                    <>
                      Predict Loan Risk
                      <ArrowRight size={18} />
                    </>
                  )}

                </button>

              </div>

              {apiStatus === "offline" && (
                <p className="backend-warning">
                  Start your Flask backend using:
                  <code> python app.py </code>
                </p>
              )}

            </form>

          </div>

          {/* RESULT PANEL */}

          <div className="right-column">

            <div className="result-card">

              <span className="section-label">
                ANALYSIS OUTPUT
              </span>

              <h2>Risk Assessment</h2>

              {!result ? (

                <div className="empty-result">

                  <div className="empty-icon">
                    <Shield size={38} />
                  </div>

                  <h3>Awaiting Prediction</h3>

                  <p>
                    Enter applicant information and click
                    Predict Loan Risk to see the result.
                  </p>

                  <div className="result-steps">
                    <span>01. Details</span>
                    <span>02. Analysis</span>
                    <span>03. Result</span>
                  </div>

                </div>

              ) : (

                <div className="result-content">

                  <div
                    className={`result-icon ${
                      isHighRisk ? "high" : "low"
                    }`}
                  >
                    {isHighRisk
                      ? <ShieldAlert size={32} />
                      : <ShieldCheck size={32} />}
                  </div>

                  <span className="result-label">
                    MODEL CLASSIFICATION
                  </span>

                  <h2
                    className={
                      isHighRisk
                        ? "high-risk"
                        : "low-risk"
                    }
                  >
                    {result.risk}
                  </h2>

                  <p className="result-description">
                    {isHighRisk
                      ? "The model identifies this applicant as having a higher-risk profile."
                      : "The model identifies this applicant as having a lower-risk profile."}
                  </p>

                  <div className="probability-card">

                    <div className="probability-heading">
                      <span>High Risk Probability</span>

                      <strong>
                        {result.high_risk_probability == null
                          ? "N/A"
                          : `${(
                              result.high_risk_probability * 100
                            ).toFixed(2)}%`}
                      </strong>
                    </div>

                    <div className="probability-track">
                      <div
                        style={{
                          width: `${
                            (result.high_risk_probability || 0) *
                            100
                          }%`
                        }}
                      />
                    </div>

                    <small>
                      Model estimated probability of class 1
                    </small>

                  </div>

                  <div className="success-message">
                    <CheckCircle2 size={16} />
                    Prediction completed successfully
                  </div>

                  <button
                    className="again-button"
                    onClick={() => setResult(null)}
                  >
                    New Prediction
                    <ArrowUpRight size={16} />
                  </button>

                </div>

              )}

            </div>

            {/* CREATOR INFORMATION */}

            <div className="creator-card" id="about">

              <div className="creator-heading">
                <GraduationCap size={19} />
                ABOUT THE PROJECT
              </div>

              <h3>
                Built with data.
                <br />
                Powered by intelligence.
              </h3>

              <p>
                An academic machine learning project
                developed to analyze bank loan risk
                using applicant information.
              </p>

              <div className="creator-profile">

                <div className="creator-avatar">
                  SQ
                </div>

                <div>
                  <small>
                    CREATED & DATASET COLLECTED BY
                  </small>

                  <h4>Shakir Qureshi</h4>

                  <span>MCA Student</span>
                </div>

                <CheckCircle2
                  size={20}
                  className="verified-icon"
                />

              </div>

              <div className="creator-meta">
                <span>ALGORITHM</span>
                <strong>Random Forest Classifier</strong>
              </div>

              <div className="creator-meta">
                <span>DATASET</span>
                <strong>Collected by Shakir Qureshi</strong>
              </div>

            </div>

          </div>

        </section>

        {/* DISCLAIMER */}

        <div className="disclaimer">

          <Shield size={18} />

          <p>
            <strong>Academic Project Disclaimer:</strong>
            This prediction is generated by a machine learning
            model using the supplied dataset. It is intended
            for educational purposes and should not be used
            alone for actual loan approval or rejection.
          </p>

        </div>

        {/* FOOTER */}

        <footer className="footer">

          <span>
            © 2026 Credence · Loan Risk Intelligence
          </span>

          <span>
            Academic Machine Learning Project
          </span>

        </footer>

      </main>

    </div>
  );
}

export default App;

