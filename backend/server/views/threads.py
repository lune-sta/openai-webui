import logging

import openai
import ulid
from flask import Blueprint, Response, jsonify, request

from server.models import Message, Thread, db
from server.presets import get_preset

threads_router = Blueprint("threads_router", __name__)
logger = logging.getLogger(__name__)


def generate_title(content: str) -> str:
    if len(content) < 10:
        return content
    else:
        return content[0:20] + "..."


@threads_router.route("/threads", methods=["POST"])
def create_thread():
    user_id = request.headers.get("user-id")
    content = request.form.get("content")
    preset = "gpt-3.5-default"

    thread = Thread(
        thread_id=ulid.ulid(),
        user_id=user_id,
        title=generate_title(content),
        preset=preset,
    )
    thread.save()

    preset = get_preset(preset)
    for init_message in preset.init_messages():
        with db.transaction():
            message = Message(
                message_id=ulid.ulid(),
                role=init_message["role"],
                content=init_message["content"],
                thread=thread,
            )
            message.save()

    result = {"thread_id": thread.thread_id, "title": thread.title}
    return jsonify(result)


@threads_router.route("/threads", methods=["GET"])
def get_threads():
    user_id = request.headers.get("user-id")
    threads = [
        {"thread_id": thread.thread_id, "title": thread.title}
        for thread in Thread.select().where(Thread.user_id == user_id)
    ]
    result = {"threads": threads}

    return jsonify(result)


@threads_router.route("/threads/<thread_id>", methods=["GET"])
def get_messages(thread_id: str):
    messages = [
        {
            "message_id": message.message_id,
            "role": message.role,
            "content": message.content,
        }
        for message in Message.select()
        .join(Thread)
        .where(Thread.thread_id == thread_id)
        .order_by(Message.message_id)
    ]
    result = {"messages": messages}

    return jsonify(result)


@threads_router.route("/threads/<thread_id>/messages", methods=["POST"])
def post_message(thread_id: str) -> Response:
    content = request.form["content"]
    thread = Thread.get(thread_id=thread_id)

    messages = [
        {"role": message.role, "content": message.content}
        for message in Message.select()
        .join(Thread)
        .where(Thread.thread_id == thread_id)
        .order_by(Message.message_id)
    ]

    messages.append({"role": "user", "content": content})

    preset = get_preset(thread.preset)

    res = openai.ChatCompletion.create(model=preset.openai_model, messages=messages)
    return jsonify(res["choices"][0]["message"])
