const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let photosArray = [];
let ready = false;
let imagesLoaded = 0;

// Unsplash API
// TODO: move this to .env file
// const apiKey = "nhv9fi7yTcTFSd5qEuYrB2MH6TgfBmv-QWGMRih8xeM";
const apiKey = config.API_KEY;
const images_per_page = 10;
// const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;
let apiUrl = `https://api.pexels.com/v1/search?query=forest&per_page=${images_per_page}`;

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === images_per_page) {
    ready = true;
    loader.hidden = true;
  }
}

// Helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create Elements for links & photos, Add to POM
function displayPhotos() {
  imagesLoaded = 0;

  // Go through fetched photos run function
  photosArray.forEach((photo) => {
    // Create <a> to link to Unsplash
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.url,
      target: "_blank",
    });

    // Create <img> for photo
    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.src.large,
      alt: photo.alt || "Alt description unavailable",
      title: photo.alt || "Title unavailable",
    });

    // Event listener, check when each is finished loading
    img.addEventListener("load", imageLoaded());

    // Put <img> inside <a>, then put both inside imageContainer Element
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Get photos from unsplash api
async function getPhotos() {
  try {
    const reponse = await fetch(apiUrl);
    data = await reponse.json();

    photosArray = data.photos;
    apiUrl = data.next_page;

    displayPhotos();
  } catch (error) {
    console.log(error);
  }
}

// Check to see if scrolling near botton of page, Load More Photos
window.addEventListener("scroll", () => {
  if (
    ready &&
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 500
  ) {
    ready = false;
    getPhotos();
  }
});

// On load
getPhotos();
