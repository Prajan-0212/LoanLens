import { useState } from "react";
import "./Prediction.css";

const initialForm = {
  gender: "",
  married: "",
  dependents: "",
  education: "",
  selfEmployed: "",
  applicantIncome: "",
  coApplicantIncome: "",
  loanAmount: "",
  loanTerm: "",
  creditHistory: "",
  propertyArea: "",
};

function Prediction() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }

    if (result) {
      setResult(null);
    }
  }

  function validateForm() {
    const nextErrors = {};

    if (!formData.gender) {
      nextErrors.gender = "Please select gender.";
    }

    if (!formData.married) {
      nextErrors.married = "Please select marital status.";
    }

    if (!formData.education) {
      nextErrors.education = "Please select education level.";
    }

    if (!formData.applicantIncome) {
      nextErrors.applicantIncome =
        "Please enter applicant income.";
    }

    if (!formData.loanAmount) {
      nextErrors.loanAmount =
        "Please enter the loan amount.";
    }

    if (!formData.creditHistory) {
      nextErrors.creditHistory =
        "Please select credit history.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setResult(null);

    const requestData = {
      gender: formData.gender,
      married: formData.married,
      dependents: formData.dependents || "0",
      education: formData.education,
      selfEmployed: formData.selfEmployed || "no",
      applicantIncome: Number(formData.applicantIncome),
      coApplicantIncome: Number(
        formData.coApplicantIncome || 0
      ),
      loanAmount: Number(formData.loanAmount),
      loanTerm: Number(formData.loanTerm || 360),
      creditHistory: formData.creditHistory,
      propertyArea: formData.propertyArea || "urban",
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/predict/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Prediction request failed."
        );
      }

      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error:
          error.message ||
          "Unable to connect to the prediction server.",
      });
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function formatFeatureName(feature) {
  const featureNames = {
    Credit_History: "Credit History",
    ApplicantIncome: "Applicant Income",
    LoanAmount: "Loan Amount",
    CoapplicantIncome: "Co-applicant Income",
    Loan_Amount_Term: "Loan Amount Term",
  };

  if (featureNames[feature]) {
    return featureNames[feature];
  }

  return feature
    .replace("Property_Area_", "Property Area: ")
    .replace("Education_", "Education: ")
    .replace("Dependents_", "Dependents: ")
    .replace("Married_", "Marital Status: ")
    .replace("Self_Employed_", "Self Employed: ")
    .replace("Gender_", "Gender: ")
    .replace(/_/g, " ");
}

  return (
    <main className="prediction-page">

      <section className="prediction-header">
        <div>
          <span className="page-eyebrow">
            LOAN ASSESSMENT
          </span>

          <h2>Check loan approval likelihood</h2>

          <p>
            Enter the applicant&apos;s information below. LoanLens
            will analyze the profile and generate a prediction.
          </p>
        </div>

        <div className="progress-badge">
          <span>STEP 1 OF 2</span>
          Applicant details
        </div>
      </section>


      <form
        className="prediction-form"
        onSubmit={handleSubmit}
      >

        <section className="form-card">

          <div className="form-card-header">

            <div className="form-icon">
              01
            </div>

            <div>
              <h3>Applicant information</h3>

              <p>
                Basic personal information about the applicant.
              </p>
            </div>

          </div>


          <div className="form-grid">

            <div className="field">

              <label htmlFor="gender">
                Gender
              </label>

              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                aria-invalid={Boolean(errors.gender)}
              >
                <option value="">
                  Select gender
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>
              </select>

              {errors.gender && (
                <span className="field-error">
                  {errors.gender}
                </span>
              )}

            </div>


            <div className="field">

              <label htmlFor="married">
                Marital status
              </label>

              <select
                id="married"
                name="married"
                value={formData.married}
                onChange={handleChange}
                aria-invalid={Boolean(errors.married)}
              >
                <option value="">
                  Select status
                </option>

                <option value="yes">
                  Married
                </option>

                <option value="no">
                  Single
                </option>
              </select>

              {errors.married && (
                <span className="field-error">
                  {errors.married}
                </span>
              )}

            </div>


            <div className="field">

              <label htmlFor="dependents">
                Dependents
              </label>

              <select
                id="dependents"
                name="dependents"
                value={formData.dependents}
                onChange={handleChange}
              >
                <option value="">
                  Select
                </option>

                <option value="0">
                  0
                </option>

                <option value="1">
                  1
                </option>

                <option value="2">
                  2
                </option>

                <option value="3+">
                  3+
                </option>
              </select>

            </div>


            <div className="field">

              <label htmlFor="education">
                Education
              </label>

              <select
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                aria-invalid={Boolean(errors.education)}
              >
                <option value="">
                  Select education
                </option>

                <option value="graduate">
                  Graduate
                </option>

                <option value="not_graduate">
                  Not Graduate
                </option>
              </select>

              {errors.education && (
                <span className="field-error">
                  {errors.education}
                </span>
              )}

            </div>


            <div className="field">

              <label htmlFor="selfEmployed">
                Employment type
              </label>

              <select
                id="selfEmployed"
                name="selfEmployed"
                value={formData.selfEmployed}
                onChange={handleChange}
              >
                <option value="">
                  Select employment
                </option>

                <option value="yes">
                  Self-employed
                </option>

                <option value="no">
                  Salaried
                </option>
              </select>

            </div>


            <div className="field">

              <label htmlFor="propertyArea">
                Property area
              </label>

              <select
                id="propertyArea"
                name="propertyArea"
                value={formData.propertyArea}
                onChange={handleChange}
              >
                <option value="">
                  Select area
                </option>

                <option value="urban">
                  Urban
                </option>

                <option value="semiurban">
                  Semi-urban
                </option>

                <option value="rural">
                  Rural
                </option>
              </select>

            </div>

          </div>

        </section>


        <section className="form-card">

          <div className="form-card-header">

            <div className="form-icon">
              02
            </div>

            <div>
              <h3>Financial information</h3>

              <p>
                Income and loan information used by the prediction
                model.
              </p>
            </div>

          </div>


          <div className="form-grid">

            <div className="field">

              <label htmlFor="applicantIncome">
                Applicant income
              </label>

              <div className="input-with-prefix">

                <span>₹</span>

                <input
                  id="applicantIncome"
                  name="applicantIncome"
                  type="number"
                  min="0"
                  placeholder="50000"
                  value={formData.applicantIncome}
                  onChange={handleChange}
                  aria-invalid={Boolean(
                    errors.applicantIncome
                  )}
                />

              </div>

              {errors.applicantIncome && (
                <span className="field-error">
                  {errors.applicantIncome}
                </span>
              )}

            </div>


            <div className="field">

              <label htmlFor="coApplicantIncome">
                Co-applicant income
              </label>

              <div className="input-with-prefix">

                <span>₹</span>

                <input
                  id="coApplicantIncome"
                  name="coApplicantIncome"
                  type="number"
                  min="0"
                  placeholder="10000"
                  value={formData.coApplicantIncome}
                  onChange={handleChange}
                />

              </div>

            </div>


            <div className="field">

              <label htmlFor="loanAmount">
                Loan amount
              </label>

              <div className="input-with-prefix">

                <span>₹</span>

                <input
                  id="loanAmount"
                  name="loanAmount"
                  type="number"
                  min="0"
                  placeholder="200000"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  aria-invalid={Boolean(
                    errors.loanAmount
                  )}
                />

              </div>

              {errors.loanAmount && (
                <span className="field-error">
                  {errors.loanAmount}
                </span>
              )}

            </div>


            <div className="field">

              <label htmlFor="loanTerm">
                Loan term
              </label>

              <select
                id="loanTerm"
                name="loanTerm"
                value={formData.loanTerm}
                onChange={handleChange}
              >
                <option value="">
                  Select term
                </option>

                <option value="120">
                  120 months
                </option>

                <option value="180">
                  180 months
                </option>

                <option value="240">
                  240 months
                </option>

                <option value="300">
                  300 months
                </option>

                <option value="360">
                  360 months
                </option>
              </select>

            </div>


            <div className="field">

              <label htmlFor="creditHistory">
                Credit history
              </label>

              <select
                id="creditHistory"
                name="creditHistory"
                value={formData.creditHistory}
                onChange={handleChange}
                aria-invalid={Boolean(
                  errors.creditHistory
                )}
              >
                <option value="">
                  Select history
                </option>

                <option value="good">
                  Good
                </option>

                <option value="poor">
                  Poor
                </option>
              </select>

              {errors.creditHistory && (
                <span className="field-error">
                  {errors.creditHistory}
                </span>
              )}

            </div>

          </div>

        </section>


        <div className="form-actions">

          <a
            href="/"
            className="back-link"
          >
            ← Back to home
          </a>

          <button
            className="submit-button"
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Analyzing..."
              : "Analyze application"}

            {!loading && (
              <span aria-hidden="true">
                →
              </span>
            )}

          </button>

        </div>

      </form>


      {result && (

        <section className="prediction-result">

          {result.success ? (

            <>

              {/* RESULT HEADER */}

              <div className="result-heading">

                <span className="page-eyebrow">
                  PREDICTION RESULT
                </span>

                <h2>
                  {result.approved
                    ? "Likely Approved"
                    : "Likely Rejected"}
                </h2>

                <p>
                  The machine learning model has analyzed the
                  submitted applicant profile.
                </p>

              </div>


              {/* CONFIDENCE */}

              <div className="result-confidence">

                <strong>
                  {result.confidence}%
                </strong>

                <span>
                  model confidence indicator
                </span>

              </div>


              <div className="result-status">

                Prediction:{" "}

                <strong>
                  {result.prediction}
                </strong>

              </div>


              {/* APPLICANT INSIGHTS */}

              <div className="insights-section">

                <div className="result-section-heading">

                  <span className="result-section-number">
                    01
                  </span>

                  <div>

                    <h3>
                      Applicant insights
                    </h3>

                    <p>
                      Summary of the information used for this
                      prediction.
                    </p>

                  </div>

                </div>


                <div className="insights-grid">

                  <div className="insight-item">

                    <span>
                      Applicant income
                    </span>

                    <strong>
                      {formatCurrency(
                        result.applicantInsights.income
                      )}
                    </strong>

                  </div>


                  <div className="insight-item">

                    <span>
                      Co-applicant income
                    </span>

                    <strong>
                      {formatCurrency(
                        result.applicantInsights
                          .coApplicantIncome
                      )}
                    </strong>

                  </div>


                  <div className="insight-item">

                    <span>
                      Total income
                    </span>

                    <strong>
                      {formatCurrency(
                        result.applicantInsights.totalIncome
                      )}
                    </strong>

                  </div>


                  <div className="insight-item">

                    <span>
                      Loan amount
                    </span>

                    <strong>
                      {formatCurrency(
                        result.applicantInsights.loanAmount
                      )}
                    </strong>

                  </div>


                  <div className="insight-item">

                    <span>
                      Loan burden
                    </span>

                    <strong>
                      {result.applicantInsights.loanBurden}
                    </strong>

                  </div>


                  <div className="insight-item">

                    <span>
                      Credit history
                    </span>

                    <strong>
                      {result.applicantInsights.creditHistory}
                    </strong>

                  </div>


                  <div className="insight-item">

                    <span>
                      Education
                    </span>

                    <strong>
                      {result.applicantInsights.education}
                    </strong>

                  </div>


                  <div className="insight-item">

                    <span>
                      Employment
                    </span>

                    <strong>
                      {result.applicantInsights.employment}
                    </strong>

                  </div>


                  <div className="insight-item">

                    <span>
                      Property area
                    </span>

                    <strong>
                      {result.applicantInsights.propertyArea}
                    </strong>

                  </div>

                </div>

              </div>


              {/* REAL MODEL FACTORS */}

              <div className="explanation-section">

                <div className="result-section-heading">

                  <span className="result-section-number">
                    02
                  </span>

                  <div>

                    <h3>
                      Model factors
                    </h3>

                    <p>
                      Features with the highest relative importance
                      in the trained Random Forest model.
                    </p>

                  </div>

                </div>


                <div className="model-factors-list">

                  {result.topModelFactors &&
                    result.topModelFactors.map(
                      (item) => {

                        const percentage =
                          item.importance * 100;

                        const barWidth = Math.min(
                          percentage * 3,
                          100
                        );

                        return (
                          <div
                            className="model-factor"
                            key={item.feature}
                          >

                            <div className="model-factor-name">
                              {formatFeatureName(
                                item.feature
                              )}
                            </div>

                            <div className="model-factor-bar">

                              <div
                                className="model-factor-fill"
                                style={{
                                  width: `${barWidth}%`,
                                }}
                              ></div>

                            </div>

                            <div className="model-factor-value">
                              {percentage.toFixed(2)}%
                            </div>

                          </div>
                        );
                      }
                    )}

                </div>


                <div className="model-factor-note">

                  <strong>
                    Important:
                  </strong>

                  <span>
                    These values represent global feature
                    importance learned by the Random Forest from
                    the training dataset. They describe overall
                    model behavior and are not individual reasons
                    that guarantee approval or rejection.
                  </span>

                </div>

              </div>


              {/* MODEL INFORMATION */}

              <div className="model-info">

                <span>
                  MODEL
                </span>

                <strong>
                  {result.model.algorithm}
                </strong>

                <small>
                  Used for loan approval prediction.
                </small>

              </div>


              {/* DISCLAIMER */}

              <small className="result-disclaimer">

                This result is a machine learning prediction
                for decision support and is not a guaranteed
                lending decision. The confidence value is a
                model-based indicator and should not be treated
                as a guaranteed real-world approval probability.

              </small>

            </>

          ) : (

            <>

              <span className="page-eyebrow">
                PREDICTION ERROR
              </span>

              <h2>
                Unable to analyze application
              </h2>

              <p>
                {result.error}
              </p>

              <small className="result-disclaimer">

                Please make sure the LoanLens backend server
                is running and try again.

              </small>

            </>

          )}

        </section>

      )}

    </main>
  );
}

export default Prediction;