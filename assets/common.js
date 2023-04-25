
  $(document).ready(function () {
    $(window).scroll(function () {
      if ($(window).scrollTop() > 10) {
        $('.navbar').addClass('scrolled');
      } else {
        $('.navbar').removeClass('scrolled');
      }
    });
  });


  /* autorefresh on change */
  let previousResponse = null;

function checkForChanges() {
  // Call your backend API to check for changes
  fetch('change.html')
    .then(response => response.text())
    .then(data => {
      if (previousResponse !== null && data !== previousResponse) {
        // The response has changed, refresh the page
        window.location.reload();
      } else {
        // The response is the same, update the previous response
        previousResponse = data;
      }
    })
    .catch(error => {
      console.error('Error checking for changes:', error);
    });
}

// setInterval(checkForChanges, 1000);


