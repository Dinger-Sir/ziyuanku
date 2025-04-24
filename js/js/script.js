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
    const validSections = ['home', 'a-section', 'b-section', 'c-section', 'd-section'];
    
    // 判断是否有效hash
    if (validSections.includes(currentHash)) {
        switchSection(currentHash);
    } else {
        // 默认显示第一个有效版块（可选）
        switchSection(validSections[0]); 
    }
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

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    window.scrollTo(0, 0); // 强制回到顶部
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