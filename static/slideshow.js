var slideIndex = 0;
  
// Function to show slides
function showSlides() {
  var slides = document.getElementsByClassName("slide");
  var dots = document.getElementsByClassName("dot");

  // Hide all slides and remove active dot class
  for (var i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    dots[i].classList.remove("active");
  }

  // Increment slide index
  slideIndex++;

  // Reset slide index if exceeds the number of slides
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  // Show current slide and set dot as active
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].classList.add("active");

  // Call the function recursively after 2 seconds
  setTimeout(showSlides, 3000);
}

// Initial call to the function
showSlides();