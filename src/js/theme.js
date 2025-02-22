let currentIndex = 0;

const images = ["cover2.webp"];
const colorSets = [
  {
    "--text-color": "#59b6d3",
    "--hover-color": "#b17387",
    "--accent-color": "#f1ce63",
    "--accent-color-2": "#447ecf",
    "--background-color": "#426491",
  },
];

function preloadImages() {
  for (let i = 0; i < images.length; i++) {
    const img = new Image();
    img.src = "../src/images/cover2.webp";
  }
}

function updateColors() {
  const colorSet = colorSets[currentIndex];
  // Iterate through the colorSet and set the CSS variables
  for (const [property, value] of Object.entries(colorSet)) {
    document.documentElement.style.setProperty(property, value);
  }
}
// Set colors with current index first
updateColors(currentIndex);

// Set the initial image
document.getElementById("carouselImage").src = "../src/images/cover2.webp";

// Image is opacity 0 and text is translated off screen by default
// Add the loaded class to the image and text to animate them in
window.onload = function () {
  document.getElementById("image").classList.add("loaded");
  document.getElementById("text").classList.add("loaded");
  document.getElementsByTagName("html")[0].classList.add("loaded");
  // Preload the image
  preloadImages();
};