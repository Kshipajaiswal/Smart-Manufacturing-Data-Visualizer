# Smart-Manufacturing-Data-Visualizer
This project is a real-time quality control data visualization dashboard built using Python, Flask, JavaScript, HTML, and CSS. It collects and displays manufacturing data to help trace errors and present insights clearly to clients. The dashboard features dynamic charts, filters, and export options for streamlined analysis.

## Introduction
In modern manufacturing settings, real-time data monitoring is essential for preserving quality and efficiency. Designed expressly for an electric vehicle battery manufacturing line, this project presents a Real Time Quality Control (QC) Visualization Tool. Using Python for backend processing and HTML, CSS, and JavaScript for the frontend interface, the system is built. 

The tool lets users engineers, quality analysts, and clients visualize and analyze production data in real time or over custom time spans. It connects to a SQL Server database receiving constant input from a Programmable Logic Controller (PLC). Charts like SPC, X-bar, R, Histogram, and Normal Distribution allow users to track major performance indicators. 

Other options include zone and station selection, a feedback form that updates the SQL server, PDF/Excel report creation, and an emergency stop button to improve safety. Making data more understandable and enabling teams to rapidly address quality concerns and production trends, the tool moves smart manufacturing ahead.

## Objectives of the Project
1. Enable Real-Time Monitoring: To visualize live data from the PLC via SQL Server for immediate tracking of assembly line performance.
2. Allow Data Filtering by Time and Station: To help users analyze specific data ranges using date, time, zone, and station filters.
3. Display Key Quality Control Charts: To generate SPC, X-bar, R, Histogram, and Normal Distribution charts for better insight into production quality.
4. Generate Reports for Review: To export charts and data into PDF or Excel format for easy sharing and analysis.
5. Collect Feedback from Engineers: To provide a form for real-time input from on-site engineers, updating the SQL database instantly.

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

    
