const axios = require("axios");

const setLog = async (logData) => {
    const baseUrl = process.env.LOGGER_URI;
    try {
        // Ensure logData contains level and message
        console.log(logData)
        if (!logData.level || !logData.message) {
            throw new Error('Level and message are required');
        }
        
        const saveLog = await axios.post(baseUrl, logData);
        console.log('Log saved successfully:', saveLog.data);
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error logging data:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up request:', error.message);
        }
        console.error('Config:', error.config);
    }
};

module.exports = { setLog };
