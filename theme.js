(function () {
    'use strict';

    const storageKey = 'theme';
    const systemTheme = window.matchMedia('(prefers-color-scheme: light)');
    let savedTheme = null;
    let transitionTimeout;

    try {
        savedTheme = localStorage.getItem(storageKey);
        if (savedTheme === null) {
            // Preserve preferences saved under the previous key.
            savedTheme = localStorage.getItem('calder-theme');
            if (savedTheme !== null) {
                localStorage.setItem(storageKey, savedTheme);
                localStorage.removeItem('calder-theme');
            }
        }
    } catch (error) {
        // The switch still works when browser storage is unavailable.
    }

    function applyTheme(animate = false) {
        const theme = savedTheme === 'light' || savedTheme === 'dark'
            ? savedTheme
            : (systemTheme.matches ? 'light' : 'dark');
        const root = document.documentElement;

        if (animate && root.dataset.theme !== theme) {
            root.classList.add('theme-changing');
            clearTimeout(transitionTimeout);
            const duration = parseFloat(getComputedStyle(root).getPropertyValue('--theme-transition-duration'));
            transitionTimeout = setTimeout(function () {
                root.classList.remove('theme-changing');
            }, duration + 50);
        }

        root.dataset.theme = theme;
        document.querySelectorAll('.theme-switcher').forEach(function (button) {
            button.setAttribute('aria-pressed', String(theme === 'dark'));
        });
    }

    // Run in the head, before styles load, to avoid flashing the wrong theme.
    applyTheme();

    function addThemeSwitcher() {
        const switcher = document.createElement('button');
        switcher.className = 'theme-switcher';
        switcher.type = 'button';
        switcher.setAttribute('aria-label', 'Dark mode');
        switcher.setAttribute('aria-pressed', 'false');

        switcher.innerHTML = `
            <span class="theme-icon theme-icon--sun" aria-hidden="true">&#x2299;</span>
            <span class="theme-icon theme-switcher__slash" aria-hidden="true">&#x2215;</span>
            <span class="theme-icon theme-icon--moon" aria-hidden="true">&#x263E;</span>
        `;

        switcher.addEventListener('click', function () {
            savedTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            applyTheme(true);
            try {
                localStorage.setItem(storageKey, savedTheme);
            } catch (error) {
                // Keep the current page usable without persistent storage.
            }
        });

        const toolbar = document.querySelector('.site-header .site-links');
        (toolbar || document.body).appendChild(switcher);
        applyTheme();
    }

    document.addEventListener('DOMContentLoaded', addThemeSwitcher);
    systemTheme.addEventListener('change', function () {
        applyTheme(true);
    });
    window.addEventListener('storage', function (event) {
        if (event.key === storageKey || event.key === null) {
            savedTheme = event.key === null ? null : event.newValue;
            applyTheme(true);
        }
    });
})();
