export const ds = {
    body: document.querySelector('body'),

    /**** SEARCH ****/
    searchBasic: document.querySelector('.search__basic'),
    searchInput: document.getElementById('searchField'),
    searchInputTrack: document.getElementById('searchFieldTrack'),
    searchInputArtist: document.getElementById('searchFieldArtist'),
    searchForm: document.querySelector('.search__form'),
    searchBtn: document.querySelector('.search__btn'),
    searchBtnStandard: document.getElementById('searchBtnStandard'),
    searchBtnAdvanced: document.getElementById('searchBtnAdvanced'),
    searchOptions: document.querySelector('.search__options'),
    searchAdvanced: document.querySelector('.search__advanced'),
    searchAdvancedInputs: document.querySelector('.search__advanced-inputs'),
    searchPlatforms: document.querySelector('.search__toggle-platforms'),
    searchClose: document.querySelector('.search__close'),
    searchLabel: document.querySelector('.search__label'),
    searchLabels: document.querySelectorAll('.search__label'),
    searchProvider: document.querySelector('.search__provider'),
    searchProviders: document.querySelectorAll('.search__provider'),
    searchProviderIcon: document.querySelector('.search__option-icon'),
    searchProviderIcons: document.querySelectorAll('.search__option-icon'),

    /**** SPOTIFY ****/
    // IDs
    spotifyAuth: document.getElementById('spotify__auth'),
    spotifyRefreshToken: document.getElementById('obtain-new-token'),
    spotifyLikes: document.querySelectorAll('.spotify__like'),
    spotifyLike: document.querySelector('.spotify__like')
};

// Loader functions
export const renderLoader = (parent) => {
    const loader = `
    <div class="loader">
        <h3 class="loader__text">Cooking up some results!</h3>
        <div class="loader__img-wrapper">
            <img src="/img/pie3.gif" alt="loading results...">
        </div>
    </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector('.loader');
    if (loader) loader.parentElement.removeChild(loader);
};
