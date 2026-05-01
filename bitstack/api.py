from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd
import shutil
import os

from your_backend import clean_data, train_pipeline, run_eda

app = FastAPI()

# CORS (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_PATH = "data.csv"

@app.post("/upload/")
async def upload(file: UploadFile = File(...)):
    with open(UPLOAD_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"message": "File uploaded"}


@app.post("/train/")
def train(target: str = Form(...), problem_type: str = Form(...)):
    try:
        df = pd.read_csv(UPLOAD_PATH)

        # ✅ clean
        df = clean_data(df)

        # ✅ generate EDA (FIXED)
        run_eda(df)

        # ✅ train models
        results = train_pipeline(df, target, problem_type)

        return {
            "top_models": [
                {"model": r[0], "score": float(r[1])}
                for r in results
            ]
        }

    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}


# ---------------- DOWNLOAD ----------------

@app.get("/download-data/")
def download_data():
    path = os.path.abspath("outputs/clean.csv")
    if not os.path.exists(path):
        return {"error": "clean.csv not found"}
    return FileResponse(path, filename="clean.csv")


@app.get("/download-model/")
def download_model():
    path = os.path.abspath("outputs/stacked_model.pkl")
    if not os.path.exists(path):
        return {"error": "model not found"}
    return FileResponse(path, filename="model.pkl")


@app.get("/download-report/")
def download_report():
    path = os.path.abspath("outputs/report.pdf")

    if not os.path.exists(path):
        return {"error": "report not found"}

    return FileResponse(
        path,
        media_type="application/pdf",
        filename="report.pdf",
        headers={"Content-Disposition": "attachment; filename=report.pdf"},
    )

@app.get("/eda/")
def get_eda():
    file_path = os.path.abspath("outputs/eda.png")
    return FileResponse(file_path)