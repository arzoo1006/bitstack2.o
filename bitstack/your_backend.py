import pandas as pd
import numpy as np
import os
import joblib
import optuna
import shap
import matplotlib.pyplot as plt
import seaborn as sns


from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet


from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.feature_selection import SelectKBest, f_classif, f_regression
from sklearn.metrics import f1_score, mean_squared_error
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, StackingClassifier, StackingRegressor
from sklearn.linear_model import LogisticRegression, LinearRegression

from xgboost import XGBClassifier, XGBRegressor
from lightgbm import LGBMClassifier, LGBMRegressor
from catboost import CatBoostClassifier, CatBoostRegressor

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -------------------- CLEAN --------------------

def clean_data(df):
    for col in df.columns:
        if df[col].dtype in ["int64", "float64"]:
            df[col] = df[col].fillna(df[col].median())
        else:
            if not df[col].mode().empty:
                df[col] = df[col].fillna(df[col].mode()[0])
            else:
                df[col] = df[col].fillna("unknown")
    df.to_csv("outputs/clean.csv", index=False)
    return df



# -------------------- FEATURE ENGINEERING --------------------

def feature_engineering(X, y, problem_type):
    # Polynomial features
    poly = PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)
    X_poly = poly.fit_transform(X)

    # Feature selection
    if problem_type == "classification":
        selector = SelectKBest(f_classif, k=min(20, X_poly.shape[1]))
    else:
        selector = SelectKBest(f_regression, k=min(20, X_poly.shape[1]))

    X_selected = selector.fit_transform(X_poly, y)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_selected)

    return X_scaled

# -------------------- MODEL SET --------------------

def get_models(problem_type):
    if problem_type == "classification":
        return {
            "rf": RandomForestClassifier(),
            "xgb": XGBClassifier(use_label_encoder=False, eval_metric="logloss"),
            "lgbm": LGBMClassifier(),
            "cat": CatBoostClassifier(verbose=0)
        }
    else:
        return {
            "rf": RandomForestRegressor(),
            "xgb": XGBRegressor(),
            "lgbm": LGBMRegressor(),
            "cat": CatBoostRegressor(verbose=0)
        }

# -------------------- TUNING --------------------

def tune(model, X_train, y_train, X_test, y_test, problem_type):

    def objective(trial):
        if isinstance(model, (RandomForestClassifier, RandomForestRegressor)):
            params = {
                "n_estimators": trial.suggest_int("n_estimators", 50, 150),
                "max_depth": trial.suggest_int("max_depth", 3, 10)
            }
        else:
            params = {}

        m = model.__class__(**params)

        if "CatBoost" in str(type(m)):
            m.fit(X_train, y_train, verbose=0)
        else:
            m.fit(X_train, y_train)

        preds = m.predict(X_test)

        if problem_type == "classification":
            return f1_score(y_test, preds, average="weighted")
        else:
            return -mean_squared_error(y_test, preds)

    study = optuna.create_study(direction="maximize")
    study.optimize(objective, n_trials=10)

    best_model = model.__class__(**study.best_params)

    if "CatBoost" in str(type(best_model)):
        best_model.fit(X_train, y_train, verbose=0)
    else:
        best_model.fit(X_train, y_train)

    return best_model, study.best_value

# -------------------- STACKING --------------------

def build_stacking(models, problem_type):
    estimators = [(name, model) for name, model in models.items()]

    if problem_type == "classification":
        return StackingClassifier(estimators=estimators, final_estimator=LogisticRegression())
    else:
        return StackingRegressor(estimators=estimators, final_estimator=LinearRegression())

# -------------------- TRAIN --------------------



def train_pipeline(df, target, problem_type):

    if target not in df.columns:
        raise ValueError(f"Target column '{target}' not found")

    X = df.drop(columns=[target])
    y = df[target]

    X = pd.get_dummies(X)

    X = feature_engineering(X, y, problem_type)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    base_models = get_models(problem_type)
    tuned_models = {}
    results = []

    for name, model in base_models.items():
        print(f"Tuning {name}...")
        best_model, score = tune(model, X_train, y_train, X_test, y_test, problem_type)

        tuned_models[name] = best_model
        joblib.dump(best_model, f"{OUTPUT_DIR}/{name}.pkl")

        results.append((name, score))

    # Stacking
    print("Building ensemble...")
    stack = build_stacking(tuned_models, problem_type)
    stack.fit(X_train, y_train)

    preds = stack.predict(X_test)

    if problem_type == "classification":
        stack_score = f1_score(y_test, preds, average="weighted")
    else:
        stack_score = -mean_squared_error(y_test, preds)

    joblib.dump(stack, f"{OUTPUT_DIR}/stacked_model.pkl")

    joblib.dump(best_model, "outputs/stacked_model.pkl")

    with open("outputs/report.pdf", "wb") as f:
        f.write(b"BitStack AutoML Report")

    results.append(("stacked_model", stack_score))

    results.sort(key=lambda x: x[1], reverse=True)

    # inside train_pipeline() OR right after training
    # generate_report("EDA and model evaluation were performed successfully.")
    generate_report(df, results)

    return results



def generate_report(df, results):
    os.makedirs("outputs", exist_ok=True)

    doc = SimpleDocTemplate("outputs/report.pdf")
    styles = getSampleStyleSheet()
    content = []

    # Title
    content.append(Paragraph("BitStack AutoML Report", styles["Title"]))
    content.append(Spacer(1, 12))

    # Dataset info
    content.append(Paragraph(
        f"Dataset size: {df.shape[0]} rows × {df.shape[1]} columns",
        styles["BodyText"]
    ))
    content.append(Spacer(1, 10))

    # Top model
    if results:
        best = results[0]
        content.append(Paragraph(
            f"Best Model: {best[0]} (Score: {round(best[1], 4)})",
            styles["BodyText"]
        ))
        content.append(Spacer(1, 10))

    # All models
    content.append(Paragraph("Top Models:", styles["Heading2"]))
    for m in results:
        content.append(Paragraph(f"{m[0]} → {round(m[1], 4)}", styles["BodyText"]))
    content.append(Spacer(1, 15))

    # EDA images
    content.append(Paragraph("Exploratory Data Analysis", styles["Heading2"]))
    content.append(Spacer(1, 10))

    if os.path.exists("outputs/eda_heatmap.png"):
        content.append(Image("outputs/eda_heatmap.png", width=400, height=250))
        content.append(Spacer(1, 10))

    if os.path.exists("outputs/eda_box.png"):
        content.append(Image("outputs/eda_box.png", width=400, height=250))
        content.append(Spacer(1, 10))

    # Explanation
    content.append(Paragraph(
        "The system automatically cleaned the dataset, selected features, "
        "trained multiple models, and identified the best performing one.",
        styles["BodyText"]
    ))

    doc.build(content)
# -------------------- EDA --------------------


def run_eda(df):
    import matplotlib.pyplot as plt
    import seaborn as sns
    import os

    os.makedirs("outputs", exist_ok=True)
    plt.close("all")

    numeric_df = df.select_dtypes(include=["number"])

    # 🔹 Heatmap
    plt.figure(figsize=(8, 5))
    sns.heatmap(numeric_df.corr(), cmap="coolwarm")
    plt.title("Correlation Heatmap")
    plt.savefig("outputs/eda_heatmap.png")
    plt.close()

    # 🔹 Distribution plots
    for col in numeric_df.columns[:3]:  # first 3 columns
        plt.figure()
        sns.histplot(numeric_df[col], kde=True)
        plt.title(f"Distribution of {col}")
        plt.savefig(f"outputs/{col}_dist.png")
        plt.close()

    # 🔹 Boxplot
    plt.figure(figsize=(8, 5))
    sns.boxplot(data=numeric_df)
    plt.xticks(rotation=45)
    plt.title("Boxplot")
    plt.savefig("outputs/eda_box.png")
    plt.close()

    # For frontend use main one
    plt.figure(figsize=(8, 5))
    sns.heatmap(numeric_df.corr(), cmap="coolwarm")
    plt.savefig("outputs/eda.png")
    plt.close()




# -------------------- MAIN --------------------

def run(file, target, problem_type):
    df = pd.read_csv(file)

    print("Cleaning...")
    df = clean_data(df)
    df.to_csv(f"{OUTPUT_DIR}/clean.csv", index=False)

    print("EDA...")
    run_eda(df)

    print("Training...")
    results = train_pipeline(df, target, problem_type)

    print("\nTop Models:")
    for r in results[:3]:
        print(r)

if __name__ == "__main__":
    run("data.csv", "target", "classification")
