from django.urls import path

from .views import (
    predict_loan,
    model_evaluation,
)

urlpatterns = [
    path(
        "predict/",
        predict_loan,
        name="predict-loan",
    ),
    path(
        "evaluation/",
        model_evaluation,
        name="model-evaluation",
    ),
]