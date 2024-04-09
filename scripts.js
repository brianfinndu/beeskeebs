// TO DO: "add keeb" interface
// TO DO: pick some better fonts oml
// TO DO: nice-ify left div
// TO DO: adjust opacity for active elements
// TO DO: adjust background colors and/or build name based on active index
// TO DO: add "like" button that updates server
// TO DO: sort by (popularity, switch type, keycap material)
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
        updateCenter();
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
        new_img.className = "left-icon clickable";
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
        new_img.className = "center-icon clickable";
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
    // const centerDiv = document.getElementById("center");
    // centerDiv.attributes['style'].textContent = 'background-color:' + mainContent[activeIndex]["accent-code"];
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
                new_li.className = attr + " clickable";
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
            new_li.className = attr + " clickable";
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
    new_btn.className = "clickable";
    new_btn.addEventListener("click", () => {
        if (confirm("Are you sure? The keeb will be lost forever..."))
        {
            mainContent.splice(activeIndex, 1);
            activeIndex = 0;
            populateLeft();
            updateCenter();
            updateRight();
        }
    })
    rightDiv.appendChild(new_btn);
}

/*
function populateAdd() {
    let rowCounter = 1;
    let colCounter = 1;
    let addContainer = document.getElementById("add-container");

    for(const attr in mainContent[0])
    {
        if(Array.isArray(mainContent[0][attr]) || typeof(mainContent[0][attr]) == "string")
        {
            if(attr == "Description")
            {
                colCounter++;
            }

            addContainer.appendChild(createStringInput(attr, rowCounter, colCounter));
            rowCounter++;
        }

        else if(typeof(mainContent[0][attr]) == "object")
        {
            colCounter++;
            rowCounter = 1;

            let new_p = document.createElement("p");
            new_p.innerText = attr;
            new_p.style.gridArea = rowCounter + " / " + colCounter + " / " + (rowCounter + 1) + (colCounter + 1);
            rowCounter++;

            for(const subAttr in mainContent[0][attr])
            {
                addContainer.appendChild(createStringInput(attr + "-" + subAttr, rowCounter, colCounter));
                rowCounter++;
            }
        }
    }
}

function createStringInput(attr, rowCounter, colCounter) {
    let new_div = document.createElement("div");
            
    let new_p = document.createElement("p");
    new_p.innerText = attr;
    new_div.appendChild(new_p);
    
    let new_input = document.createElement("input");
    new_input.type = "text";
    new_input.id = attr + "-input";

    new_div.style.gridArea = rowCounter + " / " + colCounter + " / " + (rowCounter + 1) + (colCounter + 1);
    
    new_div.appendChild(new_input);

    return new_div;
}
*/