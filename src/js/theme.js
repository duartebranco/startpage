// Fallback colors (in case CSS variables aren't loaded)
const fallbackColors = {
    "--text-color": "#59b6d3",
    "--hover-color": "#b17387",
    "--accent-color": "#f1ce63",
    "--accent-color-2": "#447ecf",
    "--background-color": "#426491",
};

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

async function checkBookmarksExists() {
    try {
        const response = await fetch("bookmarks.html");

        // Check if the response is successful AND actually contains HTML content
        if (response.ok) {
            const text = await response.text();
            // Check if it's actually HTML content (not a 404 page or error)
            if (
                text.includes("<!doctype html") ||
                text.includes("<html") ||
                text.includes("bookmark")
            ) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.log("⚠️ Bookmarks file not found:", error);
        return false;
    }
}

async function makeImageClickableIfBookmarksExists() {
    const imageElement = document.getElementById("carouselImage");
    const imageContainer = document.getElementById("image");

    if (!imageElement || !imageContainer) {
        console.log("⚠️ Image elements not found");
        return;
    }

    const bookmarksExists = await checkBookmarksExists();

    if (bookmarksExists) {
        console.log("✅ Bookmarks file found - making image clickable");

        // Create an anchor element and wrap the image
        const anchor = document.createElement("a");
        anchor.href = "bookmarks.html";

        // Remove the image from its current parent
        imageElement.parentNode.removeChild(imageElement);

        // Add the image to the anchor
        anchor.appendChild(imageElement);

        // Add the anchor to the image container
        imageContainer.appendChild(anchor);

        // Add some styling to indicate it's clickable
        imageElement.style.cursor = "pointer";
        imageElement.title = "Click to view bookmarks";
    } else {
        console.log(
            "⚠️ Bookmarks file not found - image will not be clickable",
        );
    }
}

async function loadCarouselImage() {
    const imageElement = document.getElementById("carouselImage");
    const imageContainer = document.getElementById("image");

    if (!imageElement || !imageContainer) {
        console.log("⚠️ Image elements not found");
        return;
    }

    try {
        // Priority order: png first, then jpg, then other common formats
        const imageExtensions = [
            "png",
            "jpg",
            "jpeg",
            "gif",
            "webp",
            "bmp",
            "svg",
        ];
        let foundWallpaper = null;

        // Try each extension in priority order
        for (const ext of imageExtensions) {
            const testPath = `src/theme/wallpaper.${ext}`;

            try {
                const testImg = new Image();

                await new Promise((resolve, reject) => {
                    testImg.onload = () => {
                        foundWallpaper = testPath;
                        resolve();
                    };
                    testImg.onerror = () => reject();
                    testImg.src = testPath;
                });

                // If we reach here, we found a valid wallpaper
                break;
            } catch (error) {
                // Continue to next extension
                continue;
            }
        }

        if (foundWallpaper) {
            console.log(`✅ Found wallpaper: ${foundWallpaper}`);
            imageElement.src = foundWallpaper;
            imageElement.style.opacity = "0";
            imageElement.style.transition = "opacity 0.3s ease";

            // Fade in the image
            setTimeout(() => {
                imageElement.style.opacity = "1";
            }, 100);
        } else {
            throw new Error("No wallpaper file found");
        }
    } catch (error) {
        // If no wallpaper found, hide the container
        console.log("⚠️ No wallpaper file found in theme folder");
        imageContainer.style.display = "none";
    }
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
    loadCarouselImage().then(() => {
        // After the image is loaded, check if we should make it clickable
        makeImageClickableIfBookmarksExists();
    });
};
