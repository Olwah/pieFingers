/* eslint-disable */
import { ds } from './base';
import { toggleAdvancedInputs, searchOpsAppear } from './searchView';
import { getPlatforms, submitSearch } from './search';
import { submitAction } from './spotify';
import { showAlert } from './alerts';

// Search section event listeners
if (ds.searchClose && ds.searchPlatforms) {
    [ds.searchClose, ds.searchPlatforms].forEach((el) =>
        el.addEventListener('click', searchOpsAppear)
    );
    ds.searchAdvanced.addEventListener('click', toggleAdvancedInputs);
}

// Initiate basic search
if (ds.searchBtn) {
    ds.searchBtn.addEventListener('click', () => {
        const type = 'basic';
        const searchString = ds.searchInput.value;
        const searchPlatforms = getPlatforms(); // Retrieve which platforms to search
        const searchData = { searchPlatforms, searchString };
        submitSearch(type, searchData);
    });
}

// Initiate advanced search
if (ds.searchBtnAdvanced) {
    ds.searchBtnAdvanced.addEventListener('click', () => {
        const type = 'advanced';
        const track = ds.searchInputTrack.value;
        const artist = ds.searchInputArtist.value;
        const searchPlatforms = getPlatforms();
        const searchData = { searchPlatforms, track, artist };
        submitSearch(type, searchData);
    });
}

/**** SPOTIFY ACTIONS *****/
if (ds.spotifyLike) {
    ds.spotifyLikes.forEach(el => {
        el.addEventListener('click', (e) => {
            const trackId = e.target.closest('svg').dataset.spotifyTrackId;
            submitAction(trackId);
        })
    })
}

// Alerts for user
const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 15);
