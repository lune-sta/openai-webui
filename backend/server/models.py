import os
from datetime import datetime

from peewee import *

if 'ENV' in os.environ and os.environ["ENV"] == "test":
    db = SqliteDatabase(":memory:")
else:
    db = SqliteDatabase("sqlite.db")


class Chat(Model):
    chat_id = CharField(primary_key=True, null=False)
    user_id = CharField(null=False)
    title = CharField(null=False)
    preset = CharField(null=False)
    created_at = DateTimeField(default=datetime.now, null=False)
    updated_at = DateTimeField(default=datetime.now, null=False)

    class Meta:
        database = db


class Message(Model):
    message_id = CharField(primary_key=True, null=False)
    role = CharField(null=False)
    content = CharField(null=False)
    chat = ForeignKeyField(Chat, backref="messages", null=False)
    preset = CharField(null=True)
    created_at = DateTimeField(default=datetime.now, null=False)

    class Meta:
        database = db


def create_tables():
    db.create_tables([Chat, Message])
