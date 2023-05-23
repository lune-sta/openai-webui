import os
from peewee import *


if os.environ["ENV"] == "test":
    db = SqliteDatabase(":memory:")
else:
    db = SqliteDatabase("sqlite.db")


class Thread(Model):
    thread_id = CharField()
    user_id = CharField()
    title = CharField()
    preset = CharField()

    class Meta:
        database = db


class Message(Model):
    message_id = CharField()
    role = CharField()
    content = CharField()
    thread = ForeignKeyField(Thread, backref="messages")

    class Meta:
        database = db


def create_tables():
    db.create_tables([Thread, Message])
