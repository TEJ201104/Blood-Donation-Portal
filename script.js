const donorForm = document.getElementById("donorForm");
const donorCards = document.getElementById("donorCards");
const searchInput = document.getElementById("searchInput");
const filterBloodType = document.getElementById("filterBloodType");
const successMsg = document.getElementById("successMsg");

let donors = JSON.parse(localStorage.getItem("donors")) || [];

function renderDonors(data) {
  donorCards.innerHTML = "";
  if (data.length === 0) {
    donorCards.innerHTML = "<p>No donors found.</p>";
    return;
  }

  data.forEach(donor => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${donor.name}</h3>
      <p><strong>Blood Type:</strong> ${donor.bloodType}</p>
      <p><strong>Location:</strong> ${donor.location}</p>
      <p><strong>Date:</strong> ${donor.registeredAt}</p>
    `;
    donorCards.appendChild(card);
  });
}

function isEligibleToDonateAgain(name, bloodType, date) {
  const now = new Date(date);
  return !donors.some(donor => {
    return donor.name.toLowerCase() === name.toLowerCase() &&
           donor.bloodType === bloodType &&
           (now - new Date(donor.registeredAt)) < 90 * 24 * 60 * 60 * 1000;
  });
}

donorForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const location = document.getElementById("location").value.trim();
  const bloodType = document.getElementById("bloodType").value;
  const registeredAt = document.getElementById("registrationDate").value;

  if (!name || !bloodType || !location || !registeredAt) {
    alert("Please fill in all fields.");
    return;
  }

  if (!isEligibleToDonateAgain(name, bloodType, registeredAt)) {
    alert("You can only register once every 3 months.");
    return;
  }

  const newDonor = { name, bloodType, location, registeredAt };
  donors.push(newDonor);
  localStorage.setItem("donors", JSON.stringify(donors));
  donorForm.reset();

  donorCards.innerHTML = ""; // Don't show donors after register
  successMsg.textContent = "✅ Registered successfully!";
  setTimeout(() => successMsg.textContent = "", 3000);
});

// Filter on dropdown and input
function filterDonors() {
  const bloodFilter = filterBloodType.value.toLowerCase();
  const cityFilter = searchInput.value.toLowerCase();

  // If both filters are empty, clear donorCards and return
  if (bloodFilter === "" && cityFilter === "") {
    donorCards.innerHTML = "";
    return;
  }

  const filtered = donors.filter(donor =>
    (bloodFilter === "" || donor.bloodType.toLowerCase() === bloodFilter) &&
    (cityFilter === "" || donor.location.toLowerCase().includes(cityFilter))
  );

  renderDonors(filtered);
}


filterBloodType.addEventListener("change", filterDonors);
searchInput.addEventListener("input", filterDonors);
