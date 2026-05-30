import { generateUUID } from "../utils/utils.js";

export function readEntries() {
  const entries = JSON.parse(localStorage.getItem("journal")) ?? [];
  return entries;
}

export function createEntry(data) {
  const entries = readEntries();
  const newEntry = {
    id: generateUUID(),
    date: data.date,
    location: data.location,
    notes: data.notes,
    rating: data.rating,
    eventsObserved: data.eventsObserved,
    createdAt: Date.now(),
  };
  entries.push(newEntry);
  localStorage.setItem("journal", JSON.stringify(entries));
}

export function deleteEntry(id) {
  const entries = readEntries();
  const updated = entries.filter((entry) => entry.id !== id);
  localStorage.setItem("journal", JSON.stringify(updated));
}

export function updateEntry(id, data) {
  const entries = readEntries();
  const updated = entries.map((entry) => {
    if (entry.id === id) {
      return { ...entry, ...data };
    } else {
      return entry;
    }
  });
  localStorage.setItem("journal", JSON.stringify(updated));
}

export function initJournal(city) {
  const dateInput = document.getElementById("journal-date");
  dateInput.value = new Date().toISOString().slice(0, 10);
  const locationInput = document.getElementById("journal-location");
  locationInput.value = city;
  const submit = document.getElementById("journal-submit");
  let selectedRating = 0;
  const ratingButtons = document.querySelectorAll("#journal-rating button");
  for (const button of ratingButtons) {
    button.addEventListener("click", () => {
      selectedRating = Number(button.dataset.rating);
    });
  }
  submit.addEventListener("click", () => {
    const data = {
      date: dateInput.value,
      location: locationInput.value,
      notes: document.getElementById("journal-notes").value,
      rating: selectedRating,
      eventsObserved: [],
    };
    createEntry(data);
    renderJournalList();
  });
  renderJournalList();
  const searchInput = document.getElementById("journal-search");
  searchInput.addEventListener("input", () => {
    const entries = readEntries();
    const search = searchInput.value;
    const filtered = entries.filter((entry) => {
      return (
        entry.notes.toLowerCase().includes(search.toLowerCase()) ||
        entry.location.toLowerCase().includes(search.toLowerCase())
      );
    });
    renderJournalList(filtered);
  });
}

export function renderJournalList(passedEntries) {
  const entries = passedEntries || readEntries();
  const list = document.getElementById("journal-list");
  if (!entries || entries.length === 0) {
    list.innerHTML = "<p>No entries yet.</p>";
    return;
  } else {
    const html = entries
      .map(
        (entry, index) => `
            <div class="event-card" style="--i: ${index}">
                <h3>${entry.date}</h3>
                <p>${entry.location}</p>
                <p>${entry.notes}</p>
                <p>${"⭐".repeat(entry.rating)}</p>
                <button class="delete-btn" data-id="${entry.id}">Delete</button>
            </div>
        `,
      )
      .join("");
    list.innerHTML = html;
    const deleteButtons = list.querySelectorAll(".delete-btn");
    for (const button of deleteButtons) {
      button.addEventListener("click", () => {
        deleteEntry(button.dataset.id);
        renderJournalList();
      });
    }
  }
}
