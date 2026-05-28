/**
 * 🏋️ FitTrack - Main Application Module
 * Modern ES6 module for page initialization and management
 */

import { Auth } from './auth-modern.js';
import { API } from './api-modern.js';
import Utils from './utils-modern.js';
import Validator from './validation.js';
import DOMHelper from './dom-helper.js';
import { LocalStorage } from './storage.js';

class FitTrackApp {
    constructor() {
        this.state = {
            workouts: [],
            exercises: [],
            filtered: [],
            loading: false,
            currentUser: null
        };
        this.init();
    }

    /**
     * Initialize application
     */
    async init() {
        try {
            await this.setupAuth();
            await this.loadData();
            this.setupEventListeners();
            this.render();
        } catch (error) {
            console.error('App initialization error:', error);
            this.showError('Lỗi khởi tạo ứng dụng');
        }
    }

    /**
     * Setup authentication
     */
    async setupAuth() {
        const user = Auth.getUser();
        this.state.currentUser = user;

        if (!user) {
            // Redirect to login if needed
            console.warn('No user logged in');
            return;
        }

        // Subscribe to auth changes
        Auth.onChange((session) => {
            this.state.currentUser = session;
            this.updateUserUI();
        });

        this.updateUserUI();
    }

    /**
     * Load data from API
     */
    async loadData() {
        this.showLoading(true);
        try {
            const [workouts, exercises] = await Promise.all([
                API.workouts.getAll(),
                API.exercises.getAll()
            ]);

            this.state.workouts = (workouts || []).sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );
            this.state.exercises = exercises || [];
            this.state.filtered = [...this.state.workouts];
        } catch (error) {
            console.error('Data loading error:', error);
            this.showError('Không thể tải dữ liệu từ máy chủ');
            // Load from cache if available
            this.loadFromCache();
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Load from LocalStorage cache
     */
    loadFromCache() {
        try {
            const cached = LocalStorage.get('workouts');
            if (cached) {
                this.state.workouts = cached;
                this.state.filtered = [...cached];
            }
        } catch (error) {
            console.error('Cache loading error:', error);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Logout button
        const logoutBtn = DOMHelper.select('[data-action="logout"]');
        if (logoutBtn) {
            DOMHelper.on(logoutBtn, 'click', () => this.logout());
        }

        // Search/filter
        const searchInput = DOMHelper.select('#searchWorkout');
        if (searchInput) {
            DOMHelper.on(searchInput, 'input', Utils.debounce((e) => {
                this.filterWorkouts(e.target.value);
            }, 300));
        }

        // Admin link
        const adminLink = DOMHelper.select('[href="admin.html"]');
        if (adminLink && !Auth.isAdmin()) {
            DOMHelper.hide(adminLink);
        }
    }

    /**
     * Filter workouts
     */
    filterWorkouts(query) {
        const q = (query || '').toLowerCase().trim();
        if (!q) {
            this.state.filtered = [...this.state.workouts];
        } else {
            this.state.filtered = this.state.workouts.filter(w =>
                (w.name || '').toLowerCase().includes(q) ||
                (w.muscleGroup || '').toLowerCase().includes(q)
            );
        }
        this.render();
    }

    /**
     * Update user UI
     */
    updateUserUI() {
        const user = this.state.currentUser;
        if (!user) return;

        const banner = DOMHelper.select('.welcome-banner');
        if (banner) {
            const avatar = banner.querySelector('.welcome-avatar');
            const name = banner.querySelector('.user-name');
            const role = banner.querySelector('.user-role');

            if (avatar) avatar.textContent = user.name?.charAt(0) || '?';
            if (name) name.textContent = user.name || 'User';
            if (role) {
                role.className = `role-badge role-badge-${user.role}`;
                role.textContent = user.role === 'admin' ? 'Admin' : 'User';
            }
        }
    }

    /**
     * Render dashboard and lists
     */
    render() {
        this.renderDashboard();
        this.renderWorkoutList();
    }

    /**
     * Render dashboard statistics
     */
    renderDashboard() {
        const workouts = this.state.workouts;
        if (!workouts.length) return;

        // Total workouts
        const totalEl = DOMHelper.select('[data-stat="total"]');
        if (totalEl) DOMHelper.setText(totalEl, workouts.length);

        // Streak
        const streak = Utils.calcStreak(workouts);
        const streakEl = DOMHelper.select('[data-stat="streak"]');
        if (streakEl) DOMHelper.setText(streakEl, streak);

        // Total calories
        const totalCal = workouts.reduce((sum, w) => sum + (parseFloat(w.totalCalories) || 0), 0);
        const calEl = DOMHelper.select('[data-stat="calories"]');
        if (calEl) DOMHelper.setText(calEl, Utils.formatNumber(Math.round(totalCal)));
    }

    /**
     * Render workout list
     */
    renderWorkoutList() {
        const listEl = DOMHelper.select('#workoutList');
        if (!listEl) return;

        if (this.state.filtered.length === 0) {
            DOMHelper.setHTML(listEl, `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-inbox display-4 text-secondary"></i>
                    <h5 class="mt-3 text-secondary">Chưa có buổi tập nào</h5>
                    <p class="text-muted">Hãy thêm một buổi tập mới để bắt đầu!</p>
                </div>
            `);
            return;
        }

        const html = this.state.filtered.map(w => this.renderWorkoutCard(w)).join('');
        DOMHelper.setHTML(listEl, html);
    }

    /**
     * Render single workout card
     */
    renderWorkoutCard(workout) {
        const date = Utils.formatDate(workout.date);
        const relative = Utils.relativeTime(workout.date);
        const color = Utils.getMuscleColor(workout.muscleGroup);
        const icon = Utils.getMuscleIcon(workout.muscleGroup);
        const cal = Utils.formatNumber(Math.round(workout.totalCalories || 0));

        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm hover-shadow-lg transition">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h6 class="card-title mb-1">${Validator.sanitize(workout.name)}</h6>
                                <small class="text-muted">${date}</small>
                                <br>
                                <small class="text-secondary">${relative}</small>
                            </div>
                            <span class="badge" style="background-color: ${color}">
                                <i class="bi ${icon}"></i>
                            </span>
                        </div>
                        <div class="workout-meta">
                            <div class="meta-item">
                                <small class="text-muted">Nhóm cơ:</small>
                                <p class="mb-0">${Validator.sanitize(workout.muscleGroup)}</p>
                            </div>
                            <div class="meta-item mt-2">
                                <small class="text-muted">Calo:</small>
                                <p class="mb-0 fw-bold">${cal} kcal</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Show loading state
     */
    showLoading(show) {
        const overlay = DOMHelper.byId('pageLoadingOverlay');
        if (overlay) {
            if (show) {
                DOMHelper.show(overlay);
            } else {
                DOMHelper.hide(overlay);
            }
        }
        this.state.loading = show;
    }

    /**
     * Show error message
     */
    showError(message) {
        Utils.showToast('Lỗi', message, 'error');
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        Utils.showToast('Thành công', message, 'success');
    }

    /**
     * Logout
     */
    logout() {
        if (confirm('Bạn có chắc muốn đăng xuất?')) {
            Auth.logout();
            window.location.href = 'login.html';
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new FitTrackApp();
    });
} else {
    window.app = new FitTrackApp();
}

export default FitTrackApp;
