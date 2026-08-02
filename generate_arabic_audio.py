#!/usr/bin/env python3
"""
Arabic Alphabet Audio Generator Script
Generates 28 high-precision local MP3 files for the Arabic alphabet.
"""

import os
import asyncio
from gtts import gTTS

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "FRONTEND", "islam app", "public", "audio", "alphabet"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

LETTERS = [
    (1, "alif", "أَلِف"),
    (2, "ba", "بَاء"),
    (3, "ta", "تَاء"),
    (4, "tha", "ثَاء"),
    (5, "jim", "جِيم"),
    (6, "ha", "حَاء"),
    (7, "kha", "خَاء"),
    (8, "dal", "دَال"),
    (9, "dhal", "ذَال"),
    (10, "ra", "رَاء"),
    (11, "zay", "زَاي"),
    (12, "sin", "سِين"),
    (13, "shin", "شِين"),
    (14, "sad", "صَاد"),
    (15, "dhad", "ضَاد"),
    (16, "ta_emphatic", "طَاء"),
    (17, "dha_emphatic", "ظَاء"),
    (18, "ayn", "عَيْن"),
    (19, "ghayn", "غَيْن"),
    (20, "fa", "فَاء"),
    (21, "qaf", "قَاف"),
    (22, "kaf", "كَاف"),
    (23, "lam", "لاَم"),
    (24, "mim", "مِيم"),
    (25, "nun", "نُون"),
    (26, "ha_soft", "هَاء"),
    (27, "waw", "وَاو"),
    (28, "ya", "يَاء")
]

def generate_gtts():
    print("Generating 28 Arabic letter MP3 files via gTTS...")
    for item in LETTERS:
        num, key, text = item
        filename = f"{num}_{key}.mp3"
        filepath = os.path.join(OUTPUT_DIR, filename)
        print(f"Generating [{filename}] for '{text}'...")
        tts = gTTS(text=text, lang='ar', slow=False)
        tts.save(filepath)
    print("All 28 MP3 files generated successfully!")

if __name__ == "__main__":
    generate_gtts()
