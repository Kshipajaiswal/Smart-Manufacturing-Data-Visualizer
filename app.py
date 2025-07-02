from flask import Flask, render_template, request, jsonify
import os
import base64
import matplotlib.pyplot as plt
import io
import pyodbc
import threading
import webbrowser
import numpy as np
from scipy.stats import norm
from datetime import datetime, date, time, timedelta
import json
app = Flask(__name__)


server_ip = '192.168.6.64'
database =  'Control_chart'
#database =  'DemoPLCData'
username = 'sa'
password = 'CTPL123'

# Database connection string
conn_str = (
    f"DRIVER={{ODBC Driver 17 for SQL Server}};"
    f"SERVER={server_ip},1433;"
    f"DATABASE={database};"
    f"UID={username};"
    f"PWD={password};"
    f"Encrypt=no;"
)

def connect_db():
    try:
        conn = pyodbc.connect(conn_str)
        print("✅ Database connected")
        return conn
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return None

def make_jason_safe(data):
    for row in data:
        for k, v in row.items():
            if isinstance(v, time):
                row[k] = v.strftime('%H:%M:%S')
    return data

def fetch_data(start_date, end_date):
    conn = connect_db()
    if conn is None:
        return None

    cursor = conn.cursor()
    try:
        def convert_date(date_str):
            try:
                return datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                raise ValueError(f"Invalid date format: {date_str}")

        # Convert input strings to date objects
        start_date = convert_date(start_date)
        end_date = convert_date(end_date)

        query = """
        SELECT * FROM COMMON_REPORT_3
        WHERE Date BETWEEN ? AND ?
        """

        print(f"📊 Running SQL Query from {start_date} to {end_date}")
        cursor.execute(query, (start_date, end_date))

        columns = [column[0] for column in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]

        print(f"📈 Rows fetched: {len(results)}")

        data = make_jason_safe(results)
        return data

    except Exception as e:
        print(f"❌ Error fetching data: {e}")
        return None
    finally:
        conn.close()


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chart-data')
def chart_data():
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    print(start_date)
    print(end_date)

    data = fetch_data(start_date, end_date)
    return jsonify(data)

def open_browser():
    webbrowser.open_new("http://127.0.0.1:5000/")

if __name__ == '__main__':
    # threading.Timer(1.25, open_browser).start()
    app.run(debug=True)
