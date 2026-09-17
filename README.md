\# LoanLens



\## Intelligent Loan Approval Prediction Using Machine Learning



LoanLens is a full-stack machine learning web application that predicts the likely outcome of a loan application based on applicant, financial, employment, and property information.



The system combines a React frontend, Django REST API backend, and a trained machine learning model to provide a fast prediction along with applicant insights and global model feature importance.



> \*\*Academic Project:\*\* Developed as an academic Machine Learning project to demonstrate data preprocessing, model training, model evaluation, REST API integration, and full-stack deployment of an ML model.



\---



\## 1. Problem Statement



Loan applications involve evaluating multiple applicant and financial attributes such as income, credit history, loan amount, employment status, education, and property area.



Manual evaluation of these factors can be time-consuming and may involve inconsistent decision-making.



LoanLens provides a machine-learning-based decision-support system that analyzes the available application information and predicts whether the application is likely to be approved or rejected.



The system is intended for educational and analytical purposes and does not replace real-world banking or credit decisions.



\---



\## 2. Objectives



The main objectives of LoanLens are:



\- Build a machine learning model for loan approval prediction.

\- Preprocess categorical and numerical applicant data.

\- Handle missing values systematically.

\- Compare multiple classification algorithms.

\- Evaluate models using multiple performance metrics.

\- Perform stratified cross-validation.

\- Deploy the selected ML model through a Django REST API.

\- Provide a user-friendly React interface for predictions.

\- Display applicant-level insights and global model feature importance.

\- Demonstrate an end-to-end machine learning application.



\---



\## 3. Key Features



\### Loan Prediction



Users can enter loan application information including:



\- Gender

\- Marital status

\- Number of dependents

\- Education

\- Self-employment status

\- Applicant income

\- Co-applicant income

\- Loan amount

\- Loan term

\- Credit history

\- Property area



The application sends the information to the Django backend, which processes the input using the trained ML pipeline and returns a prediction.



\### Applicant Insights



The prediction page displays derived information such as:



\- Total income

\- Loan-to-income ratio

\- Loan burden

\- Income level

\- Credit history

\- Education

\- Employment type

\- Property area



\### Model Factors



LoanLens displays the most important processed features used by the deployed Random Forest model.



These feature importance values represent global model behavior across the dataset. They should not be interpreted as the exact individual reasons for a particular prediction.



\### Model Evaluation



The application provides a separate evaluation page containing:



\- Accuracy

\- Precision

\- Recall

\- F1 Score

\- ROC-AUC

\- Cross-validation accuracy

\- Confusion matrices

\- Feature importance

\- Deployed model information



\---



\## 4. Technology Stack



\### Frontend



\- React

\- Vite

\- JavaScript

\- HTML

\- CSS

\- React Router



\### Backend



\- Python

\- Django

\- Django REST Framework

\- django-cors-headers



\### Machine Learning



\- pandas

\- NumPy

\- scikit-learn

\- joblib



\### Database



\- SQLite



\### Development Tools



\- Git

\- GitHub

\- Visual Studio Code / IntelliJ-compatible development environment

\- PowerShell



\---



\## 5. System Architecture



```text

&#x20;                   ┌─────────────────────────┐

&#x20;                   │       React Frontend    │

&#x20;                   │                         │

&#x20;                   │  Home                   │

&#x20;                   │  Prediction              │

&#x20;                   │  Evaluation              │

&#x20;                   └────────────┬────────────┘

&#x20;                                │

&#x20;                                │ HTTP / JSON

&#x20;                                ▼

&#x20;                   ┌─────────────────────────┐

&#x20;                   │    Django REST API      │

&#x20;                   │                         │

&#x20;                   │  /api/predict/          │

&#x20;                   │  /api/evaluation/       │

&#x20;                   └────────────┬────────────┘

&#x20;                                │

&#x20;                                ▼

&#x20;                   ┌─────────────────────────┐

&#x20;                   │ ML Prediction Pipeline  │

&#x20;                   │                         │

&#x20;                   │ Missing Value Handling  │

&#x20;                   │ Categorical Encoding   │

&#x20;                   │ Random Forest Model     │

&#x20;                   └────────────┬────────────┘

&#x20;                                │

&#x20;                                ▼

&#x20;                   ┌─────────────────────────┐

&#x20;                   │ Prediction + Insights   │

&#x20;                   │ Feature Importance      │

&#x20;                   └─────────────────────────┘

