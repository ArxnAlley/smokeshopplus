console.log("JS FILE LOADED");

/* =========================================
   GLOBAL INIT
========================================= */

window.addEventListener("DOMContentLoaded", () => {

  console.log("DOM LOADED");

  initReviews();
  initMobileMenu();
  initPillVisibility();

});

/* =========================================
   PILL SCROLL CONTROL
========================================= */

function initPillVisibility(){

  const storeSection = document.getElementById("storeHero");
  if(!storeSection) return;

  function checkPosition(){

    const storeBottom =
      storeSection.offsetTop + storeSection.offsetHeight;

    if(window.scrollY >= storeBottom -200){
      document.body.classList.add("pillsHidden");
    } else {
      document.body.classList.remove("pillsHidden");
    }

  }

  window.addEventListener("scroll", checkPosition);
  window.addEventListener("resize", checkPosition);

  checkPosition(); // run once on load

}



/* =========================================
   MOBILE MENU SYSTEM
========================================= */

function initMobileMenu(){

  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if(!hamburger || !mobileMenu){
    console.warn("Mobile menu elements not found.");
    return;
  }

  hamburger.addEventListener("click", () => {

    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");

    // Lock scroll when open
    document.body.style.overflow =
      mobileMenu.classList.contains("active") ? "hidden" : "auto";

  });

  // Close when clicking any link
  mobileMenu.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "auto";

    });

  });

}


/* =========================================
   GOOGLE REVIEWS (LIVE DATA)
========================================= */

async function initReviews(){

  console.log("REVIEWS FUNCTION FIRING");

  const grid = document.getElementById("reviewsGrid");
  const score = document.getElementById("reviewScore");
  const ratingSub = document.querySelector(".ratingSub");
  const starsContainer = document.getElementById("ratingStars");

  if(!grid){
    console.warn("reviewsGrid not found — stopping.");
    return;
  }

  /* =====================================
     ⭐ PUT YOUR API KEY RIGHT HERE
  ===================================== */

  const API_KEY = "AIzaSyDBjHucVz_O-3Z44HNHX0aS7AaK_Hxkleg";
  const PLACE_ID = "ChIJ54IVvUbfRYgRDOkYFnkYTyY";

  const url =
  `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=rating,userRatingCount,reviews&key=${API_KEY}`;

  try{

    const res = await fetch(url);

    if(!res.ok){
      const text = await res.text();
      console.error("Google API FAILED:", text);
      return;
    }

    const data = await res.json();

    console.log("Google Data:", data);

    /* ⭐ Rating */
    if(score && data.rating){
      score.textContent = data.rating.toFixed(1);
    }

    /* ⭐ Review Count */
    if(ratingSub && data.userRatingCount){
      ratingSub.textContent =
        `Based on ${data.userRatingCount} Google Reviews`;
    }

    /* ⭐ Dynamic Stars */
    if(starsContainer && data.rating){

      const fullStars = Math.floor(data.rating);
      const halfStar = data.rating % 1 >= 0.5;

      let stars = "★".repeat(fullStars);

      if(halfStar){
        stars += "½";
      }

      starsContainer.textContent = stars;
    }

    renderGoogleReviews(data.reviews, grid);

  }
  catch(err){
    console.error("Google Reviews Crash:", err);
  }

}


/* =========================================
   GOOGLE REVIEW CARD RENDERER
========================================= */

function renderGoogleReviews(reviews, grid){

  if(!reviews || reviews.length === 0){
    console.warn("No reviews returned from Google.");
    return;
  }

  grid.innerHTML = "";

  reviews.slice(0,5).forEach(review => {

    const stars =
      "★".repeat(review.rating) +
      "☆".repeat(5 - review.rating);

    const text =
      review?.text?.text || "No review text provided.";

    const author =
      review?.authorAttribution?.displayName || "Google User";

    const card = `
      <div class="reviewCard">
        <div class="reviewStars">${stars}</div>
        <p class="reviewText">"${text}"</p>
        <div class="reviewAuthor">— ${author}</div>
      </div>
    `;

    grid.insertAdjacentHTML("beforeend", card);

  });

}
