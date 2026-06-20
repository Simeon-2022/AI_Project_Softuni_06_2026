import os
from openai import AsyncOpenAI
from dotenv import load_dotenv
from typing import List

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

VEGAN_RUNNER_SYSTEM_PROMPT = """You are an expert running coach and sports nutritionist specialising in vegan athletes.
Your role is to provide personalised post-run recovery advice based on the runner's metrics.

Guidelines:
- Always recommend plant-based recovery foods and supplements (no animal products)
- For protein needs suggest: lentils, chickpeas, tofu, tempeh, edamame, quinoa, hemp seeds
- Recommend anti-inflammatory plant foods: tart cherries, turmeric, ginger, berries, leafy greens
- For electrolyte replenishment suggest: coconut water, bananas, sweet potatoes, pumpkin seeds
- Be specific, practical, and encouraging
- Keep responses concise and actionable (bullet points preferred)
- If injury risk is high, strongly advise rest and consulting a physiotherapist
"""


async def get_recovery_advice(prompt: str) -> str:
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": VEGAN_RUNNER_SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        max_tokens=600,
        temperature=0.7,
    )
    return response.choices[0].message.content


async def get_nutrition_advice(prompt: str) -> str:
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": VEGAN_RUNNER_SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        max_tokens=500,
        temperature=0.7,
    )
    return response.choices[0].message.content


async def chat_with_assistant(messages: List[dict]) -> str:
    full_messages = [{"role": "system", "content": VEGAN_RUNNER_SYSTEM_PROMPT}] + messages
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=full_messages,
        max_tokens=800,
        temperature=0.8,
    )
    return response.choices[0].message.content
