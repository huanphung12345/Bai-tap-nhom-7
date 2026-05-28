// ============================================
//  FITTRACK AUTH MODULE
//  Quản lý đăng nhập / đăng xuất / phân quyền
// ============================================

const Auth = (function () {
    const SESSION_KEY = 'fittrack_session';
    const USERS_KEY = 'fittrack_users';

    /**
     * Lấy session hiện tại
     */
    function getSession() {
        const data = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch {
            return null;
        }
    }

    /**
     * Kiểm tra đã đăng nhập chưa
     */
    function isLoggedIn() {
        return getSession() !== null;
    }

    /**
     * Lấy role hiện tại: 'admin' | 'customer' | null
     */
    function getRole() {
        const session = getSession();
        return session ? session.role : null;
    }

    /**
     * Kiểm tra có phải admin không
     */
    function isAdmin() {
        return getRole() === 'admin';
    }

    /**
     * Kiểm tra có phải customer không
     */
    function isCustomer() {
        return getRole() === 'customer';
    }

    /**
     * Lấy thông tin user hiện tại
     */
    function getCurrentUser() {
        return getSession();
    }

    /**
     * Đăng xuất
     */
    function logout() {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
        window.location.href = 'login.html';
    }

    /**
     * Yêu cầu đăng nhập - redirect nếu chưa login
     */
    function requireLogin() {
        if (!isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    /**
     * Yêu cầu quyền admin - redirect nếu không phải admin
     */
    function requireAdmin() {
        if (!isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        if (!isAdmin()) {
            alert('⛔ Bạn không có quyền truy cập trang này!');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }

    /**
     * Áp dụng phân quyền cho giao diện
     * - Ẩn các phần tử có class "admin-only" nếu không phải admin
     * - Ẩn các phần tử có class "customer-only" nếu không phải customer
     * - Hiện thông tin user trên navbar
     */
    function applyPermissions() {
        const session = getSession();
        if (!session) return;

        const role = session.role;

        // Ẩn phần tử admin-only nếu không phải admin
        document.querySelectorAll('.admin-only').forEach(el => {
            if (role !== 'admin') {
                el.style.display = 'none';
                el.classList.add('d-none');
            } else {
                el.style.display = '';
                el.classList.remove('d-none');
            }
        });

        // Ẩn phần tử customer-only nếu không phải customer
        document.querySelectorAll('.customer-only').forEach(el => {
            if (role !== 'customer') {
                el.style.display = 'none';
                el.classList.add('d-none');
            } else {
                el.style.display = '';
                el.classList.remove('d-none');
            }
        });

        // Cập nhật navbar user info
        updateNavbarUser(session);
    }

    /**
     * Cập nhật navbar hiển thị thông tin user
     */
    function updateNavbarUser(session) {
        const navUserArea = document.getElementById('navUserArea');
        if (!navUserArea) return;

        const roleBadge = session.role === 'admin'
            ? '<span class="badge bg-danger ms-1">Admin</span>'
            : '<span class="badge bg-success ms-1">Khách hàng</span>';

        const initial = session.name ? session.name.charAt(0).toUpperCase() : 'U';

        navUserArea.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center gap-2" 
                        type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <div class="user-avatar-sm">${initial}</div>
                    <span class="d-none d-md-inline">${session.name}</span>
                    ${roleBadge}
                </button>
                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark">
                    <li>
                        <div class="dropdown-item-text">
                            <div class="fw-bold">${session.name}</div>
                            <small class="text-muted">${session.email}</small>
                        </div>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                        <a class="dropdown-item" href="#" onclick="Auth.logout(); return false;">
                            <i class="bi bi-box-arrow-right me-2"></i>Đăng Xuất
                        </a>
                    </li>
                </ul>
            </div>
        `;
    }

    /**
     * Lấy tất cả users
     */
    function getAllUsers() {
        return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    }

    // Public API
    return {
        getSession,
        isLoggedIn,
        getRole,
        isAdmin,
        isCustomer,
        getCurrentUser,
        logout,
        requireLogin,
        requireAdmin,
        applyPermissions,
        getAllUsers
    };
})();