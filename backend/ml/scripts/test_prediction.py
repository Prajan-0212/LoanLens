from pathlib import Path

import joblib
import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "ml" / "model" / "loan_approval_model.pkl"


model = joblib.load(MODEL_PATH)


sample_application = pd.DataFrame(
    [
        {
            "Gender": "Male",
            "Married": "Yes",
            "Dependents": "0",
            "Education": "Graduate",
            "Self_Employed": "No",
            "ApplicantIncome": 5000,
            "CoapplicantIncome": 1500,
            "LoanAmount": 120,
            "Loan_Amount_Term": 360,
            "Credit_History": 1,
            "Property_Area": "Urban",
        }
    ]
)


prediction = model.predict(sample_application)[0]

probabilities = model.predict_proba(sample_application)[0]

classes = model.classes_

confidence = probabilities[list(classes).index(prediction)]


print("=" * 50)
print("LOANLENS PREDICTION TEST")
print("=" * 50)

print(f"Prediction: {prediction}")
print(f"Confidence: {confidence:.2%}")