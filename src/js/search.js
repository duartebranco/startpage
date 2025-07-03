// Auto-focus the search box when page loads
window.addEventListener('load', function() {
    const searchBox = document.getElementById('search-box');
    
    // Add a small delay to ensure the page is fully loaded
    setTimeout(() => {
        searchBox.focus();
    }, 300);
});

// Handle search form submission
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
    
    const searchBox = document.getElementById('search-box');
    const query = searchBox.value.trim();
    
    if (!query) {
        return; // Don't search if empty
    }
    
    // Construct the Google search URL
    const searchUrl = `https://google.com/search?q=${encodeURIComponent(query)}`;
    
    // Navigate to the search URL
    window.location.href = searchUrl;
});

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    const searchBox = document.getElementById('search-box');
    
    // Focus search box when pressing '/' (like vim)
    if (e.key === '/' && document.activeElement !== searchBox) {
        e.preventDefault();
        searchBox.focus();
    }
    
    // Clear search box when pressing Escape
    if (e.key === 'Escape') {
        searchBox.blur();
        if (searchBox.value) {
            searchBox.value = '';
        }
    }
});
