const researchProjects = [...document.querySelectorAll('.research-project')];
const researchLinks = [...document.querySelectorAll('.research-nav .project-link')];
const researchAreas = [...document.querySelectorAll('.research-area')];
const researchContent = document.querySelector('.research-layout main');
const projectPicker = document.querySelector('.project-picker');
const compactProjects = window.matchMedia('(max-width: 1024px)');
document.body.classList.add('research-reader');

function showProject(focusContent = false) {
    const target = document.getElementById(location.hash.slice(1));
    if (target === researchContent && focusContent) {
        researchContent.focus();
        return;
    }
    const requestedProject = target?.closest('.research-project')
        || (target?.classList.contains('research-area') && target.querySelector('.research-project'));
    const currentProject = requestedProject || researchProjects[0];

    for (const project of researchProjects) {
        project.hidden = project !== currentProject;
    }
    for (const area of researchAreas) {
        area.hidden = !area.contains(currentProject);
    }

    for (const link of researchLinks) {
        const isCurrent = link.hash === `#${currentProject.id}`;
        link.classList.toggle('is-current', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    }

    if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([currentProject]);
    const currentLink = researchLinks.find(link => link.classList.contains('is-current'));
    projectPicker.querySelector('.project-selection').textContent = currentLink.textContent;
    if (compactProjects.matches) projectPicker.open = false;
    if (focusContent) researchContent.focus({ preventScroll: true });
    requestAnimationFrame(() => window.scrollTo(0, 0));
}

window.addEventListener('hashchange', () => showProject(true));
for (const link of researchLinks) {
    link.addEventListener('click', event => {
        if (compactProjects.matches && link.hash === location.hash) {
            event.preventDefault();
            showProject(true);
        }
    });
}
showProject();

for (const versions of document.querySelectorAll('.audience-versions')) {
    const tablist = versions.querySelector('.audience-tabs');
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));

    function selectAudience(selectedTab) {
        tabs.forEach((tab, index) => {
            const selected = tab === selectedTab;
            tab.setAttribute('aria-selected', String(selected));
            tab.tabIndex = selected ? 0 : -1;
            panels[index].hidden = !selected;
        });
    }

    tabs.forEach((tab, index) => {
        panels[index].setAttribute('role', 'tabpanel');
        panels[index].setAttribute('aria-labelledby', tab.id);
        panels[index].tabIndex = 0;

        tab.addEventListener('click', () => selectAudience(tab));
        tab.addEventListener('keydown', event => {
            let nextIndex;
            if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
            else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
            else if (event.key === 'Home') nextIndex = 0;
            else if (event.key === 'End') nextIndex = tabs.length - 1;
            else return;

            event.preventDefault();
            selectAudience(tabs[nextIndex]);
            tabs[nextIndex].focus();
        });
    });

    selectAudience(tabs.find(tab => tab.getAttribute('aria-selected') === 'true') || tabs[0]);
    versions.classList.add('has-audience-tabs');
    tablist.hidden = false;
}
