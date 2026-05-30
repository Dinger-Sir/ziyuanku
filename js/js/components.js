/**
 * 大学一点通工具箱 — 共享组件注入引擎
 * 消除7个HTML页面间的重复代码
 */

// ======== 导航配置 ========
var NAV_ITEMS = [
    { page: 'index', href: 'index.html', icon: 'fa-home', label: '首页', bold: true },
    { page: 'search', href: 'search.html', icon: 'fa-compass', label: '浏览器' },
    { page: 'ai-tools', href: 'ai-tools.html', icon: 'fa-robot', label: 'AI工具' },
    { page: 'video-resources', href: 'video-resources.html', icon: 'fa-film', label: '影视资源' },
    { page: 'software', href: 'software.html', icon: 'fa-laptop', label: '电脑软件' },
    { page: 'textbook-answers', href: 'textbook-answers.html', icon: 'fa-book', label: '课本答案' },
    { page: 'tools', href: 'tools.html', icon: 'fa-tools', label: '实用工具' }
];

// ======== 构建侧边栏 HTML ========
function buildSidebarHTML(activePage) {
    var html = '<nav class="sidebar">';
    html += '<button id="sidebar-toggle" class="sidebar-toggle"><i class="fas fa-bars"></i></button>';
    html += '<div class="logo"><a href="index.html" class="logo-link"><img src="img/DaXueYDT.jpg" alt="大学一点通"></a></div>';
    html += '<ul>';

    NAV_ITEMS.forEach(function(item) {
        var isActive = (item.page === activePage) ? ' active' : '';
        var boldOpen = item.bold ? '<strong>' : '';
        var boldClose = item.bold ? '</strong>' : '';
        html += '<li class="nav-item">';
        html += '<a href="' + item.href + '" class="nav-link' + isActive + '">';
        html += '<i class="fas ' + item.icon + '"></i>';
        html += '<span>' + boldOpen + item.label + boldClose + '</span>';
        html += '</a></li>';
    });

    html += '</ul></nav>';
    return html;
}

// ======== 构建共享组件 HTML ========
function buildSharedComponentsHTML() {
    var html = '';

    // 自定义弹窗
    html += '<div id="custom-modal" class="custom-modal">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';
    html += '<span class="close-modal">&times;</span>';
    html += '<h3 id="modal-title">提示</h3>';
    html += '</div>';
    html += '<div class="modal-body">';
    html += '<img id="modal-image" src="" alt="提示图片">';
    html += '<p id="modal-message"></p>';
    html += '</div></div></div>';

    // 在线咨询
    html += '<div class="opinion-nav">';
    html += '<img class="opinion-img" src="img/DaXueYDT.jpg" alt="在线咨询">';
    html += '<span class="opinion-text">在线咨询</span>';
    html += '<section class="opinion-cont"><section class="opinion-box">';
    html += '<div class="opinion-list" data-type="tech"><i class="fas fa-headset"></i><span>商务合作</span></div>';
    html += '<div class="opinion-list" data-type="feedback"><i class="fas fa-comments"></i><span>问题反馈</span></div>';
    html += '<div class="opinion-list" data-type="help"><i class="fas fa-info-circle"></i><span>使用帮助</span></div>';
    html += '</section></section></div>';

    // 回到顶部
    html += '<div id="get-top" title="回到顶部"><i class="fas fa-arrow-up"></i></div>';

    // 页脚（含不蒜子访问统计）
    html += '<footer class="site-footer"><div class="copyright-text">';
    html += '由「大学一点通」团队提供技术支持';
    html += '&nbsp;|&nbsp;';
    html += '全站访问 <strong id="busuanzi_value_site_pv">—</strong> 次';
    html += '&nbsp;|&nbsp;';
    html += '本页访问 <strong id="busuanzi_value_page_pv">—</strong> 次';
    html += '</div></footer>';

    return html;
}

// ======== 不蒜子计数器 ========
(function initBusuanzi() {
    var bs = document.createElement('script');
    bs.async = true;
    bs.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    var s = document.getElementsByTagName('script')[0];
    if (s) s.parentNode.insertBefore(bs, s);
})();

// ======== 百度统计（全站） ========
(function initBaiduAnalytics() {
    window._hmt = window._hmt || [];
    var hm = document.createElement('script');
    hm.src = 'https://hm.baidu.com/hm.js?a569475ad9f1afea83c954b408edca99';
    hm.async = true;
    var s = document.getElementsByTagName('script')[0];
    if (s) s.parentNode.insertBefore(hm, s);
})();

// ======== 注入共享组件 ========
function insertSharedComponents(activePage) {
    activePage = activePage || 'index';

    // 1. 在 .container 开头插入侧边栏
    var container = document.querySelector('.container');
    if (container) {
        var sidebarHTML = buildSidebarHTML(activePage);
        container.insertAdjacentHTML('afterbegin', sidebarHTML);
    }

    // 2. 在 body 末尾插入共享组件
    var sharedHTML = buildSharedComponentsHTML();
    document.body.insertAdjacentHTML('beforeend', sharedHTML);
}
