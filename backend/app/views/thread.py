import logging
import json

from flask import Blueprint, request
import openai

from app.secrets import API_KEY


thread_router = Blueprint('thread_router', __name__)
logger = logging.getLogger(__name__)
openai.api_key = API_KEY


@thread_router.route('/messages', methods=['POST'])
def post_messages() -> str:
    message = request.form.get("message")

    messages = [{"role": "system", "content": "いい感じに質問に答えてください."}, {
        "rolle": "user",
        "content": message,
    }]

    res = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
    return json.dumps({
        "answer": res["choices"][0]["message"]["content"]
    })
