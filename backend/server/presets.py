from abc import ABC, abstractmethod


class _PresetBase(ABC):
    openai_model: str

    @abstractmethod
    def init_messages(self) -> list[dict[str, str]]:
        pass


class Gpt35DefaultPreset(_PresetBase):
    openai_model = "gpt-3.5-turbo"

    def init_messages(self) -> list[dict[str, str]]:
        return [{"role": "system", "content": "いい感じに質問に答えてください。"}]


_presets: dict[str, _PresetBase] = {"gpt-3.5-default": Gpt35DefaultPreset()}


def get_preset(preset_name: str) -> _PresetBase:
    return _presets[preset_name]
