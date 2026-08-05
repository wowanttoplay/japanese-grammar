const key = "mnn2-grammar-complete-v1";
const completed = new Set(JSON.parse(localStorage.getItem(key) || "[]"));
document.querySelectorAll("[data-lesson-row]").forEach(row => {
  const lesson = Number(row.dataset.lessonRow);
  if (completed.has(lesson)) {
    row.classList.add("completed");
    row.querySelector(".progress-track span").style.width = "100%";
    row.querySelector(".lesson-meta").textContent = "已完成";
  }
});
document.querySelectorAll("[data-volume]").forEach(volume => {
  const start = Number(volume.dataset.volume);
  const count = [...completed].filter(n => n >= start && n < start + 25).length;
  const target = volume.querySelector(".volume-progress");
  if (target) target.textContent = `${count}/25 课完成`;
});
const completeButton = document.querySelector("[data-complete]");
if (completeButton) {
  const lesson = Number(completeButton.dataset.complete);
  const paint = () => {
    const done = completed.has(lesson);
    completeButton.classList.toggle("completed", done);
    completeButton.textContent = done ? "✓ 本课已完成" : "标记本课已完成";
    completeButton.setAttribute("aria-pressed", String(done));
  };
  completeButton.addEventListener("click", () => {
    completed.has(lesson) ? completed.delete(lesson) : completed.add(lesson);
    localStorage.setItem(key, JSON.stringify([...completed].sort((a,b)=>a-b)));
    paint();
  });
  paint();
}
let currentAudio = null;
document.querySelectorAll("[data-audio]").forEach(button => button.addEventListener("click", () => {
  if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
  currentAudio = new Audio(button.dataset.audio);
  currentAudio.play();
}));
const tocLinks = [...document.querySelectorAll(".toc a")];
if (tocLinks.length && "IntersectionObserver" in window) {
  const links = new Map(tocLinks.map(a => [a.getAttribute("href").slice(1), a]));
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];
    if (!visible) return;
    tocLinks.forEach(a => a.classList.remove("active"));
    links.get(visible.target.id)?.classList.add("active");
  }, { rootMargin:"-18% 0px -65%", threshold:0 });
  document.querySelectorAll(".grammar-section").forEach(section => observer.observe(section));
}
