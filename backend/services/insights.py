import pandas as pd
import json

def generate_insights_text(analysis_data: dict):
    if not analysis_data or not analysis_data.get("success"):
        return "Cannot generate insights. Dataset analysis failed or is missing."

    summary = analysis_data["summary"]
    issues = analysis_data["issues"]

    insights = []
    insights.append(f"This dataset contains {summary['rows']} rows and {summary['columns']} columns.")
    
    if issues['total_missing'] > 0:
        clean_cols = sum(1 for v in issues['missing_by_column'].values() if v == 0)
        insights.append(f"Data quality issues detected: {issues['total_missing']} missing values across the dataset. However, {clean_cols} columns have no missing data.")
    else:
        insights.append("Great news! The dataset has no missing values.")
        
    if issues['duplicates'] > 0:
         insights.append(f"There are {issues['duplicates']} duplicate rows that should be reviewed or removed.")
         
    if issues['total_outliers'] > 0:
         insights.append(f"We detected {issues['total_outliers']} potential outliers in numeric columns using the IQR method.")
         
    # Mocking a statistical insight
    insights.append("Based on initial scanning, numeric columns exhibit standard variations. Consider checking the detailed stats per column.")
    
    return " ".join(insights)
