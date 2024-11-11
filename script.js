const apiBaseUrl = 'https://east-side-spots-api.onrender.com';

// Fetch all places initially to allow searching locally
let allPlaces = [];

// Fetch all places on load to enable case-insensitive name searching
async function fetchAllPlaces() {
  try {
    const response = await fetch(`${apiBaseUrl}/spot?category=all`);
    allPlaces = await response.json();
  } catch (error) {
    console.error('Error fetching all places:', error);
    displayError('Failed to load places.');
  }
}

// Fetch by category
async function fetchByCategory() {
  const category = document.getElementById('category-select').value;
  try {
    const response = await fetch(`${apiBaseUrl}/spot?category=${category}`);
    const data = await response.json();
    displayResults(data, `Places in category: ${category}`);
  } catch (error) {
    console.error('Error fetching by category:', error);
    displayError('Failed to fetch places by category.');
  }
}

// Fetch by minimum rating
async function fetchByRating() {
  const minRating = document.getElementById('min-rating').value;
  if (!minRating) return displayError('Please enter a minimum rating.');
  
  try {
    const response = await fetch(`${apiBaseUrl}/rating?min=${minRating}`);
    const data = await response.json();
    displayResults(data, `Places with a rating of at least ${minRating}`);
  } catch (error) {
    console.error('Error fetching by rating:', error);
    displayError('Failed to fetch places by rating.');
  }
}

// Search by name in a case-insensitive and partial matching manner
function searchByName() {
  const input = document.getElementById('place-name').value.trim().toLowerCase();
  if (!input) return displayError('Please enter a place name.');

  const filteredPlaces = allPlaces.filter(place => place.toLowerCase().includes(input));
  displayResults(filteredPlaces, `Results for: "${input}"`);
}

// Display array of results with clickable restaurant names and static ratings
function displayResults(places, title) {
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = `<h3>${title}</h3>`;

  if (places.length === 0) {
    resultsContainer.innerHTML += '<p>No results found.</p>';
    return;
  }

  places.forEach(place => {
    const item = document.createElement('div');
    item.className = 'result-item';

    // Create a clickable title for the restaurant name
    const name = document.createElement('span');
    name.className = 'clickable-name';
    name.textContent = place;
    name.addEventListener('click', () => openGoogleSearch(place));
    addZoomEffect(name); // Add zoom effect to the restaurant name

    // Append only the clickable name to the item
    item.appendChild(name);
    resultsContainer.appendChild(item);
  });
}

// Display detailed information for a single place with non-clickable rating
function displayPlaceDetails(place) {
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = `
    <div class="result-item">
      <span class="clickable-name" onclick="openGoogleSearch('${place.name}')">${place.name}</span>
      <p><strong>Rating:</strong> ${place.rating}</p>
      <p><strong>Address:</strong> ${place.address}</p>
      <p><strong>Description:</strong> ${place.desc}</p>
    </div>
  `;
}

// Open a Google search for the clicked place
function openGoogleSearch(place) {
  const searchQuery = encodeURIComponent(place);
  window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
}

// Add zoom effect only to clickable names
function addZoomEffect(element) {
  element.addEventListener('mouseenter', () => {
    element.style.transform = 'scale(1.1)';
    element.style.transition = 'transform 0.2s ease-in-out';
  });
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'scale(1)';
  });
}

// Display an error message
function displayError(message) {
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = `<p style="color: red;">${message}</p>`;
}

// Initialize and load all places for searching by name
fetchAllPlaces();
document.getElementById('place-name').addEventListener('input', searchByName);
