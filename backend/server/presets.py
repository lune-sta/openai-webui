import os
from abc import ABC, abstractmethod

import openai


class _PresetBase(ABC):
    openai_model: str

    @abstractmethod
    def init_messages(self) -> list[dict[str, str]]:
        pass

    @abstractmethod
    def create_compleation(self, messages) -> dict:
        pass


class Gpt35DefaultPreset(_PresetBase):
    openai_model = "gpt-3.5-turbo"

    def init_messages(self) -> list[dict[str, str]]:
        return [{"role": "system", "content": "いい感じに質問に答えてください。"}]

    def create_compleation(self, messages) -> dict:
        openai.api_type = "open_ai"
        openai.api_key = os.environ.get("OPENAI_API_KEY")
        openai.api_version = None
        res = openai.ChatCompletion.create(model=self.openai_model, messages=messages)
        return res


class Gpt35AzurePreset(_PresetBase):
    def init_messages(self) -> list[dict[str, str]]:
        return [{"role": "system", "content": "いい感じに質問に答えてください。"}]

    def create_compleation(self, messages):
        openai.api_type = "azure"
        openai.api_key = os.environ.get("AZURE_OPENAI_APIKEY")
        openai.api_base = os.environ.get("AZURE_OPENAI_ENDPOINT_NAME")
        openai.api_version = "2023-05-15"
        azure_openai_deploy_name = os.environ.get("AZURE_OPENAI_DEPLOY_NAME")

        try:
            res = openai.ChatCompletion.create(
                deployment_id=azure_openai_deploy_name, messages=messages
            )
        except openai.error.PermissionError:
            res["choices"][0]["message"][
                "content"
            ] = "Access denied due to Virtual Network/Firewall rules."
        return res


_presets: dict[str, _PresetBase] = {
    "gpt-3.5-default": Gpt35DefaultPreset(),
    "azure-gpt3.5-default": Gpt35AzurePreset(),
}


def get_preset(preset_name: str) -> _PresetBase:
    return _presets[preset_name]
