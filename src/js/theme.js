// Fallback colors (in case CSS variables aren't loaded)
const fallbackColors = {
    "--text-color": "#59b6d3",
    "--hover-color": "#b17387",
    "--accent-color": "#f1ce63",
    "--accent-color-2": "#447ecf",
    "--background-color": "#426491",
};

// Common image extensions to look for
const imageExtensions = ["jpg", "jpeg", "png", "webp", "gif", "svg"];

function getColorsFromCSS() {
    // Get the computed CSS variables from the document
    const rootStyles = getComputedStyle(document.documentElement);

    // Map pywal CSS variables to your theme variables
    const colorMapping = {
        "--text-color": rootStyles.getPropertyValue("--foreground").trim(),
        "--hover-color": rootStyles.getPropertyValue("--color5").trim(),
        "--accent-color": rootStyles.getPropertyValue("--color3").trim(),
        "--accent-color-2": rootStyles.getPropertyValue("--color4").trim(),
        "--background-color": rootStyles.getPropertyValue("--color1").trim(),
    };

    // Check if we got valid colors (not empty)
    const hasValidColors = Object.values(colorMapping).every(
        (color) => color && color !== "",
    );

    if (hasValidColors) {
        console.log("✅ Loaded pywal colors from CSS:", colorMapping);
        return colorMapping;
    } else {
        console.log("⚠️ CSS variables not found or empty");
        return null;
    }
}

async function loadCarouselImage() {
    const imageElement = document.getElementById("carouselImage");
    const imageContainer = document.getElementById("image");

    if (!imageElement || !imageContainer) {
        console.log("⚠️ Image elements not found");
        return;
    }

    // Try to find images in the theme folder
    for (const ext of imageExtensions) {
        try {
            const imagePath = `src/theme/wallpaper.${ext}`;

            // Create a test image to check if the file exists
            const testImg = new Image();

            await new Promise((resolve, reject) => {
                testImg.onload = () => {
                    console.log(`✅ Found image: ${imagePath}`);
                    imageElement.src = imagePath;
                    imageElement.style.opacity = "0";
                    imageElement.style.transition = "opacity 0.3s ease";

                    // Fade in the image
                    setTimeout(() => {
                        imageElement.style.opacity = "1";
                    }, 100);

                    resolve();
                };

                testImg.onerror = () => reject();
                testImg.src = imagePath;
            });

            // If we get here, we found an image
            return;
        } catch (error) {
            // Continue to next extension
            continue;
        }
    }

    // If no image found, hide the container
    console.log("⚠️ No wallpaper image found in theme folder");
    imageContainer.style.display = "none";
}

function updateColors() {
    let colorSet = null;

    // Try to get colors from CSS variables first
    colorSet = getColorsFromCSS();

    if (!colorSet) {
        console.log("⚠️ Using fallback colors");
        colorSet = fallbackColors;
    }

    // Apply the colors to CSS variables
    for (const [property, value] of Object.entries(colorSet)) {
        document.documentElement.style.setProperty(property, value);
    }

    console.log("🎨 Applied colors:", colorSet);
}

// Initialize when page loads
window.onload = function () {
    const textElement = document.getElementById("text");
    const htmlElement = document.getElementsByTagName("html")[0];

    if (textElement) textElement.classList.add("loaded");
    if (htmlElement) htmlElement.classList.add("loaded");

    // Apply colors and load image
    updateColors();
    loadCarouselImage();
};
