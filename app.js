
const subjectsContainer = document.querySelector(".subject-grid");

function renderSubjects() {
    if (!subjectsContainer || !window.STUDY_DATA) return;

    subjectsContainer.innerHTML = STUDY_DATA.subjects.map(subject => `
        <a href="#" class="subject"
           onclick="showSubject('${subject.id}'); return false;">
            <span style="font-size:26px">${subject.icon}</span>
            <div>${subject.name}</div>
        </a>
    `).join("");
}

function showSubject(subjectId) {
    const subject = STUDY_DATA.subjects.find(
        item => item.id === subjectId
    );

    if (!subject) return;

    const main = document.querySelector("main");

    let chaptersHTML = subject.chapters.length
        ? subject.chapters.map(chapter => `
            <section class="chapter">
                <h3>${chapter.name}</h3>
                <ul>
                    ${chapter.lessons.map(lesson => `
                        <li>${lesson.name}</li>
                    `).join("")}
                </ul>
            </section>
        `).join("")
        : `<p>Mục lục môn học đang được cập nhật.</p>`;

    main.innerHTML = `
        <button onclick="location.reload()" class="back-button">
            ← Quay lại trang chủ
        </button>

        <h2>${subject.icon} ${subject.name}</h2>
        <p>${subject.textbook}</p>

        <div class="chapter-list">
            ${chaptersHTML}
        </div>
    `;

    window.scrollTo(0, 0);
}

renderSubjects();
