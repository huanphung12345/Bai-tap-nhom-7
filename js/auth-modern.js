/**
 * 🏋️ FitTrack - Auth Module (Modern ES6)
 * Manages authentication, session, and user roles
 */

class AuthManager {
    constructor() {
        this.SESSION_KEY = 'fittrack_session';
        this.USERS_KEY = 'fittrack_users';
        this.listeners = [];
    }

    /**
     * Subscribe to auth changes
     */
    onChange(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    /**
     * Notify all listeners of auth changes
     */
    notify() {
        this.listeners.forEach(cb => cb(this.getSession()));
    }

    /**
     * Get current session
     */
    getSession() {
        const data = localStorage.getItem(this.SESSION_KEY) || sessionStorage.getItem(this.SESSION_KEY);
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('Invalid session data:', e);
            return null;
        }
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return this.getSession() !== null;
    }

    /**
     * Get current user role
     */
    getRole() {
        const session = this.getSession();
        return session ? session.role : null;
    }

    /**
     * Check if user is admin
     */
    isAdmin() {
        return this.getRole() === 'admin';
    }

    /**
     * Check if user is customer
     */
    isCustomer() {
        return this.getRole() === 'customer';
    }

    /**
     * Get current user ID
     */
    getUserId() {
        const session = this.getSession();
        return session ? session.id : null;
    }

    /**
     * Get current user info
     */
    getUser() {
        return this.getSession();
    }

    /**
     * Login user
     */
    login(user, rememberMe = false) {
        if (!user || !user.id) {
            throw new Error('Invalid user object');
        }

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(this.SESSION_KEY, JSON.stringify(user));
        this.notify();
        return user;
    }

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem(this.SESSION_KEY);
        sessionStorage.removeItem(this.SESSION_KEY);
        this.notify();
    }

    /**
     * Check access rights
     */
    hasAccess(requiredRole) {
        if (!this.isLoggedIn()) return false;
        if (requiredRole === 'admin') return this.isAdmin();
        if (requiredRole === 'customer') return this.isCustomer();
        return true;
    }
}

export const Auth = new AuthManager();
