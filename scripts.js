// TO DO: adjust opacity for active elements
// TO DO: "edit keeb" interface
// TO DO: "add keeb" interface
// TO DO: "remove keeb" interface (with Alert warning "lost to the ether...")
// TO DO: adjust background colors and/or build name based on active index

let activeIndex = 0;
let activeSubIndex = 0;
let photoIndex = 0;
let mainContent = [];

// This calls the addCards() function when the page is first loaded
document.addEventListener("DOMContentLoaded", loadContent);

async function loadContent() {
    const leftArrow = document.getElementById("left-arr")
    leftArrow.addEventListener("click", () => {
        activeSubIndex--;
        activeSubIndex = (activeSubIndex + mainContent[activeIndex]["media-urls"].length) % mainContent[activeIndex]["media-urls"].length;
        updateFocusImg();
    })

    const rightArrow = document.getElementById("right-arr")
    rightArrow.addEventListener("click", () => {
        activeSubIndex++;
        activeSubIndex = activeSubIndex % mainContent[activeIndex]["media-urls"].length;
        updateFocusImg();
    })
    
    let req = new XMLHttpRequest();

    req.onload = () => 
    {
        mainContent = JSON.parse(req.response);
        
        populateLeft();
        populateCenterLow();
        updateFocusImg();
        updateRight();
    }

    req.open("GET", "https://api.jsonbin.io/v3/b/6611d64ce41b4d34e4e0661e/latest");
    req.setRequestHeader("X-Master-Key", "$2b$10$NcpW2rFP851TgVn6DZ4iQu/akYysLsu/UC8B7COjY2WiWzEmsAg4y");
    req.setRequestHeader("X-Bin-Meta", "false");
    req.send();
}

function populateLeft() {
    const leftDiv = document.getElementById("left");
    leftDiv.innerHTML = "";
    for(let i = 0; i < mainContent.length; i++)
    {
        let new_img = document.createElement("img");
        new_img.className = "left-icon";
        new_img.src = mainContent[i]["media-urls"][0];
        new_img.setAttribute("item-index", i);
        new_img.addEventListener("click", (event) => {
            activeIndex = event.target.getAttribute("item-index");
            activeSubIndex = 0;
            updateCenter();
            updateRight();
        })
        leftDiv.appendChild(new_img);
    }
}

function populateCenterLow() {
    const centerLow = document.getElementById("center-low");
    centerLow.innerHTML = "";
    for(let i = 0; i < mainContent[activeIndex]["media-urls"].length; i++)
    {
        let new_img = document.createElement("img");
        new_img.className = "center-icon";
        new_img.src = mainContent[activeIndex]["media-urls"][i];
        new_img.setAttribute("item-index", i);
        new_img.addEventListener("click", (event) => {
            activeSubIndex = event.target.getAttribute("item-index");
            updateFocusImg();
        })
        centerLow.appendChild(new_img);
    }
}

function updateFocusImg() {
    const focusImage = document.getElementById("focus-img");
    focusImage.src = mainContent[activeIndex]["media-urls"][activeSubIndex];
}

function updateCenter() {
    populateCenterLow();
    updateFocusImg();
}

function updateRight() {
    const rightDiv = document.getElementById("right");
    rightDiv.innerHTML = "";

    let new_h1 = document.createElement("h1");
    new_h1.innerHTML = mainContent[activeIndex]["name"];
    rightDiv.appendChild(new_h1);

    for(const attr in mainContent[activeIndex]["build-specs"])
    {
        let new_p = document.createElement("p");
        new_p.innerHTML = attr + ":";
        rightDiv.appendChild(new_p);
        
        let new_ul = document.createElement("ul");

        if (attr != "Description")
        {
            for(const nestedAttr in mainContent[activeIndex]["build-specs"][attr])
            {
                let new_li = document.createElement("li");
                new_li.innerHTML = nestedAttr + ": " + mainContent[activeIndex]["build-specs"][attr][nestedAttr];
                new_ul.appendChild(new_li);
            }
        }

        else
        {
            let new_li = document.createElement("li");
            new_li.innerHTML = mainContent[0]["build-specs"][attr];
            new_ul.appendChild(new_li);
        }

        rightDiv.appendChild(new_ul);
    }
}