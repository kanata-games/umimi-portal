#!/usr/bin/env python3
"""GitHub Pages 用の index.html を source/index.html から作る。

source/index.html はアーティファクトの本体ページ（doctype なし）。
アーティファクトは公開時に骨組みでつつむが、Pages ではつつまれないので、ここで head を足す。
CLAUDE.md を handoff.md にもコピーする（アーティファクトに同梱する引き継ぎメモ）。
使い方: python3 build.py
"""
import pathlib, shutil
root = pathlib.Path(__file__).parent
body = (root / 'source' / 'index.html').read_text(encoding='utf-8')
head = '''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
</head>
<body>
'''
(root / 'index.html').write_text(head + body + '\n</body>\n</html>\n', encoding='utf-8')
shutil.copyfile(root / 'CLAUDE.md', root / 'handoff.md')
print('index.html と handoff.md を作りました')
