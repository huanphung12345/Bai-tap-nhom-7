const STORAGE_USERS_KEY = 'fittrack_users';
const STORAGE_SESSION_KEY = 'fittrack_session';
const STORAGE_REMEMBER_KEY = 'fittrack_remember';

const DEFAULT_USERS = [
    { id: 1, name: 'Admin FitTrack', email: 'admin@fittrack.com', password: 'admin123', role: 'admin', adminCode: '', avatar: '', createdAt: new Date().toISOString() },
    { id: 2, name: 'Nguyễn Văn Khách', email: 'khach@fittrack.com', password: 'khach123', role: 'customer', avatar: '', createdAt: new Date().toISOString() },
    { id: 3, name: 'Trần Thị Lan', email: 'lan@fittrack.com', password: 'lan123', role: 'customer', avatar: '', createdAt: new Date().toISOString() }
];

function initUsers() {
    if (!localStorage.getItem(STORAGE_USERS_KEY)) {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS));
    }
}

function getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || '[]');
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

function checkExistingSession() {
    const storageValue = localStorage.getItem(STORAGE_SESSION_KEY) || sessionStorage.getItem(STORAGE_SESSION_KEY) || 'null';
    const session = JSON.parse(storageValue);
    if (session && session.email) {
        window.location.href = 'index.html';
        return;
    }
    const remembered = JSON.parse(localStorage.getItem(STORAGE_REMEMBER_KEY) || 'null');
    if (remembered) {
        document.getElementById('loginEmail').value = remembered.email;
        document.getElementById('rememberMe').checked = true;
    }
}

function setupEventListeners() {
    document.getElementById('tabLogin').addEventListener('click', () => switchTab('login'));
    document.getElementById('tabRegister').addEventListener('click', () => switchTab('register'));
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('regPassword').addEventListener('input', checkPasswordStrength);
    document.querySelectorAll('.input-group-custom input').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('input-error');
            const alert = document.getElementById('authAlert');
            if (alert.style.display === 'flex') hideAlert();
        });
    });
}

function switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const title = document.getElementById('formTitle');
    const subtitle = document.getElementById('formSubtitle');

    if (tab === 'login') {
        document.getElementById('tabLogin').classList.add('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        title.textContent = 'Chào mừng trở lại!';
        subtitle.textContent = 'Đăng nhập để tiếp tục hành trình tập luyện.';
    } else {
        document.getElementById('tabRegister').classList.add('active');
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        title.textContent = 'Tạo tài khoản mới';
        subtitle.textContent = 'Bắt đầu hành trình, xây cơ và nâng sức mạnh.';
    }
    hideAlert();
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;

    if (!email || !password) {
        showAlert('Vui lòng nhập đầy đủ thông tin!', 'danger');
        if (!email) document.getElementById('loginEmail').classList.add('input-error');
        if (!password) document.getElementById('loginPassword').classList.add('input-error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Email không hợp lệ!', 'danger');
        document.getElementById('loginEmail').classList.add('input-error');
        return;
    }

    const btn = document.getElementById('btnLogin');
    setButtonLoading(btn, 'Đang đăng nhập...');

    setTimeout(() => {
        const user = getUsers().find(u => u.email.toLowerCase() === email && u.password === password);
        if (!user) {
            const emailExists = getUsers().find(u => u.email.toLowerCase() === email);
            if (emailExists) {
                showAlert('Mật khẩu không chính xác!', 'danger');
                document.getElementById('loginPassword').classList.add('input-error');
            } else {
                showAlert('Tài khoản không tồn tại! Vui lòng đăng ký.', 'danger');
                document.getElementById('loginEmail').classList.add('input-error');
            }
            resetButton(btn, '<i class="bi bi-box-arrow-in-right me-2"></i>Đăng Nhập');
            return;
        }

        const session = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar || '',
            loginAt: new Date().toISOString()
        };

        if (remember) {
            localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
            localStorage.setItem(STORAGE_REMEMBER_KEY, JSON.stringify({ email: user.email }));
        } else {
            sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
            localStorage.removeItem(STORAGE_REMEMBER_KEY);
        }

        showAlert(`Đăng nhập thành công! Xin chào ${user.name}`, 'success');
        setTimeout(() => { window.location.href = 'index.html'; }, 1200);
    }, 900);
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const role = document.querySelector('.role-btn.active')?.dataset.role || 'customer';

    if (!name || !email || !password || !confirmPassword) {
        showAlert('Vui lòng nhập đầy đủ thông tin!', 'danger');
        if (!name) document.getElementById('regName').classList.add('input-error');
        if (!email) document.getElementById('regEmail').classList.add('input-error');
        if (!password) document.getElementById('regPassword').classList.add('input-error');
        if (!confirmPassword) document.getElementById('regConfirmPassword').classList.add('input-error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Email không hợp lệ!', 'danger');
        document.getElementById('regEmail').classList.add('input-error');
        return;
    }
    if (name.length < 2) {
        showAlert('Họ tên phải có ít nhất 2 ký tự!', 'danger');
        document.getElementById('regName').classList.add('input-error');
        return;
    }
    if (password.length < 6) {
        showAlert('Mật khẩu phải có ít nhất 6 ký tự!', 'danger');
        document.getElementById('regPassword').classList.add('input-error');
        return;
    }
    if (password !== confirmPassword) {
        showAlert('Mật khẩu xác nhận không khớp!', 'danger');
        document.getElementById('regConfirmPassword').classList.add('input-error');
        return;
    }

    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email)) {
        showAlert('Email này đã được đăng ký!', 'danger');
        document.getElementById('regEmail').classList.add('input-error');
        return;
    }

    const btn = document.getElementById('btnRegister');
    setButtonLoading(btn, 'Đang tạo tài khoản...');

    setTimeout(() => {
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            role,
            adminCode: document.getElementById('adminCode').value.trim(),
            avatar: '',
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        saveUsers(users);
        showAlert('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
        resetButton(btn, '<i class="bi bi-person-plus me-2"></i>Đăng Ký');
        setTimeout(() => {
            switchTab('login');
            document.getElementById('loginEmail').value = email;
            document.getElementById('loginPassword').focus();
        }, 900);
    }, 900);
}

function setButtonLoading(btn, text) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>${text}`;
}

function resetButton(btn, html) {
    btn.disabled = false;
    btn.innerHTML = html;
}

function selectRole(role, buttonElement) {
    document.querySelectorAll('.role-btn').forEach(r => r.classList.remove('active'));
    buttonElement.classList.add('active');
    const adminCodeGroup = document.getElementById('adminCodeGroup');
    if (role === 'admin') {
        adminCodeGroup.classList.remove('d-none');
        document.getElementById('adminCode').focus();
    } else {
        adminCodeGroup.classList.add('d-none');
        document.getElementById('adminCode').value = '';
    }
}

function checkPasswordStrength() {
    const password = document.getElementById('regPassword').value;
    const strengthDiv = document.getElementById('passwordStrength');
    const fill = document.getElementById('strengthFill');
    const text = document.getElementById('strengthText');

    if (!password) {
        strengthDiv.style.display = 'none';
        return;
    }
    strengthDiv.style.display = 'block';

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
        { width: '20%', color: '#ff4757', text: 'Rất yếu' },
        { width: '40%', color: '#ff6348', text: 'Yếu' },
        { width: '60%', color: '#ffb92e', text: 'Trung bình' },
        { width: '80%', color: '#2ed573', text: 'Mạnh' },
        { width: '100%', color: '#1dd1a1', text: 'Rất mạnh' }
    ];
    const level = levels[Math.min(score, 4)];
    fill.style.width = level.width;
    fill.style.background = level.color;
    text.textContent = `Độ mạnh: ${level.text}`;
    text.style.color = level.color;
}

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('bi-eye', 'bi-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('bi-eye-slash', 'bi-eye');
    }
}

function fillDemo(type) {
    switchTab('login');
    if (type === 'admin') {
        document.getElementById('loginEmail').value = 'admin@fittrack.com';
        document.getElementById('loginPassword').value = 'admin123';
    } else {
        document.getElementById('loginEmail').value = 'khach@fittrack.com';
        document.getElementById('loginPassword').value = 'khach123';
    }
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    showAlert(`Đã điền tài khoản ${type === 'admin' ? 'Admin' : 'Khách hàng'} demo`, 'info');
}

function showForgotPassword(event) {
    event.preventDefault();
    showAlert('Vui lòng liên hệ Admin để đặt lại mật khẩu: admin@fittrack.com', 'info');
}

function showAlert(message, type) {
    const alert = document.getElementById('authAlert');
    const icons = { danger: 'exclamation-triangle-fill', success: 'check-circle-fill', info: 'info-circle-fill' };
    alert.className = `auth-alert alert-${type}`;
    alert.innerHTML = `<i class="bi bi-${icons[type] || 'info-circle'}"></i><span>${message}</span>`;
    alert.style.display = 'flex';
    if (type !== 'danger') {
        clearTimeout(alert._hideTimeout);
        alert._hideTimeout = setTimeout(hideAlert, 7000);
    }
}

function hideAlert() {
    const alert = document.getElementById('authAlert');
    alert.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    initUsers();
    checkExistingSession();
    setupEventListeners();
});
