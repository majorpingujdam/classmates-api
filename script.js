const apiBaseUrl = 'https://east-side-spots-api.onrender.com';

// Initialize an array to store all places for local searching
let allPlaces = [];

// Fetch all places on load for enabling case-insensitive name search
async function fetchAllPlaces() {
  try {
    const response = await fetch(`${apiBaseUrl}/spot?category=all`);
    allPlaces = await response.json();
    console.log('Loaded all places:', allPlaces); // Log for debugging
  } catch (error) {
    console.error('Error fetching all places:', error);
    displayError('Failed to load places. Please try again later.');
  }
}

// Fetch places by category
async function fetchByCategory() {
  const category = document.getElementById('category-select').value;
  if (!category) return displayError('Please select a category.');

  try {
    const response = await fetch(`${apiBaseUrl}/spot?category=${category}`);
    const data = await response.json();
    displayResults(data, `Places in category: ${category}`);
  } catch (error) {
    console.error('Error fetching by category:', error);
    displayError('Failed to fetch places by category.');
  }
}

// Fetch places by minimum rating
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

// Search places by name with case-insensitive and partial matching
function searchByName() {
  const input = document.getElementById('place-name').value.trim().toLowerCase();
  if (!input) return displayError('Please enter a place name.');

  const filteredPlaces = allPlaces.filter(place =>
    place.toLowerCase().includes(input)
  );

  if (filteredPlaces.length > 0) {
    displayResults(filteredPlaces, `Results for: "${input}"`);
  } else {
    displayError(`No results found for: "${input}"`);
  }
}

// Display results with clickable names and static ratings
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

    // Create a clickable title for the place name
    const name = document.createElement('span');
    name.className = 'clickable-name';
    name.textContent = place;
    name.addEventListener('click', () => openGoogleSearch(place));
    addZoomEffect(name); // Add zoom effect to the clickable name

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

// Add zoom effect to elements
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

// Initialize and load all places for searching by name on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchAllPlaces();

  // Set up event listeners for search functionality
  document.getElementById('category-select').addEventListener('change', fetchByCategory);
  document.getElementById('min-rating').addEventListener('change', fetchByRating);
  document.getElementById('place-name').addEventListener('input', searchByName);
});
