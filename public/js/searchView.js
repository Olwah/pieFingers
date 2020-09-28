const searchClose = document.querySelector('.search__close');
const searchOptions = document.querySelector('.search__options');
const searchSettings = document.querySelector('.search__advanced');
const searchLabel = document.querySelector('.search__label');
const searchLabels = document.querySelectorAll('.search__label');
const searchProvider = document.querySelector('.search__provider');
const searchProviders = document.querySelectorAll('.search__provider');
const searchProviderIcon = document.querySelector('.search__option-icon');
const searchProviderIcons = document.querySelectorAll('.search__option-icon');

const searchOpsAppear = () => {
    if (!searchOptions.classList.contains('active')) {
        searchSettings.classList.toggle('active');
        searchSettings.classList.toggle('btn-scale');
        searchSettings.textContent = 'Toggle Platforms:';
        setTimeout(() => {
            searchOptions.classList.toggle('active');
        }, 500);
        setTimeout(() => {
            searchClose.classList.toggle('active');
        }, 950);
    } else {
        searchSettings.textContent = 'Toggle Platforms';
        searchClose.classList.toggle('active');
        searchOptions.classList.toggle('active');
        setTimeout(() => {
            searchSettings.classList.toggle('active');
            setTimeout(() => searchSettings.classList.toggle('btn-scale'), 1000);
        }, 800);
    }
};

[searchClose, searchSettings].forEach((el) => el.addEventListener('click', searchOpsAppear));