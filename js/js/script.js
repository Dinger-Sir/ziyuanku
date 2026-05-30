// ======== 点击计数与排序功能 ========
function initializeClickSort() {
    const quickAccessContainers = document.querySelectorAll('#home .horizontal-links');

    quickAccessContainers.forEach(container => {
        const links = Array.from(container.querySelectorAll('.horizontal-link'));

        links.forEach(link => {
            const anchor = link.querySelector('a');
            if (!anchor) return;
            const key = anchor.innerText.trim();

            anchor.addEventListener('click', () => {
                const count = localStorage.getItem(key) || 0;
                localStorage.setItem(key, parseInt(count) + 1);
            });
        });

        const sortedLinks = links.sort((a, b) => {
            const keyA = a.querySelector('a').innerText.trim();
            const keyB = b.querySelector('a').innerText.trim();
            const countA = parseInt(localStorage.getItem(keyA)) || 0;
            const countB = parseInt(localStorage.getItem(keyB)) || 0;
            return countB - countA;
        });

        container.innerHTML = '';
        sortedLinks.forEach(link => container.appendChild(link));
    });
}

// ======== 移动端适配增强 ========
function handleMobileResize() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    if (window.innerWidth <= 768) {
        sidebar.classList.add('mobile-view');
    } else {
        sidebar.classList.remove('mobile-view');
    }
}

// ======== 版块切换函数 ========
function switchSection(sectionId) {
    console.log('切换到:', sectionId);

    const allSections = document.querySelectorAll('main > section, section[id^="c-section"]');
    allSections.forEach(section => {
        section.style.display = 'none';
    });

    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('成功显示:', sectionId);
    } else {
        console.error('未找到section:', sectionId);
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    if (history.pushState) {
        history.pushState(null, null, `#${sectionId}`);
    } else {
        location.hash = `#${sectionId}`;
    }
}

// ======== 优化后的 Tooltip 系统（单例共享） ========
function initTooltips() {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.style.cssText = 'position:absolute;background:rgba(0,0,0,0.8);color:#fff;padding:5px 10px;border-radius:3px;font-size:13px;display:none;z-index:10000;pointer-events:none;white-space:nowrap;';
    document.body.appendChild(tooltip);

    document.querySelectorAll('a[title]').forEach(link => {
        link.addEventListener('mouseenter', function(e) {
            // 暂存 title 并移除，防止浏览器原生 tooltip 叠加
            var t = link.getAttribute('title');
            if (t) {
                link.setAttribute('data-tt', t);
                link.removeAttribute('title');
            }
            tooltip.textContent = t || '';
            tooltip.style.display = 'block';
        });
        link.addEventListener('mousemove', function(e) {
            tooltip.style.left = (e.pageX + 12) + 'px';
            tooltip.style.top = (e.pageY + 12) + 'px';
        });
        link.addEventListener('mouseleave', function() {
            tooltip.style.display = 'none';
            // 恢复 title
            var saved = link.getAttribute('data-tt');
            if (saved) {
                link.setAttribute('title', saved);
                link.removeAttribute('data-tt');
            }
        });
    });
}

// ======== 主初始化（单一 DOMContentLoaded） ========
document.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成');

    // --- Hash 导航 ---
    const currentHash = window.location.hash.substring(1);
    const validSections = [
        'home', 'c-section',
        'c-section-sub1', 'c-section-sub2', 'c-section-sub3', 'c-section-sub4',
        'c-section-sub5', 'c-section-sub6', 'c-section-sub7', 'c-section-sub8',
        'c-section-sub9', 'c-section-sub10', 'c-section-sub11', 'c-section-sub12',
        'c-section-sub13', 'c-section-sub14', 'c-section-sub15', 'c-section-sub16',
        'c-section-sub17', 'c-section-sub18', 'c-section-sub19', 'c-section-sub20',
        'c-section-sub21', 'c-section-sub22', 'c-section-sub23', 'c-section-sub24',
        'c-section-sub25', 'c-section-sub26', 'c-section-sub27', 'c-section-sub28',
        'c-section-sub29', 'c-section-sub30', 'c-section-sub31', 'c-section-sub32',
        'c-section-sub33', 'c-section-sub34', 'c-section-sub35', 'c-section-sub36',
        'c-section-sub37', 'c-section-sub38', 'c-section-sub39', 'c-section-sub40',
        'c-section-sub41', 'c-section-sub42', 'c-section-sub43', 'c-section-sub44',
        'c-section-sub101','c-section-sub102','c-section-sub103','c-section-sub104',
        'c-section-sub105','c-section-sub106','c-section-sub107','c-section-sub108',
        'c-section-sub109','c-section-sub110','c-section-sub111','c-section-sub112',
        'c-section-sub113','c-section-sub114','c-section-sub115','c-section-sub116',
        'c-section-sub201','c-section-sub202','c-section-sub203','c-section-sub204',
        'c-section-sub205','c-section-sub206',
        'c-section-sub301','c-section-sub302','c-section-sub303','c-section-sub304',
        'c-section-sub305','c-section-sub306',
        'c-section-sub401','c-section-sub402','c-section-sub403','c-section-sub404',
        'c-section-sub405','c-section-sub406','c-section-sub407','c-section-sub408',
        'c-section-sub409',
        'c-section-sub501','c-section-sub502','c-section-sub503','c-section-sub504',
        'c-section-sub505','c-section-sub506','c-section-sub507','c-section-sub508',
        'c-section-sub509','c-section-sub510','c-section-sub511','c-section-sub512',
        'c-section-sub513','c-section-sub514','c-section-sub515','c-section-sub516',
        'c-section-sub517','c-section-sub518','c-section-sub519','c-section-sub520',
        'c-section-sub521','c-section-sub522','c-section-sub523',
        'c-section-sub601','c-section-sub602','c-section-sub603','c-section-sub604',
        'c-section-sub666'
    ];

    if (currentHash && validSections.includes(currentHash)) {
        switchSection(currentHash);
    } else {
        switchSection('c-section');
    }

    // --- 侧边栏切换（使用 hidden 类） ---
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (sidebarToggle && sidebar && mainContent) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
            mainContent.classList.toggle('full-width');
        });
    }

    // --- 移动端适配 ---
    window.addEventListener('resize', handleMobileResize);
    handleMobileResize();

    // --- 初始化功能 ---
    initializeClickSort();
    setupSearchBox();
    initTooltips();

    const showModal = setupCustomModal();
    setupOpinionNav(showModal);
    setupBackToTop();
});

// ======== Hash 变化监听 ========
window.addEventListener('hashchange', () => {
    const sectionId = window.location.hash.substring(1);
    if (sectionId) switchSection(sectionId);
});

// ======== 右键保护（动态创建提示元素） ========
(function createRightClickTip() {
    if (document.getElementById('right-click-tip')) return;
    const tip = document.createElement('div');
    tip.id = 'right-click-tip';
    tip.className = 'right-click-tip';
    tip.textContent = '网站不支持复制！';
    document.body.appendChild(tip);
})();

// 判断事件是否来自搜索框（搜索框允许操作）
function isSearchInput(el) {
    return el && (el.id === 'search-input' || el.closest('#search-input'));
}

document.addEventListener('contextmenu', function (e) {
    if (isSearchInput(e.target)) return; // 搜索框允许右键
    e.preventDefault();
    const tip = document.getElementById('right-click-tip');
    if (tip) {
        tip.style.left = e.pageX + 'px';
        tip.style.top = e.pageY + 'px';
        tip.classList.add('show');
        clearTimeout(tip.timer);
        tip.timer = setTimeout(() => tip.classList.remove('show'), 1500);
    }
});

document.addEventListener('copy', function (e) {
    if (isSearchInput(e.target)) return; // 搜索框允许复制
    e.preventDefault();
    alert('You cannot copy content of this page');
});

document.addEventListener('selectstart', function (e) {
    if (isSearchInput(e.target)) return; // 搜索框允许选中
    e.preventDefault();
});

document.addEventListener('click', function (e) {
    const tip = document.getElementById('right-click-tip');
    if (tip && !tip.contains(e.target)) {
        clearTimeout(tip.timer);
        tip.classList.remove('show');
    }
});

// ======== 搜索框功能 ========
function setupSearchBox() {
    const engineSelector = document.getElementById('engine-selector');
    const engineOptions = document.getElementById('engine-options');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (!engineSelector || !engineOptions || !searchInput || !searchBtn) return;

    const engineName = engineSelector.querySelector('.engine-name');
    let currentEngine = 'baidu';

    const engines = {
        baidu: 'https://www.baidu.com/s?wd=',
        bing: 'https://www.bing.com/search?q=',
        google: 'https://www.google.com/search?q=',
        sogou: 'https://www.sogou.com/web?query='
    };

    engineSelector.addEventListener('click', function(e) {
        engineOptions.style.display = engineOptions.style.display === 'block' ? 'none' : 'block';
        e.stopPropagation();
    });

    engineOptions.querySelectorAll('.engine-option').forEach(option => {
        option.addEventListener('click', function() {
            currentEngine = this.getAttribute('data-engine');
            engineName.textContent = this.textContent;
            engineOptions.style.display = 'none';
            if (window.innerWidth <= 768) adjustMobileOptionsPosition();
        });
    });

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            window.open(engines[currentEngine] + encodeURIComponent(query), '_blank');
        } else {
            searchInput.focus();
        }
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });

    document.addEventListener('click', function(e) {
        if (!engineSelector.contains(e.target) && !engineOptions.contains(e.target)) {
            engineOptions.style.display = 'none';
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768 && engineOptions.style.display === 'block') {
            adjustMobileOptionsPosition();
        }
    });

    function adjustMobileOptionsPosition() {
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            engineOptions.style.width = searchBox.offsetWidth + 'px';
            engineOptions.style.left = searchBox.getBoundingClientRect().left + 'px';
        }
    }
}

// ======== 自定义弹窗功能 ========
function setupCustomModal() {
    const modal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalMessage = document.getElementById('modal-message');
    const closeBtn = document.querySelector('.close-modal');

    if (!modal || !modalTitle || !modalImage || !modalMessage) {
        return function() {};
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', function(event) {
        if (event.target === modal) closeModal();
    });

    return function showModal(title, imageSrc, message) {
        modalTitle.textContent = title;
        modalImage.src = imageSrc;
        modalMessage.textContent = message;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };
}

// ======== 在线咨询功能 ========
function setupOpinionNav(showModal) {
    const opinionNav = document.querySelector('.opinion-nav');
    if (!opinionNav) return;

    opinionNav.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
    });

    document.querySelectorAll('.opinion-list').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const type = this.getAttribute('data-type');
            switch(type) {
                case 'tech':
                    showModal('商务合作', 'img/微信二维码.png', '合作请联系我们！');
                    break;
                case 'feedback':
                    showModal('问题反馈', 'img/大学一点通工具箱-问题反馈.png', '感谢您的宝贵意见！我们会认真考虑每一条反馈，持续改进产品体验。');
                    break;
                case 'help':
                    showModal('使用帮助', 'img/欢迎关注大学一点通公众号！.jpg', '关注「大学一点通」公众号，获取更多信息！');
                    break;
            }
            opinionNav.classList.remove('active');
        });
    });

    document.addEventListener('click', function() {
        if (opinionNav) opinionNav.classList.remove('active');
    });
}

// ======== 回到顶部功能 ========
function setupBackToTop() {
    const backToTopBtn = document.getElementById('get-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
