'use strict';
document.addEventListener('DOMContentLoaded', function () {
  const calendarDays = document.getElementById('calendar-days');
  const monthYear = document.getElementById('month-year');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');


  let currentDate = new Date();

  function renderCalendar() {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startDayIndex = firstDay.getDay();

    monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
    let daysHTML = '';

    for (let i = 0; i < startDayIndex; i++) {
      daysHTML += `<div class="other-month"></div>`;
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === currentDate.getDate() && currentDate.getMonth() === new Date().getMonth();
      daysHTML += `<div class="${isToday ? 'today' : ''}">${i}</div>`;
    }

    calendarDays.innerHTML = daysHTML;
  }

  renderCalendar();

  prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });
});


///////////////////////////////////////////////////////////////////////////
const eventForm = document.getElementById('event-reservation-form');
document.addEventListener("DOMContentLoaded", function () {
  // Get the form element
  var form = document.getElementById("event-reservation-form");
  // Add a submit event listener to the form
  form.addEventListener("submit", function (event) {
    // Prevent the default form submission
    event.preventDefault();
    // Serialize form data into JSON
    var formData = {
      rfid: form.querySelector("#rfid").value,
      name: form.querySelector("#name").value,
      residency: form.querySelector("#residency").value,
      email: form.querySelector("#email").value,
      event: form.querySelector("#event").value,
      guests: parseInt(form.querySelector("#guests").value, 10),
      daysOfEvent: parseInt(form.querySelector("#days-of-event").value, 10),
      oneDate: form.querySelector("#one-date").value || null,
      timeFromOne: form.querySelector("#time-from-one").value || null,
      timeToOne: form.querySelector("#time-to-one").value || null,
      dateFrom: form.querySelector("#date-from").value || null,
      timeFrom: form.querySelector("#time-from").value || null,
      dateTo: form.querySelector("#date-to").value || null,
      timeTo: form.querySelector("#time-to").value || null
    };

    // Send the form data to the server using the fetch API
    fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not okay");
        }
        return response.text();
      })
      .then((data) => {
        // Handle different server responses
        if (data.startsWith("Invalid RFID for resident")) {
          alert("Invalid RFID for resident. Please check your RFID value and try again.");
        } else if (data.startsWith("You cannot reserve this event")) {
          alert("You cannot reserve this event. This reservation is exclusive for residents only.");
        } else if (data.startsWith("A reservation with overlapping date ranges already exists")) {
          alert("A reservation with overlapping date ranges already exists. Please choose different dates.");
        } else if (data.startsWith("Invalid date range")) {
          alert("Invalid date range. Please check your date and time values.");
        } else if (data.startsWith("Reservation submitted successfully")) {
          // Show a success message
          alert("Thank you for submitting your event reservation form! We have received your request and will be in touch soon to confirm your reservation. In the meantime, please feel free to contact us if you have any questions or need anything at all. We look forward to helping you create a memorable event at our village!");
          form.reset();
          form.querySelector("#rfid").value = formData.rfid;
          form.querySelector("#name").value = formData.name;
          form.querySelector("#email").value = formData.email;
        } else {
          // Handle unexpected responses
          console.error("Server response:", data);
          alert("You cannot reserve this event. This reservation is exclusive for residents only.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("You cannot reserve this event. This reservation is exclusive for residents only.");
      });
  });
});

/////////////////////////////////////////////////////////////////
//---------------------login form---------------------------//
document.addEventListener("DOMContentLoaded", function () {
  const loginContainer = document.getElementById('loginForm');
  loginContainer.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not okay");
        }
        return response.json();
      })
      .then(data => {
        console.log("Client received data:", data);

        if (data.message.startsWith("Invalid username or password")) {
          alert("Invalid username or password. Please check your credentials and try again.");
        } else if (data.message.startsWith("Internal server error")) {
          alert("Internal server error. Please try again later.");
        } else if (data.message.startsWith("Login successful")) {
          alert("Login successfully. Welcome residence of Monte Brisa.");
          window.location.href = '/index.html';
        } else {
          console.error("Server response:", data);
          alert("An unexpected error occurred. Please try again.");
        }
      })
      .catch(error => {
        console.error("Client error:", error);
        alert("An error occurred. Please try again.");
      });
  });
});

// Function to toggle password visibility
function togglePassword() {
  var x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    sendFormData(form);
  });

  function sendFormData(form) {
    const formData = new FormData(form);

    // Log the form data to the console for debugging
    for (const [name, value] of formData) {
      console.log(name + ': ' + value);
    }

    fetch('/submit-form', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Data saved and email sent successfully') {
          // Display a success message using an alert or any other UI element
          alert('Form submitted successfully');
          form.reset(); // Clear the form fields if needed
        } else {
          // Display an error message using an alert or any other UI element
          alert('Form submission failed');
        }
      })
      .catch((error) => {
        // Handle network errors or other issues
        console.error('Error:', error);
        alert('An error occurred while submitting the form');
      });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("reserved-date-button");
  const cardContainer = document.getElementById("floating-card");
  const contentContainer = document.getElementById("content"); // This container will hold the data
  let cardVisible = false;

  button.addEventListener("click", function () {
    cardVisible = !cardVisible;

    if (cardVisible) {
      cardContainer.style.display = "block";

      // Fetch data from MongoDB
      fetch("/getDataFromMongoDB?collectionName=reserved")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response error. Please try again.");
          }
          return response.json();
        })
        .then((data) => {
          if (contentContainer) {
            contentContainer.innerHTML = ""; // Clear previous content

            if (data.length > 0) {
              data.forEach((record) => {
                const cardContent = `
                  <p>Name: ${record.name}</p>
                  <p>Event: ${record.event}</p>
                  <p>Date: ${record.date}</p>
                  <p>Guest: ${record.guest}</p>
                `;
                const card = document.createElement("div");
                card.classList.add("card");
                card.innerHTML = cardContent;
                contentContainer.appendChild(card);
              });
            } else {
              contentContainer.innerHTML = "<p class='no-data'>No data found</p>";
            }
          } else {
            console.error("Element with id 'content' not found.");
          }
        })
        .catch((error) => {
          console.error("Error during data retrieval:", error);
        });
    } else {
      cardContainer.style.display = "none";
    }
  });
// Get the elements you want to show/hide
const oneDayDiv = document.getElementById("one-day");
const selectDateDiv = document.getElementById("select-date");
const daysOfEventInput = document.getElementById("days-of-event");
const dateNumber = document.getElementById("date-number");

// Hide the date-number initially
dateNumber.style.display = "none";

// Add an event listener to the days-of-event input
daysOfEventInput.addEventListener("input", function () {
    const daysValue = parseInt(daysOfEventInput.value);

    if (daysValue === 1) {
        oneDayDiv.style.display = "block";
        selectDateDiv.style.display = "none";
        dateNumber.style.display = "block"; // Show the parent container
    } else if (daysValue >= 2 && daysValue <= 30) {
        oneDayDiv.style.display = "none";
        selectDateDiv.style.display = "block";
        dateNumber.style.display = "block"; // Show the parent container
    } else {
        oneDayDiv.style.display = "none";
        selectDateDiv.style.display = "none";
        dateNumber.style.display = "none";
    }
});

});
