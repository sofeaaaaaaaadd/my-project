let currentBooking = { spot: null, time: null, location: null, timeout: null };

// Function to show a specific page by its ID
function showPage(pageId) {
    const pages = document.querySelectorAll(".page");
    pages.forEach((page) => {
        page.classList.remove("active");
    });
    document.getElementById(pageId).classList.add("active");

    // Initialize the map when the details page is shown
    if (pageId === "details") {
        initializeMap();
    }

    // Update booking details when viewing or canceling booking
    if (pageId === "viewBooking" || pageId === "cancelBooking") {
        updateBookingDetails();
    }
}

// Function to handle login
function login() {
    const userInput = document.getElementById("userInput").value;
    const password = document.getElementById("password").value;
    if (userInput && password) {
        alert("Logged in successfully");
        showPage("dashboard");
    } else {
        alert("Please fill in all fields");
    }
}

// Function to handle forgot password
function showForgotPassword() {
    const userInput = prompt("Enter your phone number, username, or email:");
    if (userInput) {
        alert("Password reset link sent to " + userInput);
    } else {
        alert("Please enter your phone number, username, or email");
    }
}

// Function to handle registration
function register() {
    const regEmail = document.getElementById("regEmail").value;
    const regFullName = document.getElementById("regFullName").value;
    const regUsername = document.getElementById("regUsername").value;
    const regPassword = document.getElementById("regPassword").value;
    const regCarPlate = document.getElementById("regCarPlate").value;

    if (regEmail && regFullName && regUsername && regPassword && regCarPlate) {
        alert("Registered successfully");
        showPage("home");
    } else {
        alert("Please fill in all fields");
    }
}

// Function to create parking spots
function createParkingSpots(parkingSpotsId) {
    const parkingSpotsContainer = document.getElementById(parkingSpotsId);
    parkingSpotsContainer.innerHTML = ""; // Clear existing spots
    for (let i = 1; i <= 15; i++) {
        const spot = document.createElement("div");
        spot.classList.add("spot");
        spot.classList.add(getRandomStatus()); // Simulate random status
        spot.innerText = `Spot ${i}`;
        spot.onclick = () => selectSpot(parkingSpotsId, spot);
        parkingSpotsContainer.appendChild(spot);
    }
}

// Function to get a random status for parking spots (simulate real-time data)
function getRandomStatus() {
    const statuses = ["available", "reserved", "unavailable"];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

// Function to select a parking spot
function selectSpot(parkingSpotsId, spot) {
    if (spot.classList.contains("unavailable")) {
        alert("This parking spot is unavailable.");
    } else if (spot.classList.contains("reserved")) {
        alert("This parking spot is reserved.");
    } else {
        const spots = document.querySelectorAll(`#${parkingSpotsId} .spot`);
        spots.forEach((s) => {
            s.classList.remove("selected");
        });
        spot.classList.add("selected");
    }
}

// Function to confirm booking
function confirmBooking(block) {
    const timeInput = document.getElementById(`parkingTime${block}`).value;
    if (timeInput) {
        const selectedSpot = document.querySelector(`#parkingSpots${block} .selected`);
        if (selectedSpot) {
            alert(`Booking confirmed for ${selectedSpot.innerText} at ${timeInput}`);
            currentBooking.spot = selectedSpot.innerText;
            currentBooking.time = timeInput;
            currentBooking.location = `Block ${block}`;
            showPage("details");
            document.getElementById("selectedSpot").innerText = selectedSpot.innerText;
            document.getElementById("location").innerText = `Block ${block}`;

            // Set a timeout to cancel the booking if the user does not arrive within 15 minutes
            if (currentBooking.timeout) {
                clearTimeout(currentBooking.timeout);
            }
            currentBooking.timeout = setTimeout(cancelBooking, 15 * 60 * 1000); // 15 minutes
        } else {
            document.getElementById(`timeAlert${block}`).innerText = "Please select a parking spot.";
        }
    } else {
        document.getElementById(`timeAlert${block}`).innerText = "Please enter a parking time.";
    }
}

// Function to initialize parking spots
createParkingSpots("parkingSpotsD");
createParkingSpots("parkingSpotsC");
createParkingSpots("parkingSpotsM");

// Function to initialize map
function initializeMap() {
    const mapContainer = document.getElementById('map');
    if (mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
    }
    const map = L.map(mapContainer).setView([4.3365, 100.9278], 15); // UTP coordinates
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
}

// Function to view current booking
function viewBooking() {
    if (currentBooking.spot && currentBooking.time && currentBooking.location) {
        showPage("viewBooking");
    } else {
        alert("You have no current bookings.");
    }
}

// Function to update booking details in view booking page
function updateBookingDetails() {
    if (currentBooking.spot && currentBooking.time && currentBooking.location) {
        document.getElementById("currentSpot").innerText = currentBooking.spot;
        document.getElementById("currentTime").innerText = currentBooking.time;
        document.getElementById("currentLocation").innerText = currentBooking.location;
    }
}

// Function to cancel booking
function cancelBooking() {
    if (currentBooking.spot && currentBooking.time && currentBooking.location) {
        showPage("cancelBooking");
    } else {
        alert("You have no current bookings.");
    }
}

// Function to confirm cancellation
function confirmCancellation() {
    currentBooking = { spot: null, time: null, location: null, timeout: null };
    alert("Booking canceled successfully.");
    showPage("dashboard");
}