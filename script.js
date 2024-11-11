const apiBaseUrl = 'https://east-side-spots-api.onrender.com';

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

// Fetch by name
async function fetchByName() {
  const name = document.getElementById('place-name').value.trim();
  if (!name) return displayError('Please enter a place name.');
  
  try {
    const response = await fetch(`${apiBaseUrl}/name/${encodeURIComponent(name)}`);
    const data = await response.json();
    displayPlaceDetails(data);
  } catch (error) {
    console.error('Error fetching by name:', error);
    displayError('Failed to fetch place details.');
  }
}

// Display array of results
function displayResults(places, title) {
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = `<h3>${title}</h3>`;
  places.forEach(place => {
    const item = document.createElement('div');
    item.className = 'result-item';
    item.textContent = place;
    resultsContainer.appendChild(item);
  });
}

// Display detailed information for a single place
function displayPlaceDetails(place) {
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = `
    <div class="result-item">
      <h3>${place.name}</h3>
      <p><strong>Address:</strong> ${place.address}</p>
      <p><strong>Rating:</strong> ${place.rating}</p>
      <p><strong>Description:</strong> ${place.desc}</p>
    </div>
  `;
}

// Display error message
function displayError(message) {
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = `<p style="color: red;">${message}</p>`;
}

// Event listeners
document.getElementById('category-select').addEventListener('change', fetchByCategory);
document.getElementById('min-rating').addEventListener('change', fetchByRating);
document.getElementById('place-name').addEventListener('input', (event) => {
  if (event.key === 'Enter') {
    fetchByName();
  }
});
