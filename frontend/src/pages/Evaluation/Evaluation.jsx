import { useEffect, useState } from "react";
import "./Evaluation.css";

function Evaluation() {
    const [evaluation, setEvaluation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/evaluation/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unable to load model evaluation.");
                }

                return response.json();
            })
            .then((data) => {
                setEvaluation(data);
                setLoading(false);
            })
            .catch(() => {
                setError(
                    "Unable to connect to the LoanLens backend. Please make sure Django is running."
                );
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <main className="evaluation-page">
                <div className="evaluation-loading">
                    Loading model evaluation...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="evaluation-page">
                <div className="evaluation-error">
                    {error}
                </div>
            </main>
        );
    }

    const models = evaluation.models;
    const featureImportance = evaluation.feature_importance;
    const topFeatures = featureImportance.slice(0, 8);

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
        <main className="evaluation-page">

            {/* Header */}
            <section className="evaluation-header">
                <div className="evaluation-label">
                    MODEL EVALUATION
                </div>

                <h1>
                    Understanding the LoanLens
                    <span> ML model.</span>
                </h1>

                <p>
                    LoanLens evaluates multiple machine learning algorithms
                    using standard classification metrics and cross-validation
                    before deploying a prediction model.
                </p>
            </section>


            {/* Dataset overview */}
            <section className="evaluation-overview">

                <div className="overview-card">
                    <div className="overview-number">
                        614
                    </div>

                    <div className="overview-title">
                        Dataset records
                    </div>

                    <div className="overview-text">
                        Public loan application records used for training
                        and evaluation.
                    </div>
                </div>


                <div className="overview-card">
                    <div className="overview-number">
                        3
                    </div>

                    <div className="overview-title">
                        Algorithms
                    </div>

                    <div className="overview-text">
                        Logistic Regression, Decision Tree and Random Forest.
                    </div>
                </div>


                <div className="overview-card">
                    <div className="overview-number">
                        5-fold
                    </div>

                    <div className="overview-title">
                        Cross-validation
                    </div>

                    <div className="overview-text">
    5-fold stratified CV on the training set, with a separate held-out test set.
</div>
                </div>


                <div className="overview-card">
                    <div className="overview-number">
                        11 → 20
                    </div>

                    <div className="overview-title">
                        Feature processing
                    </div>

                    <div className="overview-text">
                        11 source features become 20 processed features
                        after categorical encoding.
                    </div>
                </div>

            </section>


            {/* Model comparison */}
            <section className="evaluation-section">

                <div className="section-heading">
                    <div className="section-number">
                        01
                    </div>

                    <div>
                        <h2>Model comparison</h2>

                        <p>
                            Performance of the three evaluated classification
                            algorithms on the held-out test set.
                        </p>
                    </div>
                </div>


                <div className="model-table-wrapper">

                    <table className="model-table">

                        <thead>
                            <tr>
                                <th>Model</th>
                                <th>Accuracy</th>
                                <th>Precision</th>
                                <th>Recall</th>
                                <th>F1 Score</th>
                                <th>ROC-AUC</th>
                            </tr>
                        </thead>

                        <tbody>

                            {models.map((model) => (
                                <tr key={model.name}>

                                    <td className="model-name">
                                        {model.name}

                                        {model.name ===
                                            evaluation.deployed_model.name && (
                                            <span className="deployed-badge">
                                                Deployed
                                            </span>
                                        )}
                                    </td>

                                    <td>
                                        {(model.accuracy * 100).toFixed(2)}%
                                    </td>

                                    <td>
                                        {(model.precision * 100).toFixed(2)}%
                                    </td>

                                    <td>
                                        {(model.recall * 100).toFixed(2)}%
                                    </td>

                                    <td>
                                        {(model.f1 * 100).toFixed(2)}%
                                    </td>

                                    <td>
                                        {(model.roc_auc * 100).toFixed(2)}%
                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>

            </section>


            {/* Cross validation */}
            <section className="evaluation-section">

                <div className="section-heading">
                    <div className="section-number">
                        02
                    </div>

                    <div>
                        <h2>Cross-validation stability</h2>

                        <p>
    Five-fold stratified cross-validation was performed
    on the training set to measure performance across
    different subsets while keeping the held-out test
    set separate for final evaluation.
</p>
                    </div>
                </div>


                <div className="cv-grid">

                    {models.map((model) => (
                        <div className="cv-card" key={model.name}>

                            <div className="cv-model">
                                {model.name}
                            </div>

                            <div className="cv-main">
                                {(model.cv_accuracy * 100).toFixed(2)}%
                            </div>

                            <div className="cv-label">
                                Mean CV accuracy
                            </div>

                            <div className="cv-divider"></div>

                            <div className="cv-row">
                                <span>CV standard deviation</span>

                                <strong>
                                    {(model.cv_std * 100).toFixed(2)}%
                                </strong>
                            </div>

                        </div>
                    ))}

                </div>

            </section>


            {/* Confusion matrices */}
            <section className="evaluation-section">

                <div className="section-heading">
                    <div className="section-number">
                        03
                    </div>

                    <div>
                        <h2>Confusion matrices</h2>

                        <p>
                            Test-set predictions showing correct and incorrect
                            classifications for each model.
                        </p>
                    </div>
                </div>


                <div className="confusion-grid">

                    {models.map((model) => {

                        const matrix = model.confusion_matrix;

                        return (
                            <div
                                className="confusion-card"
                                key={model.name}
                            >

                                <h3>{model.name}</h3>

                                <div className="matrix-label">
                                    Actual → Predicted
                                </div>

                                <table className="confusion-table">

                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>N</th>
                                            <th>Y</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        <tr>
                                            <th>N</th>
                                            <td>{matrix[0][0]}</td>
                                            <td>{matrix[0][1]}</td>
                                        </tr>

                                        <tr>
                                            <th>Y</th>
                                            <td>{matrix[1][0]}</td>
                                            <td>{matrix[1][1]}</td>
                                        </tr>

                                    </tbody>

                                </table>

                                <div className="matrix-note">
                                    N = Not Approved &nbsp; • &nbsp;
                                    Y = Approved
                                </div>

                            </div>
                        );
                    })}

                </div>

            </section>


            {/* Feature importance */}
            <section className="evaluation-section">

                <div className="section-heading">
                    <div className="section-number">
                        04
                    </div>

                    <div>
                        <h2>Feature importance</h2>

                        <p>
                            Relative importance of the processed features in
                            the deployed Random Forest model.
                        </p>
                    </div>
                </div>


                <div className="importance-card">

                    {topFeatures.map((item, index) => {

                        const percentage =
                            item.importance * 100;

                        const barWidth = Math.min(
                            percentage * 3,
                            100
                        );

                        return (
                            <div
                                className="importance-row"
                                key={item.feature}
                            >

                                <div className="importance-rank">
                                    {String(index + 1).padStart(2, "0")}
                                </div>

                                <div className="importance-name">
                                    {formatFeatureName(item.feature)}
                                </div>

                                <div className="importance-bar-container">

                                    <div
                                        className="importance-bar"
                                        style={{
                                            width: `${barWidth}%`,
                                        }}
                                    ></div>

                                </div>

                                <div className="importance-value">
                                    {percentage.toFixed(2)}%
                                </div>

                            </div>
                        );
                    })}

                </div>


                <div className="importance-note">

                    <strong>Interpretation:</strong>

                    <span>
                        Feature importance indicates the relative contribution
                        of processed features to the Random Forest&apos;s
                        decisions on this dataset. It does not mean that a
                        feature guarantees loan approval or rejection.
                    </span>

                </div>

            </section>


            {/* Deployment */}
            <section className="deployment-card">

                <div className="deployment-number">
                    05
                </div>

                <div className="deployment-content">

                    <div className="deployment-label">
                        DEPLOYED MODEL
                    </div>

                    <h2>
                        {evaluation.deployed_model.name}
                    </h2>

                    <p>
                        {evaluation.deployed_model.reason}
                    </p>

                </div>

            </section>


            {/* Academic note */}
            <section className="evaluation-disclaimer">

                <strong>Academic evaluation note</strong>

                <p>
                    These metrics represent performance on the available
                    public dataset and evaluation split. They should not be
                    interpreted as evidence of real-world lending performance.
                    The prediction system is intended for academic and
                    decision-support purposes.
                </p>

            </section>

        </main>
    );
}

export default Evaluation;