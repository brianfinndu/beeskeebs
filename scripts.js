// TO DO: adjust background colors and/or build name based on active index
// TO DO: write proper descriptions

// TO DO: add "like" button that updates server
// TO DO: sort by (popularity, switch type, keycap material)
// TO DO: write changes to server button

// TO DO: adjust opacity for active elements

let activeIndex = 0;
let activeSubIndex = 0;
let photoIndex = 0;
let mainContent = [];

let infoArr = [
    ["Misc Macropads", "https://i.imgur.com/oVXGUsQ.jpeg, https://i.imgur.com/2zuwOqw.jpeg, https://i.imgur.com/B4Ej2Ne.jpeg, https://i.imgur.com/OsR1qd0.jpeg, https://i.imgur.com/DhKcEW5.jpeg, https://i.imgur.com/NV29u3b.jpeg, https://i.imgur.com/FpAIj8y.jpeg, https://i.imgur.com/xoB24Bp.jpeg",
        "10, 21, 107", "Meletrix ZoomPad / OwLab Voice Mini / Stack Overflow The Key", "Assorted", "Macro", "Assorted", "PuNkShoO Root Beer Float / OwLab London Fog / Invokeys Black Sesame", "62g / 60g / 63g", "Tactile / Linear / Linear",
        "Gateron Milky / Polycarbonate / Polycarbonate", "Gateron Ink / Polycarbonate / Nylon", "Gateron / BSUN / Aflion", "GMK Pixel / shirouu.kaps Misc / Stock", "ABS / Clay / PBT", "Cunty!"],
    ["Darksaber", "https://i.imgur.com/cHMIwPf.jpeg, https://i.imgur.com/nflPCR6.jpeg, https://i.imgur.com/2tMIw8I.jpeg, https://i.imgur.com/pvj4GYa.jpeg, https://i.imgur.com/EUxEgUo.jpeg, https://i.imgur.com/TnC7l6G.jpeg",
        "0, 0, 0", "GMMK Pro", "Aluminum", "75%", "Sandwich", "Geon BSUN Raw", "55g", "Tactile", "Polycarbonate", "Nylon", "BSUN", "Cerakey Black Legendless", "Ceramic", "Cunty!"]            
];

document.addEventListener("DOMContentLoaded", loadContent);

async function loadContent() {
    alert("You can edit bullet points by clicking them. Enjoy!");
    
    document.getElementById("left-arr").addEventListener("click", () => {
        activeSubIndex--;
        activeSubIndex += mainContent[activeIndex]["media-urls"].length;
        activeSubIndex = activeSubIndex % mainContent[activeIndex]["media-urls"].length;
        updateFocusImg();
    })

    document.getElementById("right-arr").addEventListener("click", () => {
        activeSubIndex++;
        activeSubIndex = activeSubIndex % mainContent[activeIndex]["media-urls"].length;
        updateFocusImg();
    })

    document.getElementById("sample-btn").addEventListener("click", () => {
        if(infoArr.length == 0)
        {
            alert("Sorry, no more sample data left!");
            return;
        }

        kids = document.getElementById("add-container").getElementsByTagName("input");
        let sampleList = infoArr.pop();
        
        for(let i = 0; i < kids.length; i++)
        {
            kids[i].value = sampleList[i];
        }
    });

    document.getElementById("add-coll-btn").addEventListener("click", () => {
        kids = document.getElementById("add-container").getElementsByTagName("input");
        let newObj = {};
        newObj["build-specs"] = {"Case": {}, "Switches": {}, "Keycaps": {}};
        for (let i = 0; i < kids.length; i++)
        {
            let splitID = kids[i].id.split("/");
            
            if(splitID[0] == "media-urls")
            {
                newObj["media-urls"] = [];
                let splitVals = kids[i].value.split(", ");
                for(const item in splitVals)
                {
                    newObj["media-urls"].push(splitVals[item]);
                }
            }

            // this is... very messy

            else if(splitID.length == 1)
            {
                newObj[splitID[0]] = kids[i].value;
            }

            else if(splitID.length == 2)
            {
                newObj[splitID[0]][splitID[1]] = kids[i].value;
            }

            else if(splitID.length == 3)
            {
                newObj[splitID[0]][splitID[1]][splitID[2]] = kids[i].value;
            }
        }

        mainContent.push(newObj);
        populateLeft();
        updateCenter();
        updateRight();

        for(let i = 0; i < kids.length; i++)
        {
            kids[i].value = "";
        }
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
    document.body.style.backgroundColor = "rgba(" + mainContent[activeIndex]["accent-code"] + ", 0.15)";
    document.getElementsByClassName("main-header")[0].style.backgroundColor = "rgba(" + mainContent[activeIndex]["accent-code"] + ", 0.95)";
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
                        mainContent[activeIndex]["build-specs"][event.target.className.split(' ')[0]][splitStr[0]] = newInfo;
                        event.target.innerHTML = splitStr[0] + ": " + mainContent[activeIndex]["build-specs"][event.target.className.split(' ')[0]][splitStr[0]];
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