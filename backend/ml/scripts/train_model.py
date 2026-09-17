from pathlib import Path
import json

import joblib
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


BASE_DIR = Path(__file__).resolve().parents[2]

DATA_PATH = BASE_DIR / "ml" / "data" / "loan_data.csv"
MODEL_PATH = BASE_DIR / "ml" / "model" / "loan_approval_model.pkl"


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
    data = pd.read_csv(DATA_PATH)

    # Loan_ID is only an identifier.
    data = data.drop(columns=["Loan_ID"])

    return data


def build_model():

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

    numerical_pipeline = Pipeline(
        steps=[
            (
                "imputer",
                SimpleImputer(strategy="median"),
            ),
        ]
    )

    preprocessor = ColumnTransformer(
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

    classifier = RandomForestClassifier(
        n_estimators=300,
        max_depth=8,
        class_weight="balanced",
        random_state=42,
    )

    return Pipeline(
        steps=[
            (
                "preprocessor",
                preprocessor,
            ),
            (
                "classifier",
                classifier,
            ),
        ]
    )
def save_feature_importance(model):

    preprocessor = model.named_steps["preprocessor"]
    classifier = model.named_steps["classifier"]

    feature_names = (
        preprocessor
        .get_feature_names_out()
    )

    importances = classifier.feature_importances_

    feature_importance = []

    for name, importance in zip(
        feature_names,
        importances,
    ):
        clean_name = name.replace(
            "categorical__",
            "",
        ).replace(
            "numerical__",
            "",
        )

        feature_importance.append(
            {
                "feature": clean_name,
                "importance": round(
                    float(importance),
                    6,
                ),
            }
        )

    feature_importance.sort(
        key=lambda item: item["importance"],
        reverse=True,
    )

    output_path = (
        BASE_DIR
        / "ml"
        / "model"
        / "feature_importance.json"
    )

    with open(
        output_path,
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            feature_importance,
            file,
            indent=4,
        )

    print("\nFeature importance saved to:")
    print(output_path)


def main():

    print("=" * 60)
    print("LOANLENS MODEL TRAINING")
    print("=" * 60)

    data = load_data()

    print(f"\nDataset shape: {data.shape}")

    print("\nTarget distribution:")
    print(data["Loan_Status"].value_counts())

    print("\nMissing values:")
    print(data.isnull().sum())

    features = data.drop(
        columns=["Loan_Status"]
    )

    target = data["Loan_Status"]

    x_train, x_test, y_train, y_test = train_test_split(
        features,
        target,
        test_size=0.20,
        random_state=42,
        stratify=target,
    )

    print("\nTraining samples:", len(x_train))
    print("Testing samples :", len(x_test))

    model = build_model()

    print("\nTraining Random Forest model...")

    model.fit(
        x_train,
        y_train,
    )

    predictions = model.predict(x_test)

    probabilities = model.predict_proba(x_test)

    classes = list(model.classes_)

    y_index = classes.index("Y")

    roc_auc = roc_auc_score(
        y_test,
        probabilities[:, y_index],
    )

    accuracy = accuracy_score(
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

    print("\n" + "=" * 60)
    print("MODEL PERFORMANCE")
    print("=" * 60)

    print(f"\nAccuracy  : {accuracy:.4f}")
    print(f"Precision : {precision:.4f}")
    print(f"Recall    : {recall:.4f}")
    print(f"F1 Score  : {f1:.4f}")
    print(f"ROC-AUC   : {roc_auc:.4f}")

    print("\nClassification Report:")
    print(
        classification_report(
            y_test,
            predictions,
            zero_division=0,
        )
    )

    matrix = confusion_matrix(
        y_test,
        predictions,
        labels=["N", "Y"],
    )

    print("Confusion Matrix:")
    print(matrix)

    joblib.dump(
        model,
        MODEL_PATH,
    )

    print("\nModel saved to:")
    print(MODEL_PATH)
    save_feature_importance(model)

    print("\nTraining completed successfully.")


if __name__ == "__main__":
    main()