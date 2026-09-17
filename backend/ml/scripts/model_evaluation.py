from pathlib import Path

import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
)
from sklearn.model_selection import (
    train_test_split,
    StratifiedKFold,
    cross_val_score,
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


BASE_DIR = Path(__file__).resolve().parents[2]

DATA_PATH = BASE_DIR / "ml" / "data" / "loan_data.csv"


CATEGORICAL_FEATURES = [
    "Gender",
    "Married",
    "Dependents",
    "Education",
    "Self_Employed",
    "Property_Area",
]


NUMERICAL_FEATURES = [
    "ApplicantIncome",
    "CoapplicantIncome",
    "LoanAmount",
    "Loan_Amount_Term",
    "Credit_History",
]


def load_data():
    return pd.read_csv(DATA_PATH)


def build_preprocessor(scale_numeric=False):
    categorical_pipeline = Pipeline(
        steps=[
            (
                "imputer",
                SimpleImputer(strategy="most_frequent"),
            ),
            (
                "encoder",
                OneHotEncoder(
                    handle_unknown="ignore",
                    sparse_output=False,
                ),
            ),
        ]
    )

    numerical_steps = [
        (
            "imputer",
            SimpleImputer(strategy="median"),
        )
    ]

    if scale_numeric:
        numerical_steps.append(
            (
                "scaler",
                StandardScaler(),
            )
        )

    numerical_pipeline = Pipeline(
        steps=numerical_steps
    )

    return ColumnTransformer(
        transformers=[
            (
                "categorical",
                categorical_pipeline,
                CATEGORICAL_FEATURES,
            ),
            (
                "numerical",
                numerical_pipeline,
                NUMERICAL_FEATURES,
            ),
        ]
    )


def build_pipeline(classifier, scale_numeric=False):
    return Pipeline(
        steps=[
            (
                "preprocessor",
                build_preprocessor(
                    scale_numeric=scale_numeric
                ),
            ),
            (
                "classifier",
                classifier,
            ),
        ]
    )


def evaluate_model(
    name,
    model,
    x_train,
    x_test,
    y_train,
    y_test,
):
    print("\n" + "=" * 60)
    print(name.upper())
    print("=" * 60)

    model.fit(
        x_train,
        y_train,
    )

    predictions = model.predict(x_test)

    # ---------------------------------------------------------
    # Basic classification metrics
    # ---------------------------------------------------------

    accuracy = accuracy_score(
        y_test,
        predictions,
    )

    balanced_accuracy = balanced_accuracy_score(
        y_test,
        predictions,
    )

    precision = precision_score(
        y_test,
        predictions,
        pos_label="Y",
        zero_division=0,
    )

    recall = recall_score(
        y_test,
        predictions,
        pos_label="Y",
        zero_division=0,
    )

    f1 = f1_score(
        y_test,
        predictions,
        pos_label="Y",
        zero_division=0,
    )

    print(f"Accuracy          : {accuracy:.4f}")
    print(
        f"Balanced Accuracy : "
        f"{balanced_accuracy:.4f}"
    )
    print(f"Precision         : {precision:.4f}")
    print(f"Recall            : {recall:.4f}")
    print(f"F1 Score          : {f1:.4f}")

    # ---------------------------------------------------------
    # ROC-AUC
    # ---------------------------------------------------------

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(x_test)

        classes = list(model.classes_)

        if "Y" in classes:
            y_index = classes.index("Y")

            try:
                roc_auc = roc_auc_score(
                    y_test,
                    probabilities[:, y_index],
                )

                print(
                    f"ROC-AUC           : "
                    f"{roc_auc:.4f}"
                )

            except ValueError:
                print(
                    "ROC-AUC           : "
                    "Not available"
                )

    # ---------------------------------------------------------
    # Confusion Matrix
    # ---------------------------------------------------------

    matrix = confusion_matrix(
        y_test,
        predictions,
        labels=["N", "Y"],
    )

    true_negative = matrix[0][0]
    false_positive = matrix[0][1]
    false_negative = matrix[1][0]
    true_positive = matrix[1][1]

    # ---------------------------------------------------------
    # Specificity
    #
    # Specificity measures how well the model identifies
    # applications belonging to the N (Not Approved) class.
    #
    # Specificity = TN / (TN + FP)
    # ---------------------------------------------------------

    if (true_negative + false_positive) > 0:
        specificity = (
            true_negative
            / (true_negative + false_positive)
        )
    else:
        specificity = 0.0

    print(
        f"Specificity       : "
        f"{specificity:.4f}"
    )

    print("\nConfusion Matrix")
    print("Rows = Actual")
    print("Columns = Predicted")
    print()
    print("             Predicted")
    print("             N       Y")

    print(
        f"Actual N    {matrix[0][0]:<7}"
        f"{matrix[0][1]}"
    )

    print(
        f"Actual Y    {matrix[1][0]:<7}"
        f"{matrix[1][1]}"
    )

    # ---------------------------------------------------------
    # Classification Report
    # ---------------------------------------------------------

    print("\nClassification Report")
    print(
        classification_report(
            y_test,
            predictions,
            labels=["N", "Y"],
            target_names=[
                "Not Approved",
                "Approved",
            ],
            zero_division=0,
        )
    )


def cross_validate_model(
    name,
    model,
    x_train,
    y_train,
):
    print("\n" + "-" * 60)
    print(f"{name} - CROSS VALIDATION")
    print("-" * 60)

    folds = min(
        5,
        y_train.value_counts().min(),
    )

    if folds < 2:
        print(
            "Not enough samples for cross-validation."
        )
        return

    cv = StratifiedKFold(
        n_splits=folds,
        shuffle=True,
        random_state=42,
    )

    scores = cross_val_score(
        model,
        x_train,
        y_train,
        cv=cv,
        scoring="accuracy",
    )

    print(
        "Fold accuracy scores: "
        f"{[round(score, 4) for score in scores]}"
    )

    print(
        f"Mean CV accuracy: "
        f"{scores.mean():.4f}"
    )

    print(
        f"CV standard deviation: "
        f"{scores.std():.4f}"
    )


def main():
    print("=" * 60)
    print("LOANLENS ML MODEL EVALUATION")
    print("=" * 60)

    # ---------------------------------------------------------
    # Load dataset
    # ---------------------------------------------------------

    data = load_data()

    data = data.drop(
        columns=["Loan_ID"]
    )

    print(
        f"\nDataset shape after removing Loan_ID: "
        f"{data.shape}"
    )

    # ---------------------------------------------------------
    # Target distribution
    # ---------------------------------------------------------

    print("\nTarget distribution:")
    print(
        data["Loan_Status"].value_counts()
    )

    # ---------------------------------------------------------
    # Missing values
    # ---------------------------------------------------------

    print("\nMissing values:")
    print(
        data.isnull().sum()
    )

    # ---------------------------------------------------------
    # Separate features and target
    # ---------------------------------------------------------

    features = data.drop(
        columns=["Loan_Status"]
    )

    target = data["Loan_Status"]

    print(
        f"\nInput features: "
        f"{len(features.columns)}"
    )

    # ---------------------------------------------------------
    # Train / Test split
    # ---------------------------------------------------------

    x_train, x_test, y_train, y_test = train_test_split(
        features,
        target,
        test_size=0.20,
        random_state=42,
        stratify=target,
    )

    print(
        f"Training samples: "
        f"{len(x_train)}"
    )

    print(
        f"Testing samples : "
        f"{len(x_test)}"
    )

    # ---------------------------------------------------------
    # Models
    # ---------------------------------------------------------

    models = {
        "Logistic Regression": build_pipeline(
            LogisticRegression(
                max_iter=1000,
                class_weight="balanced",
                random_state=42,
            ),
            scale_numeric=True,
        ),

        "Decision Tree": build_pipeline(
            DecisionTreeClassifier(
                max_depth=5,
                class_weight="balanced",
                random_state=42,
            ),
            scale_numeric=False,
        ),

        "Random Forest": build_pipeline(
            RandomForestClassifier(
                n_estimators=300,
                max_depth=8,
                class_weight="balanced",
                random_state=42,
            ),
            scale_numeric=False,
        ),
    }

    # ---------------------------------------------------------
    # Evaluate every model
    # ---------------------------------------------------------

    for name, model in models.items():

        evaluate_model(
            name,
            model,
            x_train,
            x_test,
            y_train,
            y_test,
        )

        cross_validate_model(
            name,
            model,
            x_train,
            y_train,
        )

    print("\n" + "=" * 60)
    print("EVALUATION COMPLETED")
    print("=" * 60)


if __name__ == "__main__":
    main()