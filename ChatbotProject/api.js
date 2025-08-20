// api.js
// CORREGIDO PARA USAR NOMBRES DE ARCHIVO EN SINGULAR

const axios = require('axios');

// Ruta de la API
const API_URL = 'http://localhost/ChatbotProject/ajax/Apis/';

/**
 * Llama a la API para obtener o crear un usuario.
 */
async function getUser(telefono) {
    try {
        const response = await axios.post(API_URL + 'candidate.php', {
            action: 'getUser',
            telefono: telefono
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener usuario:', error.response?.data || error.message);
        return null;
    }
}

/**
 * Actualiza el estado de un usuario.
 */
async function updateUserState(id_usuario, estado) {
    try {
        const response = await axios.post(API_URL + 'candidate.php', {
            action: 'updateState',
            id_usuario: id_usuario,
            estado: estado
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el estado del usuario:', error.response?.data || error.message);
        return null;
    }
}

async function getProductByPayload(payload) {
    try {
        const response = await axios.post(API_URL + 'flow.php', {
            action: 'getByPayload',
            payload: payload
        });
        return response.data;
    } catch (error) {
        if (error.response?.status !== 404) {
            console.error('Error al obtener producto por payload:', error.response?.data || error.message);
        }
        return null;
    }
}

module.exports = {
    getUser,
    updateUserState,
    getProductByPayload,
};
