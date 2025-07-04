# Smart-Manufacturing-Data-Visualizer
This project is a real-time quality control data visualization dashboard built using Python, Flask, JavaScript, HTML, and CSS. It collects and displays manufacturing data to help trace errors and present insights clearly to clients. The dashboard features dynamic charts, filters, and export options for streamlined analysis.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Involved](technologies-involved)
- [Objective of the Project](#objective-of-the-project)
- [How to Test](#how-to-test)
- [Future Scope](#future-scope)
- [Contact](#contact)

## Introduction
In modern manufacturing settings, real-time data monitoring is essential for preserving quality and efficiency. Designed expressly for an electric vehicle battery manufacturing line, this project presents a Real Time Quality Control (QC) Visualization Tool. Using Python for backend processing and HTML, CSS, and JavaScript for the frontend interface, the system is built. 

The tool lets users engineers, quality analysts, and clients visualize and analyze production data in real time or over custom time spans. It connects to a SQL Server database receiving constant input from a Programmable Logic Controller (PLC). Charts like SPC, X-bar, R, Histogram, and Normal Distribution allow users to track major performance indicators. 

Other options include zone and station selection, a feedback form that updates the SQL server, PDF/Excel report creation, and an emergency stop button to improve safety. Making data more understandable and enabling teams to rapidly address quality concerns and production trends, the tool moves smart manufacturing ahead.

## Features
* Real-Time Quality Control Visualization
  Display live production data from SQL Server connected to the assembly line PLC.

* Filterable Dashboard
  Select by Zone, Station, Product Type, and Date Range to drill down into specific data.

* Statistical Charts
  Dynamic generation of:
  * SPC (Statistical Process Control) Chart

  * X-bar Chart

  * R (Range) Chart

  * Histogram

  * Normal Distribution Chart

* Export Options
Generate professional PDF or Excel reports with charts and raw data.

* Engineer Feedback Form
On-site users can submit feedback directly to the SQL Server in real time.

* Full-Screen Chart View
Expand any chart for detailed visualization with a single click.

## Technologies Involved
1. Python – Backend logic, data processing, and communication with the SQL Server.
2. Flask – Web framework used to serve the application and handle routing.
3. HTML/CSS – Structure and styling of the frontend interface.
4. JavaScript – Frontend interactivity and dynamic chart rendering.
5. Chart.js – For generating real-time statistical charts and visualizations.
6. SQL Server – Database used to store and retrieve production data from the PLC.
7. PLC (Programmable Logic Controller) – Source of real-time data from the assembly line.
8. Pandas & NumPy – For data manipulation and analysis on the backend.
9. PDF/Excel Libraries (e.g., ReportLab, openpyxl) – For exporting charts and tables into downloadable formats.


## Objectives of the Project
1. Enable Real-Time Monitoring: To visualize live data from the PLC via SQL Server for immediate tracking of assembly line performance.
2. Allow Data Filtering by Time and Station: To help users analyze specific data ranges using date, time, zone, and station filters.
3. Display Key Quality Control Charts: To generate SPC, X-bar, R, Histogram, and Normal Distribution charts for better insight into production quality.
4. Generate Reports for Review: To export charts and data into PDF or Excel format for easy sharing and analysis.
5. Collect Feedback from Engineers: To provide a form for real-time input from on-site engineers, updating the SQL database instantly.


## How to Test
1. Launch the Flask app:  python app.py
2. Open http://localhost:5000/ in your browser.
3. Use the header dropdowns to filter by:
* Zone
* Station
* Product Type
* Date Range
4. View charts:
* SPC Chart
* X-Bar Chart
*R Chart
*Histogram
*Normal Distribution Chart
5. Expand charts into full-screen views.
6. Export results to PDF or Excel.
7. Submit real-time feedback through the Engineer Form.

## Future Scope
1. Machine Learning Integration
   
   Use ML models to predict faults and flag anomalies in SPC data.

2. Real-Time Alerts and Notifications
   
   Send notifications when data crosses specified thresholds.

3. Mobile-Optimized Interface
   Adapt the dashboard for tablets and smartphones used on the shop floor.

4. Multi-Facility Support

   Extend visualization across multiple manufacturing lines or zones.

5. Cloud Deployment with User Access Control

    Host on a cloud platform with secure user login and permission levels.

6. Long-Term Historical Trends

   Enable multi-month/year analysis of KPIs and defect rates.

7. QR/Barcode Integration

   Scan products to instantly filter and load their corresponding data.

## Contact
Kshipa Jaiswal
1. Email: [kshipajaiswal@gmail.com]
2. LinkedIn: www.linkedin.com/in/kshipa-jaiswal-ab7055220
3. GitHub: [github.com/your-username](https://github.com/Kshipajaiswal)



