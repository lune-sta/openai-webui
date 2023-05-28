import logging
import uuid

import openai
from flask import Blueprint, Response, jsonify, request

from server.models import Chat, Message, db
from server.presets import get_preset

chats_router = Blueprint("chats_router", __name__)
logger = logging.getLogger(__name__)


def generate_title(content: str) -> str:
    if len(content) < 10:
        return content
    else:
        return content[0:20] + "..."


@chats_router.route("/chats", methods=["POST"])
def create_chat():
    user_id = request.headers["user-id"]
    content = request.form["content"]
    preset = request.form["preset"]

    chat = Chat(
        chat_id=uuid.uuid4(),
        user_id=user_id,
        title=generate_title(content),
        preset=preset,
    )
    chat.save(force_insert=True)

    preset = get_preset(preset)
    for init_message in preset.init_messages():
        with db.transaction():
            message = Message(
                message_id=uuid.uuid4(),
                role=init_message["role"],
                content=init_message["content"],
                chat=chat,
                preset=preset,
            )
            message.save(force_insert=True)

    result = {"chat_id": chat.chat_id, "title": chat.title}
    return jsonify(result)


@chats_router.route("/chats", methods=["GET"])
def get_chats():
    user_id = request.headers.get("user-id")
    chats = [
        {"chat_id": chat.chat_id, "title": chat.title}
        for chat in Chat.select()
        .where(Chat.user_id == user_id)
        .order_by(Chat.created_at.desc())
        .limit(10)
    ]
    result = {"chats": chats}

    return jsonify(result)


@chats_router.route("/chats/<chat_id>/messages", methods=["GET"])
def get_messages(chat_id: str):
    messages = [
        {
            "message_id": message.message_id,
            "role": message.role,
            "content": message.content,
        }
        for message in Message.select()
        .join(Chat)
        .where((Chat.chat_id == chat_id) & (Message.role != "system"))
        .order_by(Message.created_at.asc())
    ]
    result = {"messages": messages}

    return jsonify(result)


@chats_router.route("/chats/<chat_id>/messages", methods=["POST"])
def post_message(chat_id: str) -> Response:
    content = request.form["content"]

    chat = Chat.get(Chat.chat_id == chat_id)

    messages = [
        {"role": message.role, "content": message.content}
        for message in Message.select()
        .join(Chat)
        .where(Chat.chat_id == chat_id)
        .order_by(Message.created_at.asc())
    ]

    messages.append({"role": "user", "content": content})

    preset = get_preset(chat.preset)
    res = preset.create_compleation(messages)

    with db.transaction():
        user_message = Message(
            message_id=uuid.uuid4(),
            role="user",
            content=content,
            chat=chat,
            preset=preset,
        )
        user_message.save(force_insert=True)

        assistant_message = Message(
            message_id=uuid.uuid4(),
            role="assistant",
            content=res["choices"][0]["message"]["content"],
            chat=chat,
            preset=preset,
        )
        assistant_message.save(force_insert=True)

    return jsonify(res["choices"][0]["message"])
