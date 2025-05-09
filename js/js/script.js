// ======== 新增：点击计数与排序功能 ========
function initializeClickSort() {
    // 定义快速入口容器的选择器（根据你的HTML结构调整）
    const quickAccessContainers = document.querySelectorAll('#home .horizontal-links');

    quickAccessContainers.forEach(container => {
        // 1. 获取所有链接项
        const links = Array.from(container.querySelectorAll('.horizontal-link'));
        
        // 2. 为每个链接添加点击计数器
        links.forEach(link => {
            const anchor = link.querySelector('a');
            const key = anchor.innerText.trim(); // 使用文字作为存储键
            
            anchor.addEventListener('click', () => {
                const count = localStorage.getItem(key) || 0;
                localStorage.setItem(key, parseInt(count) + 1);
            });
        });

        // 3. 排序逻辑
        const sortedLinks = links.sort((a, b) => {
            const keyA = a.querySelector('a').innerText.trim();
            const keyB = b.querySelector('a').innerText.trim();
            
            const countA = parseInt(localStorage.getItem(keyA)) || 0;
            const countB = parseInt(localStorage.getItem(keyB)) || 0;
            
            return countB - countA; // 降序排列
        });

        // 4. 清空容器并重新添加排序后的元素
        container.innerHTML = '';
        sortedLinks.forEach(link => {
            container.appendChild(link);
        });
    });
}


// 移动端适配增强
function handleMobileResize() {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 768) {
        sidebar.classList.add('mobile-view');
    } else {
        sidebar.classList.remove('mobile-view');
    }
}

// 新版初始化代码
document.addEventListener('DOMContentLoaded', () => {
    // 获取当前URL的hash值
    const currentHash = window.location.hash.substring(1);

    // 验证有效版块（需与HTML中section的id匹配）
    const validSections = [
        'home', 'a-section', 'b-section', 'c-section', 'd-section',
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
        'd-section-sub1', 'd-section-sub2', 'd-section-sub3', 'd-section-sub4',
        'd-section-sub5', 'e-section'
    ];

    // 判断是否有效hash
    if (validSections.includes(currentHash)) {
        switchSection(currentHash);
    } else {
        // 默认显示第一个有效版块（可选）
        switchSection(validSections[0]); 
    }

    // 监听窗口大小变化，处理移动端适配
    window.addEventListener('resize', handleMobileResize);
    handleMobileResize();
});

// 监听hash变化（保留原有功能）
window.addEventListener('hashchange', () => {
    const sectionId = window.location.hash.substring(1);
    if (sectionId) {
        switchSection(sectionId);
    }
}); 

function switchSection(sectionId) {
    // 隐藏所有版块
    document.querySelectorAll('main section').forEach(section => {
        section.style.display = 'none';
    });

    // 显示目标版块
    const target = document.getElementById(sectionId);
    if(target) {
        target.style.display = 'block';

        // 滚动到页面顶部（可选）
        window.scrollTo(0, 0);
    }

    // 更新导航状态
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    // 更新浏览器历史记录
    if (history.pushState) {
        history.pushState(null, null, `#${sectionId}`);
    } else {
        location.hash = `#${sectionId}`;
    }

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 锁界面
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    const tip = document.getElementById('right-click-tip');
    tip.style.left = e.pageX + 'px';
    tip.style.top = e.pageY + 'px';
    tip.classList.add('show');

    clearTimeout(tip.timer);
    tip.timer = setTimeout(() => {
        tip.classList.remove('show');
    }, 1500);
});

document.addEventListener('copy', function (e) {
    e.preventDefault();
    alert('You cannot copy content of this page');
});

document.addEventListener('click', function (e) {
    const tip = document.getElementById('right-click-tip');
    if (!tip.contains(e.target)) {
        clearTimeout(tip.timer);
        tip.classList.remove('show');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const title = link.getAttribute('title');
        if (title) {
            const tooltip = document.createElement('div');
            tooltip.classList.add('custom-tooltip');
            tooltip.textContent = title;
            link.addEventListener('mouseover', () => {
                document.body.appendChild(tooltip);
                const rect = link.getBoundingClientRect();
                tooltip.style.left = rect.left + 'px';
                tooltip.style.top = rect.bottom + 'px';
                tooltip.style.display = 'block';
            });
            link.addEventListener('mouseout', () => {
                tooltip.style.display = 'none';
                document.body.removeChild(tooltip);
            });
        }
    });
    initializeClickSort(); // 新增此行
});

document.addEventListener('selectstart', function (e) {
    e.preventDefault();
});

// 侧边栏控制按钮点击事件
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
    mainContent.classList.toggle('full-width');
});

// 页面加载时处理移动端适配
window.addEventListener('load', handleMobileResize);
// 窗口大小改变时处理移动端适配
window.addEventListener('resize', handleMobileResize);



function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    sidebar.classList.toggle('hidden');

    // 调整侧边栏隐藏按钮的位置
    if (sidebar.classList.contains('hidden')) {
        sidebarToggle.style.left = '10px';
    } else {
        sidebarToggle.style.left = '260px';
    }

    // 调整主内容区的样式
    const mainContent = document.querySelector('.main-content');
    mainContent.classList.toggle('full-width');
}
