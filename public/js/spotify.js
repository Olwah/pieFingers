import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alerts';

export const submitAction = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/spotify/add-track-to-library',
            data: {
                data
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Track added to your library');
        }

    } catch (err) {
        console.log('error', err.response.data.message);
        showAlert('error', err.response.data.message);
    }
};