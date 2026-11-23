const seedNotes = [
  { id: "note-1", title: "A quieter start", body: "Make the first step small enough to begin. Progress can build from there.", date: "Today" },
  { id: "note-2", title: "Ideas to explore", body: "Collect the useful thoughts. Decide what they mean after there is room to think.", date: "Yesterday" },
  { id: "note-3", title: "Keep it simple", body: "One clear next step is more useful than a perfect plan for everything.", date: "This week" },
];

const seedTasks = [
  { id: "task-1", text: "Write down the one thing that matters today", tag: "FOCUS", done: false },
  { id: "task-2", text: "Give a rough idea ten quiet minutes", tag: "IDEAS", done: false },
  { id: "task-3", text: "Make space for a short reset", tag: "WELLBEING", done: true },
];

const storageKey = "orbitWorkspaceDemo";
const noteGrid = document.querySelector("#note-grid");
const taskList = document.querySelector("#task-list");
const noteDialog = document.querySelector("#note-dialog");
const noteForm = document.querySelector("#note-form");
const chatForm = document.querySelector("#chat-form");
const chatPrompt = document.querySelector("#chat-prompt");
const chatOutput = document.querySelector("#chat-output");
const liveAiEnabled = window.location.hostname.endsWith(".vercel.app");
let workspace = { notes: seedNotes, tasks: seedTasks };

function readWorkspace() {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (
      parsed &&
      Array.isArray(parsed.notes) &&
      Array.isArray(parsed.tasks) &&
      parsed.notes.every((item) => item && typeof item.id === "string" && typeof item.title === "string" && typeof item.body === "string") &&
      parsed.tasks.every((item) => item && typeof item.id === "string" && typeof item.text === "string" && typeof item.done === "boolean")
    ) {
      workspace = parsed;
    }
  } catch (error) {
    console.error("Could not read the Orbit demo workspace.", error);
  }
}

function saveWorkspace() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(workspace));
  } catch (error) {
    console.error("Could not save the Orbit demo workspace.", error);
  }
}

function renderNotes() {
  noteGrid.replaceChildren();
  for (const note of workspace.notes.slice(0, 6)) {
    const article = document.createElement("article");
    article.className = "note-card";
    const top = document.createElement("div");
    top.className = "note-card-top";
    const accent = document.createElement("span");
    accent.className = "note-card-accent";
    accent.setAttribute("aria-hidden", "true");
    const date = document.createElement("span");
    date.className = "note-date";
    date.textContent = note.date || "Today";
    top.append(accent, date);
    const title = document.createElement("h3");
    title.textContent = note.title;
    const body = document.createElement("p");
    body.textContent = note.body;
    article.append(top, title, body);
    noteGrid.append(article);
  }
  document.querySelector("#note-count").textContent = String(workspace.notes.length);
  document.querySelector("#recent-count").textContent = `(${workspace.notes.length})`;
}

function renderTasks() {
  taskList.replaceChildren();
  for (const task of workspace.tasks) {
    const row = document.createElement("div");
    row.className = `task-row${task.done ? " is-done" : ""}`;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = task.id;
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      saveWorkspace();
      renderTasks();
    });
    const label = document.createElement("label");
    label.htmlFor = task.id;
    label.textContent = task.text;
    const tag = document.createElement("span");
    tag.className = `task-tag${task.tag === "WELLBEING" ? " tag-mint" : ""}`;
    tag.textContent = task.tag;
    row.append(checkbox, label, tag);
    taskList.append(row);
  }
  const completed = workspace.tasks.filter((task) => task.done).length;
  document.querySelector("#task-summary").textContent = `${completed} of ${workspace.tasks.length} complete`;
}

function openNoteDialog() {
  noteDialog.showModal();
  document.querySelector("#note-title").focus();
}

function addMessage(text, isUser) {
  const message = document.createElement("p");
  message.className = `chat-message${isUser ? " is-user" : ""}`;
  message.textContent = text;
  chatOutput.append(message);
}

function sampleReply(prompt) {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("week") || normalized.includes("plan")) {
    return "Try a gentle three-part plan: pick one priority, reserve a short block for it, then leave a little room for everything else. What is the one thing you would be glad to move forward?";
  }
  if (normalized.includes("step") || normalized.includes("idea")) {
    return "Start by describing the outcome in one sentence. Then list the smallest visible action you could take in 15 minutes. You can decide the next step after that.";
  }
  if (normalized.includes("focus") || normalized.includes("one thing")) {
    return "Choose one task that would make the rest feel lighter. Close one distraction, set a short timer, and give yourself permission to stop when it rings.";
  }
  return "Let's make this manageable. What would a useful outcome look like, and what is one small action you can take toward it today?";
}

readWorkspace();
renderNotes();
renderTasks();

document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(new Date());
if (liveAiEnabled) {
  document.querySelector(".sample-badge").textContent = "GEMINI AI";
  document.querySelector("#assistant-copy").textContent = "Ask Gemini to help you organize an idea or plan a next step. Avoid entering sensitive information.";
  document.querySelector("#privacy-note").lastChild.textContent = " Prompts are sent to Gemini. Notes remain saved only on this device.";
}
document.querySelectorAll("#add-note-button, #welcome-note-button, #all-notes-button").forEach((button) => button.addEventListener("click", openNoteDialog));
document.querySelector("#cancel-note").addEventListener("click", () => noteDialog.close());

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!noteForm.reportValidity()) return;
  const formData = new FormData(noteForm);
  workspace.notes.unshift({
    id: `note-${Date.now()}`,
    title: String(formData.get("title")).trim(),
    body: String(formData.get("body")).trim(),
    date: "Just now",
  });
  saveWorkspace();
  renderNotes();
  noteForm.reset();
  noteDialog.close();
});

document.querySelector("#about-button").addEventListener("click", () => document.querySelector("#about-dialog").showModal());
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const openDialog = Array.from(document.querySelectorAll("dialog[open]")).pop();
  if (openDialog) {
    event.preventDefault();
    openDialog.close();
  }
});

for (const chip of document.querySelectorAll(".suggestion-chip")) {
  chip.addEventListener("click", () => {
    chatPrompt.value = chip.dataset.prompt;
    chatPrompt.focus();
  });
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const prompt = chatPrompt.value.trim();
  if (!prompt) {
    chatPrompt.focus();
    return;
  }
  addMessage(prompt, true);
  chatPrompt.value = "";
  const submitButton = chatForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    let reply = sampleReply(prompt);
    if (liveAiEnabled) {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || `Gemini request failed with status ${response.status}.`);
      }
      if (typeof result.reply !== "string" || !result.reply.trim()) {
        throw new Error("Gemini returned an empty reply.");
      }
      reply = result.reply;
    }
    addMessage(reply, false);
  } catch (error) {
    console.error("Could not complete the Orbit AI request.", error);
    addMessage("Orbit could not reach Gemini just now. Please try again later.", false);
  } finally {
    submitButton.disabled = false;
    chatOutput.lastElementChild.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
});
