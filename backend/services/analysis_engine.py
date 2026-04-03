import pandas as pd
import json
import numpy as np

def analyze_dataset(file_path: str):
    try:
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        elif file_path.endswith('.xlsx'):
            df = pd.read_excel(file_path)
        else:
            return {"error": "Unsupported file format"}

        # Basic stats
        rows = len(df)
        cols = len(df.columns)
        
        # Missing values
        missing_values_per_col = df.isnull().sum().to_dict()
        total_missing = sum(missing_values_per_col.values())
        
        # Duplicates
        duplicates = int(df.duplicated().sum())
        
        # Data types
        dtypes = df.dtypes.astype(str).to_dict()
        
        # Outliers (IQR method for numeric cols)
        outliers_count = {}
        total_outliers = 0
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            col_outliers = int(((df[col] < lower_bound) | (df[col] > upper_bound)).sum())
            outliers_count[col] = col_outliers
            total_outliers += col_outliers
            
        return {
            "success": True,
            "summary": {
                "rows": rows,
                "columns": cols,
                "column_names": list(df.columns),
                "data_types": dtypes
            },
            "issues": {
                "total_missing": total_missing,
                "missing_by_column": missing_values_per_col,
                "duplicates": duplicates,
                "total_outliers": total_outliers,
                "outliers_by_column": outliers_count
            }
        }
    except Exception as e:
        return {"error": str(e), "success": False}
