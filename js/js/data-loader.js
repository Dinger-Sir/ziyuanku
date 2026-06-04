/**
 * 大学一点通工具箱 — JSON 数据加载引擎 v3.0
 * - 服务器：fetch JSON 动态渲染（单数据源）
 * - 本  地：fetch 失败自动用内嵌兜底数据（也能正常显示）
 */

/* ======== 内嵌兜底数据（fetch 失败时使用） ======== */
var FALLBACK_DATA = {
    'ai-tools': {
        categories: [
            {"name":"AI聊天对话","links":[
                {"name":"豆包","url":"https://www.doubao.com/chat/","title":"豆包AI聊天平台"},
                {"name":"问小白","url":"https://www.wenxiaobai.com/chat/tourist"},
                {"name":"Deepseek","url":"https://www.deepseek.com/"},
                {"name":"腾讯元宝","url":"https://yuanbao.tencent.com/chat/naQivTmsDa"},
                {"name":"通义","url":"https://tongyi.aliyun.com/"},
                {"name":"文心一言","url":"https://yiyan.baidu.com/"},
                {"name":"讯飞星火","url":"https://xinghuo.xfyun.cn/desk"},
                {"name":"智谱清言","url":"https://chatglm.cn/main/alltoolsdetail?lang=zh"},
                {"name":"Kimi智能助手","url":"https://kimi.moonshot.cn/"},
                {"name":"ChatGPT（需VPN）","url":"https://chatgpt.com/"},
                {"name":"Claude（需VPN）","url":"https://claude.ai/login?returnTo=%2F%3F"},
                {"name":"Gemini（需VPN）","url":"https://gemini.google.com/"}
            ]},
            {"name":"AI编程工具","links":[
                {"name":"Cursor","url":"https://www.cursor.com/cn"},
                {"name":"Trae","url":"https://www.trae.com.cn/"},
                {"name":"通义灵码","url":"https://lingma.aliyun.com/"}
            ]},
            {"name":"AI搜索引擎","links":[
                {"name":"秘塔AI搜索","url":"https://metaso.cn/"},
                {"name":"纳米AI搜索","url":"https://www.n.cn/"},
                {"name":"Perplexity（需VPN）","url":"https://www.perplexity.ai/"}
            ]}
        ]
    },
    'video-resources': {
        categories: [
            {"name":"在线影视","links":[
                {"name":"VIP视频在线观看","url":"https://daxueyidiantongvipshipin.netlify.app/","className":"vip-link"},
                {"name":"免费影视1","url":"https://www.zhenlang.org/?utm_source=daxueyidiantong","title":"来源于第三方"},
                {"name":"免费影视2","url":"https://xl02.com.de/?utm_source=daxueyidiantong","title":"来源于第三方"},
                {"name":"免费影视3","url":"https://www.bzzdyy.com/?utm_source=daxueyidiantong","title":"来源于第三方"},
                {"name":"免费影视4","url":"https://www.hdmoli.com/?utm_source=daxueyidiantong","title":"来源于第三方"},
                {"name":"免费影视5","url":"https://soupian.pro/?utm_source=daxueyidiantong","title":"来源于第三方"},
                {"name":"免费影视6","url":"https://www.gqc6.top/?utm_source=daxueyidiantong","title":"来源于第三方"},
                {"name":"免费影视7","url":"https://pomo.mom/?utm_source=daxueyidiantong","title":"来源于第三方"}
            ]},
            {"name":"影视下载","links":[
                {"name":"影视下载1","url":"https://www.seedhub.cc/","title":"来源于第三方"}
            ]}
        ]
    },
    'tools': {
        categories: [
            {"name":"自研工具","links":[
                {"name":"加水印","url":"https://daxueydtsy.netlify.app"},
                {"name":"薪资计算器","url":"https://daxueydtxzjsq.netlify.app"},
                {"name":"色值查询","url":"https://sezhichaxun.netlify.app"},
                {"name":"PDF合并","url":"https://daxueydtpdfmerge.netlify.app"},
                {"name":"在线画板","url":"https://zaixianhuatu.netlify.app"}
            ]},
            {"name":"优秀工具/网站","links":[
                {"name":"新概念英语","url":"https://www.newconceptenglish.com/"}
            ]}
        ]
    },
    'textbook-answers': {
        categories: [
            {"name":"新视野大学英语（读写教程）","links":[
                {"name":"读写教程（第三版）","url":"textbook-reading-writing-3.html"},
                {"name":"读写教程（第四版）","url":"textbook-reading-writing-4.html"}
            ]},
            {"name":"新视野大学英语（视听教程）","links":[
                {"name":"视听教程（第三版）","url":"textbook-audio-visual-3.html"},
                {"name":"视听教程（第四版）","url":"textbook-audio-visual-4.html"}
            ]}
        ]
    }
};

/* ======== 数据加载 ======== */
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
            renderPage(pageName, config, data);
            console.log('[DataLoader] ' + pageName + ' 从 JSON 加载');
        })
        .catch(function(err) {
            console.warn('[DataLoader] ' + pageName + ' JSON 加载失败，使用兜底数据:', err.message);
            var fallback = FALLBACK_DATA[pageName];
            if (fallback) {
                renderPage(pageName, config, fallback);
            }
        });
}

function renderPage(pageName, config, data) {
    if (config.type === 'software') {
        renderSoftware(data);
    } else {
        var container = document.querySelector('.category-container');
        if (container && data.categories) renderLinks(container, data.categories);
    }
}

/* ---- 普通页面渲染 ---- */
function renderLinks(container, categories) {
    container.innerHTML = '';
    categories.forEach(function(cat) {
        container.appendChild(buildCategoryGroup(cat.name, cat.links));
    });
}

/* ---- 构建分类组 ---- */
function buildCategoryGroup(catName, links) {
    var group = document.createElement('div');
    group.className = 'category-group';

    if (catName) {
        var title = document.createElement('h3');
        title.textContent = catName;
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
        if (link.className) anchor.className = link.className;
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

/* ---- Software 专用渲染 ---- */
function renderSoftware(data) {
    var mainContainer = document.querySelector('#c-section .category-container');
    if (mainContainer && data.mainCategories) {
        mainContainer.innerHTML = '';
        data.mainCategories.forEach(function(cat) {
            mainContainer.appendChild(buildCategoryGroup(cat.name, cat.links));
        });
    }

    var mainEl = document.querySelector('main.main-content') || document.querySelector('main');
    if (!mainEl || !data.subSections) return;

    var oldSubs = mainEl.querySelectorAll('section[id^="c-section-sub"]');
    oldSubs.forEach(function(s) { s.remove(); });

    Object.keys(data.subSections).forEach(function(id) {
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
}
