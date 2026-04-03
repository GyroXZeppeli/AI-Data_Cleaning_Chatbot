import pandas as pd
import numpy as np

class DataCleaner:
    def __init__(self, file_path: str):
        self.file_path = file_path
        if file_path.endswith('.csv'):
            self.df = pd.read_csv(file_path)
        elif file_path.endswith('.xlsx'):
            self.df = pd.read_excel(file_path)
        else:
            raise ValueError("Unsupported file format")

    def save(self):
        if self.file_path.endswith('.csv'):
            self.df.to_csv(self.file_path, index=False)
        elif self.file_path.endswith('.xlsx'):
            self.df.to_excel(self.file_path, index=False)

    def drop_duplicates(self):
        initial_rows = len(self.df)
        self.df.drop_duplicates(inplace=True)
        self.save()
        return initial_rows - len(self.df)

    def fill_missing(self, column: str, method: str, value=None):
        if column not in self.df.columns:
            raise ValueError(f"Column {column} not found")
            
        initial_missing = self.df[column].isnull().sum()
        
        if method == "mean" and pd.api.types.is_numeric_dtype(self.df[column]):
            self.df[column].fillna(self.df[column].mean(), inplace=True)
        elif method == "median" and pd.api.types.is_numeric_dtype(self.df[column]):
            self.df[column].fillna(self.df[column].median(), inplace=True)
        elif method == "mode":
            self.df[column].fillna(self.df[column].mode()[0], inplace=True)
        elif method == "constant" and value is not None:
            self.df[column].fillna(value, inplace=True)
        else:
            raise ValueError(f"Invalid method {method} or column {column} is not compatible")
            
        self.save()
        final_missing = self.df[column].isnull().sum()
        return initial_missing - final_missing

    def drop_missing(self, column: str = None):
        initial_rows = len(self.df)
        if column:
             self.df.dropna(subset=[column], inplace=True)
        else:
             self.df.dropna(inplace=True)
        self.save()
        return initial_rows - len(self.df)

    def remove_outliers(self, column: str):
        if column not in self.df.columns or not pd.api.types.is_numeric_dtype(self.df[column]):
            raise ValueError(f"Column {column} must be numeric")
            
        initial_rows = len(self.df)
        Q1 = self.df[column].quantile(0.25)
        Q3 = self.df[column].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        
        self.df = self.df[(self.df[column] >= lower_bound) & (self.df[column] <= upper_bound)]
        self.save()
        return initial_rows - len(self.df)

    def rename_column(self, old_name: str, new_name: str):
        if old_name not in self.df.columns:
            raise ValueError(f"Column {old_name} not found")
        self.df.rename(columns={old_name: new_name}, inplace=True)
        self.save()
        return 0

    def drop_column(self, column: str):
        if column not in self.df.columns:
             raise ValueError(f"Column {column} not found")
        self.df.drop(columns=[column], inplace=True)
        self.save()
        return 0
