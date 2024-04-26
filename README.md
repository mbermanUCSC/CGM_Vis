# CGM_Vis
 Data visualization from my Dexcom G6 sensor readings.
 [https://mbermanucsc.github.io/CGM_Vis/]

## Overview

The Glucose Monitoring Dashboard is a web-based visualization tool that displays real-time glucose levels using data from a Dexcom G6 Continuous Glucose Monitoring (CGM) system. This dashboard is designed to visualize  with Type 1 diabetes monitor their glucose levels throughout the day and understand how they fluctuate in response to daily activities and diet.

This data is constantly being collected using python, and the pydexcom package on my raspberry pi. I chose to visualize the data in such a way to show patterns in my glucose based on the time of day, and to help identify patterns to help improve my condition.

pydexcom: [https://github.com/gagebenne/pydexcom]

## Features

- **Real-time Data Visualization**: Displays glucose levels in real-time through a line chart.
- **Time Filter**: Allows users to filter glucose readings by specific hours of the day to analyze fluctuations.
- **CSV Reading**: More data can be added easily by simply updating the cvs file.

## Technologies Used

- **HTML/CSS**: For structuring and styling the webpage.
- **JavaScript**: For interactive elements and data processing.
- **Chart.js**: Used to render the line chart of glucose readings.
- **Moment.js**: For date and time formatting.


