import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alerts';
import { ds, renderLoader, clearLoader } from './base';

// Check which platforms to search based on toggles in DOM
export const getPlatforms = () => {
    const soundcloud = document.getElementById('scCheck').checked;
    const spotify = document.getElementById('syCheck').checked;
    const youtube = document.getElementById('ytCheck').checked;
    const discogs = document.getElementById('dgCheck').checked;
    let searchPlatforms = { soundcloud, spotify, youtube, discogs };

    // Filter searchPlatforms object and return an array containing platform names to be searched
    searchPlatforms = Object.keys(searchPlatforms).filter((el) => {
        return searchPlatforms[el] !== false;
    });

    return searchPlatforms;
};

export const submitSearch = async (type, searchData) => {
    let url = '/api/v1/search/results';

    let params =
        type === 'basic'
            ? (params = `searchString/${searchData.searchString}`)
            : (params = `track/${searchData.track}/artist/${searchData.artist}`);

    try {
        const res = await axios({
            method: 'POST',
            url: `${url}/${params}`,
            data: {
                searchData
            }
        });

        if (res.data.status === 'success') {
            clearLoader();
            renderLoader(ds.body);
            location.assign(
                `${url}/${params}`
            );
        }
    } catch (err) {
        console.log('error', err.response.data.message);
        showAlert('error', err.response.data.message);
    }
};
