import os
import json

import joblib
import pandas as pd

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view
from rest_framework.response import Response


MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "ml",
    "model",
    "loan_approval_model.pkl",
)


model = joblib.load(MODEL_PATH)


def load_feature_importance():
    """
    Load feature importance generated during model training.
    """

    feature_importance_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "ml",
        "model",
        "feature_importance.json",
    )

    try:
        with open(
            feature_importance_path,
            "r",
            encoding="utf-8",
        ) as file:
            return json.load(file)

    except (FileNotFoundError, json.JSONDecodeError):
        return []
@csrf_exempt
@api_view(["POST"])
def predict_loan(request):
    try:
        data = request.data

        required_fields = [
            "gender",
            "married",
            "education",
            "applicantIncome",
            "loanAmount",
            "creditHistory",
        ]

        for field in required_fields:
            if field not in data or data[field] in ["", None]:
                return JsonResponse(
                    {
                        "success": False,
                        "error": f"{field} is required.",
                    },
                    status=400,
                )

        applicant_income = float(data["applicantIncome"])
        coapplicant_income = float(
            data.get("coApplicantIncome", 0) or 0
        )
        loan_amount = float(data["loanAmount"])

        if applicant_income < 0:
            return JsonResponse(
                {
                    "success": False,
                    "error": "Applicant income cannot be negative.",
                },
                status=400,
            )

        if coapplicant_income < 0:
            return JsonResponse(
                {
                    "success": False,
                    "error": "Co-applicant income cannot be negative.",
                },
                status=400,
            )

        if loan_amount <= 0:
            return JsonResponse(
                {
                    "success": False,
                    "error": "Loan amount must be greater than zero.",
                },
                status=400,
            )

        credit_history = data["creditHistory"]

        if credit_history not in ["good", "poor"]:
            return JsonResponse(
                {
                    "success": False,
                    "error": "Invalid credit history.",
                },
                status=400,
            )

        input_data = pd.DataFrame(
            [
                {
                    "Gender": data["gender"].capitalize(),
                    "Married": data["married"].capitalize(),
                    "Dependents": data.get("dependents", "0"),
                    "Education": (
                        "Graduate"
                        if data["education"] == "graduate"
                        else "Not Graduate"
                    ),
                    "Self_Employed": (
                        "Yes"
                        if data.get("selfEmployed", "no") == "yes"
                        else "No"
                    ),
                    "ApplicantIncome": applicant_income,
                    "CoapplicantIncome": coapplicant_income,
                    "LoanAmount": loan_amount,
                    "Loan_Amount_Term": float(
                        data.get("loanTerm", 360) or 360
                    ),
                    "Credit_History": (
                        1 if credit_history == "good" else 0
                    ),
                    "Property_Area": (
                        data.get("propertyArea", "urban").capitalize()
                    ),
                }
            ]
        )

        prediction = model.predict(input_data)[0]

        probabilities = model.predict_proba(input_data)[0]

        classes = list(model.classes_)

        predicted_index = classes.index(prediction)

        confidence = round(
            float(probabilities[predicted_index]) * 100,
            1,
        )

        approved = str(prediction).upper() == "Y"

        total_income = applicant_income + coapplicant_income

        loan_to_income = loan_amount / max(total_income, 1)

        if loan_to_income <= 2:
            loan_burden = "Low"
        elif loan_to_income <= 4:
            loan_burden = "Moderate"
        else:
            loan_burden = "High"

        if applicant_income >= 50000:
            income_level = "High"
        elif applicant_income >= 25000:
            income_level = "Moderate"
        else:
            income_level = "Low"

        if credit_history == "good":
            credit_status = "Good"
        else:
            credit_status = "Poor"

        explanation = []

        if credit_history == "good":
            explanation.append(
                "The applicant has a positive credit history."
            )
        else:
            explanation.append(
                "The applicant has a poor credit history, "
                "which can negatively affect the prediction."
            )

        if loan_burden == "High":
            explanation.append(
                "The requested loan amount is high relative "
                "to the combined applicant income."
            )
        elif loan_burden == "Moderate":
            explanation.append(
                "The requested loan amount represents a "
                "moderate burden relative to the combined income."
            )
        else:
            explanation.append(
                "The requested loan amount is relatively low "
                "compared with the combined income."
            )

        if applicant_income >= 50000:
            explanation.append(
                "The applicant has a relatively high reported income."
            )
        elif applicant_income >= 25000:
            explanation.append(
                "The applicant has a moderate reported income."
            )
        else:
            explanation.append(
                "The applicant has a relatively low reported income."
            )
        feature_importance = load_feature_importance()
        top_features = feature_importance[:5]
        return JsonResponse(
            {
                "success": True,
                "prediction": (
                    "Approved" if approved else "Rejected"
                ),
                "approved": approved,
                "confidence": confidence,

                "applicantInsights": {
                    "income": applicant_income,
                    "coApplicantIncome": coapplicant_income,
                    "totalIncome": total_income,
                    "loanAmount": loan_amount,
                    "loanToIncome": round(loan_to_income, 2),
                    "loanBurden": loan_burden,
                    "incomeLevel": income_level,
                    "creditHistory": credit_status,
                    "education": input_data.iloc[0]["Education"],
                    "employment": (
                        "Self-employed"
                        if input_data.iloc[0]["Self_Employed"] == "Yes"
                        else "Salaried"
                    ),
                    "propertyArea": input_data.iloc[0]["Property_Area"],
                },

                "modelExplanation": explanation,
                "featureImportance": feature_importance,
                "topModelFactors": top_features,

                "model": {
                    "algorithm": "Random Forest Classifier",
                    "purpose": "Loan approval prediction",
                    "explanationType": "Global feature importance",
                }
            }
        )

    except ValueError:
        return JsonResponse(
            {
                "success": False,
                "error": "Please enter valid numeric values.",
            },
            status=400,
        )

    except Exception as error:
        return JsonResponse(
            {
                "success": False,
                "error": str(error),
            },
            status=500,
        )
@api_view(["GET"])
def model_evaluation(request):
    """
    Returns the evaluation results of the ML models
    and the feature importance of the deployed model.
    """

    evaluation = {
        "models": [
            {
                "name": "Logistic Regression",
                "accuracy": 0.8293,
                "precision": 0.8721,
                "recall": 0.8824,
                "f1": 0.8772,
                "roc_auc": 0.8551,
                "cv_accuracy": 0.7290,
                "cv_std": 0.0436,
                "confusion_matrix": [
                    [27, 11],
                    [10, 75],
                ],
            },
            {
                "name": "Decision Tree",
                "accuracy": 0.7805,
                "precision": 0.8222,
                "recall": 0.8706,
                "f1": 0.8457,
                "roc_auc": 0.7348,
                "cv_accuracy": 0.6579,
                "cv_std": 0.0632,
                "confusion_matrix": [
                    [22, 16],
                    [11, 74],
                ],
            },
            {
                "name": "Random Forest",
                "accuracy": 0.8130,
                "precision": 0.8444,
                "recall": 0.8941,
                "f1": 0.8686,
                "roc_auc": 0.8127,
                "cv_accuracy": 0.7475,
                "cv_std": 0.0470,
                "confusion_matrix": [
                    [24, 14],
                    [9, 76],
                ],
            },
        ],
        "deployed_model": {
            "name": "Random Forest Classifier",
            "reason": (
                "Random Forest was selected for deployment because it "
                "achieved the highest mean cross-validation accuracy "
                "(74.75%) among the evaluated models. This indicates "
                "the strongest average performance across the five "
                "stratified validation folds in this experiment."
            ),
        },
        "feature_importance": [],
    }

    feature_importance_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "ml",
        "model",
        "feature_importance.json",
    )

    try:
        with open(
            feature_importance_path,
            "r",
            encoding="utf-8",
        ) as file:
            feature_importance = json.load(file)

        evaluation["feature_importance"] = feature_importance

    except (FileNotFoundError, json.JSONDecodeError):
        evaluation["feature_importance"] = []

    return Response(evaluation)