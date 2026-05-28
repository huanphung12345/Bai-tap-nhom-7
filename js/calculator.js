// ============================================
//  FITTRACK CALORIE CALCULATOR - ENHANCED
// ============================================

const CalorieCalc = (function () {

    // ---- MET Values Database ----
    // MET (Metabolic Equivalent of Task)
    // Calories = MET × Weight(kg) × Duration(hours)
    const EXERCISES_DB = [
        // Cardio
        { id: 'running_fast', name: 'Chạy bộ (nhanh 10km/h)', category: 'Cardio', emoji: '🏃', met: { low: 8, medium: 10, high: 12.5 } },
        { id: 'running_slow', name: 'Chạy bộ (chậm 6km/h)', category: 'Cardio', emoji: '🏃', met: { low: 5, medium: 6, high: 8 } },
        { id: 'walking', name: 'Đi bộ nhanh', category: 'Cardio', emoji: '🚶', met: { low: 3, medium: 4, high: 5 } },
        { id: 'cycling', name: 'Đạp xe', category: 'Cardio', emoji: '🚴', met: { low: 4, medium: 7, high: 10 } },
        { id: 'swimming', name: 'Bơi lội', category: 'Cardio', emoji: '🏊', met: { low: 5, medium: 7, high: 10 } },
        { id: 'jump_rope', name: 'Nhảy dây', category: 'Cardio', emoji: '⏭️', met: { low: 8, medium: 10, high: 12 } },
        { id: 'stair_climbing', name: 'Leo cầu thang', category: 'Cardio', emoji: '🪜', met: { low: 4, medium: 6, high: 9 } },
        { id: 'dancing', name: 'Nhảy / Zumba', category: 'Cardio', emoji: '💃', met: { low: 4, medium: 6, high: 8 } },
        { id: 'hiit', name: 'HIIT (Interval)', category: 'Cardio', emoji: '⚡', met: { low: 8, medium: 10, high: 14 } },
        { id: 'rowing', name: 'Chèo thuyền máy', category: 'Cardio', emoji: '🚣', met: { low: 4, medium: 7, high: 10 } },

        // Gym - Upper Body
        { id: 'bench_press', name: 'Đẩy ngực (Bench Press)', category: 'Ngực', emoji: '🏋️', met: { low: 3, medium: 5, high: 6 } },
        { id: 'push_ups', name: 'Chống đẩy (Push-ups)', category: 'Ngực', emoji: '💪', met: { low: 3.5, medium: 5, high: 7 } },
        { id: 'dumbbell_fly', name: 'Bay tạ (Dumbbell Fly)', category: 'Ngực', emoji: '🦅', met: { low: 3, medium: 4.5, high: 6 } },
        { id: 'pull_ups', name: 'Kéo xà (Pull-ups)', category: 'Lưng', emoji: '🧗', met: { low: 4, medium: 6, high: 8 } },
        { id: 'lat_pulldown', name: 'Kéo cáp lưng', category: 'Lưng', emoji: '🔽', met: { low: 3, medium: 5, high: 6 } },
        { id: 'deadlift', name: 'Deadlift', category: 'Lưng', emoji: '🏋️', met: { low: 4, medium: 6, high: 8 } },
        { id: 'shoulder_press', name: 'Đẩy vai (Shoulder Press)', category: 'Vai', emoji: '🙌', met: { low: 3, medium: 5, high: 6 } },
        { id: 'lateral_raise', name: 'Nâng tạ sang ngang', category: 'Vai', emoji: '🤸', met: { low: 2.5, medium: 4, high: 5 } },
        { id: 'bicep_curl', name: 'Cuốn tạ tay trước', category: 'Tay', emoji: '💪', met: { low: 2.5, medium: 4, high: 5 } },
        { id: 'tricep_dip', name: 'Dips tay sau', category: 'Tay', emoji: '🤲', met: { low: 3, medium: 5, high: 6 } },

        // Gym - Lower Body
        { id: 'squat', name: 'Squat (gánh tạ)', category: 'Chân', emoji: '🦵', met: { low: 4, medium: 6, high: 8 } },
        { id: 'lunges', name: 'Lunges (Bước)', category: 'Chân', emoji: '🚶', met: { low: 3.5, medium: 5, high: 7 } },
        { id: 'leg_press', name: 'Đạp chân máy', category: 'Chân', emoji: '🦿', met: { low: 3, medium: 5, high: 6 } },
        { id: 'calf_raise', name: 'Nâng bắp chân', category: 'Chân', emoji: '🦶', met: { low: 2.5, medium: 3.5, high: 5 } },
        { id: 'leg_curl', name: 'Gập chân máy', category: 'Chân', emoji: '🔄', met: { low: 3, medium: 4, high: 5 } },

        // Core
        { id: 'plank', name: 'Plank', category: 'Bụng', emoji: '🧘', met: { low: 3, medium: 4, high: 5 } },
        { id: 'crunches', name: 'Gập bụng (Crunches)', category: 'Bụng', emoji: '🔄', met: { low: 2.5, medium: 4, high: 5 } },
        { id: 'sit_ups', name: 'Sit-ups', category: 'Bụng', emoji: '⬆️', met: { low: 3, medium: 4.5, high: 6 } },
        { id: 'russian_twist', name: 'Russian Twist', category: 'Bụng', emoji: '🌀', met: { low: 3, medium: 4.5, high: 6 } },
        { id: 'leg_raise', name: 'Nâng chân (Leg Raise)', category: 'Bụng', emoji: '🦵', met: { low: 2.5, medium: 4, high: 5 } },

        // Sports
        { id: 'basketball', name: 'Bóng rổ', category: 'Thể thao', emoji: '🏀', met: { low: 5, medium: 7, high: 9 } },
        { id: 'football', name: 'Bóng đá', category: 'Thể thao', emoji: '⚽', met: { low: 5, medium: 7, high: 10 } },
        { id: 'badminton', name: 'Cầu lông', category: 'Thể thao', emoji: '🏸', met: { low: 4, medium: 6, high: 8 } },
        { id: 'tennis', name: 'Tennis', category: 'Thể thao', emoji: '🎾', met: { low: 4, medium: 7, high: 9 } },
        { id: 'boxing', name: 'Boxing / Kickboxing', category: 'Thể thao', emoji: '🥊', met: { low: 6, medium: 8, high: 12 } },
        { id: 'yoga', name: 'Yoga', category: 'Khác', emoji: '🧘', met: { low: 2, medium: 3, high: 4 } },
        { id: 'stretching', name: 'Giãn cơ / Thả lỏng', category: 'Khác', emoji: '🤸', met: { low: 2, medium: 2.5, high: 3 } },
    ];

    // Food equivalents (calories per unit)
    const FOOD_DB = [
        { name: 'Bát cơm trắng', emoji: '🍚', calories: 200 },
        { name: 'Lon Coca-Cola', emoji: '🥤', calories: 140 },
        { name: 'Cái bánh mì', emoji: '🥖', calories: 250 },
        { name: 'Quả chuối', emoji: '🍌', calories: 105 },
        { name: 'Miếng pizza', emoji: '🍕', calories: 285 },
        { name: 'Ly trà sữa', emoji: '🧋', calories: 350 },
        { name: 'Cái burger', emoji: '🍔', calories: 354 },
        { name: 'Thanh socola', emoji: '🍫', calories: 230 },
        { name: 'Quả trứng luộc', emoji: '🥚', calories: 78 },
        { name: 'Ly bia 330ml', emoji: '🍺', calories: 150 },
    ];

    const HISTORY_KEY = 'fittrack_calc_history';
    let rowCounter = 0;

    // ---- Initialize ----
    function init() {
        addExerciseRow();
        setupEventListeners();
        buildQuickAddPanel();
        loadHistory();
    }

    // ---- Event Listeners ----
    function setupEventListeners() {
        document.getElementById('btnAddExerciseRow').addEventListener('click', addExerciseRow);
        document.getElementById('btnCalculateCalories').addEventListener('click', calculateCalories);
        document.getElementById('btnResetCalc').addEventListener('click', resetCalculator);
        document.getElementById('btnClearCalcHistory').addEventListener('click', clearHistory);

        document.getElementById('btnQuickAdd').addEventListener('click', function () {
            document.getElementById('quickAddPanel').classList.toggle('d-none');
        });

        // Live preview on input changes
        document.getElementById('calcExerciseList').addEventListener('input', debounce(livePreview, 300));
        document.getElementById('calcExerciseList').addEventListener('change', livePreview);
        document.getElementById('calcUserWeight').addEventListener('input', debounce(livePreview, 300));
    }

    // ---- Add Exercise Row ----
    function addExerciseRow(presetExerciseId) {
        rowCounter++;
        const container = document.getElementById('calcExerciseList');
        const defaultIntensity = document.getElementById('calcDefaultIntensity').value;

        // Build exercise options grouped by category
        const categories = {};
        EXERCISES_DB.forEach(ex => {
            if (!categories[ex.category]) categories[ex.category] = [];
            categories[ex.category].push(ex);
        });

        let optionsHTML = '<option value="">-- Chọn bài tập --</option>';
        for (const [cat, exercises] of Object.entries(categories)) {
            optionsHTML += `<optgroup label="${cat}">`;
            exercises.forEach(ex => {
                const selected = presetExerciseId === ex.id ? 'selected' : '';
                optionsHTML += `<option value="${ex.id}" ${selected}>${ex.emoji} ${ex.name}</option>`;
            });
            optionsHTML += '</optgroup>';
        }

        const rowHTML = `
            <div class="calc-exercise-row" data-row="${rowCounter}" id="calcRow${rowCounter}">
                <div class="row-number">${rowCounter}</div>
                <button type="button" class="btn-remove-row" onclick="CalorieCalc.removeRow(${rowCounter})" title="Xóa">
                    <i class="bi bi-x"></i>
                </button>
                <div class="row g-2 align-items-end">
                    <div class="col-md-5">
                        <label class="form-label small fw-semibold text-muted">Bài Tập</label>
                        <select class="form-select exercise-select" id="exercise_${rowCounter}">
                            ${optionsHTML}
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label small fw-semibold text-muted">Thời Gian</label>
                        <div class="input-group">
                            <input type="number" class="form-control duration-input" 
                                   id="duration_${rowCounter}" min="1" max="300" 
                                   value="30" placeholder="30">
                            <span class="input-group-text small">phút</span>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label small fw-semibold text-muted">Cường Độ</label>
                        <select class="form-select intensity-select" id="intensity_${rowCounter}">
                            <option value="low" ${defaultIntensity === 'low' ? 'selected' : ''}>🟢 Nhẹ</option>
                            <option value="medium" ${defaultIntensity === 'medium' ? 'selected' : ''}>🟡 TB</option>
                            <option value="high" ${defaultIntensity === 'high' ? 'selected' : ''}>🔴 Cao</option>
                        </select>
                    </div>
                </div>
                <div class="text-end mt-1">
                    <span class="row-calorie-preview" id="preview_${rowCounter}">
                        <i class="bi bi-fire me-1"></i>~ 0 kcal
                    </span>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', rowHTML);
        updateExerciseCount();
        livePreview();
    }

    // ---- Remove Exercise Row ----
    function removeRow(rowNum) {
        const row = document.getElementById(`calcRow${rowNum}`);
        if (row) {
            row.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                row.remove();
                renumberRows();
                updateExerciseCount();
                livePreview();
            }, 300);
        }
    }

    // ---- Renumber Rows ----
    function renumberRows() {
        const rows = document.querySelectorAll('.calc-exercise-row');
        rows.forEach((row, index) => {
            const numEl = row.querySelector('.row-number');
            if (numEl) numEl.textContent = index + 1;
        });
    }

    // ---- Update Exercise Count ----
    function updateExerciseCount() {
        const count = document.querySelectorAll('.calc-exercise-row').length;
        document.getElementById('exerciseCount').textContent = `${count} bài tập`;
    }

    // ---- Live Preview (calculate as you type) ----
    function livePreview() {
        const weight = parseFloat(document.getElementById('calcUserWeight').value) || 65;
        const rows = document.querySelectorAll('.calc-exercise-row');

        rows.forEach(row => {
            const rowNum = row.dataset.row;
            const exerciseId = document.getElementById(`exercise_${rowNum}`)?.value;
            const duration = parseFloat(document.getElementById(`duration_${rowNum}`)?.value) || 0;
            const intensity = document.getElementById(`intensity_${rowNum}`)?.value || 'medium';

            const preview = document.getElementById(`preview_${rowNum}`);
            if (!preview) return;

            if (!exerciseId || duration <= 0) {
                preview.innerHTML = '<i class="bi bi-fire me-1"></i>~ 0 kcal';
                return;
            }

            const exercise = EXERCISES_DB.find(e => e.id === exerciseId);
            if (!exercise) return;

            const met = exercise.met[intensity] || exercise.met.medium;
            const cal = Math.round(met * weight * (duration / 60));
            preview.innerHTML = `<i class="bi bi-fire me-1"></i>~ ${cal.toLocaleString()} kcal`;
        });
    }

    // ---- Calculate Calories (Final) ----
    function calculateCalories() {
        const weight = parseFloat(document.getElementById('calcUserWeight').value);

        if (!weight || weight < 20 || weight > 300) {
            showToast('Vui lòng nhập cân nặng hợp lệ (20-300 kg)', 'warning');
            document.getElementById('calcUserWeight').focus();
            return;
        }

        const rows = document.querySelectorAll('.calc-exercise-row');
        if (rows.length === 0) {
            showToast('Vui lòng thêm ít nhất 1 bài tập', 'warning');
            return;
        }

        let totalCalories = 0;
        let totalDuration = 0;
        let exerciseCount = 0;
        const breakdown = [];
        let hasValid = false;

        rows.forEach(row => {
            const rowNum = row.dataset.row;
            const exerciseId = document.getElementById(`exercise_${rowNum}`)?.value;
            const duration = parseFloat(document.getElementById(`duration_${rowNum}`)?.value) || 0;
            const intensity = document.getElementById(`intensity_${rowNum}`)?.value || 'medium';

            if (!exerciseId || duration <= 0) return;

            const exercise = EXERCISES_DB.find(e => e.id === exerciseId);
            if (!exercise) return;

            hasValid = true;
            const met = exercise.met[intensity] || exercise.met.medium;
            const cal = Math.round(met * weight * (duration / 60));

            totalCalories += cal;
            totalDuration += duration;
            exerciseCount++;

            breakdown.push({
                name: exercise.name,
                emoji: exercise.emoji,
                category: exercise.category,
                duration,
                intensity,
                met,
                calories: cal
            });
        });

        if (!hasValid) {
            showToast('Vui lòng chọn bài tập và nhập thời gian', 'warning');
            return;
        }

        // Show results
        displayResults(totalCalories, totalDuration, exerciseCount, breakdown, weight);

        // Save to history
        saveHistory(totalCalories, totalDuration, exerciseCount, breakdown);
    }

    // ---- Display Results ----
    function displayResults(totalCal, totalTime, exerciseNum, breakdown, weight) {
        document.getElementById('calcPlaceholder').classList.add('d-none');
        const resultDiv = document.getElementById('calcResult');
        resultDiv.classList.remove('d-none');
        resultDiv.classList.add('calc-result-animate');

        // Animate total number
        animateNumber('totalCalcResult', totalCal);

        // Stats
        document.getElementById('calcTotalTime').textContent = totalTime;
        document.getElementById('calcTotalExercises').textContent = exerciseNum;
        document.getElementById('calcAvgPerMin').textContent = totalTime > 0
            ? (totalCal / totalTime).toFixed(1) : '0';

        const bowlsOfRice = (totalCal / 200).toFixed(1);
        document.getElementById('calcFoodEquiv').textContent = bowlsOfRice;

        // Breakdown list
        const maxCal = Math.max(...breakdown.map(b => b.calories), 1);
        const breakdownHTML = breakdown.map(item => {
            const barWidth = Math.round((item.calories / maxCal) * 100);
            const intensityLabel = { low: '🟢 Nhẹ', medium: '🟡 TB', high: '🔴 Cao' }[item.intensity] || '';
            const bgColor = getCategoryColor(item.category);

            return `
                <div class="calc-breakdown-item">
                    <div class="breakdown-info">
                        <div class="breakdown-icon" style="background: ${bgColor}15; color: ${bgColor}">
                            ${item.emoji}
                        </div>
                        <div style="flex:1">
                            <div class="breakdown-name">${item.name}</div>
                            <div class="breakdown-meta">${item.duration} phút · ${intensityLabel} · MET ${item.met}</div>
                            <div class="breakdown-bar">
                                <div class="breakdown-bar-fill" style="width: ${barWidth}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="breakdown-cal">${item.calories.toLocaleString()} kcal</div>
                </div>
            `;
        }).join('');

        document.getElementById('calcBreakdownList').innerHTML = breakdownHTML;

        // Food equivalents
        const foodHTML = FOOD_DB
            .filter(() => Math.random() > 0.3)
            .slice(0, 6)
            .map(food => {
                const amount = (totalCal / food.calories).toFixed(1);
                return `
                    <div class="calc-food-item">
                        <span class="food-emoji">${food.emoji}</span>
                        <span class="food-name">${food.name} (${food.calories} kcal)</span>
                        <span class="food-amount">${amount} phần</span>
                    </div>
                `;
            }).join('');

        document.getElementById('calcFoodList').innerHTML = foodHTML;

        // Advice
        let advice = '';
        if (totalCal < 200) {
            advice = `
                <h6><i class="bi bi-lightbulb me-2"></i>Lời Khuyên</h6>
                <p>Bạn đốt được <strong>${totalCal} kcal</strong> – buổi tập khởi động nhẹ nhàng. 
                Hãy tăng cường độ hoặc thêm thời gian để đạt hiệu quả giảm cân tốt hơn. 
                Mục tiêu tối thiểu 300 kcal/buổi tập!</p>
            `;
        } else if (totalCal < 500) {
            advice = `
                <h6><i class="bi bi-lightbulb me-2"></i>Lời Khuyên</h6>
                <p>Tuyệt vời! <strong>${totalCal} kcal</strong> là mức tập luyện hiệu quả 💪. 
                Kết hợp với chế độ ăn khoa học, bạn sẽ đạt mục tiêu sớm thôi. 
                Nhớ uống đủ 2-3 lít nước/ngày nhé!</p>
            `;
        } else {
            advice = `
                <h6><i class="bi bi-lightbulb me-2"></i>Lời Khuyên</h6>
                <p>Siêu đỉnh! 🔥 <strong>${totalCal} kcal</strong> – buổi tập cường độ cao! 
                Bạn đã đốt tương đương ${bowlsOfRice} bát cơm. 
                Hãy bổ sung protein sau tập (whey, trứng, gà) và nghỉ ngơi đầy đủ để phục hồi cơ!</p>
            `;
        }

        document.getElementById('calcAdvice').innerHTML = advice;

        // Remove animation class after done
        setTimeout(() => resultDiv.classList.remove('calc-result-animate'), 500);
    }

    // ---- Animate Number ----
    function animateNumber(elementId, targetValue) {
        const el = document.getElementById(elementId);
        const duration = 800;
        const startTime = Date.now();
        const startValue = parseInt(el.textContent.replace(/,/g, '')) || 0;

        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startValue + (targetValue - startValue) * eased);
            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ---- Reset Calculator ----
    function resetCalculator() {
        document.getElementById('calcExerciseList').innerHTML = '';
        rowCounter = 0;
        addExerciseRow();

        document.getElementById('calcResult').classList.add('d-none');
        document.getElementById('calcPlaceholder').classList.remove('d-none');
        document.getElementById('totalCalcResult').textContent = '0';
        document.getElementById('quickAddPanel').classList.add('d-none');

        showToast('Đã reset máy tính calo', 'info');
    }

    // ---- Quick Add Panel ----
    function buildQuickAddPanel() {
        const popular = [
            'running_fast', 'cycling', 'swimming', 'jump_rope', 'hiit',
            'bench_press', 'squat', 'pull_ups', 'plank', 'push_ups',
            'football', 'boxing', 'yoga', 'dancing', 'deadlift'
        ];

        const container = document.getElementById('quickAddButtons');
        let html = '';

        popular.forEach(id => {
            const ex = EXERCISES_DB.find(e => e.id === id);
            if (!ex) return;

            html += `
                <div class="col-6 col-md-4">
                    <button class="quick-add-btn" onclick="CalorieCalc.quickAddExercise('${ex.id}')">
                        <span class="qa-emoji">${ex.emoji}</span>
                        <span class="qa-name">${ex.name}</span>
                    </button>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function quickAddExercise(exerciseId) {
        addExerciseRow(exerciseId);
        showToast('Đã thêm bài tập!', 'success');
    }

    // ---- History ----
    function saveHistory(totalCal, totalTime, exerciseNum, breakdown) {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

        history.unshift({
            id: Date.now(),
            date: new Date().toISOString(),
            totalCalories: totalCal,
            totalDuration: totalTime,
            exerciseCount: exerciseNum,
            exercises: breakdown.map(b => b.name)
        });

        // Keep last 20
        if (history.length > 20) history.length = 20;

        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        loadHistory();
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        const container = document.getElementById('calcHistoryList');

        if (history.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="bi bi-inbox me-1"></i>Chưa có lịch sử
                </div>
            `;
            return;
        }

        let html = '';
        history.forEach(item => {
            const date = new Date(item.date);
            const dateStr = date.toLocaleDateString('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            const exercises = item.exercises.slice(0, 3).join(', ');
            const more = item.exercises.length > 3 ? ` +${item.exercises.length - 3}` : '';

            html += `
                <div class="calc-history-item">
                    <div class="history-info">
                        <span class="history-date">${dateStr}</span>
                        <span class="history-detail">
                            ${item.exerciseCount} bài · ${item.totalDuration} phút
                        </span>
                        <span class="history-detail" style="font-size: 0.7rem">
                            ${exercises}${more}
                        </span>
                    </div>
                    <div class="history-cal">
                        <i class="bi bi-fire text-danger me-1"></i>${item.totalCalories.toLocaleString()}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function clearHistory() {
        if (confirm('Xóa toàn bộ lịch sử tính calo?')) {
            localStorage.removeItem(HISTORY_KEY);
            loadHistory();
            showToast('Đã xóa lịch sử', 'info');
        }
    }

    // ---- Helpers ----
    function getCategoryColor(category) {
        const colors = {
            'Cardio': '#ff6b6b',
            'Ngực': '#667eea',
            'Lưng': '#00b894',
            'Vai': '#fdcb6e',
            'Tay': '#e17055',
            'Chân': '#6c5ce7',
            'Bụng': '#00cec9',
            'Thể thao': '#fd79a8',
            'Khác': '#636e72'
        };
        return colors[category] || '#636e72';
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function showToast(message, type) {
        // Create toast
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'info'} position-fixed shadow-lg`;
        toast.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 280px; animation: slideIn 0.3s ease;';
        toast.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-${type === 'warning' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Public API
    return {
        init,
        addExerciseRow: function (presetId) { addExerciseRow(presetId); },
        removeRow,
        quickAddExercise,
        calculateCalories,
        resetCalculator
    };

})();

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', function () {
    CalorieCalc.init();
});