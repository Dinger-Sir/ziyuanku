/**
 * 大学一点通工具箱 — JSON 数据加载引擎 v2.0
 * 渐进增强：JSON 加载成功则动态渲染，失败则保留 HTML 硬编码后备
 *
 * 支持两种页面模式：
 * - 普通页面：categories 数组直接渲染
 * - software 页面：mainCategories + subSections 双层结构
 */

var DATA_CONFIG = {
    'ai-tools':          { file: 'data/ai-tools.json' },
    'video-resources':   { file: 'data/video-resources.json' },
    'tools':             { file: 'data/tools.json' },
    'textbook-answers':  { file: 'data/textbook-answers.json' },
    'software':          { file: 'data/software.json', type: 'software' }
};

function loadLinkData(pageName) {
    var config = DATA_CONFIG[pageName];
    if (!config) return;

    fetch(config.file)
        .then(function(response) {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.json();
        })
        .then(function(data) {
            if (config.type === 'software') {
                renderSoftware(data);
            } else {
                var container = document.querySelector('.category-container');
                if (container) renderLinks(container, data.categories);
            }
            console.log('[DataLoader] ' + pageName + ' loaded from JSON (' +
                (config.type === 'software' ? 'software mode' : data.categories.length + ' categories') + ')');
        })
        .catch(function(err) {
            console.warn('[DataLoader] ' + pageName + ' JSON load failed, using fallback:', err.message);
        });
}

/* ---- 普通页面渲染 ---- */
function renderLinks(container, categories) {
    if (!categories) return;
    container.innerHTML = '';
    categories.forEach(function(cat) {
        container.appendChild(buildCategoryGroup(cat.name, cat.links));
    });
}

/* ---- 构建一个分类组 DOM ---- */
function buildCategoryGroup(catName, links) {
    var group = document.createElement('div');
    group.className = 'category-group';

    if (catName) {
        var title = document.createElement('h3');
        title.innerHTML = catName;
        group.appendChild(title);
    }

    var grid = document.createElement('div');
    grid.className = 'horizontal-links';

    links.forEach(function(link) {
        var card = document.createElement('div');
        card.className = 'horizontal-link';

        var anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.textContent = link.name;
        if (link.title) anchor.title = link.title;
        if (link.onclick) anchor.setAttribute('onclick', link.onclick);
        // 外部链接安全属性
        if (link.url.indexOf('http') === 0) {
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
        }
        card.appendChild(anchor);
        grid.appendChild(card);
    });

    group.appendChild(grid);
    return group;
}

/* ---- Software 专用渲染（双层结构：主分类 + 子节） ---- */
function renderSoftware(data) {
    // 1. 渲染主分类导航
    var mainContainer = document.querySelector('#c-section .category-container');
    if (mainContainer && data.mainCategories) {
        mainContainer.innerHTML = '';
        data.mainCategories.forEach(function(cat) {
            mainContainer.appendChild(buildCategoryGroup(cat.name, cat.links));
        });
    }

    // 2. 创建子节容器
    var mainEl = document.querySelector('main.main-content') || document.querySelector('main');
    if (!mainEl || !data.subSections) return;

    // 移除旧子节
    var oldSubs = mainEl.querySelectorAll('section[id^="c-section-sub"]');
    oldSubs.forEach(function(s) { s.remove(); });

    // 创建新子节
    var subIds = Object.keys(data.subSections);
    subIds.forEach(function(id) {
        var ss = data.subSections[id];
        var section = document.createElement('section');
        section.id = id;
        section.style.display = 'none';

        var h2 = document.createElement('h2');
        h2.className = 'section-title';
        h2.textContent = ss.title;
        section.appendChild(h2);

        var catContainer = document.createElement('div');
        catContainer.className = 'category-container';

        if (ss.categories) {
            ss.categories.forEach(function(cat) {
                catContainer.appendChild(buildCategoryGroup(cat.name, cat.links));
            });
        } else if (ss.links) {
            catContainer.appendChild(buildCategoryGroup('', ss.links));
        }

        section.appendChild(catContainer);
        mainEl.appendChild(section);
    });

    console.log('[DataLoader] software: ' + data.mainCategories.length + ' categories, ' + subIds.length + ' sub-sections rendered');
}
