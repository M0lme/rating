var developerMode = false;

var artist = {
    drawType: "default",
    drawTypeOrder: "descending",
    name: [],
    open: [],

    new: function(index) {
        document.getElementById("wrapper-main").style.filter = "blur(4px)";
        let e = document.getElementById("screen-creation")
        e.style.display = "block";
        e.innerHTML = '';

        let creationUI = document.createElement("div");
        creationUI.id = "UI-creation";

        let UItitle = document.createElement("div");
        UItitle.classList.add("title-UI-creation");
        UItitle.innerHTML = "Add a new artist";

        let saveButton = document.createElement("div");
        saveButton.classList.add("button-UI-creation");
        saveButton.tabIndex = "0";
        saveButton.innerHTML = "Save";
        saveButton.style.left = "3%";
        saveButton.tabIndex = "0";

        let closeButton = document.createElement("div");
        closeButton.classList.add("button-UI-creation");
        closeButton.innerHTML = "Close";
        closeButton.style.right = "3%";
        closeButton.addEventListener("click", () => {
            artist.closeCreation();
        })

        let nameField = document.createElement("input");
        nameField.classList.add("field-UI-creation");
        nameField.type = "text";
        nameField.placeholder = "Insert artist name";
        if (index != undefined) {
            nameField.placeholder = artist.name[index];
        }

        creationUI.appendChild(UItitle);
        creationUI.appendChild(saveButton);
        creationUI.appendChild(closeButton);
        creationUI.appendChild(nameField);

        e.appendChild(creationUI);

        saveButton.addEventListener("click", () => {
            let name = nameField.value;
            if (index != undefined) {artist.edit(index, name); return;};
            artist.add(name);
        })

        saveButton.addEventListener("keydown", (event) => {
            if (event.key == "Enter") {
                let name = nameField.value;
                if (index != undefined) {artist.edit(index, name); return;};
                artist.add(name);
            }
        })

        nameField.addEventListener("keydown", (event) => {
            if (event.key == "Enter") {saveButton.focus()}
        })

        nameField.focus();
    },
    closeCreation: function() {
        let e = document.getElementById("screen-creation");
        e.innerHTML = '';
        e.style.display = "none";
        document.getElementById("wrapper-main").style.filter = "none";
    },
    add: function(name) {
        let countTrue = 0;
        for (let i = 0; i < artist.name.length; i++) {
            if (name == artist.name[i]) {countTrue += 1;}
        }
        if (!name || countTrue > 0) {return;}
        artist.closeCreation();

        artist.name.push(name);
        artist.open.push(false);

        display.updateSectionMiddle();
    },
    edit: function(index, name) {
        let countTrue = 0;
        for (let i = 0; i < artist.name.length; i++) {
            if (name == artist.name[i]) {countTrue += 1;}
        }
        if (!name || countTrue > 0) {return;}
        artist.closeCreation();
        artist.name[index] = name
        display.updateSectionMiddle();
    },
    toggleOpen: function(i) {
        if (artist.open[i]) {
            artist.open[i] = false;
        } else {
            artist.open[i] = true;
        }
        display.updateSectionMiddle();
    },
    findIndex: function(name) {
        for (let i = 0; i < artist.name.length; i++) {
            if (name == artist.name[i]) {
                return i;
            }
        }
    },
    getNumberOfAlbums: function(index) {
        let count = 0;
        for (let i = 0; i < album.name.length; i++) {
            if (album.artistIndex[i] == index && album.name[i].includes(display.albumSearch)) {
                count++;
            }
        }
        return count;
    },
    getAverageRating: function(index) {
        let sum = 0;
        for (let i = 0; i < album.name.length; i++) {
            if (album.artistIndex[i] == index && album.name[i].includes(display.albumSearch)) {
                sum += Number(album.rating[i]);
            }
        }
        let avg = sum/artist.getNumberOfAlbums(index);
        if (isNaN(avg)) {return 0};
        return (avg).toFixed(1);
    },
    getColor: function(n) {
        return ((300-2.4*(n)**2)+", "+(10*n**2+5*n)+", 0");
    },
    remove: function(index) {
        if (!confirm("ookko varma")) {return;}
        let n = (album.name.length-1);
        for (let i = n; i >= 0; i--) {
            if (album.artistIndex[i] == index) {
                album.remove(i)
            }
        }
        for(let i = 0; i < album.name.length; i++) {
            if (album.artistIndex[i] > index) {
                album.artistIndex[i]--;
            }
        }
        artist.name.splice(index, 1);
        artist.open.splice(index, 1);

        display.updateSectionMiddle();
    },
    getDrawOrder: function(type) {
        let drawOrder = [];
        let reference = [];

        for (let i = 0; i < artist.name.length; i++) {
            if (type == "default") {
                drawOrder.push(i);
            } else if (type == "name") {
                reference.push(artist.name[i])
            } else if (type == "albums") {
                reference.push(artist.getNumberOfAlbums(i))
            } else if (type == "rating") {
                reference.push(artist.getAverageRating(i))
            }
        }
        let artistReference;
        artistReference = reference.slice(0);

        reference.sort((x,y) => x > y);

        for (let i = 0; i < reference.length; i++) {
            for (let a = 0; a < artistReference.length; a++) {
                if (reference[i] === artistReference[a]) {
                    drawOrder.push(a);
                    artistReference[a] = false;
                    break;
                }
            }
        }
        if (artist.drawTypeOrder == "descending" && (type == "albums" || type == "rating")) {drawOrder.reverse()}
        if (artist.drawTypeOrder == "ascending" && type == "name") {drawOrder.reverse()}
        return drawOrder;
    },
    switchDrawOrder: function(type) {
        if (artist.drawType != type) {artist.drawType = type; artist.drawTypeOrder = "descending"}
        else if (artist.drawType == type && artist.drawTypeOrder == "descending") {artist.drawTypeOrder = "ascending"}
        else if (artist.drawType == type && artist.drawTypeOrder == "ascending") {artist.drawType = "default"; artist.drawTypeOrder = "descending"};

        display.updateSectionMiddle();
    },
    toggleAll: function(type) {
        for (let i = 0; i < artist.name.length; i++) {
            if (type == "open") {
                artist.open[i] = true;
            } else if (type == "close") {
                artist.open[i] = false;
            }
        }
        display.updateSectionMiddle();
    }
}

var album = {
    name: [],
    artistIndex: [],
    rating: [],
    year: [],

    new: function(index, type) {
        document.getElementById("wrapper-main").style.filter = "blur(4px)";
        let e = document.getElementById("screen-creation")
        e.style.display = "block";
        e.innerHTML = '';

        let creationUI = document.createElement("div");
        creationUI.id = "UI-creation";
        creationUI.style.width = "30%";
        creationUI.style.left = "35%";


        let UItitle = document.createElement("div");
        UItitle.classList.add("title-UI-creation");
        UItitle.innerHTML = "Add a new album";

        let saveButton = document.createElement("div");
        saveButton.classList.add("button-UI-creation");
        saveButton.tabIndex = "0";
        saveButton.innerHTML = "Save";
        saveButton.style.left = "3%";

        let closeButton = document.createElement("div");
        closeButton.classList.add("button-UI-creation");
        closeButton.innerHTML = "Close";
        closeButton.style.right = "3%";
        closeButton.addEventListener("click", () => {
            artist.closeCreation();
        })

        let nameField = document.createElement("input");
        nameField.classList.add("field-UI-creation")
        nameField.type = "text";
        nameField.placeholder = "Insert album name";
        nameField.style.left = "10px";
        nameField.style.top = "40px"
        nameField.style.width = "40%";

        let ratingField = document.createElement("input");
        ratingField.classList.add("field-UI-creation")
        ratingField.type = "text";
        ratingField.placeholder = "Insert album rating";
        ratingField.style.left = "10px";
        ratingField.style.top = "65px"
        ratingField.style.width = "40%";

        let yearField = document.createElement("input");
        yearField.classList.add("field-UI-creation")
        yearField.type = "text";
        yearField.placeholder = "Insert album year";
        yearField.style.left = "10px";
        yearField.style.top = "90px"
        yearField.style.width = "40%";

        let artistField = document.createElement("select");
        artistField.classList.add("field-UI-creation");
        artistField.name = "artists";
        artistField.style.left = "260px";
        artistField.style.top = "40px";
        artistField.style.width = "40%";
        artistField.innerHTML = "Select Artist";

        for (let i = 0; i < artist.name.length; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.innerHTML = artist.name[i];
            option.style.color = "white";

            artistField.appendChild(option);
        }
        if (index != undefined && type == undefined) {
            artistField.value = album.artistIndex[index]
            nameField.value = album.name[index]
            yearField.value = album.year[index]
            ratingField.value = album.rating[index]
        } else if (type == "new") {
            artistField.value = index;
        }
        
        creationUI.appendChild(artistField);
        creationUI.appendChild(UItitle);
        creationUI.appendChild(saveButton);
        creationUI.appendChild(closeButton);
        creationUI.appendChild(nameField);
        creationUI.appendChild(ratingField);
        creationUI.appendChild(yearField);

        e.appendChild(creationUI);

        saveButton.addEventListener("click", () => {
            if (developerMode) {console.log("Click")}
            let name = nameField.value;
            let artistIndex = artistField.value;
            let rating = Number(ratingField.value);
            let year = Number(yearField.value);
            if (index != undefined && type == undefined) {album.edit(index, name, artistIndex, rating, year); return;}
            if (developerMode) {console.log("album.add called")}
            album.add(name, artistIndex, rating, year);
        })

        saveButton.addEventListener("keydown", (e) => {
            if (e.key == "Enter") {
                if (developerMode) {console.log("Enter")}
                let name = nameField.value;
                let artistIndex = artistField.value;
                let rating = Number(ratingField.value);
                let year = Number(yearField.value);
                if (index != undefined && type == undefined) {album.edit(index, name, artistIndex, rating, year); return;}
                if (developerMode) {console.log("album.add called")}
                album.add(name, artistIndex, rating, year);
            }
        })

        nameField.focus();
    },
    add: function(name, artistIndex, rating, year) {
        if (developerMode) {
            console.log("album.add()");
            console.log(!name)
            console.log(!(artistIndex && artistIndex !== 0))
            console.log(!rating)
            console.log(!(typeof rating === "number"))
            console.log(!year)
            console.log(!(typeof year === "number"))
        }

        if (!name || !(artistIndex && artistIndex !== 0) || !rating || !(typeof rating === "number") || !year || !(typeof year === "number")) {return};
        artist.closeCreation();

        if (typeof rating === "string" && rating.includes(",")) {
            let i = getCharIndex(rating, ",");
            rating = replaceChar(rating, i, ".")
            rating = Number(rating);
        }

        album.name.push(name);
        album.artistIndex.push(artistIndex);
        album.rating.push(rating);
        album.year.push(year);

        display.updateSectionMiddle();
    },
    edit: function(i, name, artistIndex, rating, year) {
        if (!name || !artistIndex || !rating || !year) {return};
        artist.closeCreation();

        album.name[i] = name;
        album.artistIndex[i] = artistIndex;
        album.rating[i] = rating;
        album.year[i] = year;

        display.updateSectionMiddle();
    },
    remove: function(i, type) {
        if (type == "manual" && !confirm("ookko varma")) {return};
        album.name.splice(i, 1);
        album.artistIndex.splice(i, 1);
        album.rating.splice(i, 1);
        album.year.splice(i, 1);

        display.updateSectionMiddle();
    },
}

var display = {
    scroll: 0,
    artistSearch: "",
    albumSearch: "",
    updateUpperBar: function() {
        let e = document.getElementById("upper-bar");
        e.innerHTML = '';

        let leftSection = document.createElement("div");
        leftSection.classList.add("upper-bar-container");
        leftSection.style.width = "20.5%";

        let leftHeader = document.createElement("div");
        leftHeader.classList.add("header-left");
        leftHeader.innerHTML = "Statistics";

        leftSection.appendChild(leftHeader);

        let middleSection = document.createElement("div");
        middleSection.classList.add("upper-bar-container");
        middleSection.style.width = "56%";

        let newArtistButton = document.createElement("div");
        newArtistButton.classList.add("button-new");
        newArtistButton.innerHTML = "+";
        newArtistButton.addEventListener("click", () => {
            artist.new();
        })

        let newAlbumButton = document.createElement("div");
        newAlbumButton.classList.add("button-new");
        newAlbumButton.innerHTML = "+";
        newAlbumButton.style.float = "right";
        newAlbumButton.addEventListener("click", () => {
            album.new();
        })

        let openAllButton = document.createElement("div");
        openAllButton.classList.add("button-toggle-all");
        openAllButton.innerHTML = "Open All";
        openAllButton.style.marginTop = "3.8%";
        openAllButton.addEventListener("click", () => {
            artist.toggleAll("open");
        })

        let collapseAllButton = document.createElement("div");
        collapseAllButton.classList.add("button-toggle-all");
        collapseAllButton.innerHTML = "Close All";
        collapseAllButton.style.marginTop = "0.3%";
        collapseAllButton.addEventListener("click", () => {
            artist.toggleAll("close");
        })

        let middleHeader = document.createElement("div");
        middleHeader.id = "header-middle";
        middleHeader.innerHTML = "Artists & Albuns";

        middleSection.appendChild(newArtistButton);
        middleSection.appendChild(newAlbumButton);
        middleSection.appendChild(middleHeader);
        middleSection.appendChild(openAllButton);
        middleSection.appendChild(collapseAllButton);

        let rightSection = document.createElement("div");
        rightSection.classList.add("upper-bar-container");
        rightSection.style.width = "20.5%";

        let importMenuButton = document.createElement("div");
        importMenuButton.classList.add("button-new");
        importMenuButton.innerHTML = "↨";
        importMenuButton.style.fontSize = "40px";
        importMenuButton.style.lineHeight = "35px";
        importMenuButton.addEventListener("click", () => {
            display.updateSectionRight("import");
        })

        let filterMenuButton = document.createElement("div");
        filterMenuButton.classList.add("button-new");
        filterMenuButton.style.fontSize = "30px";
        filterMenuButton.innerHTML = "🔍︎";
        filterMenuButton.addEventListener("click", () => {
            display.updateSectionRight("filter");
        })

        rightSection.appendChild(importMenuButton);
        rightSection.appendChild(filterMenuButton);

        e.appendChild(leftSection)
        e.appendChild(middleSection)
        e.appendChild(rightSection)
    },
    updateStatistics: function() {
        let e = document.getElementById("section-left");
        e.innerHTML = '';

        e.innerHTML += "Total Artists: " + artist.name.length;
        e.innerHTML += '<br>'
        e.innerHTML += "Total Albums: " + album.name.length;
    },
    updateSectionMiddle: function() {
        if (document.getElementById("container-artist") !== undefined && document.getElementById("container-artist") !== null) {display.scroll = document.getElementById("container-artist").scrollTop};
        let e = document.getElementById("section-middle");
        e.innerHTML = '';

        let upperSection = document.createElement("div");
        upperSection.id = "artist-container-bar";

        let artistNameButton = document.createElement("div");
        artistNameButton.classList.add("button-sort");
        artistNameButton.innerHTML = "Name"
        if (artist.drawType == "name" && artist.drawTypeOrder == "descending") {artistNameButton.innerHTML = "Name▼"}
        if (artist.drawType == "name" && artist.drawTypeOrder == "ascending") {artistNameButton.innerHTML = "Name▲"}
        artistNameButton.style.left = "6%";
        artistNameButton.addEventListener("click", () => {
            artist.switchDrawOrder("name");
        })

        let artistAlbumsButton = document.createElement("div");
        artistAlbumsButton.classList.add("button-sort");
        artistAlbumsButton.innerHTML = "No. Albums"
        if (artist.drawType == "albums" && artist.drawTypeOrder == "descending") {artistAlbumsButton.innerHTML = "No. Albums▼"}
        if (artist.drawType == "albums" && artist.drawTypeOrder == "ascending") {artistAlbumsButton.innerHTML = "No. Albums▲"}
        artistAlbumsButton.style.left = "55%";
        artistAlbumsButton.addEventListener("click", () => {
            artist.switchDrawOrder("albums");
        })

        let artistRatingButton = document.createElement("div");
        artistRatingButton.classList.add("button-sort");
        artistRatingButton.innerHTML = "Avg. Rating"
        if (artist.drawType == "rating" && artist.drawTypeOrder == "descending") {artistRatingButton.innerHTML = "Avg. Rating▼"}
        if (artist.drawType == "rating" && artist.drawTypeOrder == "ascending") {artistRatingButton.innerHTML = "Avg. Rating▲"}
        artistRatingButton.style.left = "74%";
        artistRatingButton.addEventListener("click", () => {
            artist.switchDrawOrder("rating");
        })

        upperSection.appendChild(artistNameButton);
        upperSection.appendChild(artistAlbumsButton);
        upperSection.appendChild(artistRatingButton);

        let container = document.createElement("div");
        container.id = "container-artist";

        let buffer = document.createElement("div")
        buffer.id = "buffer";

        e.appendChild(upperSection);
        e.appendChild(container);

        let drawOrder = artist.getDrawOrder(artist.drawType);
        for (let a = 0; a < drawOrder.length; a++) {
            let i = drawOrder[a];

            let countTrue = 0;
            for (let b = 0; b < album.name.length; b++) {
                if (album.artistIndex[b] == i) {countTrue++}
            }
 
            if (!((artist.name[i].includes(display.artistSearch) && display.artistSearch !== "" && artist.getNumberOfAlbums(i) > 0) || (artist.getNumberOfAlbums(i) > 0 && artist.name[i].includes(display.artistSearch)) || (countTrue == 0 && display.albumSearch === ""))) {continue;}

            let artistWrapper = document.createElement("div");
            artistWrapper.style.position = "relative";
            artistWrapper.style.float = "left";
            artistWrapper.style.width = "100%";
            artistWrapper.style.height = "auto";
            artistWrapper.style.background = "none";


            let name = artist.name[i];
            let artistUI = document.createElement("div");
            artistUI.classList.add("artist");

            let nameContainer = document.createElement("div");
            nameContainer.classList.add("container-artist-info")
            nameContainer.innerHTML = name;
            nameContainer.style.textAlign = "left";
            //nameContainer.style.left = "5px";
            nameContainer.style.width = "auto";
            nameContainer.style.padding = "0 5px 0 5px";

            let NoAlbumsContainer = document.createElement("div");
            NoAlbumsContainer.classList.add("container-artist-info")
            NoAlbumsContainer.innerHTML = artist.getNumberOfAlbums(i);
            NoAlbumsContainer.style.position = "absolute";
            NoAlbumsContainer.style.left = "60.4%";
            NoAlbumsContainer.style.width = "40px";

            let ratingContainer = document.createElement("div");
            ratingContainer.classList.add("container-artist-info")
            ratingContainer.innerHTML = artist.getAverageRating(i);
            ratingContainer.style.color = "rgb("+artist.getColor(Number(artist.getAverageRating(i)))+")";
            ratingContainer.style.position = "absolute";
            ratingContainer.style.left = "80.7%";
            ratingContainer.style.width = "40px";

            let editButton = document.createElement("div");
            editButton.classList.add("button-edit");
            editButton.innerHTML = "✎";
            editButton.style.marginRight = "5.5%";
            editButton.style.marginTop = "0.5%";
            editButton.addEventListener("click", () => {
                artist.new(i);
            })

            let addButton = document.createElement("div");
            addButton.classList.add("button-edit");
            addButton.style.marginRight = "8.4%";
            addButton.style.marginTop = "0.5%";
            addButton.style.fontWeight = "bold";
            addButton.innerHTML = "+";
            addButton.addEventListener("click", () => {
                album.new(i, "new");
            })

            let removeButton = document.createElement("div");
            removeButton.classList.add("button-edit");
            removeButton.style.right = "11%";
            removeButton.style.marginTop = "0.5%";
            removeButton.style.fontWeight = "bold";
            removeButton.style.opacity = "0.4";
            removeButton.innerHTML = "🗑";
            removeButton.addEventListener("click", () => {
                artist.remove(i)
            })

            let albumContainer = document.createElement("div");
            albumContainer.classList.add("container-album");

            artistUI.appendChild(nameContainer);
            artistUI.appendChild(NoAlbumsContainer);
            artistUI.appendChild(ratingContainer);
            artistWrapper.appendChild(editButton);
            artistWrapper.appendChild(addButton);
            artistWrapper.appendChild(removeButton);

            artistWrapper.appendChild(artistUI);
            artistWrapper.appendChild(albumContainer);

            container.appendChild(artistWrapper);

            artistUI.addEventListener("click", (e) => {
                artist.toggleOpen(i);
            })

            if (artist.open[i] && artist.getNumberOfAlbums(i) > 0) {
                let albumInfoInfo = document.createElement("div");
                albumInfoInfo.classList.add("artist");
                albumInfoInfo.style.fontSize = "10px";
                albumInfoInfo.style.marginLeft = "0";
                albumInfoInfo.style.width = "100%";
                albumInfoInfo.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
                albumInfoInfo.style.marginTop = "0";
                albumInfoInfo.style.borderTop = "solid black 1px";

                let albumInfoName = document.createElement("div");
                albumInfoName.innerHTML = "Name:";
                albumInfoName.classList.add("info-album-info");
                albumInfoName.style.marginLeft = "7%";

                let albumInfoYear = document.createElement("div");
                albumInfoYear.innerHTML = "Year:";
                albumInfoYear.classList.add("info-album-info");
                albumInfoYear.style.position = "absolute";
                albumInfoYear.style.marginLeft = "61.5%";

                let albumInfoRating = document.createElement("div");
                albumInfoRating.innerHTML = "Rating:";
                albumInfoRating.classList.add("info-album-info");
                albumInfoRating.style.position = "absolute";
                albumInfoRating.style.marginLeft = "81.5%";

                albumInfoInfo.appendChild(albumInfoName)
                albumInfoInfo.appendChild(albumInfoYear)
                albumInfoInfo.appendChild(albumInfoRating)
                artistUI.appendChild(albumInfoInfo);
            }

            for (let I = 0; I < album.name.length; I++) {
                if (artist.open[i] && album.artistIndex[I] == i && album.name[I].includes(display.albumSearch)) {
                    let albumUI = document.createElement("div");
                    albumUI.classList.add("album");

                    let albumName = document.createElement("div");
                    albumName.classList.add("container-artist-info")
                    //albumName.style.left = "10px";
                    albumName.style.width = "auto";
                    albumName.style.padding = "0 5px";
                    albumName.innerHTML = album.name[I];

                    let albumRating = document.createElement("div");
                    albumRating.classList.add("container-artist-info")
                    albumRating.style.position = "absolute";
                    albumRating.style.left = "83.8%";
                    albumRating.style.width = "50px";
                    albumRating.innerHTML = album.rating[I] + "/10";
                    albumRating.style.color = "rgb("+artist.getColor(Number(album.rating[I]))+")";

                    let albumYear = document.createElement("div");
                    albumYear.classList.add("container-artist-info")
                    albumYear.style.position = "absolute";
                    albumYear.style.left = "62.4%";
                    albumYear.style.width = "30px";
                    albumYear.style.fontSize = "12px";
                    albumYear.innerHTML = album.year[I];

                    let editAlbumButton = document.createElement("div");
                    editAlbumButton.classList.add("button-edit");
                    editAlbumButton.innerHTML = "✎";
                    editAlbumButton.style.opacity = "0.5";
                    editAlbumButton.addEventListener("click", () => {
                        album.new(I);
                    })

                    let removeAlbumButton = document.createElement("div");
                    removeAlbumButton.classList.add("button-edit");
                    removeAlbumButton.style.right = "25px";
                    removeAlbumButton.style.fontWeight = "bold";
                    removeAlbumButton.style.opacity = "0.4";
                    removeAlbumButton.innerHTML = "🗑";
                    removeAlbumButton.addEventListener("click", () => {
                        album.remove(I, "manual");
                    })

                    albumUI.appendChild(albumName);
                    albumUI.appendChild(albumYear);
                    albumUI.appendChild(albumRating);
                    albumUI.appendChild(editAlbumButton);
                    albumUI.appendChild(removeAlbumButton);
                    

                    albumContainer.appendChild(albumUI);
                }
            }
        }
        for (let i = 0; i < document.getElementsByClassName("album").length; i++) {
            if (i%2==0) {
                document.getElementsByClassName("album")[i].style.backgroundColor = "#757575";
            }
        }
        container.appendChild(buffer);
        container.scrollTop = display.scroll;
        display.updateStatistics();
    },
    updateSectionRight: function(type) {
        if (type == "import") {
            display.updateImport();
        } else if (type == "filter") {
            display.updateFilter();
        }
    },
    updateImport: function() {
        let e = document.getElementById("section-right");
        e.innerHTML = '';

        let header = document.createElement("div");
        header.classList.add("header-left");
        header.innerHTML = "Import"
        header.style.height = "10%";

        let inputField = document.createElement("input");
        inputField.classList.add("field-import-input");
        inputField.type = "text";
        inputField.placeholder = "paste your list";

        let previewButton = document.createElement("div");
        previewButton.classList.add("button-preview-import");
        previewButton.innerHTML = "Preview";

        let addButton = document.createElement("div");
        addButton.classList.add("button-preview-import");
        addButton.innerHTML = "Add";
        addButton.style.left = "80%";

        let previewContainer = document.createElement("div");
        previewContainer.id = "container-preview-import";

        previewButton.addEventListener("click", () => {
            let text = inputField.value;
            display.updatePreview(text);
        })

        addButton.addEventListener("click", () => {
            for (let i = 0; i < previewContainer.children.length; i++) {
                if (previewContainer.children[i].classList.contains("artist-preview")) {
                    artist.add(previewContainer.children[i].innerHTML);
                } else if (previewContainer.children[i].classList.contains("album-preview")) {
                    album.add(previewContainer.children[i].children[0].innerHTML, artist.name.length-1, Number(previewContainer.children[i].children[1].innerHTML), 2000);
                }
            }
            display.updateSectionRight("import");
        })

        e.appendChild(header)
        e.appendChild(inputField);
        e.appendChild(previewButton);
        e.appendChild(addButton)
        e.appendChild(previewContainer);
    },
    updatePreview: function(text) {
        let e = document.getElementById("container-preview-import");
        e.innerHTML = '';
        let textClump = "";

        for (let i = 0; i < text.length+1; i++) {
            if (text[i-1] === ":" || (text[i-1] === "0" && text[i-2] === "1" && text[i-3] === "/")) {
                if (textClump[0] === " ") {textClump = removeChar(textClump, 0)};
                if (textClump[textClump.length-1] === " ") {textClump = removeChar(textClump, textClump.length-1)};
                if (text[i-1] === ":") {
                    let previewArtist = document.createElement("div")
                    previewArtist.classList.add("artist-preview");
                    previewArtist.innerHTML = removeChar(textClump, textClump.length-1);

                    e.appendChild(previewArtist);
                } else if (text[i-1] === "0" && text[i-2] === "1" && text[i-3] === "/") {
                    let previewAlbum = document.createElement("div")
                    previewAlbum.classList.add("album-preview");
                    let previewRating = "";
                    
                    while (textClump[textClump.length-1] !== "/") {
                        textClump = removeChar(textClump, textClump.length-1);
                    }
                    textClump = removeChar(textClump, textClump.length-1);

                    while (textClump[textClump.length-1] !== " ") {
                        previewRating+=textClump[textClump.length-1]
                        textClump = removeChar(textClump, textClump.length-1);
                    }
                    previewRating = reverseString(previewRating);

                    for (let a = 0; a < 3; a++) {
                        textClump = removeChar(textClump, textClump.length-1);
                    }
                    for (let a = 0; a < previewRating.length; a++) {
                        if (previewRating[a] === ",") {
                            previewRating = replaceChar(previewRating, a, ".")
                        }
                    }

                    let previewAlbumContainer = document.createElement("div");
                    previewAlbumContainer.classList.add("container-album-preview");
                    previewAlbumContainer.innerHTML = textClump;

                    let previewRatingContainer = document.createElement("div");
                    previewRatingContainer.classList.add("container-album-preview");
                    previewRatingContainer.style.float = "right";
                    previewRatingContainer.innerHTML = previewRating;

                    previewAlbum.appendChild(previewAlbumContainer)
                    previewAlbum.appendChild(previewRatingContainer)
                    e.appendChild(previewAlbum);
                }

                textClump = ""
            }
            textClump += text[i];
        }
    },
    updateFilter: function() {
        let e = document.getElementById("section-right");
        e.innerHTML = '';

        let header = document.createElement("div");
        header.classList.add("header-left");
        header.innerHTML = "Filter"
        header.style.height = "10%";

        let searchArtistField = document.createElement("input");
        searchArtistField.type = "text";
        searchArtistField.placeholder = "Search an artist name";
        searchArtistField.classList.add("field-import-input");
        searchArtistField.addEventListener("keyup", () => {
            display.artistSearch = searchArtistField.value;
            display.updateSectionMiddle();
        })
        let searchAlbumField = document.createElement("input");
        searchAlbumField.type = "text";
        searchAlbumField.placeholder = "Search an album name";
        searchAlbumField.classList.add("field-import-input");
        searchAlbumField.style.top = "22%";
        searchAlbumField.addEventListener("keyup", () => {
            display.albumSearch = searchAlbumField.value;
            display.updateSectionMiddle();
        })

        e.appendChild(header);
        e.appendChild(searchArtistField);
        e.appendChild(searchAlbumField);
    }
}

function removeChar(str, index) {
    return str.slice(0, index) + str.slice(index + 1);
}

function replaceChar(str, index, str2) {
    return str.slice(0, index) + str2 + str.slice(index + 1);
}

function reverseString(s){
    return s.split("").reverse().join("");
}

function getCharIndex(str, char) {
    for (let i = 0; i < str.length; i++) {
        if (str[i] === char) {return i}
    }
}

function savePage() {
    var pageSave = {
        developerMode: developerMode,
        artistName: artist.name,
        artistOpen: artist.open,

        albumName: album.name,
        albumArtistIndex: album.artistIndex,
        albumRating: album.rating,
        albumYear: album.year,
    };
    localStorage.setItem("pageSave", JSON.stringify(pageSave));
}

setInterval(() => {
    savePage();
}, 5000);

function loadPage() {
    var savedPage = JSON.parse(localStorage.getItem("pageSave"));

    if (localStorage.getItem("pageSave") !== null) {
        //if (typeof savedPage.XXX !== "undefined") XXX = savedPage.XXX;

        //if (typeof savedPage.XXX !== "undefined") {
        //    for ( let i = 0; i < savedPage.XXX.length; i++) {
        //        XXX[i] = savedPage.XXX[i];
        //    }
        //}
        if (typeof savedPage.developerMode !== "undefined") developerMode = savedPage.developerMode;

        if (typeof savedPage.artistName !== "undefined") {
            for ( let i = 0; i < savedPage.artistName.length; i++) {
                artist.name[i] = savedPage.artistName[i];
            }
        }
        if (typeof savedPage.artistOpen !== "undefined") {
            for ( let i = 0; i < savedPage.artistOpen.length; i++) {
                artist.open[i] = savedPage.artistOpen[i];
            }
        }
        if (typeof savedPage.albumName !== "undefined") {
            for ( let i = 0; i < savedPage.albumName.length; i++) {
                album.name[i] = savedPage.albumName[i];
            }
        }
        if (typeof savedPage.albumArtistIndex !== "undefined") {
            for ( let i = 0; i < savedPage.albumArtistIndex.length; i++) {
                album.artistIndex[i] = savedPage.albumArtistIndex[i];
            }
        }
        if (typeof savedPage.albumRating !== "undefined") {
            for ( let i = 0; i < savedPage.albumRating.length; i++) {
                album.rating[i] = savedPage.albumRating[i];
            }
        }
        if (typeof savedPage.albumYear !== "undefined") {
            for ( let i = 0; i < savedPage.albumYear.length; i++) {
                album.year[i] = savedPage.albumYear[i];
            }
        }
    }
}

function reset () {
    pageSave = "";
    localStorage.setItem("pageSave", JSON.stringify(pageSave));

    location.reload();
}

window.onload = () => {
    loadPage();
    display.updateUpperBar();
    display.updateStatistics();
    display.updateSectionMiddle();
    display.updateSectionRight("filter");
}

document.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && e.target.placeholder == "Insert album name") {document.getElementsByClassName("field-UI-creation")[2].focus()};
    if (e.key == "Enter" && e.target.placeholder == "Insert album rating") {document.getElementsByClassName("field-UI-creation")[3].focus()};
    if (e.key == "Enter" && e.target.placeholder == "Insert album year") {document.getElementsByClassName("button-UI-creation")[0].focus()};
})
