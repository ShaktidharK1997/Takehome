# Takehome

# Technology Stack

Frontend: React

Backend:
Django: A high-level Python web framework that encourages rapid development and clean, pragmatic design.
Django REST Framework: A powerful toolkit for building Web APIs in Django, providing features like serialization and customizable endpoints.

Database: PostgreSQL

Containerization: Docker and Docker-compose

Just run `docker-compose up --build` from project directory after cloning the git repository! I've added django commands (migrate, base commands) in the .yaml file

# Brief rundown of what I've done : 

1. Data Modeling
Environment Data Categories and Environmental Data: Created two Django model classes to efficiently store and manage environmental data. EnvironmentDataCategories stores metadata about the data points, such as category names and measurement units, while EnvironmentalData stores the actual environmental readings along with timestamps.

2. Data Extraction and Storage
Extract_info Script: Implemented a Python script (extract_info.py) that automates the extraction of data from Excel files. This script reads environmental metrics from structured Excel spreadsheets and populates the Django models with this data, ensuring data integrity and availability in the web application.

3. REST API Integration
Data Transfer to Frontend: Developed RESTful APIs using Django REST Framework to seamlessly transfer data from the backend to the frontend. This setup facilitates the dynamic interaction of the React-based frontend with the backend, allowing for real-time data updates and interaction.

4. Interactive Frontend Visualizations
   
- Latest Metrics: This feature on the dashboard displays the most recent environmental metrics, allowing users to get a quick glance at the latest data by date. It's designed to provide immediate insights into the current environmental conditions.
  
- Time Series Chart: Implemented using React and Chart.js, this interactive line chart displays time-series data for each category. Users can hover over data points to see detailed metrics at specific times, enhancing the analytical capabilities of the dashboard.
  
- Metrics for the Day: Enhancing the interactivity, points on the time series chart are clickable. Clicking a point triggers a detailed display of all metrics for that day in a bar chart on the right side of the dashboard. This feature allows users to drill down into daily environmental data for more detailed analysis.
