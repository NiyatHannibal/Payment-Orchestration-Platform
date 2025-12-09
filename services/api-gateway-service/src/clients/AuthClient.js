const axios = require('axios'); 
require('dotenv').config();

class AuthClient {
    constructor() {
        this.baseUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
    }

    async authorizePayment(token, paymentDetails) {
        try {
            const response = await axios.post(`${this.baseUrl}/v1/authorize`, paymentDetails, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Auth Service Error:', error.message);
            if (error.response) {
                throw new Error(`Auth Failed: ${error.response.data.message || error.response.statusText}`);
            }
            throw new Error('Auth Service Unreachable');
        }
    }

    // Placeholder for simple token verification if needed separately
    async verifyToken(token) {
        // Implementation for later
        return true;
    }
}

module.exports = new AuthClient();
