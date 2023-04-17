function toggleSublist(menuId) {
    var sublist = document.getElementById(menuId).querySelector('.sidebar__menu-item__list');
    var icon = document.getElementById('icons-' + menuId);
    var menuItem = document.getElementById(menuId);
    var activeMenuItem = document.querySelector('.sidebar__menu-item.active');
    var activeSublist = document.querySelector('.sidebar__menu-item.active .sidebar__menu-item__list');

    if (sublist.style.display === 'none') {
        // Collapse the previously active submenu
        if (activeMenuItem && activeSublist && activeMenuItem !== menuItem) {
            activeSublist.style.display = 'none';
            activeMenuItem.classList.remove('active');
            document.getElementById('icons-' + activeMenuItem.id).classList.remove('fa-chevron-down');
            document.getElementById('icons-' + activeMenuItem.id).classList.add('fa-chevron-right');
        }
        // Expand the clicked submenu
        sublist.style.display = 'block';
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-down');
        menuItem.classList.add('active');
    } else {
        // Collapse the clicked submenu
        sublist.style.display = 'none';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-right');
        menuItem.classList.remove('active');
    }
}


function spreadOut() {
    const userItemDots = document.querySelectorAll('.user__item-dot');
    let scale = 0;
    userItemDots.forEach((itemDot, index) => {
        itemDot.style.transform = `scale(${index === 0 ? 1 : scale})`;
        scale += 1;
    });
    setTimeout(() => {
        userItemDots.forEach(itemDot => {
            itemDot.style.transform = 'scale(0)';
        });
    }, 500);
}
spreadOut();
setInterval(spreadOut, 3000);