(function () {
    'use strict';

    const compactLayout = window.matchMedia('(max-width: 1280px)');
    const compactProjects = window.matchMedia('(max-width: 1024px)');
    const header = document.querySelector('.site-header');
    const menuButton = header.querySelector('.site-menu-toggle');
    const projectPicker = document.querySelector('.project-picker');

    header.classList.add('has-menu');
    menuButton.hidden = false;

    function closeMenu(returnFocus = false) {
        menuButton.setAttribute('aria-expanded', 'false');
        if (returnFocus) menuButton.focus();
    }

    menuButton.addEventListener('click', function () {
        const expanded = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', String(!expanded));
        if (!expanded && compactProjects.matches && projectPicker) projectPicker.open = false;
    });

    if (projectPicker) {
        projectPicker.addEventListener('toggle', function () {
            if (compactProjects.matches && projectPicker.open) closeMenu();
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape' || !compactLayout.matches) return;
        if (menuButton.getAttribute('aria-expanded') === 'true') {
            closeMenu(true);
        } else if (compactProjects.matches && projectPicker?.open) {
            projectPicker.open = false;
            projectPicker.querySelector('summary').focus();
        }
    });

    function updateLayout() {
        const activeElement = document.activeElement;
        if (compactLayout.matches && header.querySelector('.site-links').contains(activeElement)) {
            menuButton.focus();
        } else if (!compactLayout.matches && activeElement === menuButton) {
            header.querySelector('.site-name').focus();
        }
        closeMenu();
        if (projectPicker) {
            projectPicker.open = !compactProjects.matches;
            if (compactProjects.matches && projectPicker.contains(activeElement)) {
                projectPicker.querySelector('summary').focus();
            } else if (!compactProjects.matches && activeElement === projectPicker.querySelector('summary')) {
                projectPicker.querySelector('[aria-current="location"]').focus();
            }
        }
    }

    compactLayout.addEventListener('change', updateLayout);
    compactProjects.addEventListener('change', updateLayout);
    updateLayout();
})();
