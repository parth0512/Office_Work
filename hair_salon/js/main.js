document.addEventListener("DOMContentLoaded", function () {
    let navbarToggler = document.querySelector(".navbar-toggler");
    let navbarCollapse = document.querySelector(".navbar-collapse");
    let background = document.querySelector(".background");
  
    navbarToggler.addEventListener("click", function () {
      if (!navbarCollapse.classList.contains("show")) {
        background.style.marginTop = "0px"; 
      } else {
        
        background.style.marginTop = "0";
      }
    });
  
    navbarCollapse.addEventListener("hidden.bs.collapse", function () {
      background.style.marginTop = "0"; 
    });
  });
  function navigateTo(page) {
    window.location.href = page;
}

document.querySelectorAll('.nav-link').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});


