"""
双击运行即可：自动读取 software.html → 生成 data/software.json
"""
import re
import json
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))  # tools/
ROOT = os.path.dirname(BASE)                        # 项目根目录

def get_links(html):
    links = []
    for m in re.finditer(r'<a href="([^"]+)"([^>]*)>([^<]+)</a>', html):
        url, attrs, name = m.group(1), m.group(2), m.group(3).strip()
        if (url == '#' and not name) or '其他' in name:
            continue
        link = {'name': name, 'url': url}
        tm = re.search(r'title="([^"]+)"', attrs)
        if tm:
            link['title'] = tm.group(1)
        om = re.search(r'onclick="([^"]+)"', attrs)
        if om:
            link['onclick'] = om.group(1)
        links.append(link)
    return links

# 读取 HTML
html_path = os.path.join(ROOT, 'software.html')
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# --- 主分类 ---
main_match = re.search(r'<section id="c-section">(.*?)</section>', html, re.DOTALL)
main_cats = []
if main_match:
    parts = re.split(r'<h3>([^<]+)</h3>', main_match.group(1))
    for i in range(1, len(parts), 2):
        name = parts[i].strip()
        links = get_links(parts[i + 1] if i + 1 < len(parts) else '')
        if links:
            main_cats.append({'name': name, 'links': links})

# --- 子节 ---
sub_sections = {}
for m in re.finditer(r'<section id="(c-section-sub\d+)"[^>]*>(.*?)</section>', html, re.DOTALL):
    sid, content = m.group(1), m.group(2)
    tm = re.search(r'<h2 class="section-title">([^<]+)</h2>', content)
    title = tm.group(1).strip() if tm else ''

    parts = re.split(r'<h3>([^<]+)</h3>', content)
    if len(parts) > 1:
        cats = []
        for i in range(1, len(parts), 2):
            name = parts[i].strip()
            links = get_links(parts[i + 1] if i + 1 < len(parts) else '')
            if links:
                cats.append({'name': name, 'links': links})
        sub_sections[sid] = {'title': title, 'categories': cats}
    else:
        sub_sections[sid] = {'title': title, 'links': get_links(content)}

# --- 统计 ---
total = sum(len(c['links']) for c in main_cats)
for ss in sub_sections.values():
    if 'categories' in ss:
        total += sum(len(c['links']) for c in ss['categories'])
    if 'links' in ss:
        total += len(ss['links'])

# --- 写入 ---
result = {'page': 'software', 'mainCategories': main_cats, 'subSections': sub_sections}
out_path = os.path.join(ROOT, 'data', 'software.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f'✅ 更新完成！主分类 {len(main_cats)} 个，子节 {len(sub_sections)} 个，共 {total} 条链接')
print(f'📄 输出文件：data/software.json')
input('\n按回车退出...')
