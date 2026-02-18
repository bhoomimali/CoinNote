from openai import OpenAI
import os

client = OpenAI(api_key="YOUR_OPENAI_API_KEY")

def analyze_with_ai(name, income, document_text):
    prompt = f"""
    Analyze this onboarding data:

    Name: {name}
    Income: {income}
    Document Text: {document_text}

    Detect:
    - Any inconsistencies
    - Fraud indicators
    - Suspicious patterns

    Return response as:
    Risk_Level: (Low/Medium/High)
    Reason: (short explanation)
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )

    return response.choices[0].message.content
