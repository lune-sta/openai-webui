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


def test_create_thread(client):
    user_id = "test_user_id"
    headers = {"user-id": user_id}
    data = {"content": "赤ちゃんはどこから来るの？"}

    create_thread_response = client.post("/threads", headers=headers, data=data)
    assert create_thread_response.status_code == 200
    thread_id = create_thread_response.json["thread_id"]

    post_message_response = client.post(
        f"/threads/{thread_id}/messages", headers=headers, data=data
    )
    assert post_message_response.status_code == 200
