import pandas as pd
from flask import Flask, jsonify, send_from_directory  # i have no idea how to use
app = Flask(__name__, static_folder="public", static_url_path="")
@app.route("/")
def home():
   return send_from_directory("public", "index.html")
@app.route("/api/data")
def get_data():
   df = pd.read_csv("data.csv") # read the csv

   # order the months as flask puts then alphabetically
   month_order = [
       "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
   ]

   # months sorted
   df["Month"] = pd.Categorical(df["Month"], categories=month_order, ordered=True)

   # group by data sorting
   grouped = df.groupby("Month")[["Sales", "Customers"]].sum()
   return jsonify(grouped.reset_index().to_dict(orient="records"))
if __name__ == "__main__":
   app.run(debug=True)