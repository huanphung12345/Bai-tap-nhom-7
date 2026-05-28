# 🏋️ FitTrack - Nhật Ký Tập Luyện & Theo Dõi Tiến Độ

**Phiên bản**: Nhóm 7 — Frontend hiện đại (HTML/CSS/ES6 Modules)  
**Trạng thái**: ✅ Upgraded & Production-Ready

---

## 📋 Giới thiệu

Ứng dụng web hiện đại để ghi lại buổi tập, tính calo, phân tích BMI và hiển thị biểu đồ tiến độ. Dự án sử dụng:

- **Bootstrap 5** — Framework CSS responsive
- **ES6 Modules** — Modern JavaScript (không jQuery)
- **Fetch API** — HTTP requests thay vì jQuery AJAX
- **LocalStorage** — Lưu trữ dữ liệu offline
- **MockAPI** — API endpoints cho dữ liệu
- **ESLint** — Code quality validation

---

## 👥 Thành viên

- **Trần Minh Đức** — 1971020119
- **Phùng Mạnh Huấn** — 1971020194
- **Vừ Anh Sự** — 1971020543

---

## 📁 Cấu trúc dự án

```
FIT-DNU-FE-NHOM-7/
├── index.html              # Trang chính (Dashboard)
├── login.html              # Trang đăng nhập
├── admin.html              # Giao diện quản trị (chỉ admin)
├── .eslintrc.json          # Cấu hình ESLint
├── css/
│   ├── style.css           # Styles cơ bản
│   └── modern-styles.css   # Styles hiện đại & accessibility
├── js/
│   ├── auth-modern.js      # Authentication manager (ES6)
│   ├── api-modern.js       # API client với retry logic
│   ├── app.js              # Main application class
│   ├── utils-modern.js     # Utility functions
│   ├── validation.js       # Input validation & sanitization
│   ├── dom-helper.js       # DOM manipulation helpers
│   ├── storage.js          # Storage manager (localStorage/sessionStorage)
│   ├── auth.js             # Auth module (legacy, keep for compatibility)
│   ├── api.js              # API module (legacy, keep for compatibility)
│   ├── main.js             # Main logic (legacy)
│   ├── utils.js            # Utils (legacy)
│   └── ...                 # Các file khác
├── img/                    # Ảnh minh họa
└── README.md               # Tài liệu này
```

---

## 🚀 Hướng dẫn chạy

### Option 1: Mở trực tiếp trong trình duyệt

```bash
# Nhấp đôi vào index.html hoặc kéo vào trình duyệt
```

### Option 2: Chạy HTTP Server (Recommended)

```bash
cd FIT-DNU-FE-NHOM-7
python3 -m http.server 8000
# Truy cập: http://localhost:8000
```

### Option 3: Chạy với Node.js

```bash
# Cài đặt http-server
npm install -g http-server

# Chạy server
http-server -p 8000
# Truy cập: http://localhost:8000
```

---

## 🔑 Test Tài khoản

Mở **DevTools → Console** và chạy:

### Admin Account

```javascript
localStorage.setItem(
  "fittrack_session",
  JSON.stringify({
    id: "u1",
    name: "Admin Người Dùng",
    email: "admin@example.com",
    role: "admin",
  }),
);
location.reload();
```

### Customer Account

```javascript
localStorage.setItem(
  "fittrack_session",
  JSON.stringify({
    id: "u2",
    name: "Khách Hàng",
    email: "customer@example.com",
    role: "customer",
  }),
);
location.reload();
```

---

## 📦 Các Module Mới

### 1. **auth-modern.js** — Authentication Manager

Quản lý session user với pattern Singleton.

```javascript
import { Auth } from "./js/auth-modern.js";

// Check login
Auth.isLoggedIn(); // boolean

// Get user info
Auth.getUser(); // user object
Auth.getUserId(); // string
Auth.getRole(); // 'admin' | 'customer' | null

// Check permissions
Auth.isAdmin(); // boolean
Auth.isCustomer(); // boolean
Auth.hasAccess("admin"); // boolean

// Login/Logout
Auth.login(user, rememberMe);
Auth.logout();

// Subscribe to changes
Auth.onChange((session) => console.log(session));
```

### 2. **api-modern.js** — API Client

HTTP client với retry logic và error handling.

```javascript
import { API } from "./js/api-modern.js";

// Workouts
await API.workouts.getAll();
await API.workouts.getById(id);
await API.workouts.create(data);
await API.workouts.update(id, data);
await API.workouts.delete(id);

// Exercises
await API.exercises.getAll();
// ... similar endpoints

// Users
await API.users.getAll();
// ... similar endpoints
```

### 3. **validation.js** — Input Validator

Validate và sanitize user inputs (XSS prevention).

```javascript
import Validator from './js/validation.js';

// Sanitize input
Validator.sanitize(userInput);

// Validate email
Validator.isEmail('test@example.com');

// Validate required fields
Validator.required({ name: 'John', email: '' });

// Batch validation
Validator.validate({
  name: { value: 'John', validate: [...] },
  email: { value: 'test@example.com', validate: [...] }
});
```

### 4. **dom-helper.js** — DOM Utilities

Lightweight DOM manipulation without jQuery.

```javascript
import DOMHelper from "./js/dom-helper.js";

// Select
DOMHelper.select(".btn");
DOMHelper.selectAll(".card");
DOMHelper.byId("myId");

// Manipulate
DOMHelper.setText(el, "Hello");
DOMHelper.setHTML(el, "<p>Hello</p>");
DOMHelper.addClass(el, "active");
DOMHelper.removeClass(el, "active");
DOMHelper.toggleClass(el, "active");

// Events
DOMHelper.on(el, "click", handler);
DOMHelper.off(el, "click", handler);
DOMHelper.delegate(parent, "click", ".btn", handler);

// Effects
DOMHelper.fadeIn(el, 300);
DOMHelper.fadeOut(el, 300);
DOMHelper.slideDown(el, 300);
DOMHelper.slideUp(el, 300);
```

### 5. **storage.js** — Storage Manager

Abstraction layer cho localStorage/sessionStorage.

```javascript
import { LocalStorage, SessionStorage } from "./js/storage.js";

// Get/Set
LocalStorage.get("key");
LocalStorage.set("key", value);
LocalStorage.remove("key");
LocalStorage.has("key");

// Clear all
LocalStorage.clear();

// Get all items
LocalStorage.getAll();

// Get storage size
LocalStorage.getSize();
```

### 6. **utils-modern.js** — Utility Functions

Helper functions cho formatting, calculations, animations.

```javascript
import Utils from "./js/utils-modern.js";

// Date
Utils.formatDate(dateStr);
Utils.formatDateInput(dateStr);
Utils.relativeTime(dateStr);

// Calculation
Utils.calcCalories(sets, calPerSet);
Utils.calcTotalCalories(exercises);
Utils.calcStreak(workouts);

// Grouping
Utils.groupByWeek(workouts, field);
Utils.groupByMuscle(workouts);
Utils.groupByDayOfWeek(workouts);

// UI
Utils.showToast(title, message, type);
Utils.animateNumber(selector, target, duration);
Utils.debounce(fn, delay);
Utils.throttle(fn, delay);

// Formatting
Utils.formatNumber(num);
Utils.truncate(str, maxLength);
Utils.getMuscleColor(group);
Utils.getMuscleIcon(group);
```

### 7. **app.js** — Main Application

Core application class với lifecycle management.

```javascript
// Tự động khởi tạo khi DOM ready
// Quản lý state, data loading, rendering

window.app.filterWorkouts(query);
window.app.showSuccess(message);
window.app.showError(message);
window.app.logout();
```

---

## ✨ Cải tiến chính

### Code Quality

✅ ES6 Modules — Không jQuery, code modern  
✅ ESLint Configuration — Consistent code style  
✅ JSDoc Comments — Tài liệu inline  
✅ Error Handling — Try-catch & graceful degradation

### Security

✅ Input Sanitization — Prevent XSS attacks  
✅ CSRF Protection — Ready (có thể bổ sung)  
✅ Data Validation — All inputs validated

### Performance

✅ Retry Logic — Auto-retry failed requests  
✅ Debounce/Throttle — Optimize event handlers  
✅ Lazy Loading — Load data on demand  
✅ LocalStorage Cache — Offline support

### Accessibility

✅ ARIA Labels — Screen reader support  
✅ Keyboard Navigation — Full keyboard support  
✅ Color Contrast — WCAG compliant  
✅ Focus Indicators — Clear focus states  
✅ Reduced Motion — Respect user preferences

### UX/UI

✅ Modern Styles — Clean, gradient design  
✅ Responsive Layout — Mobile-first design  
✅ Loading States — Visual feedback  
✅ Error Messages — Clear error communication  
✅ Toast Notifications — Non-intrusive alerts

---

## 📊 API Endpoints

### MockAPI URLs

```
Workouts:   https://69e9c8b215c7e2d51268b6cb.mockapi.io/api/v1/workouts
Exercises:  https://69e9c8b215c7e2d51268b6cb.mockapi.io/api/v1/exercises
Users:      https://6a06ddebc83ba8ad9b3e0758.mockapi.io/users
```

### Workout Schema

```json
{
  "id": "1",
  "name": "Upper Body",
  "muscleGroup": "Ngực",
  "date": "2024-01-15",
  "totalCalories": 350,
  "duration": 45,
  "exercises": []
}
```

### Exercise Schema

```json
{
  "id": "1",
  "name": "Bench Press",
  "sets": 4,
  "reps": 8,
  "caloriesPerSet": 25
}
```

---

## 🔧 Development

### ESLint Usage

```bash
# Check code
npm run lint

# Fix code (auto-fix)
npm run lint:fix
```

### Code Structure

- Mỗi module có một trách nhiệm duy nhất (Single Responsibility)
- Sử dụng ES6 Classes cho stateful components
- Arrow functions cho callbacks
- Const by default, let nếu cần reassign

### Adding New Features

1. Tạo module mới trong `js/` folder
2. Sử dụng ES6 export/import
3. Document bằng JSDoc
4. Test trên cả desktop & mobile

---

## 🐛 Troubleshooting

### CORS Issues

```bash
# Chạy HTTP server thay vì mở file trực tiếp
python3 -m http.server 8000
```

### LocalStorage Empty

```javascript
// Clear cache và reload
localStorage.clear();
location.reload();
```

### Module Not Found

```javascript
// Kiểm tra import path đúng
import { Auth } from "./auth-modern.js"; // ✅
import { Auth } from "./js/auth-modern.js"; // ❌ (nếu dùng từ HTML)
```

---

## 📝 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

_Yêu cầu ES6 support_

---

## 📚 Tài liệu tham khảo

- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.0/)
- [MDN Web Docs](https://developer.mozilla.org/en-US/)
- [ES6 Features](https://es6-features.org/)
- [MockAPI Docs](https://mockapi.io/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 📄 License

Dự án học tập — Nhóm 7 — Kỹ Thuật Lập Trình (FIT-DNU)

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:

1. Check DevTools Console (F12)
2. Verify API endpoints accessible
3. Ensure localhost server is running
4. Check network tab for failed requests

**Happy Tracking! 💪**
