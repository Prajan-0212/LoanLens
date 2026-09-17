import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
    return (
        <main>
            {/* HERO */}
            <section className="hero">
                <div className="hero-content">
                    <div className="eyebrow">
                        <span
                            className="status-dot"
                            aria-hidden="true"
                        ></span>
                        AI-powered loan analysis
                    </div>

                    <h2>
    Make smarter{" "}
    <span>lending decisions.</span>
</h2>

                    <p>
                        LoanLens analyzes applicant and financial
                        information to estimate loan approval outcomes
                        using machine learning.
                    </p>

                    <div className="hero-actions">
                        <Link
                            className="primary-button"
                            to="/prediction"
                        >
                            Predict Loan Approval
                            <span aria-hidden="true">→</span>
                        </Link>

                        <a
                            className="secondary-button"
                            href="#how-it-works"
                        >
                            Explore the process
                        </a>
                    </div>

                    <div className="trust-row">
                        <div>
                            <strong>ML-powered</strong>
                            <span>Prediction engine</span>
                        </div>

                        <div>
                            <strong>Fast</strong>
                            <span>Instant analysis</span>
                        </div>

                        <div>
                            <strong>Explainable</strong>
                            <span>Clear insights</span>
                        </div>
                    </div>
                </div>

                {/* EXAMPLE PREDICTION CARD */}
                <div
                    className="hero-visual"
                    aria-label="Example prediction"
                >
                    <div className="prediction-card">
                        <div className="example-label">
                            EXAMPLE RESULT
                        </div>

                        <div className="card-header">
                            <div>
                                <span>Prediction overview</span>
                                <h3>Loan Application</h3>
                            </div>

                            <div
                                className="card-icon"
                                aria-hidden="true"
                            >
                                ↗
                            </div>
                        </div>

                        <div className="score-section">
                            <div className="score-ring">
                                <div>
                                    <strong>87%</strong>
                                    <span>confidence</span>
                                </div>
                            </div>

                            <div className="approval-status">
                                <span>Example prediction</span>
                                <strong>Likely Approved</strong>
                                <small>
                                    Illustrative result only
                                </small>
                            </div>
                        </div>

                        <div className="factor-list">
                            <div className="factor">
                                <span>Credit history</span>
                                <strong className="positive">
                                    Strong
                                </strong>
                            </div>

                            <div className="factor">
                                <span>Income stability</span>
                                <strong className="positive">
                                    Good
                                </strong>
                            </div>

                            <div className="factor">
                                <span>Loan-to-income</span>
                                <strong>
                                    Moderate
                                </strong>
                            </div>
                        </div>

                        <div className="card-footer-note">
                            Your actual result is generated from
                            the LoanLens ML model.
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section
                id="how-it-works"
                className="process-section"
            >
                <div className="section-heading">
                    <span>HOW IT WORKS</span>

                    <h2>
                        From application data to clear insight.
                    </h2>

                    <p>
                        A simple three-step process turns applicant
                        information into an easy-to-understand
                        prediction.
                    </p>
                </div>

                <div className="process-grid">
                    <article className="process-card">
                        <div className="step-number">01</div>

                        <h3>Enter details</h3>

                        <p>
                            Provide basic applicant, employment,
                            income, and loan information.
                        </p>
                    </article>

                    <article className="process-card">
                        <div className="step-number">02</div>

                        <h3>Analyze</h3>

                        <p>
                            Our trained machine learning model
                            evaluates the submitted information.
                        </p>
                    </article>

                    <article className="process-card">
                        <div className="step-number">03</div>

                        <h3>Get prediction</h3>

                        <p>
                            Receive an approval prediction together
                            with useful supporting insights.
                        </p>
                    </article>
                </div>
            </section>

            {/* ABOUT */}
            <section id="about" className="about-section">
                <div className="about-content">
                    <span className="about-label">
                        ABOUT LOANLENS
                    </span>

                    <h2>
                        Machine learning for
                        <span> loan analysis.</span>
                    </h2>

                    <p>
                        LoanLens is an academic machine learning
                        project that analyzes loan application data
                        and predicts whether an application is likely
                        to be approved.
                    </p>

                    <p>
                        The system uses a trained Random Forest
                        classifier and evaluates multiple machine
                        learning algorithms using standard
                        classification metrics and stratified
                        cross-validation.
                    </p>

                    <Link
                        className="about-button"
                        to="/evaluation"
                    >
                        View model evaluation →
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default Home;