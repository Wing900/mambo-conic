"""
语音生成工具 - 从场景 JSON 生成 MP3 语音文件（使用本地 Fish TTS 代理）

用法:
    python generate.py <json文件路径>

示例:
    python generate.py ../mambo-conic/src/data/scenes/chapter01/part1.json

前置条件:
    启动本地 Fish TTS 代理服务:
    uvicorn fish_tts_proxy:app --host 127.0.0.1 --port 8000
"""

import json
import re
import sys
import os
import time
from pathlib import Path

import httpx

# Windows 终端 UTF-8 输出
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')


SCRIPT_DIR = Path(__file__).parent
CONFIG_PATH = SCRIPT_DIR / "config.json"


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
        text = scene.get("tts_text", "") or scene.get("dialogue", {}).get("text", "")
        if sid and text:
            scenes.append({"id": sid, "text": text})
    return scenes


def get_chapter_id(scene_id: str) -> str:
    """从场景 ID 提取章节 ID, 如 ch01_s1_welcome -> ch01"""
    m = re.match(r"^ch\d+", scene_id)
    return m.group(0) if m else "unknown"


def generate_voice(text: str, config: dict, out_path: str) -> bool:
    """调用本地 Fish TTS 代理生成语音，流式保存为 MP3"""
    tts_url = config["tts_url"]
    payload = {"text": text, "format": "mp3"}
    model_id = config.get("model_id")
    if model_id:
        payload["model_id"] = model_id

    try:
        with httpx.Client(timeout=None, trust_env=False) as c:
            with c.stream("POST", tts_url, json=payload) as r:
                r.raise_for_status()
                total = 0
                with open(out_path, "wb") as f:
                    for chunk in r.iter_bytes():
                        if chunk:
                            f.write(chunk)
                            total += len(chunk)
                size_kb = total / 1024
                print(f"  已保存: {out_path} ({size_kb:.1f} KB)")
                return True

    except httpx.ConnectError:
        print(f"  连接失败: 请确认 Fish TTS 代理已启动 ({tts_url})")
        return False
    except httpx.HTTPStatusError as e:
        print(f"  API 返回错误: HTTP {e.response.status_code}")
        try:
            print(f"  详情: {e.response.text[:200]}")
        except Exception:
            pass
        return False
    except Exception as e:
        print(f"  API 调用失败: {e}")
        return False


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
    print(f"TTS 服务: {config['tts_url']}")
    print(f"模型 ID:  {config.get('model_id', '默认')}")
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
        preview = s['text'][:40]
        print(f"  {s['id']}: {preview}...")
    print()

    # 检查代理服务是否在线
    tts_url = config["tts_url"]
    base_url = tts_url.rsplit("/", 2)[0]
    try:
        r = httpx.get(f"{base_url}/docs", timeout=5)
        if r.status_code == 200:
            print("Fish TTS 代理服务在线 ✓\n")
        else:
            print(f"警告: 代理服务返回 HTTP {r.status_code}, 继续尝试...\n")
    except Exception:
        print(f"警告: 无法连接代理服务 ({base_url}), 请确认已启动\n")
        sys.exit(1)

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
            print(f"  已存在, 跳过")
            success += 1
            continue

        if generate_voice(text, config, str(out_path)):
            success += 1
        else:
            fail += 1

        # 请求间隔，避免过快
        if i < len(scenes):
            time.sleep(0.5)

    print(f"\n完成! 成功: {success}, 失败: {fail}")


if __name__ == "__main__":
    main()
