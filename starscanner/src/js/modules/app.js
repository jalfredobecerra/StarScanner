export function initNavigation() {
    let navButtons = document.querySelectorAll("nav button");
    let sections = document.querySelectorAll("main section");

    for (const button of navButtons) {
        button.addEventListener("click", () => {
            for (const section of sections) {
                section.classList.add("hidden");
                section.classList.remove("active");
            }
            for (const btn of navButtons) {
                btn.classList.remove('active');
            }
            button.classList.add('active');
            const sectionName = button.dataset.section;
            const targetSection = document.querySelector(`#section-${sectionName}`);
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active');
        })
    }
}