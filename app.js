
/* =========================================================
   KIẾN THỨC THẬP CẨM - CHỨC NĂNG WEBSITE
   Không cần thư viện ngoài. Chạy trực tiếp trên Vercel.
========================================================= */

(function () {
    "use strict";

    const app = document.getElementById("app");
    const DATA = window.STUDY_DATA;
    const menuToggle = document.getElementById("menuToggle");
    const siteNav = document.getElementById("siteNav");
    const STORAGE_KEY = "kttm_completed_lessons_v1";

    if (!app || !DATA || !Array.isArray(DATA.subjects)) {
        if (app) app.innerHTML = '<div class="empty-state">Không tải được dữ liệu. Hãy kiểm tra data.js và thứ tự các thẻ script trong index.html.</div>';
        return;
    }

    let timerSeconds = 25 * 60;
    let timerInterval = null;
    let timerRunning = false;

    function escapeHTML(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getCompleted() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    function setCompleted(items) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.warn("Không thể lưu tiến độ trên thiết bị này.", error);
        }
    }

    function allLessons(subject) {
        return subject.chapters.reduce(function (list, chapter) {
            return list.concat(chapter.lessons || []);
        }, []);
    }

    function totalLessons() {
        return DATA.subjects.reduce(function (sum, subject) {
            return sum + allLessons(subject).length;
        }, 0);
    }

    function totalChapters() {
        return DATA.subjects.reduce(function (sum, subject) {
            return sum + subject.chapters.length;
        }, 0);
    }

    function subjectProgress(subject) {
        const lessons = allLessons(subject);
        const completed = getCompleted();
        const done = lessons.filter(function (lesson) { return completed.includes(lesson.id); }).length;
        return { done: done, total: lessons.length, percent: lessons.length ? Math.round(done / lessons.length * 100) : 0 };
    }

    function findSubject(subjectId) {
        return DATA.subjects.find(function (subject) { return subject.id === subjectId; });
    }

    function findLesson(subject, lessonId) {
        for (const chapter of subject.chapters) {
            const lesson = (chapter.lessons || []).find(function (item) { return item.id === lessonId; });
            if (lesson) return { lesson: lesson, chapter: chapter };
        }
        return null;
    }

    function getRoute() {
        return (window.location.hash || "#home").replace(/^#/, "").split("/").map(decodeURIComponent);
    }

    function renderHome() {
        const lessonTotal = totalLessons();
        const chapterTotal = totalChapters();
        const subjectCards = DATA.subjects.map(function (subject) {
            const progress = subjectProgress(subject);
            return `
                <a class="subject-card" href="#subject/${subject.id}" style="--subject-tint:${subject.color}18">
                    <span class="subject-icon">${subject.icon}</span>
                    <strong>${escapeHTML(subject.name)}</strong>
                    <small>${subject.chapters.length} ${escapeHTML(subject.unitLabel.toLowerCase())} · ${allLessons(subject).length} bài học</small>
                    <span class="card-arrow">Mở môn học →</span>
                </a>
            `;
        }).join("");

        app.innerHTML = `
            <section class="hero">
                <div class="hero-content">
                    <p class="eyebrow">GÓC HỌC TẬP LỚP 12</p>
                    <h1>Học dễ hiểu – Nhớ lâu – Thi hiệu quả</h1>
                    <p>Hệ thống kiến thức theo từng môn, chương và bài học. Tra cứu nhanh lý thuyết, công thức, mẹo ghi nhớ và nội dung ôn tập.</p>
                    <div class="hero-points">
                        <span>📚 Theo SGK Kết nối tri thức</span>
                        <span>🔎 Tra cứu nhanh</span>
                        <span>📱 Thân thiện điện thoại</span>
                    </div>
                </div>
            </section>

            <section class="search-panel" aria-label="Tìm kiếm kiến thức">
                <div class="search-wrap">
                    <label for="globalSearch">Tìm môn học, chương hoặc bài học</label>
                    <span class="search-icon" aria-hidden="true">⌕</span>
                    <input class="search-input" id="globalSearch" type="search" autocomplete="off" placeholder="Ví dụ: đạo hàm, di truyền, ester, HTML...">
                </div>
                <div class="search-results" id="searchResults" aria-live="polite"></div>
            </section>

            <div class="stats-grid">
                <div class="stat-card"><strong>${DATA.subjects.length}</strong><span>Môn học</span></div>
                <div class="stat-card"><strong>${chapterTotal}</strong><span>Chương / chủ đề</span></div>
                <div class="stat-card"><strong>${lessonTotal}</strong><span>Bài học trong mục lục</span></div>
            </div>

            <section>
                <div class="section-heading">
                    <div><h2>📚 Chọn môn học</h2><p>Chọn một môn để xem danh sách chương và bài.</p></div>
                </div>
                <div class="subject-grid">${subjectCards}</div>
            </section>

            <section>
                <div class="section-heading">
                    <div><h2>🎯 Khu vực học tập</h2><p>Các phần nội dung sẽ được bổ sung theo từng giai đoạn.</p></div>
                </div>
                <div class="feature-grid">
                    <article class="feature-card"><span class="feature-icon">📖</span><h3>Kiến thức</h3><p>Lý thuyết trọng tâm được sắp xếp theo chương và bài.</p></article>
                    <article class="feature-card"><span class="feature-icon">🧮</span><h3>Công thức</h3><p>Tổng hợp công thức, sơ đồ và cách vận dụng.</p></article>
                    <article class="feature-card"><span class="feature-icon">💡</span><h3>Mẹo học</h3><p>Mẹo ghi nhớ, phân biệt khái niệm và tránh lỗi thường gặp.</p></article>
                </div>
                <a class="tool-link" href="#tools">⌁ Mở công cụ học tập</a>
            </section>
        `;
    }

    function renderSubject(subject) {
        const progress = subjectProgress(subject);
        const chaptersHTML = subject.chapters.map(function (chapter, index) {
            const lessons = chapter.lessons || [];
            const lessonsHTML = lessons.map(function (lesson) {
                const done = getCompleted().includes(lesson.id);
                return `
                    <a class="lesson-link" href="#lesson/${subject.id}/${lesson.id}">
                        <span class="lesson-number">${escapeHTML(lesson.number)}</span>
                        <span class="lesson-name">${escapeHTML(lesson.title)}</span>
                        <span class="lesson-status">${done ? "✓" : "›"}</span>
                    </a>
                `;
            }).join("");

            return `
                <details class="chapter-card" ${index === 0 ? "open" : ""}>
                    <summary>
                        <span class="chapter-title">${escapeHTML(chapter.title)}
                            ${chapter.volume ? `<span class="chapter-meta">${escapeHTML(chapter.volume)}</span>` : ""}
                        </span>
                        <span class="chapter-meta">${lessons.length} bài</span>
                    </summary>
                    <div class="lesson-list">${lessonsHTML}</div>
                </details>
            `;
        }).join("");

        app.innerHTML = `
            <div class="page-top"><a class="back-link" href="#home">← Trang chủ</a></div>
            <section class="page-title-card" style="--subject-tint:${subject.color}18">
                <div class="page-title-row">
                    <span class="page-title-icon">${subject.icon}</span>
                    <div><h1>${escapeHTML(subject.name)}</h1><p>${escapeHTML(subject.textbook)}</p></div>
                </div>
                <p>${escapeHTML(subject.description)}</p>
                <div class="subject-progress">
                    <div class="progress-line"><span style="width:${progress.percent}%"></span></div>
                    <div class="progress-caption"><span>Tiến độ học trên thiết bị này</span><span>${progress.done}/${progress.total} bài · ${progress.percent}%</span></div>
                </div>
            </section>
            <div class="section-heading"><div><h2>📑 ${escapeHTML(subject.unitLabel)} và bài học</h2><p>Chọn ${escapeHTML(subject.unitLabel.toLowerCase())} để mở danh sách bài.</p></div></div>
            <section class="chapter-list">${chaptersHTML}</section>
        `;
    }

    function renderListOrPlaceholder(items, fallback) {
        if (Array.isArray(items) && items.length) {
            return `<ul>${items.map(function (item) { return `<li>${escapeHTML(item)}</li>`; }).join("")}</ul>`;
        }
        return `<p class="content-placeholder">${escapeHTML(fallback)}</p>`;
                                   }
             function renderLesson(subject, found) {
        const lesson = found.lesson;
        const chapter = found.chapter;
        const lessons = allLessons(subject);
        const currentIndex = lessons.findIndex(function (item) { return item.id === lesson.id; });
        const previous = currentIndex > 0 ? lessons[currentIndex - 1] : null;
        const next = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
        const done = getCompleted().includes(lesson.id);
        const content = lesson.content || {};
        const summary = content.summary || "Phần tóm tắt bài học đang được biên soạn. Mục lục và trang bài học đã sẵn sàng; nội dung chi tiết sẽ được bổ sung theo từng bài.";
        const examples = Array.isArray(content.examples) && content.examples.length
            ? `<ul>${content.examples.map(function (item) { return `<li>${escapeHTML(item)}</li>`; }).join("")}</ul>`
            : `<p class="content-placeholder">Ví dụ minh họa và lời giải sẽ được bổ sung.</p>`;

        app.innerHTML = `
            <div class="page-top">
                <a class="back-link" href="#subject/${subject.id}">← ${escapeHTML(subject.name)}</a>
                <span class="chapter-meta">/ ${escapeHTML(chapter.title)}</span>
            </div>
            <article class="lesson-article">
                <section class="lesson-intro">
                    <div class="lesson-label">${escapeHTML(subject.name)} · ${escapeHTML(subject.unitLabel)} · Bài ${escapeHTML(lesson.number)}</div>
                    <h1>${escapeHTML(lesson.title)}</h1>
                    <p>${escapeHTML(chapter.title)}${chapter.volume ? " · " + escapeHTML(chapter.volume) : ""}</p>
                    <div class="lesson-actions">
                        <button class="done-button ${done ? "is-done" : ""}" type="button" data-action="toggle-done" data-lesson-id="${escapeHTML(lesson.id)}">${done ? "✓ Đã đánh dấu hoàn thành" : "○ Đánh dấu đã học"}</button>
                        <button class="secondary-button" type="button" data-action="copy-title" data-copy="${escapeHTML(lesson.title)}">Sao chép tên bài</button>
                    </div>
                </section>

                <div class="content-grid">
                    <section class="content-card"><h2>🎯 Kiến thức trọng tâm</h2><p>${escapeHTML(summary)}</p>${renderListOrPlaceholder(content.keyPoints, "Các ý chính cần nhớ sẽ được bổ sung tại đây.")}</section>
                    <section class="content-card"><h2>🧮 Công thức / Sơ đồ</h2>${renderListOrPlaceholder(content.formulas, "Công thức hoặc sơ đồ tóm tắt sẽ được bổ sung nếu bài học có nội dung phù hợp.")}</section>
                    <section class="content-card"><h2>💡 Mẹo ghi nhớ</h2>${renderListOrPlaceholder(content.tips, "Mẹo học và cách tránh nhầm lẫn sẽ được bổ sung.")}</section>
                    <section class="content-card"><h2>✍️ Ví dụ minh họa</h2>${examples}</section>
                    <section class="content-card"><h2>✅ Tự kiểm tra</h2>${renderListOrPlaceholder(content.selfCheck, "Câu hỏi tự kiểm tra sẽ được bổ sung sau khi hoàn thiện nội dung bài.")}</section>
                    <section class="content-card"><h2>📌 Ghi chú học tập</h2><p class="content-placeholder">Có thể dùng phần ghi chú cá nhân ở giai đoạn nâng cấp tiếp theo.</p></section>
                </div>

                <div class="note-box">Lưu ý: Đây là khung bài học. Nội dung kiến thức chi tiết, công thức, mẹo và câu hỏi cần được biên soạn, kiểm tra trước khi đăng chính thức.</div>
                <nav class="lesson-navigation" aria-label="Điều hướng bài học">
                    ${previous ? `<a href="#lesson/${subject.id}/${previous.id}"><span>← Bài trước</span>${escapeHTML(previous.title)}</a>` : `<a href="#subject/${subject.id}"><span>← Quay lại</span>Danh sách ${escapeHTML(subject.name)}</a>`}
                    ${next ? `<a href="#lesson/${subject.id}/${next.id}" style="text-align:right"><span>Bài tiếp theo →</span>${escapeHTML(next.title)}</a>` : `<a href="#subject/${subject.id}" style="text-align:right"><span>Đã đến bài cuối</span>Về danh sách bài →</a>`}
                </nav>
            </article>
        `;
    }

    function renderTools() {
        app.innerHTML = `
            <div class="page-top"><a class="back-link" href="#home">← Trang chủ</a></div>
            <section class="page-title-card">
                <div class="page-title-row"><span class="page-title-icon">🧰</span><div><h1>Công cụ học tập</h1><p>Các tiện ích nhỏ hỗ trợ việc học hằng ngày.</p></div></div>
            </section>
            <div class="tools-grid">
                <section class="tool-card">
                    <h2>🧮 Tính điểm trung bình có hệ số</h2>
                    <p>Nhập các điểm cách nhau bằng dấu phẩy. Tự nhập hệ số tương ứng để phù hợp cách tính của lớp hoặc môn học.</p>
                    <label class="field-label" for="scoresInput">Danh sách điểm (0 đến 10)</label>
                    <input class="text-field" id="scoresInput" inputmode="decimal" placeholder="Ví dụ: 8, 7.5, 9">
                    <label class="field-label" for="weightsInput">Hệ số tương ứng</label>
                    <input class="text-field" id="weightsInput" inputmode="decimal" placeholder="Ví dụ: 1, 2, 3">
                    <button class="primary-button" id="calculateButton" type="button" style="margin-top:13px">Tính điểm</button>
                    <div class="result-box" id="averageResult" aria-live="polite">Kết quả sẽ hiển thị tại đây.</div>
                    <div class="note-box">Công cụ dùng hệ số do người học nhập, không tự khẳng định đây là công thức tính điểm chính thức của nhà trường.</div>
                </section>

                <section class="tool-card">
                    <h2>⏱️ Đồng hồ tập trung</h2>
                    <p>Chọn thời lượng để tập trung học. Công cụ này có thể được mở rộng thành đồng hồ làm bài thi ở giai đoạn sau.</p>
                    <label class="field-label" for="timerMinutes">Thời lượng (phút)</label>
                    <input class="text-field" id="timerMinutes" type="number" min="1" max="180" value="25" inputmode="numeric">
                    <div class="timer-display" id="timerDisplay">25:00</div>
                    <div class="timer-actions">
                        <button class="primary-button" id="timerStart" type="button">Bắt đầu</button>
                        <button class="secondary-button" id="timerPause" type="button">Tạm dừng</button>
                        <button class="secondary-button" id="timerReset" type="button">Đặt lại</button>
                    </div>
                    <div class="result-box" id="timerStatus" aria-live="polite">Sẵn sàng bắt đầu.</div>
                </section>
            </div>
        `;

        bindScoreCalculator();
        bindTimer();
    }

    function bindScoreCalculator() {
        const button = document.getElementById("calculateButton");
        if (!button) return;
        button.addEventListener("click", function () {
            const scoreText = document.getElementById("scoresInput").value.trim();
            const weightText = document.getElementById("weightsInput").value.trim();
            const result = document.getElementById("averageResult");
            const scores = scoreText.split(/[;,\s]+/).filter(Boolean).map(Number);
            const weights = weightText ? weightText.split(/[;,\s]+/).filter(Boolean).map(Number) : scores.map(function () { return 1; });

            if (!scores.length || scores.some(function (n) { return !Number.isFinite(n) || n < 0 || n > 10; })) {
                result.textContent = "Hãy nhập ít nhất một điểm hợp lệ trong khoảng 0–10.";
                return;
            }
            if (weights.length !== scores.length || weights.some(function (n) { return !Number.isFinite(n) || n <= 0; })) {
                result.textContent = "Số hệ số phải bằng số điểm và mỗi hệ số phải lớn hơn 0.";
                return;
            }

            const weightedSum = scores.reduce(function (sum, score, index) { return sum + score * weights[index]; }, 0);
            const weightSum = weights.reduce(function (sum, weight) { return sum + weight; }, 0);
            const average = weightedSum / weightSum;
            result.textContent = "Điểm trung bình theo hệ số đã nhập: " + average.toFixed(2).replace(/\.00$/, "") + "/10";
        });
    }

    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
        const seconds = (totalSeconds % 60).toString().padStart(2, "0");
        return minutes + ":" + seconds;
    }

    function updateTimerDisplay() {
        const display = document.getElementById("timerDisplay");
        if (display) display.textContent = formatTime(timerSeconds);
    }

    function stopTimerInterval() {
        if (timerInterval) window.clearInterval(timerInterval);
        timerInterval = null;
        timerRunning = false;
    }

    function bindTimer() {
        const minutesInput = document.getElementById("timerMinutes");
        const startButton = document.getElementById("timerStart");
        const pauseButton = document.getElementById("timerPause");
        const resetButton = document.getElementById("timerReset");
        const status = document.getElementById("timerStatus");
        if (!minutesInput || !startButton || !pauseButton || !resetButton || !status) return;

        function setFromInput() {
            const minutes = Number(minutesInput.value);
            if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
                status.textContent = "Thời lượng phải là số nguyên từ 1 đến 180 phút.";
                return false;
            }
            timerSeconds = minutes * 60;
            updateTimerDisplay();
            return true;
        }

        startButton.addEventListener("click", function () {
            if (timerRunning) return;
            if (timerSeconds <= 0 && !setFromInput()) return;
            if (timerSeconds === 25 * 60 && minutesInput.value !== "25") {
                if (!setFromInput()) return;
            }
            timerRunning = true;
            status.textContent = "Đồng hồ đang chạy. Tập trung nhé!";
            timerInterval = window.setInterval(function () {
                timerSeconds -= 1;
                updateTimerDisplay();
                if (timerSeconds <= 0) {
                    timerSeconds = 0;
                    updateTimerDisplay();
                    stopTimerInterval();
                    status.textContent = "Đã hết thời gian.";
                }
            }, 1000);
        });

        pauseButton.addEventListener("click", function () {
            if (!timerRunning) return;
            stopTimerInterval();
            status.textContent = "Đã tạm dừng.";
        });

        resetButton.addEventListener("click", function () {
            stopTimerInterval();
            if (setFromInput()) status.textContent = "Đã đặt lại đồng hồ.";
        });

        minutesInput.addEventListener("change", function () {
            if (!timerRunning) setFromInput();
        });
        updateTimerDisplay();
    }

    function renderAbout() {
        app.innerHTML = `
            <div class="page-top"><a class="back-link" href="#home">← Trang chủ</a></div>
            <section class="page-title-card">
                <div class="page-title-row"><span class="page-title-icon">📚</span><div><h1>Về Kiến thức thập cẩm</h1><p>Học dễ hiểu – Nhớ lâu – Thi hiệu quả.</p></div></div>
                <p>Website tổng hợp kiến thức lớp 12 theo môn, chương và bài học của bộ sách Kết nối tri thức với cuộc sống.</p>
            </section>
            <section class="info-card" style="margin-top:14px">
                <h2>Định hướng nội dung</h2>
                <p>Website có sáu môn: Toán, Sinh học, Hóa học, Công nghệ nông nghiệp (Lâm nghiệp – Thủy sản), Lịch sử và Tin học (định hướng Tin học ứng dụng).</p>
                <p>Mỗi bài học được xây dựng theo các mục: kiến thức trọng tâm, công thức hoặc sơ đồ, mẹo ghi nhớ, ví dụ minh họa và câu hỏi tự kiểm tra.</p>
                <p>Website là tài liệu hỗ trợ học tập; học sinh nên đối chiếu với sách giáo khoa và hướng dẫn của giáo viên.</p>
            </section>
        `;
    }

    function renderNotFound() {
        app.innerHTML = '<section class="info-card"><h1>Không tìm thấy nội dung</h1><p>Đường dẫn này không tồn tại hoặc mục lục đã thay đổi.</p><a class="tool-link" href="#home">Về trang chủ</a></section>';
    }

    function renderCurrentRoute() {
        const route = getRoute();
        const type = route[0] || "home";
        if (type !== "tools") stopTimerInterval();

        if (type === "home") {
            renderHome();
        } else if (type === "subject") {
            const subject = findSubject(route[1]);
            subject ? renderSubject(subject) : renderNotFound();
        } else if (type === "lesson") {
            const subject = findSubject(route[1]);
            const found = subject ? findLesson(subject, route[2]) : null;
            subject && found ? renderLesson(subject, found) : renderNotFound();
        } else if (type === "tools") {
            renderTools();
        } else if (type === "about") {
            renderAbout();
        } else {
            renderNotFound();
        }

        if (siteNav) siteNav.classList.remove("is-open");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
        window.scrollTo(0, 0);
    }

    function renderSearchResults(query) {
        const box = document.getElementById("searchResults");
        if (!box) return;
        const q = query.trim().toLocaleLowerCase("vi");
        if (!q) { box.innerHTML = ""; return; }

        const results = [];
        DATA.subjects.forEach(function (subject) {
            if ((subject.name + " " + subject.textbook).toLocaleLowerCase("vi").includes(q)) {
                results.push({ href: "#subject/" + subject.id, title: subject.name, detail: subject.textbook });
            }
            subject.chapters.forEach(function (chapter) {
                if (chapter.title.toLocaleLowerCase("vi").includes(q)) {
                    results.push({ href: "#subject/" + subject.id, title: chapter.title, detail: subject.name });
                }
                (chapter.lessons || []).forEach(function (lesson) {
                    if (lesson.title.toLocaleLowerCase("vi").includes(q)) {
                        results.push({ href: "#lesson/" + subject.id + "/" + lesson.id, title: lesson.title, detail: subject.name + " · " + chapter.title });
                    }
                });
            });
        });

        const unique = results.filter(function (item, index) {
            return results.findIndex(function (other) { return other.href === item.href; }) === index;
        }).slice(0, 10);

        box.innerHTML = unique.length
            ? unique.map(function (item) { return `<a class="search-result" href="${item.href}">${escapeHTML(item.title)}<small>${escapeHTML(item.detail)}</small></a>`; }).join("")
            : '<div class="empty-state">Không tìm thấy kết quả phù hợp. Thử từ khóa khác nhé.</div>';
    }

    if (menuToggle && siteNav) {
        menuToggle.addEventListener("click", function () {
            const isOpen = siteNav.classList.toggle("is-open");
            menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    }

    app.addEventListener("input", function (event) {
        if (event.target && event.target.id === "globalSearch") renderSearchResults(event.target.value);
    });

    app.addEventListener("click", function (event) {
        const button = event.target.closest("[data-action]");
        if (!button) return;

        if (button.dataset.action === "toggle-done") {
            const lessonId = button.dataset.lessonId;
            const completed = getCompleted();
            const index = completed.indexOf(lessonId);
            if (index >= 0) completed.splice(index, 1);
            else completed.push(lessonId);
            setCompleted(completed);
            renderCurrentRoute();
        }

        if (button.dataset.action === "copy-title") {
            const title = button.dataset.copy || "";
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(title).then(function () {
                    button.textContent = "Đã sao chép";
                }).catch(function () {
                    button.textContent = "Không sao chép được";
                });
            } else {
                button.textContent = "Trình duyệt không hỗ trợ sao chép";
            }
        }
    });

    window.addEventListener("hashchange", renderCurrentRoute);

    const year = document.getElementById("currentYear");
    if (year) year.textContent = String(new Date().getFullYear());

    renderCurrentRoute();
}());

                 
