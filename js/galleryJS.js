// ========================================
// Smoke Shop+ Gallery Animations
// ========================================


// ==============================
// Scroll Reveal for Section Headers
// ==============================

document.addEventListener("DOMContentLoaded", () => {

  const revealHeaders = document.querySelectorAll('.galleryTitle');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target); // animate once only
      }
    });
  }, {
    threshold: 0.3
  });

  revealHeaders.forEach(header => {
    revealObserver.observe(header);
  });

});
