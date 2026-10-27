(function() {
    'use strict';

    function addOverlayProtection() {
        const style = document.createElement('style');
        style.textContent = `
            .photo, .pane, .product-card, .panel-image {
                position: relative;
            }
            .photo::after, .pane::after, .product-card::after, .panel-image::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 999;
                background: transparent;
                pointer-events: auto;
                cursor: default;
            }
            .photo img, .pane img, .product-image, .panel-image img {
                pointer-events: none;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
        `;
        document.head.appendChild(style);
    }

    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'IMG' || 
            e.target.closest('.photo') || 
            e.target.closest('.pane') ||
            e.target.closest('.product-card') ||
            e.target.closest('.panel-image')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG' || 
            e.target.closest('.photo') ||
            e.target.closest('.pane') ||
            e.target.closest('.product-card') ||
            e.target.closest('.panel-image')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    document.addEventListener('copy', function(e) {
        if (window.getSelection().toString().length > 0) {
            e.preventDefault();
            return false;
        }
    });

    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            return false;
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            return false;
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            return false;
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            return false;
        }
        if (e.key === 'F12' || 
            ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') ||
            ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C')) {
            e.preventDefault();
            return false;
        }
        if (e.key === 'PrintScreen' || 
            (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4'))) {
            e.preventDefault();
            return false;
        }
    });

    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName === 'IMG' || 
            e.target.closest('.photo') ||
            e.target.closest('.pane') ||
            e.target.closest('.product-card') ||
            e.target.closest('.panel-image')) {
            e.preventDefault();
            return false;
        }
    });

    document.addEventListener('mousedown', function(e) {
        if (e.target.tagName === 'IMG' || 
            e.target.closest('.photo') ||
            e.target.closest('.pane') ||
            e.target.closest('.product-card') ||
            e.target.closest('.panel-image')) {
            if (e.button === 1 || e.button === 2) {
                e.preventDefault();
                return false;
            }
        }
    });


    document.addEventListener('DOMContentLoaded', function() {
        const images = document.querySelectorAll('img');
        images.forEach(function(img) {
            img.onerror = function() {
                this.style.display = 'none';
            };
            
            Object.defineProperty(img, 'src', {
                get: function() {
                    return this.getAttribute('src');
                },
                set: function(value) {
                    this.setAttribute('src', value);
                }
            });
        });
    });

    addOverlayProtection();
    console.log('%cStop!', 'color: red; font-size: 50px; font-weight: bold;');
    console.log('%cThis is a browser feature intended for developers. Do not paste any code here.', 'color: red; font-size: 16px;');
})();

