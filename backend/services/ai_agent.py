import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

from pydantic import BaseModel, Field

# We'll expect the API key to be in the environment for the final version
# Or we can temporarily use a placeholder if none provided to prevent crashes
google_api_key = os.getenv("GOOGLE_API_KEY", "mock_key")

def get_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=google_api_key,
        temperature=0.2
    )

def generate_cleaning_plan(dataset_summary: str, dataset_issues: str):
    llm = get_llm()
    
    prompt = PromptTemplate(
        input_variables=["summary", "issues"],
        template="""
        You are an expert Data Scientist. Analyze the following dataset summary and issues, 
        and provide a concise list of recommended cleaning operations. 
        Format as clear, actionable steps.
        
        Dataset Summary:
        {summary}
        
        Issues Detected:
        {issues}
        
        Recommended Actions:
        """
    )
    
    chain = prompt | llm
    result = chain.invoke({"summary": dataset_summary, "issues": dataset_issues})
    return result.content

def process_natural_language_query(user_query: str, dataset_columns: str):
    llm = get_llm()
    
    prompt = PromptTemplate(
        input_variables=["query", "columns"],
        template="""
        You are an AI assistant helping a user clean and analyze a pandas DataFrame named `df`.
        The DataFrame has the following columns: {columns}
        
        The user asks: "{query}"
        
        If the user wants to clean data (e.g. drop duplicates, fill missing), return a highly specific JSON format.
        If the user is asking a question about the data, return the exact pandas python code needed to answer it.
        
        Please return ONLY the raw JSON string or Python code, nothing else.
        """
    )
    
    chain = prompt | llm
    result = chain.invoke({"query": user_query, "columns": dataset_columns})
    return result.content
