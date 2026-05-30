export function openModal(content) {
  const modalOverlay = document.getElementById("modal-overlay");
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `${content} <button class="modal-close-btn">Close</button>`;
  const closeBtn = modalContent.querySelector("button");
  closeBtn.addEventListener("click", closeModal);
  modalOverlay.classList.remove("hidden");
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });
}

export function closeModal() {
  const modalOverlay = document.getElementById("modal-overlay");
  modalOverlay.classList.add("hidden");
}
