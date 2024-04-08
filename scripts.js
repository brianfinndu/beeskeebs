// TO DO: "add keeb" interface
// TO DO: nice-ify left div
// TO DO: adjust opacity for active elements
// TO DO: make all interactables slightly transparent -> fully opaque on hover
// TO DO: adjust background colors and/or build name based on active index
// TO DO: write changes to server button

let activeIndex = 0;
let activeSubIndex = 0;
let photoIndex = 0;
let mainContent = [];

// This calls the addCards() function when the page is first loaded
document.addEventListener("DOMContentLoaded", loadContent);

async function loadContent() {
    alert("You can edit bullet points by clicking them. Enjoy!");
    
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
        populateAdd();
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
                new_li.className = attr;
                new_li.addEventListener("click", (event) => {
                    let splitStr = event.target.innerHTML.split(":");
                    let newInfo = prompt("Please enter the new " + splitStr[0]);
                    if (newInfo != null)
                    {
                        mainContent[activeIndex]["build-specs"][event.target.className][splitStr[0]] = newInfo;
                        event.target.innerHTML = splitStr[0] + ": " + mainContent[activeIndex]["build-specs"][event.target.className][splitStr[0]];
                    }
                })

                new_ul.appendChild(new_li);
            }
        }

        else
        {
            let new_li = document.createElement("li");
            new_li.innerHTML = mainContent[activeIndex]["build-specs"][attr];
            new_li.className = attr;
            new_li.addEventListener("click", (event) => {
                let newDesc = prompt("Please enter the new Description");
                if (newDesc != null)
                {
                    mainContent[activeIndex]["build-specs"]["Description"] = newDesc;
                    event.target.innerHTML = mainContent[activeIndex]["build-specs"]["Description"];
                }
            })
            new_ul.appendChild(new_li);
        }

        rightDiv.appendChild(new_ul);
    }

    let new_btn = document.createElement("button");
    new_btn.innerHTML = "Remove Keeb";
    new_btn.addEventListener("click", () => {
        if (confirm("Are you sure? The keeb will be lost forever..."))
        {
            mainContent.splice(activeIndex, 1);
            activeIndex = 0;
            populateLeft();
            populateCenterLow();
            updateFocusImg();
            updateRight();
        }
    })
    rightDiv.appendChild(new_btn);
}

function populateAdd() {
    
}