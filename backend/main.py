import os
import sys

from flask import Flask
from flask_cors import CORS
sys.path.append('/Users/kudtomoy/Projects/others/openai-webui/backend')


def create_app():
    from app.views.thread import thread_router

    app_ = Flask(__name__)
    CORS(app_)
    app_.config['JSON_AS_ASCII'] = False
    app_.register_blueprint(thread_router)
    return app_


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0')
