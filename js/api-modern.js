/**
 * 🏋️ FitTrack - API Module (Modern ES6 with Fetch)
 * Handles all API requests with error handling and retry logic
 */

class APIClient {
    constructor(baseURL = 'https://69e9c8b215c7e2d51268b6cb.mockapi.io/api/v1/') {
        this.baseURL = baseURL;
        this.timeout = 10000;
        this.retries = 2;
    }

    /**
     * Sanitize and validate URL
     */
    validateURL(url) {
        try {
            new URL(url);
            return url;
        } catch (e) {
            throw new Error(`Invalid URL: ${url}`);
        }
    }

    /**
     * Make HTTP request with retry logic
     */
    async request(endpoint, options = {}) {
        const {
            method = 'GET',
            body = null,
            headers = {},
            retry = 0
        } = options;

        const url = this.validateURL(`${this.baseURL}${endpoint}`);
        const requestOptions = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            signal: AbortSignal.timeout(this.timeout)
        };

        if (body && (method === 'POST' || method === 'PUT')) {
            requestOptions.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            if (retry < this.retries) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (retry + 1)));
                return this.request(endpoint, { ...options, retry: retry + 1 });
            }
            console.error(`[API ${method}] ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * Workouts endpoints
     */
    workouts = {
        getAll: () => this.request('workouts'),
        getById: (id) => this.request(`workouts/${id}`),
        create: (data) => this.request('workouts', { method: 'POST', body: data }),
        update: (id, data) => this.request(`workouts/${id}`, { method: 'PUT', body: data }),
        delete: (id) => this.request(`workouts/${id}`, { method: 'DELETE' })
    };

    /**
     * Exercises endpoints
     */
    exercises = {
        getAll: () => this.request('exercises'),
        getById: (id) => this.request(`exercises/${id}`),
        create: (data) => this.request('exercises', { method: 'POST', body: data }),
        update: (id, data) => this.request(`exercises/${id}`, { method: 'PUT', body: data }),
        delete: (id) => this.request(`exercises/${id}`, { method: 'DELETE' })
    };

    /**
     * Users endpoints
     */
    users = {
        getAll: () => this.request('users', { baseURL: 'https://6a06ddebc83ba8ad9b3e0758.mockapi.io/' }),
        getById: (id) => this.request(`users/${id}`, { baseURL: 'https://6a06ddebc83ba8ad9b3e0758.mockapi.io/' }),
        create: (data) => this.request('users', { method: 'POST', body: data, baseURL: 'https://6a06ddebc83ba8ad9b3e0758.mockapi.io/' }),
        update: (id, data) => this.request(`users/${id}`, { method: 'PUT', body: data, baseURL: 'https://6a06ddebc83ba8ad9b3e0758.mockapi.io/' }),
        delete: (id) => this.request(`users/${id}`, { method: 'DELETE', baseURL: 'https://6a06ddebc83ba8ad9b3e0758.mockapi.io/' })
    };
}

export const API = new APIClient();
