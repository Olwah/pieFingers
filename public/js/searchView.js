import { ds } from './base';

export const toggleAdvancedInputs = () => {
    ds.searchAdvancedInputs.classList.toggle('is-active');
    ds.searchBasic.classList.toggle('is-inactive');
    ds.searchAdvanced.classList.toggle('is-active');

    ds.searchAdvanced.textContent === '+'
        ? (ds.searchAdvanced.textContent = '-')
        : (ds.searchAdvanced.textContent = '+');

    ds.searchBtnStandard.classList.toggle('is-inactive');
    ds.searchBtnAdvanced.classList.toggle('is-active');
};

export const searchOpsAppear = () => {
    if (!ds.searchOptions.classList.contains('active')) {
        ds.searchPlatforms.classList.toggle('active');
        ds.searchPlatforms.classList.toggle('btn-scale');
        ds.searchPlatforms.textContent = 'Toggle Platforms:';
        setTimeout(() => {
            ds.searchOptions.classList.toggle('active');
        }, 500);
        setTimeout(() => {
            ds.searchClose.classList.toggle('active');
        }, 950);
    } else {
        ds.searchPlatforms.textContent = 'Toggle Platforms';
        ds.searchClose.classList.toggle('active');
        ds.searchOptions.classList.toggle('active');
        setTimeout(() => {
            ds.searchPlatforms.classList.toggle('active');
            setTimeout(
                () => ds.searchPlatforms.classList.toggle('btn-scale'),
                1000
            );
        }, 800);
    }
};
