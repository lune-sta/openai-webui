import os
import sys

from flask import Flask
from flask_cors import CORS

from server.views.threads import threads_router


def create_app():
    app_ = Flask(__name__)
    CORS(app_)
    app_.config["JSON_AS_ASCII"] = False
    app_.register_blueprint(threads_router)
    return app_


def validate_required_envs():
    required_envs = ["OPENAI_API_KEY"]
    for e in required_envs:
        if e not in os.environ:
            sys.stderr.write(f"required env variable {e} is not set.")
            sys.exit(1)


if __name__ == "__main__":
    validate_required_envs()
    app = create_app()
    app.run(host="0.0.0.0", port=8080)
