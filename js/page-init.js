const PageInit = (() => {
    function init() {
        const page = document.body.dataset.page || '';

        if (page === 'index') {
            if (!Auth.requireLogin()) return;
            Auth.applyPermissions();
            showWelcomeBanner();
        }

        if (page === 'admin') {
            if (!Auth.isLoggedIn()) {
                window.location.href = 'login.html';
                return;
            }
            if (!Auth.isAdmin()) {
                showAdminAccessDenied();
                return;
            }
            Auth.applyPermissions();
        }
    }

    function showWelcomeBanner() {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const container = document.getElementById('welcomeBannerContainer');
        if (!container) return;

        const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
        const roleBadge = user.role === 'admin'
            ? '<span class="role-badge-admin"><i class="bi bi-shield-check me-1"></i>Admin</span>'
            : '<span class="role-badge-customer"><i class="bi bi-person-check me-1"></i>Khách hàng</span>';

        const now = new Date();
        const hour = now.getHours();
        let greeting = 'Chào buổi sáng';
        if (hour >= 12 && hour < 18) greeting = 'Chào buổi chiều';
        else if (hour >= 18) greeting = 'Chào buổi tối';

        container.innerHTML = `
            <div class="welcome-banner">
                <div class="welcome-text">
                    <div class="welcome-avatar">${initial}</div>
                    <div>
                        <div class="fw-bold">${greeting}, ${user.name}! 💪</div>
                        <small class="text-muted">${user.email}</small>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    ${roleBadge}
                    <button class="btn btn-outline-danger btn-sm" onclick="Auth.logout()">
                        <i class="bi bi-box-arrow-right me-1"></i>Đăng xuất
                    </button>
                </div>
            </div>
        `;
    }

    function showAdminAccessDenied() {
        const accessDenied = document.getElementById('accessDenied');
        if (!accessDenied) {
            window.location.href = 'index.html';
            return;
        }
        accessDenied.classList.remove('d-none');
        document.querySelectorAll('nav, main, .toast-container, .modal').forEach(el => {
            el.style.display = 'none';
        });
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', PageInit.init);
