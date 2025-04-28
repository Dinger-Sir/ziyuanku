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
        'c-section-sub17', 'c-section-sub18'
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
});

document.addEventListener('selectstart', function (e) {
    e.preventDefault();
});
