import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import json
import numpy as np

def generate_plot_json(file_path: str, column: str, plot_type: str):
    try:
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        if column not in df.columns and plot_type != "correlation":
             return {"success": False, "error": f"Column {column} not found"}
             
        if plot_type == "histogram":
            if not pd.api.types.is_numeric_dtype(df[column]):
                 return {"success": False, "error": f"{column} is not numeric."}
            fig = px.histogram(df, x=column, title=f'Distribution of {column}')
            
        elif plot_type == "boxplot":
             if not pd.api.types.is_numeric_dtype(df[column]):
                 return {"success": False, "error": f"{column} is not numeric."}
             fig = px.box(df, y=column, title=f'Boxplot of {column}')
             
        elif plot_type == "bar":
             if pd.api.types.is_numeric_dtype(df[column]):
                  return {"success": False, "error": f"Bar charts are better for categorical data. {column} is numeric."}
             counts = df[column].value_counts().reset_index()
             num_items = min(10, len(counts))
             counts = counts.head(num_items)
             fig = px.bar(counts, x=counts.columns[0], y=counts.columns[1], title=f'Top {num_items} Categories in {column}')
             
        elif plot_type == "correlation":
              numeric_df = df.select_dtypes(include=[np.number])
              if numeric_df.empty:
                   return {"success": False, "error": "No numeric columns for correlation."}
              corr = numeric_df.corr().round(2)
              fig = px.imshow(corr, text_auto=True, title="Correlation Heatmap")
              
        else:
            return {"success": False, "error": f"Unsupported plot type: {plot_type}"}

        fig.update_layout(template="plotly_dark", paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
        return {"success": True, "fig_json": json.loads(fig.to_json())}

    except Exception as e:
        return {"success": False, "error": str(e)}
