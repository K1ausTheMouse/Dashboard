import pandas as pd
from flask import Flask, jsonify, send_from_directory  # i have no idea how to use
app = Flask(__name__, static_folder="public", static_url_path="")
@app.route("/")
def home():
   return send_from_directory("public", "index.html")
@app.route("/api/data")
def get_data():
   df = pd.read_csv("data.csv") # read the csv

   # turns date into actual dates 
   df["date"] = pd.to_datetime(df["date"])

   # create a month colmn from the date easy to read
   df["month"] = df["date"].dt.strftime("%B")

   # total amoun for each month and income/expense
   grouped = df.groupby(["month", "type"])["amount"].sum().reset_index()

   return jsonify(grouped.to.dict(orient="records"))