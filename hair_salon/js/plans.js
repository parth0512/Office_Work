const contentData = {
    all: `
        <div class="row mt-5 menu2">
            <div class="col-lg-6 col-12">
                <p>Shampoo + Cut .............................................................$25.00</p>
                <p>Long Layered Cut ..........................................................$28.00</p>
                <p>Regular Haircut ..............................................................$25.00</p>
                <p>Fade + Hot Towel ..........................................................$19.00</p>
                <p>Children’s Haircut............................................................$22.00</p>
                <p>Shaving Normal ..............................................................$15.00</p>
            </div>
            <div class="col-lg-6 col-12 list">
                <p>Crew Cut + Shape-up....................................................$35.00</p>
                <p>Senior Citizen Cut............................................................$28.00</p>
                <p>Crew Cut + Hot Towel....................................................$25.00</p>
                <p>Beard Trim with Razor....................................................$37.00</p>
                <p>Color......................................................................................$45.00</p>
                <p>Styling....................................................................................$18.00</p>
            </div>
        </div>
    `,
    beards: `
        <div class="row mt-5 menu2">
            <div class="col-12">
                <p>Basic Beard Trim .......................................................................$15.00</p>
                <p>Beard Shaping with Razor ....................................................$20.00</p>
                <p>Hot Towel Beard Trim ............................................................$25.00</p>
            </div>
        </div>
    `,
    hairstyle: `
        <div class="row mt-5 menu2">
            <div class="col-12">
                <p>Casual Styling .................................................................$20.00</p>
                <p>Formal Hairstyle ............................................................$30.00</p>
                <p>Party Look ........................................................................$35.00</p>
            </div>
        </div>
    `,
    haircut: `
        <div class="row mt-5 menu2">
            <div class="col-12">
                <p>Regular Haircut ..............................................................$25.00</p>
                <p>Fade Haircut ....................................................................$28.00</p>
                <p>Layered Cut .....................................................................$30.00</p>
            </div>
        </div>
    `,
    mustache: `
        <div class="row mt-5 menu2">
            <div class="col-12">
                <p>Mustache Trim ...........................................................................$10.00</p>
                <p>Mustache Styling ......................................................................$15.00</p>
                <p>Hot Towel Mustache Treatment .........................................$18.00</p>
            </div>
        </div>
    `
};

document.querySelectorAll(".nav.justify-content-center .nav-link").forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        document.querySelectorAll(".nav.justify-content-center .nav-link").forEach(nav => nav.classList.remove("active"));

        this.classList.add("active");

        const target = this.getAttribute("data-target");

        if (contentData[target]) {
            document.getElementById("content").innerHTML = contentData[target];
        }

        if (!document.getElementById("all-prices")) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "btn btn-outline-dark mt-3";
            button.id = "all-prices";
            button.textContent = "ALL PRICES";
            document.querySelector(".container").appendChild(button);
        }
    });
});
