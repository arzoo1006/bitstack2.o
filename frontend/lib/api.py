from fastapi import FastAPI, UploadFile, File, Form
import pandas as pd
import shutil
import os

from your_backend import clean_data, run_eda, train_pipeline

app = FastAPI()

UPLOAD_PATH = "temp.csv"

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    with open(UPLOAD_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"message": "File uploaded"}

@app.post("/clean/")
def clean():
    df = pd.read_csv(UPLOAD_PATH)
    df_clean = clean_data(df)
    df_clean.to_csv("outputs/cleaned.csv", index=False)
    return {"message": "Data cleaned"}

@app.post("/eda/")
def eda():
    df = pd.read_csv(UPLOAD_PATH)
    run_eda(df)
    return {"message": "EDA complete"}

@app.post("/train/")
def train(target: str = Form(...), problem_type: str = Form(...)):
    df = pd.read_csv(UPLOAD_PATH)
    results = train_pipeline(df, target, problem_type)

    top = [{"model": r[0], "score": float(r[1])} for r in results[:3]]
    return {"top_models": top}