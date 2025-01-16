// Function to detect the page and show content accordingly
function displayPageContent() {
    // Get the current location path
    const path = window.location.pathname;

    // Select the content divs
    const homeContent = document.getElementById('homeContent');
    const aboutContent = document.getElementById('aboutContent');

    // Check the url path to determine which content to show
    if (path === '/' || path === '/home') {
        homeContent.classList.add('welcome')
        homeContent.classList.remove('hidden');
        aboutContent.classList.add('hidden');
    } else if (path === '/about') {
        // Show about content
        homeContent.classList.add('hidden');
        aboutContent.classList.remove('hidden');
    } else {
        // Optionally handle other pages or show a default
        homeContent.classList.add('hidden');
        aboutContent.classList.add('hidden');
    }
}

// Call the function on page load
window.onload = displayPageContent;