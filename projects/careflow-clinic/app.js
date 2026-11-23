const bookingForm = document.querySelector("#booking-form");
const bookingStatus = document.querySelector("#booking-status");
const visitDate = document.querySelector("#visit-date");

if (bookingForm && bookingStatus && visitDate) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  visitDate.min = localToday;

  for (const serviceLink of document.querySelectorAll("[data-service]")) {
    serviceLink.addEventListener("click", () => {
      document.querySelector("#visit-service").value = serviceLink.dataset.service;
    });
  }

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    bookingStatus.textContent = "";

    if (!bookingForm.reportValidity()) {
      return;
    }

    const formData = new FormData(bookingForm);
    const reference = `DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const firstName = String(formData.get("name")).trim().split(/\s+/)[0];
    bookingStatus.textContent = `Demo complete, ${firstName}. Reference ${reference} was created on this page only. Nothing was sent or booked.`;
    bookingForm.reset();
    visitDate.min = localToday;
  });
}
