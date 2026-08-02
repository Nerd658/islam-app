#!/usr/bin/env python3
"""
Arabic Audio Generator Script for Alphabet & Vocabulary
Generates 100% exact local MP3 files for all alphabet letters and 50 Quranic vocabulary words.
"""

import os
from gtts import gTTS

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "FRONTEND", "islam app", "public", "audio"))
ALPHABET_DIR = os.path.join(BASE_DIR, "alphabet")
VOCAB_DIR = os.path.join(BASE_DIR, "vocabulary")

os.makedirs(ALPHABET_DIR, exist_ok=True)
os.makedirs(VOCAB_DIR, exist_ok=True)

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

VOCABULARY = [
    (1, "allah", "اللَّه"),
    (2, "fi", "فِي"),
    (3, "min", "مِنْ"),
    (4, "ma", "مَا"),
    (5, "la", "لَا"),
    (6, "inna", "إِنَّ"),
    (7, "ala", "عَلَى"),
    (8, "illa", "إِلَّا"),
    (9, "qala", "قَالَ"),
    (10, "alladhi", "الَّذِي"),
    (11, "rabb", "رَبّ"),
    (12, "an", "أَنْ"),
    (13, "ila", "إِلَى"),
    (14, "anna", "أَنَّ"),
    (15, "kull", "كُلّ"),
    (16, "lam", "لَمْ"),
    (17, "kana", "كَانَ"),
    (18, "hum", "هُمْ"),
    (19, "aw", "أَوْ"),
    (20, "lan", "لَنْ"),
    (21, "idha", "إِذَا"),
    (22, "hadha", "هَذَا"),
    (23, "yawm", "يَوْم"),
    (24, "an_prep", "عَنْ"),
    (25, "ayyuha", "أَيُّهَا"),
    (26, "bayna", "بَيْنَ"),
    (27, "aleem", "عَلِيم"),
    (28, "samee", "سَمِيع"),
    (29, "ard", "أَرْض"),
    (30, "sama", "سَمَاء"),
    (31, "qawm", "قَوْم"),
    (32, "rasool", "رَسُول"),
    (33, "kitab", "كِتَاب"),
    (34, "ayah", "آيَة"),
    (35, "adhab", "عَذَاب"),
    (36, "mumin", "مُؤْمِن"),
    (37, "nar", "نَار"),
    (38, "jannah", "جَنَّة"),
    (39, "haqq", "حَقّ"),
    (40, "shay", "شَيْء"),
    (41, "nafs", "نَفْس"),
    (42, "deen", "دِين"),
    (43, "amila", "عَمِلَ"),
    (44, "jaa", "جَاءَ"),
    (45, "kafara", "كَفَرَ"),
    (46, "khalaqa", "خَلَقَ"),
    (47, "anzala", "أَنْزَلَ"),
    (48, "jaala", "جَعَلَ"),
    (49, "daa", "دَعَا"),
    (50, "alima", "عَلِمَ")
]

def generate_all():
    print("Generating Alphabet MP3s...")
    for item in LETTERS:
        num, key, text = item
        filepath = os.path.join(ALPHABET_DIR, f"{num}_{key}.mp3")
        if not os.path.exists(filepath):
            gTTS(text=text, lang='ar', slow=False).save(filepath)

    print("Generating Vocabulary MP3s...")
    for item in VOCABULARY:
        num, key, text = item
        filepath = os.path.join(VOCAB_DIR, f"{num}_{key}.mp3")
        print(f"Generating [{num}_{key}.mp3] for '{text}'...")
        gTTS(text=text, lang='ar', slow=False).save(filepath)
    print("All Alphabet and Vocabulary MP3s generated successfully!")

if __name__ == "__main__":
    generate_all()
