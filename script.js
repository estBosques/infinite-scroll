"use strict";

import env from "./config.json" assert { type: "json" };

const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const statisticsContainer = document.getElementById("statistics-container");
const statisticText = document.getElementById("statistics-text");
const closeStatisticsBtn = document.getElementById("close-statistics");

let photosArray = [];
let ready = false;
let imagesLoaded = 0;
let query = "forest";
let totalPictures = 0;

// Unsplash API
// TODO: move this to .env file
const apiKey = env.API_KEY;
const imagesPerPage = 10;
let apiUrl = `https://api.pexels.com/v1/search?query=${query}&per_page=${imagesPerPage}`;

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  totalPictures++;
  if (imagesLoaded === imagesPerPage) {
    ready = true;
    loader.hidden = true;
    updateStatistics();
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
    const response = await fetch(apiUrl, {
      headers: new Headers({
        Authorization: apiKey,
      }),
    });
    const data = await response.json();

    photosArray = data.photos;
    apiUrl = data.next_page;

    displayPhotos();
  } catch (error) {
    console.log(error);
  }
}

function updateSearchCriteria() {
  query = searchInput.value.trim();

  if (query !== "") {
    ready = false;
    totalPictures = 0;

    apiUrl = `https://api.pexels.com/v1/search?query=${query}&per_page=${imagesPerPage}`;

    imageContainer.innerHTML = "";
    loader.hidden = false;
    getPhotos();
  }
}

function updateStatistics() {
  let statistics = `Total images loaded: ${totalPictures}<br/>Images loaded per page: ${imagesPerPage}<br/>Search criteria: ${query}<br/>`;
  statisticText.innerHTML = statistics;
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

// Fetch new images with provided query
searchBtn.addEventListener("click", updateSearchCriteria);
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    updateSearchCriteria();
  }
});

closeStatisticsBtn.addEventListener("click", () => {
  statisticsContainer.hidden = true;
});

// On load
getPhotos();
