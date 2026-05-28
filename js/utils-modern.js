/**
 * 🏋️ FitTrack - Utils Module (Modern ES6)
 * Utility functions for formatting, calculations, and DOM manipulation
 */

class Utils {
    /**
     * Format date to Vietnamese locale
     */
    static formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        return d.toLocaleDateString('vi-VN', {
            weekday: 'short',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    /**
     * Format date for input field (YYYY-MM-DD)
     */
    static formatDateInput(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return isNaN(d) ? dateStr : d.toISOString().split('T')[0];
    }

    /**
     * Get relative time (e.g., "2 days ago")
     */
    static relativeTime(dateStr) {
        const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
        if (diff === 0) return 'Hôm nay';
        if (diff === 1) return 'Hôm qua';
        if (diff < 7) return `${diff} ngày trước`;
        if (diff < 30) return `${Math.floor(diff / 7)} tuần trước`;
        return `${Math.floor(diff / 30)} tháng trước`;
    }

    /**
     * Calculate calories (sets × calories per set)
     */
    static calcCalories(sets, calPerSet) {
        return (parseInt(sets) || 0) * (parseFloat(calPerSet) || 0);
    }

    /**
     * Calculate total calories from exercises
     */
    static calcTotalCalories(exercises = []) {
        return exercises.reduce((sum, e) => sum + this.calcCalories(e.sets, e.caloriesPerSet), 0);
    }

    /**
     * Calculate workout streak
     */
    static calcStreak(workouts) {
        if (!workouts || workouts.length === 0) return 0;

        const dates = [...new Set(
            workouts.map(w => new Date(w.date).toDateString())
        )].sort((a, b) => new Date(b) - new Date(a));

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < dates.length; i++) {
            const check = new Date(today);
            check.setDate(check.getDate() - i);
            if (dates.includes(check.toDateString())) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    /**
     * Group workouts by week
     */
    static groupByWeek(workouts, field) {
        const result = [];
        for (let i = 7; i >= 0; i--) {
            const label = i === 0 ? 'Tuần này' : `T-${i}`;
            const fullLabel = i === 0 ? 'Tuần này' : `${i} tuần trước`;
            let value = 0;

            workouts.forEach(w => {
                const diff = Math.floor((Date.now() - new Date(w.date)) / 604800000);
                if (diff === i) value += parseFloat(w[field]) || 0;
            });

            result.push({ label, fullLabel, value });
        }
        return result;
    }

    /**
     * Group workouts by muscle group
     */
    static groupByMuscle(workouts) {
        const map = {};
        workouts.forEach(w => {
            const group = w.muscleGroup || 'Khác';
            map[group] = (map[group] || 0) + 1;
        });

        return Object.entries(map)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }

    /**
     * Group workouts by day of week
     */
    static groupByDayOfWeek(workouts) {
        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const counts = new Array(7).fill(0);

        workouts.forEach(w => {
            const d = new Date(w.date);
            if (!isNaN(d)) counts[d.getDay()]++;
        });

        return days.map((name, i) => ({ name, count: counts[i] }));
    }

    /**
     * Get color for muscle group
     */
    static getMuscleColor(group) {
        const colors = {
            'Ngực': '#E74C3C',
            'Lưng': '#3498DB',
            'Vai': '#9B59B6',
            'Tay trước': '#E67E22',
            'Tay sau': '#D35400',
            'Chân': '#27AE60',
            'Bụng': '#F39C12',
            'Cardio': '#1ABC9C',
            'Full Body': '#2C3E50'
        };
        return colors[group] || '#6C63FF';
    }

    /**
     * Get icon for muscle group
     */
    static getMuscleIcon(group) {
        const icons = {
            'Ngực': 'bi-heart-pulse',
            'Lưng': 'bi-arrow-left-right',
            'Vai': 'bi-arrows-angle-expand',
            'Tay trước': 'bi-lightning',
            'Tay sau': 'bi-lightning-fill',
            'Chân': 'bi-person-walking',
            'Bụng': 'bi-shield-check',
            'Cardio': 'bi-activity',
            'Full Body': 'bi-person-arms-up'
        };
        return icons[group] || 'bi-trophy';
    }

    /**
     * Format number to Vietnamese locale
     */
    static formatNumber(num) {
        return Number(num || 0).toLocaleString('vi-VN');
    }

    /**
     * Truncate string
     */
    static truncate(str, maxLength = 50) {
        if (!str) return '';
        return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
    }

    /**
     * Debounce function
     */
    static debounce(fn, delay = 300) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    }

    /**
     * Throttle function
     */
    static throttle(fn, delay = 300) {
        let lastCall = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                fn(...args);
            }
        };
    }

    /**
     * Show toast notification
     */
    static showToast(title, message, type = 'success') {
        const toastEl = document.getElementById('toastNotification');
        if (!toastEl) return;

        const icons = {
            success: 'bi-check-circle-fill text-success',
            error: 'bi-x-circle-fill text-danger',
            warning: 'bi-exclamation-triangle-fill text-warning',
            info: 'bi-info-circle-fill text-primary'
        };

        const titleEl = toastEl.querySelector('.toast-header strong');
        const bodyEl = toastEl.querySelector('.toast-body');
        const iconEl = toastEl.querySelector('.bi');

        if (titleEl) titleEl.textContent = title;
        if (bodyEl) bodyEl.textContent = message;
        if (iconEl) iconEl.className = `bi me-2 ${icons[type] || icons.info}`;

        const toast = new window.bootstrap.Toast(toastEl, { delay: 3500 });
        toast.show();
    }

    /**
     * Animate number counter
     */
    static animateNumber(selector, targetValue, duration = 900) {
        const element = document.querySelector(selector);
        if (!element) return;

        const steps = 36;
        const increment = targetValue / steps;
        let current = 0;

        const interval = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                current = targetValue;
                clearInterval(interval);
            }
            element.textContent = this.formatNumber(Math.round(current));
        }, duration / steps);
    }

    /**
     * Deep clone object
     */
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Check if object is empty
     */
    static isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    /**
     * Merge objects
     */
    static merge(target, source) {
        return { ...target, ...source };
    }
}

export default Utils;
