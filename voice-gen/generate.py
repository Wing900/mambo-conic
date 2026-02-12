"""
语音生成工具 - 从场景 JSON 生成 MP3 语音文件

用法:
    python generate.py <json文件路径>

示例:
    python generate.py ../mambo-conic/src/data/scenes/chapter01/part1.json
"""

import json
import re
import sys
import os
from pathlib import Path

# Windows 终端 UTF-8 输出
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

try:
    from gradio_client import Client
except ImportError:
    print("请先安装: pip install gradio_client")
    sys.exit(1)

try:
    from pydub import AudioSegment
except ImportError:
    print("请先安装: pip install pydub")
    sys.exit(1)


SCRIPT_DIR = Path(__file__).parent
CONFIG_PATH = SCRIPT_DIR / "config.json"
SPACE_ID = "Plachta/VITS-Umamusume-voice-synthesizer"


def load_config() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def extract_scenes(json_path: str) -> list[dict]:
    """从 JSON 文件提取所有带对话的场景 (id + text)"""
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    scenes = []
    for scene in data.get("scenes", []):
        sid = scene.get("id", "")
        text = scene.get("dialogue", {}).get("text", "")
        if sid and text:
            scenes.append({"id": sid, "text": text})
    return scenes


def get_chapter_id(scene_id: str) -> str:
    """从场景 ID 提取章节 ID, 如 ch01_s1_welcome -> ch01"""
    m = re.match(r"^ch\d+", scene_id)
    return m.group(0) if m else "unknown"


def generate_voice(client: Client, text: str, config: dict) -> str | None:
    """调用 VITS API 生成语音, 返回临时文件路径"""
    try:
        message, audio_path = client.predict(
            text=text,
            speaker=config["speaker"],
            language=config["language"],
            speed=config["speed"],
            is_symbol=False,
            api_name=config.get("api_name", "/tts_fn"),
        )
        print(f"  API 返回: {message}")
        return audio_path
    except Exception as e:
        print(f"  API 调用失败: {e}")
        return None


def convert_to_mp3(src_path: str, dst_path: str):
    """将音频文件转为 MP3"""
    audio = AudioSegment.from_file(src_path)
    audio.export(dst_path, format="mp3", bitrate="192k")


def main():
    if len(sys.argv) < 2:
        print("用法: python generate.py <json文件路径>")
        print("示例: python generate.py ../mambo-conic/src/data/scenes/chapter01/part1.json")
        sys.exit(1)

    json_path = sys.argv[1]
    if not os.path.exists(json_path):
        print(f"文件不存在: {json_path}")
        sys.exit(1)

    # 加载配置
    config = load_config()
    print(f"角色: {config['speaker']}")
    print(f"语言: {config['language']}")
    print(f"语速: {config['speed']}")
    print(f"API:  {config.get('api_name', '/tts_fn')}")
    print()

    # 输出目录
    output_base = (SCRIPT_DIR / config["output_dir"]).resolve()

    # 提取场景
    scenes = extract_scenes(json_path)
    if not scenes:
        print("该 JSON 文件中没有找到带对话的场景")
        sys.exit(0)

    print(f"找到 {len(scenes)} 个场景:")
    for s in scenes:
        print(f"  {s['id']}: {s['text'][:40]}...")
    print()

    # 连接 API
    print(f"连接 {SPACE_ID} ...")
    client = Client(SPACE_ID)
    print("连接成功\n")

    # 逐个生成
    success = 0
    fail = 0
    for i, scene in enumerate(scenes, 1):
        sid = scene["id"]
        text = scene["text"]
        chapter_id = get_chapter_id(sid)

        out_dir = output_base / chapter_id
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / f"{sid}.mp3"

        print(f"[{i}/{len(scenes)}] {sid}")
        print(f"  文本: {text}")

        # 如果已存在则跳过
        if out_path.exists():
            print(f"  已存在, 跳过 ({out_path})")
            success += 1
            continue

        audio_path = generate_voice(client, text, config)
        if audio_path:
            convert_to_mp3(audio_path, str(out_path))
            print(f"  已保存: {out_path}")
            success += 1
        else:
            fail += 1

    print(f"\n完成! 成功: {success}, 失败: {fail}")


if __name__ == "__main__":
    main()
