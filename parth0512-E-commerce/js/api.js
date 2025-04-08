document.addEventListener("DOMContentLoaded", function () {
  fetch("https://fakestoreapi.in/api/products?limit=21")
    .then((response) => response.json())
    .then((data) => {
      const products = data.products;
      const container = document.getElementById("perfume-list");
      container.innerHTML = "";

      const row = document.createElement("div");
      row.className = "row g-4";

      products.forEach((product) => {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-md-4 col-lg-4";
        col.style.marginBottom = "5%";
        col.innerHTML = `
              <div class="card h-100" style="margin-bottom:0%">
                <div class="card-img-container">
                  <img src="${
                    product.image
                  }" class="card-img-top" style="width:90%; height:200px" alt="${
          product.title
        }" loading="lazy">
                </div>
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title" style="font-size: 15px; font-weight:bold">${
                    product.title
                  }</h5>
                  <p class="card-text"><strong>Brand:</strong> ${
                    product.brand
                  }</p>
                  <p class="card-text"><strong>Model:</strong> ${
                    product.model
                  }</p>
                  <p class="card-text"><strong>Category:</strong> ${
                    product.category
                  }</p>
                  <p class="card-text"><strong>Price:</strong> $${product.price.toFixed(
                    2
                  )}</p>
                  <button class="add_cart mt-auto" data-id="${
                    product.id
                  }" style="background-color:black;color:white;border:none;width=100%">ADD TO CART</button>
                </div>
              </div>
            `;

        row.appendChild(col);
      });

      container.appendChild(row);

      // Add event listeners to all add to cart buttons
      document.querySelectorAll(".add_cart").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = this.getAttribute("data-id");
          const product = products.find((p) => p.id == productId);
          addToCart(product);
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      document.getElementById("perfume-list").innerHTML = `
            <div class="alert alert-warning">
              Failed to load products. Please try again later.
            </div>
          `;
    });
});
