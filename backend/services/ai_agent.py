import os
import json
from urllib import request, error

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

# We'll expect the API key to be in the environment for the final version
# Or we can temporarily use a placeholder if none provided to prevent crashes
google_api_key = os.getenv("GOOGLE_API_KEY", "mock_key")

def get_llm(model: str, api_key: str):
    return ChatGoogleGenerativeAI(
        model=model,
        google_api_key=api_key,
        temperature=0.2
    )

def _call_openrouter(system_prompt: str, user_prompt: str, config):
    api_key = (config.api_key or "").strip()
    if not api_key:
        raise ValueError("OpenRouter API key is required")

    model = (config.model or "").strip()
    if not model:
        raise ValueError("OpenRouter model is required")

    base_url = (config.base_url or "https://openrouter.ai/api/v1/chat/completions").strip()
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.2,
    }
    req = request.Request(
        base_url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "AI Data Cleaning Chatbot",
        },
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=60) as response:
            body = json.loads(response.read().decode("utf-8"))
    except error.HTTPError as e:
        details = e.read().decode("utf-8", errors="ignore")
        raise ValueError(f"OpenRouter request failed: {details or e.reason}")
    except error.URLError as e:
        raise ValueError(f"OpenRouter request failed: {e.reason}")

    choices = body.get("choices") or []
    if not choices:
        raise ValueError("OpenRouter returned no choices")
    message = choices[0].get("message") or {}
    content = message.get("content")
    if isinstance(content, list):
        return "\n".join(part.get("text", "") for part in content if isinstance(part, dict)).strip()
    if not content:
        raise ValueError("OpenRouter returned an empty response")
    return content

def _run_prompt(prompt_template: PromptTemplate, values: dict, config):
    provider = (config.provider or "openrouter").strip().lower()
    model = (config.model or "").strip()

    if provider == "gemini":
        api_key = (config.api_key or google_api_key).strip()
        if not api_key:
            raise ValueError("Gemini API key is required")
        if not model:
            raise ValueError("Gemini model is required")
        llm = get_llm(model, api_key)
        chain = prompt_template | llm
        result = chain.invoke(values)
        return result.content

    if provider == "openrouter":
        prompt_text = prompt_template.format(**values)
        return _call_openrouter(
            "You are an expert AI assistant for dataset cleaning and analysis.",
            prompt_text,
            config,
        )

    raise ValueError(f"Unsupported AI provider: {config.provider}")

def generate_cleaning_plan(dataset_summary: str, dataset_issues: str, config):
    
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
    return _run_prompt(prompt, {"summary": dataset_summary, "issues": dataset_issues}, config)

def process_natural_language_query(user_query: str, dataset_columns: str, config):
    
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
    return _run_prompt(prompt, {"query": user_query, "columns": dataset_columns}, config)
