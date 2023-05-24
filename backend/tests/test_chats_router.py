import pytest

from server.main import create_app
from server.models import create_tables


@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        with app.app_context():
            create_tables()
        yield client


def test_create_chat(client):
    user_id = "test_user_id"
    headers = {"user-id": user_id}
    data = {"content": "赤ちゃんはどこから来るの？"}

    create_chat_response = client.post("/chats", headers=headers, data=data)
    assert create_chat_response.status_code == 200
    chat_id = create_chat_response.json["chat_id"]

    post_message_response = client.post(
        f"/chats/{chat_id}/messages", headers=headers, data=data
    )
    assert post_message_response.status_code == 200
