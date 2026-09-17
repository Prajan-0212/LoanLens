from django.test import TestCase
from rest_framework.test import APIClient


class LoanLensAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def valid_prediction_data(self):
        return {
            "gender": "male",
            "married": "yes",
            "dependents": "0",
            "education": "graduate",
            "selfEmployed": "no",
            "applicantIncome": 50000,
            "coApplicantIncome": 10000,
            "loanAmount": 200000,
            "loanTerm": 360,
            "creditHistory": "good",
            "propertyArea": "urban",
        }

    def test_prediction_api_accepts_valid_data(self):
        response = self.client.post(
            "/api/predict/",
            self.valid_prediction_data(),
            format="json",
        )

        self.assertEqual(response.status_code, 200)

        data = response.json()

        self.assertTrue(data["success"])
        self.assertIn(
            data["prediction"],
            ["Approved", "Rejected"],
        )
        self.assertIn("confidence", data)
        self.assertIn("applicantInsights", data)
        self.assertIn("featureImportance", data)
        self.assertIn("model", data)

    def test_prediction_api_rejects_missing_required_field(self):
        data = self.valid_prediction_data()

        del data["creditHistory"]

        response = self.client.post(
            "/api/predict/",
            data,
            format="json",
        )

        self.assertEqual(response.status_code, 400)

        result = response.json()

        self.assertFalse(result["success"])
        self.assertIn("error", result)

    def test_prediction_api_rejects_negative_income(self):
        data = self.valid_prediction_data()

        data["applicantIncome"] = -5000

        response = self.client.post(
            "/api/predict/",
            data,
            format="json",
        )

        self.assertEqual(response.status_code, 400)

        result = response.json()

        self.assertFalse(result["success"])
        self.assertIn("error", result)

    def test_evaluation_api_returns_models(self):
        response = self.client.get(
            "/api/evaluation/"
        )

        self.assertEqual(response.status_code, 200)

        data = response.json()

        self.assertIn("models", data)
        self.assertIn("deployed_model", data)
        self.assertIn("feature_importance", data)

        self.assertEqual(
            len(data["models"]),
            3,
        )

    def test_evaluation_api_contains_expected_models(self):
        response = self.client.get(
            "/api/evaluation/"
        )

        self.assertEqual(response.status_code, 200)

        data = response.json()

        model_names = [
            model["name"]
            for model in data["models"]
        ]

        self.assertIn(
            "Logistic Regression",
            model_names,
        )

        self.assertIn(
            "Decision Tree",
            model_names,
        )

        self.assertIn(
            "Random Forest",
            model_names,
        )