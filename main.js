var developerMode = false;

var notes = "";
var openRight = "import";

var artist = {
    drawType: "default",
    drawTypeOrder: "descending",
    name: [],
    open: [],

    add: function(name) {
        if (!name || this.getNameExists(name)) {return;}
        dispatchEvent(create.closeEvent);

        artist.name.push(name);
        artist.open.push(false);

        display.updateSectionMiddle();
    },
    edit: function(name, index, genreIndex) {
        if (!name || (this.getNameExists(name) && !name === artist.name[index])) {return;}
        dispatchEvent(create.closeEvent);

        artist.name[index] = name

        if (!isNaN(genreIndex)) {
            for (let i = 0; i < album.name.length; i++) {
                if (album.artistIndex[i] === index) {album.genreIndex[i] = genreIndex};
            }
        }
        display.updateSectionMiddle();
    },
    getNameExists: function(name) {
        let countTrue = 0;
        for (let i = 0; i < artist.name.length; i++) {
            if (name === artist.name[i]) {countTrue++;}
        }
        return countTrue > 0;
    },
    getColor: function(n) {
        return ((300-2.4*(n)**2)+", "+(10*n**2+5*n)+", 0");
    },
    remove: function(index) {
        if (!confirm("ookko varma")) {return;}
        let n = (album.name.length-1);
        for (let i = n; i >= 0; i--) {
            if (album.artistIndex[i] === index) {
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
    getDrawOrder: function(type, order) {
        if (order === undefined) {order = artist.drawTypeOrder}
        if (developerMode) {console.log("artist.getDrawOrder()", type, artist.drawTypeOrder)}
        let drawOrder = [];
        let reference = [];

        for (let i = 0; i < artist.name.length; i++) {
            if (type == "default") {
                drawOrder.push(i);
            } else if (type == "name") {
                reference.push(artist.name[i])
            } else if (type == "albums") {
                reference.push(album.getNumberOf(i, "artist"))
            } else if (type == "rating") {
                reference.push(album.getAverageRating(i, "artist"))
            }
        }
        if (developerMode) {console.log("reference, unsorted", reference)}
        let artistReference;
        artistReference = reference.slice(0);

        reference = reference.toSorted((x,y) => x > y);
        if (developerMode) {console.log("reference, sorted", reference)}

        for (let i = 0; i < reference.length; i++) {
            for (let a = 0; a < artistReference.length; a++) {
                if (reference[i] === artistReference[a]) {
                    drawOrder.push(a);
                    artistReference[a] = false;
                    break;
                }
            }
        }
        if (order == "descending" && (type == "albums" || type == "rating")) {drawOrder.reverse()}
        if (order == "ascending" && type == "name") {drawOrder.reverse()}
        if (developerMode) {console.log(drawOrder)}
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
    },
    getGenreIndex: function(index) {
        let mostUses = 0;
        let mostUsedGenreIndex;
        let tempGenres = [];
        for (let i = 0; i < album.name.length; i++) {
            if (album.artistIndex[i] == index) {
                tempGenres.push(album.genreIndex[i])
            }
        }
        //if (developerMode) {console.log(tempGenres)};
        let tempGenreAmounts = [];
        for (let i = 0; i < genre.name.length; i++) {
            tempGenreAmounts[i] = 0;
        }
        for (let i = 0; i < tempGenres.length; i++) {
            tempGenreAmounts[tempGenres[i]] += 1;
        }
        //if (developerMode) {console.log(tempGenreAmounts)};
        for (let i = 0; i < tempGenreAmounts.length; i++) {
            if (tempGenreAmounts[i] > mostUses) {
                mostUses = tempGenreAmounts[i];
                mostUsedGenreIndex = i;
            }
        }
        //if (developerMode) {console.log(genre.name[mostUsedGenreIndex])};
        if (album.getAbsoluteNumberOf(index, "artist") === 0) {return 0};
        return mostUsedGenreIndex;
    }
}

var album = {
    name: [],
    artistIndex: [],
    rating: [],
    year: [],
    genreIndex: [],

    add: function(name, artistIndex, rating, year, genreIndex) {
        artistIndex = getConfirmedNumber(artistIndex);
        rating = getConfirmedNumber(rating);
        genreIndex = getConfirmedNumber(genreIndex);

        if (this.isDenied(name, artistIndex, rating, year, genreIndex)) {return};
        dispatchEvent(create.closeEvent);

        album.name.push(name);
        album.artistIndex.push(Number(artistIndex));
        album.rating.push(Number(rating));
        album.year.push(Number(year));
        album.genreIndex.push(genreIndex);

        display.updateSectionMiddle();
    },
    edit: function(name, artistIndex, rating, year, genreIndex, i) {
        if (this.isDenied(name, artistIndex, rating, year, genreIndex, i)) {return};
        dispatchEvent(create.closeEvent);

        album.name[i] = name;
        album.artistIndex[i] = artistIndex;
        album.rating[i] = rating;
        album.year[i] = year;
        album.genreIndex[i] = genreIndex;

        display.updateSectionMiddle();
    },
    remove: function(i, type) {
        if (type == "manual" && !confirm("ookko varma")) {return};
        album.name.splice(i, 1);
        album.artistIndex.splice(i, 1);
        album.rating.splice(i, 1);
        album.year.splice(i, 1);
        album.genreIndex.splice(i, 1);

        display.updateSectionMiddle();
    },
    isDenied: function(name, artistIndex, rating, year, genreIndex, i) { // jos yksikin ehdoista on false, return false
        rating = getConfirmedNumber(rating);
        let nameClause = (name != undefined && name !== "");
        let artistClause = (artistIndex !== "" && (artistIndex != undefined || artistIndex === 0));
        let ratingClause = (rating !== "" && typeof rating === "number" && !isNaN(rating)) || rating === "0";
        let yearClause = (year !== "" && typeof Number(year) === "number" && !isNaN(year));
        let genreClause = (genreIndex !== "" && (genreIndex != undefined || genreIndex === 0));
        let duplicateClause = true;

        if (i === undefined) {
            for (let i = 0; i < album.name.length; i++) {
                if (album.name[i] === name && album.artistIndex[i] === artistIndex) {duplicateClause = false};
            }
        }

        if (developerMode) {
            console.log("album.isDenied() " + name);
            console.log("nameClause ", nameClause, name)
            console.log("artistClause ", artistClause, artistIndex)
            console.log("ratingClause ", ratingClause, rating, "#1, rating !== empty string",(rating !== ""), ", #2, typeof rating === number", typeof rating === "number", ", #3, !isNaN(rating))", !isNaN(rating) )
            console.log("yearClause ", yearClause, year)
            console.log("genreClause ", genreClause, genreIndex)
        }

        return (!nameClause || !artistClause || !ratingClause || !yearClause || !genreClause || !duplicateClause);
    },
    getAverageRating: function(index, subject) {
        let sum = 0;
        for (let i = 0; i < album.name.length; i++) {
            if (album[subject + "Index"][i] === index && search.passesCheck(i, "album")) {
                sum += Number(album.rating[i]);
            }
        }
        let avg = sum/album.getNumberOf(index, subject);
        if (isNaN(avg)) {return 0};
        return Number((avg).toFixed(1));
    },
    getNumberOf: function(index, subject) {
        let count = 0;
        for (let i = 0; i < album.name.length; i++) {
            if (album[subject + "Index"][i] === index && search.passesCheck(i, "album")) {
                count++;
            }
        }
        return count;
    },
    getAbsoluteNumberOf: function(index, subject) {
        let count = 0;
        for (let i = 0; i < album.name.length; i++) {
            if (album[subject + "Index"][i] === index) {
                count++;
            }
        }
        return count;
    }
}

var genre = {
    sortBy: false,
    name: [
        "default*",
    ],
    open: [
        true,
    ],
    add: function(name) {
        if (!name) {return;}
        create.close();

        genre.name.push(name);
        genre.open.push(true);

        display.updateSectionMiddle();
    },
    edit: function(name, index) {
        if (!name) {return;}
        dispatchEvent(create.closeEvent);

        genre.name[index] = name;
        display.updateSectionMiddle();
    },
    getNumberOfArtists: function(index) {
        let count = 0;
        for (let i = 0; i < artist.name.length; i++) {
            if (artist.getGenreIndex(i) === index) {count++}
        }
        return count;
    },
    remove: function(index) {
        if (!confirm("ookko varma, " + genre.name[index]) || index === 0) {return;}

        for (let i = 0; i < album.name.length; i++) {
            if (album.genreIndex[i] == index) {
                album.genreIndex[i] = 0;
            }
        }

        for (let i = 0; i < album.name.length; i++) {
            if (album.genreIndex[i] > index) {
                album.genreIndex[i]--;
            }
        }
        genre.name.splice(index, 1);
        genre.open.splice(index, 1);

        display.updateSectionMiddle();
    },
}

var create = {
    closeEvent: new CustomEvent('closeCreation'),
    newTextInput: function(classAdd, placeHolder) {
        let e = document.createElement("input");
        e.type = "text";
        e.placeholder = placeHolder;
        e.classList.add(classAdd);
        return e;
    },
    newElement: function(type, classAdd, innerHTMLAdd) {
        let e = document.createElement(type);
        if (classAdd !== undefined) {
            e.classList.add(classAdd);
        }
        e.innerHTML = innerHTMLAdd;
        return e;
    },                 
                                          // subject === "artist", "album", "genre"
    new: function(subject, index, type) { // type === "add", "edit"
        document.getElementById("wrapper-main").style.filter = "blur(4px)";
        let e = document.getElementById("screen-creation")
        e.style.display = "block";
        e.innerHTML = '';

        window.addEventListener('closeCreation', () => {
            create.close();
        })

        let creationUI = document.createElement("div");
        creationUI.id = "UI-creation";
        creationUI.style.width = "30%";
        creationUI.style.left = "35%";

        let UItitle = create.newElement("div", "title-UI-creation", "Add a new ");
        UItitle.innerHTML += subject;
        if (type === "edit") {UItitle.innerHTML = "Edit"};

        let saveButton = create.newElement("div", "button-UI-creation", "Save");
        saveButton.tabIndex = "0";
        saveButton.style.left = "3%";

        let closeButton = create.newElement("div", "button-UI-creation", "Close");
        closeButton.style.right = "3%";
        closeButton.addEventListener("click", () => {
            dispatchEvent(create.closeEvent);
        })

        let nameField = create.newElement("input", "field-UI-creation", "")
        nameField.type = "text";
        nameField.placeholder = "Insert "+subject+" name";

        let ratingField = create.newElement("input", "field-UI-creation", "")
        ratingField.type = "text";
        ratingField.placeholder = "Insert album rating";

        let yearField = create.newElement("input", "field-UI-creation", "")
        yearField.type = "text";
        yearField.placeholder = "Insert album year";

        let artistField = create.newElement("select", "field-UI-creation", "Select Artist")
        artistField.name = "artists";

        for (let i = 0; i < artist.name.length; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.innerHTML = artist.name[i];
            option.style.color = "white";

            artistField.appendChild(option);
            if (developerMode) {console.log("artist option " + artist.name[i])}
            if (developerMode) {console.log(artistField.children)}
        }

        let genreField = create.newElement("select", "field-UI-creation", "Select Genre");
        genreField.name = "genres";

        if (type === "edit") {
            let defaultOption = document.createElement("option");
            defaultOption.value = "dismiss";
            defaultOption.innerHTML = "Keep original genres";
            defaultOption.style.color = "white";

            genreField.appendChild(defaultOption);
        }

        for (let i = 0; i < genre.name.length; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.innerHTML = genre.name[i];
            option.style.color = "white";

            genreField.appendChild(option);
        }

        creationUI.appendChild(UItitle);
        creationUI.appendChild(saveButton);
        creationUI.appendChild(closeButton);
        creationUI.appendChild(nameField);

        if (index !== undefined && type === "edit") {
            nameField.value = window[subject].name[index];
        }

        if (subject === "album") {
            ratingField.style.left = "10px";
            ratingField.style.top = "65px"
            ratingField.style.width = "40%";

            yearField.style.left = "10px";
            yearField.style.top = "90px"
            yearField.style.width = "40%";

            artistField.style.left = "260px";
            artistField.style.top = "65px";
            artistField.style.width = "40%";

            creationUI.appendChild(ratingField);
            creationUI.appendChild(yearField);
            creationUI.appendChild(artistField);

            if (index !== undefined && type === "edit") {
                ratingField.value = window[subject].rating[index];
                yearField.value = window[subject].year[index];
                artistField.value = window[subject].artistIndex[index];
                genreField.value = window[subject].genreIndex[index];
            }
            if (index !== undefined && type === "add") {
                artistField.value = index;
            }
        }

        if (!(subject === "artist" && type === "add")) {
            nameField.style.left = "10px";
            nameField.style.top = "40px"
            nameField.style.width = "40%";

            genreField.style.left = "260px";
            genreField.style.top = "40px";
            genreField.style.width = "40%";

            creationUI.appendChild(genreField);
        }

        e.appendChild(creationUI);

        saveButton.addEventListener("click", () => {
            if (developerMode) {console.log(nameField.value, index, genreField.value)};
            if (subject === "artist") {
                artist[type](nameField.value, index, Number(genreField.value));
            } else if (subject === "album") {
                album[type](nameField.value, Number(artistField.value), getConfirmedNumber(ratingField.value), Number(yearField.value), Number(genreField.value), index);
            } else if (subject === "genre") {
                genre[type](nameField.value, index);
            }
        })

        nameField.focus();
    },
    close: function() {
        let e = document.getElementById("screen-creation");
        e.innerHTML = '';
        e.style.display = "none";
        document.getElementById("wrapper-main").style.filter = "none";
    },
    toggleOpen: function(target, i) {
        window[target].open[i] = !window[target].open[i];
        display.updateSectionMiddle();
    },
}

var search = { // name search, rating lower bound, rating upper bound, 
    artist: ["", 0, 10,],
    album: ["", 0, 10,],
    genre: ["", 0, 10,],
    passesCheck: function(i, subject) {
        return (this.passesNameCheck(i, subject) && this.passesRatingCheck(i, subject));
    },
    passesNameCheck: function(i, subject) {
        return (window[subject].name[i].includes(this[subject][0]) || this[subject][0] === "");
    },
    passesRatingCheck: function(i, subject) {
        if (subject === "album") {
            return (album.rating[i] >= this.album[1] && album.rating[i] <= this.album[2]);
        } else {
            return (album.getAverageRating(i, subject) >= this[subject][1] && album.getAverageRating(i, subject) <= this[subject][2]);
        }
    },
    isActive: function() {
        let filters = this.artist+this.album+this.genre;
        return !(filters === (",0,10,0,10,0,10"));
    }
}

var display = {
    scroll: 0,
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
        newArtistButton.classList.add("button-add-new");
        newArtistButton.classList.add("button-image");
        newArtistButton.style.backgroundImage = "url(images/artist-add.png)";
        newArtistButton.addEventListener("click", () => {
            create.new("artist", undefined, "add");
        })

        let newAlbumButton = document.createElement("div");
        newAlbumButton.classList.add("button-add-new");
        newAlbumButton.classList.add("button-image");
        newAlbumButton.style.backgroundImage = "url(images/album-add.png)";
        newAlbumButton.addEventListener("click", () => {
            create.new("album", undefined, "add");
        })

        let newGenreButton = document.createElement("div");
        newGenreButton.classList.add("button-add-new");
        newGenreButton.classList.add("button-image");
        newGenreButton.style.backgroundImage = "url(images/genre-add.png)";
        newGenreButton.addEventListener("click", () => {
            create.new("genre", undefined, "add");
        })

        let openAllButton = document.createElement("div");
        openAllButton.classList.add("button-add-new");
        openAllButton.classList.add("button-add-new-right");
        openAllButton.classList.add("button-image");
        openAllButton.style.backgroundImage = "url(images/open-all.png)";
        openAllButton.addEventListener("click", () => {
            artist.toggleAll("open");
        })

        let collapseAllButton = document.createElement("div");
        collapseAllButton.classList.add("button-add-new");
        collapseAllButton.classList.add("button-add-new-right");
        collapseAllButton.classList.add("button-image");
        collapseAllButton.style.backgroundImage = "url(images/close-all.png)";
        collapseAllButton.addEventListener("click", () => {
            artist.toggleAll("close");
        })

        let middleHeader = document.createElement("div");
        middleHeader.id = "header-middle";
        middleHeader.innerHTML = "Artists & Albuns";

        middleSection.appendChild(newArtistButton);
        middleSection.appendChild(newAlbumButton);
        middleSection.appendChild(newGenreButton);
        middleSection.appendChild(middleHeader);
        middleSection.appendChild(openAllButton);
        middleSection.appendChild(collapseAllButton);

        let rightSection = document.createElement("div");
        rightSection.classList.add("upper-bar-container");
        rightSection.style.width = "20.5%";

        let importMenuButton = document.createElement("div");
        importMenuButton.classList.add("button-add-new");
        importMenuButton.classList.add("button-new");
        importMenuButton.classList.add("button-image");
        importMenuButton.style.backgroundImage = "url(images/import.png)"
        importMenuButton.addEventListener("click", () => {
            display.updateSectionRight("import");
        })

        let filterMenuButton = document.createElement("div");
        filterMenuButton.classList.add("button-add-new");
        filterMenuButton.classList.add("button-new");
        filterMenuButton.classList.add("button-image");
        filterMenuButton.style.backgroundImage = "url(images/search.png)"
        filterMenuButton.addEventListener("click", () => {
            display.updateSectionRight("filter");
        })

        let notesMenuButton = document.createElement("div");
        notesMenuButton.classList.add("button-new");
        notesMenuButton.classList.add("button-add-new");
        notesMenuButton.classList.add("button-image");
        notesMenuButton.style.backgroundImage = "url(images/notes.png)"
        notesMenuButton.addEventListener("click", () => {
            display.updateSectionRight("notes");
        })

        rightSection.appendChild(importMenuButton);
        rightSection.appendChild(filterMenuButton);
        rightSection.appendChild(notesMenuButton);

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
        e.innerHTML += '<br>'
        e.innerHTML += "Total Genres: " + (genre.name.length - 1);

        let albumAmountChart = document.createElement("canvas");
        let ctx = albumAmountChart.getContext("2d");

        let lista = artist.getDrawOrder("albums", "descending");

        let previousAngle = 0;

        e.appendChild(albumAmountChart);
        for (let i = 0; i < lista.length; i++) {
            
            let percentage = album.getNumberOf(lista[i], "artist")/album.name.length;

            let red = 255*Math.sin(Math.PI*i/lista.length+0);
            let green = 255*Math.sin(Math.PI*i/lista.length+1);
            let blue = 255*Math.sin(Math.PI*i/lista.length+2.2);

            ctx.beginPath();
            ctx.arc(95, 80, 35, previousAngle, 2 * Math.PI * percentage + previousAngle);
            ctx.strokeStyle = "rgb("+red+","+green+","+blue+")";
            ctx.lineWidth = 70;
            ctx.stroke();
            previousAngle = previousAngle + 2 * Math.PI * percentage;

            let textElement = document.createElement("div");
            textElement.style.color = "rgb("+red+","+green+","+blue+")";
            textElement.style.textShadow = "0 0 5px rgb("+255-red+","+255-green+","+255-blue+")";
            textElement.innerHTML = artist.name[lista[i]] + ", " + album.getNumberOf(lista[i], "artist") + " albums";

            e.appendChild(textElement)
        }
    },
    updateSectionMiddle: function() {
        if (document.getElementById("container-artist") !== undefined && document.getElementById("container-artist") !== null) {display.scroll = document.getElementById("container-artist").scrollTop};
        let e = document.getElementById("section-middle");
        e.innerHTML = '';

        let upperSection = document.createElement("div");
        upperSection.id = "artist-container-bar";

        let sortInfo = document.createElement("div");
        sortInfo.innerHTML = "Sort by:"
        sortInfo.style.fontSize = "10px";
        sortInfo.style.left = "5px";
        sortInfo.classList.add("button-sort");

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
        artistAlbumsButton.style.left = "56%";
        artistAlbumsButton.addEventListener("click", () => {
            artist.switchDrawOrder("albums");
        })

        let artistRatingButton = document.createElement("div");
        artistRatingButton.classList.add("button-sort");
        artistRatingButton.innerHTML = "Avg. Rating"
        if (artist.drawType == "rating" && artist.drawTypeOrder == "descending") {artistRatingButton.innerHTML = "Avg. Rating▼"}
        if (artist.drawType == "rating" && artist.drawTypeOrder == "ascending") {artistRatingButton.innerHTML = "Avg. Rating▲"}
        artistRatingButton.style.left = "74.4%";
        artistRatingButton.addEventListener("click", () => {
            artist.switchDrawOrder("rating");
        })

        let enableGenreButton = create.newElement("div", "button-add-new", '');
        enableGenreButton.style.backgroundImage = "url(images/genre-sortBy-" + genre.sortBy + ".png)";
        enableGenreButton.classList.add("button-enable-genre");
        enableGenreButton.classList.add("button-image");
        enableGenreButton.addEventListener("click", () => {
            genre.sortBy = !genre.sortBy;
            display.updateSectionMiddle();
        })

        upperSection.appendChild(sortInfo);
        upperSection.appendChild(artistNameButton);
        upperSection.appendChild(artistAlbumsButton);
        upperSection.appendChild(artistRatingButton);
        upperSection.appendChild(enableGenreButton);

        let container = document.createElement("div");
        container.id = "container-artist";

        let screen = document.createElement("div");
        screen.id = "screen-container-artist";

        let buffer1 = create.newElement("div", "buffer", '');
        let buffer2 = create.newElement("div", "buffer", '');

        buffer1.style.height = "3%";
        buffer2.style.height = "70%";

        e.appendChild(upperSection);
        e.appendChild(container);
        e.appendChild(screen);

        container.appendChild(buffer1)

        //-----------------------------------------------------------------------------------------------------------------------------------------

        let drawOrder = artist.getDrawOrder(artist.drawType);

        for (let g = 0; g < genre.name.length; g++) {

            let genreCondition1 = (!genre.sortBy && g > 0); // avoids duplicate artists and albums when genre.sortBy == false by skipping them
            let genreCondition2 = !search.passesCheck(g, "genre"); // checks if genre passes filter conditions
            let genreCondition3 = (genre.sortBy && (album.getNumberOf(g, "genre") === 0 && (album.getAbsoluteNumberOf(g, "genre") > 0 && search.isActive()))); // checks if genre has at least 1 album that passes filter conditions WHEN genre.sortBy == true

            if (genreCondition1 || genreCondition2 || genreCondition3) {continue;}

            let genreDividerWrapper = create.newElement("div", "wrapper-divider-genre", '');

            let genreDivider = create.newElement("div", "divider-genre", '');
            genreDivider.addEventListener("click", () => {
                create.toggleOpen("genre", g);
            })

            let genreDividerName = create.newElement("div", "info-divider-genre", genre.name[g]);
            genreDividerName.classList.add("name-divider-genre");

            let genreArtists = create.newElement("div", "info-divider-genre", "artists: " + genre.getNumberOfArtists(g));
            genreArtists.classList.add("artists-divider-genre");

            let genreAlbums = create.newElement("div", "info-divider-genre", "albums: " + album.getNumberOf(g, "genre"));
            genreAlbums.classList.add("albums-divider-genre");

            let genreRating = create.newElement("div", "info-divider-genre", album.getAverageRating(g, "genre"));
            genreRating.classList.add("rating-divider-genre");
            genreRating.style.color = "rgb("+artist.getColor(Number(album.getAverageRating(g, "genre")))+")";

            let genreButtonContainer = create.newElement("div", "info-divider-genre", '');
            genreButtonContainer.classList.add("container-button-genre");

            let genreRemoveButton = create.newElement("div", "button-edit", '');
            genreRemoveButton.classList.add("button-image");
            genreRemoveButton.classList.add("info-divider-genre");
            genreRemoveButton.style.backgroundImage = "url(images/remove.png)";
            genreRemoveButton.addEventListener("click", () => {
                genre.remove(g);
            })

            let genreEditButton = create.newElement("div", "button-edit", '');
            genreEditButton.classList.add("button-image");
            genreEditButton.classList.add("info-divider-genre");
            genreEditButton.style.backgroundImage = "url(images/edit.png)";
            genreEditButton.addEventListener("click", () => {
                create.new("genre", g, "edit");
            })

            genreButtonContainer.appendChild(genreRemoveButton);
            genreButtonContainer.appendChild(genreEditButton);

            genreDivider.appendChild(genreDividerName);
            genreDivider.appendChild(genreArtists);
            genreDivider.appendChild(genreAlbums);
            genreDivider.appendChild(genreRating);

            genreDividerWrapper.appendChild(genreDivider);
            genreDividerWrapper.appendChild(genreButtonContainer);

            if (genre.sortBy) {container.appendChild(genreDividerWrapper);}

            for (let a = 0; a < drawOrder.length; a++) {
                let i = drawOrder[a];

                let artistCondition1 = !search.passesCheck(i, "artist");
                let artistCondition2 = !((artist.getGenreIndex(i) === g && genre.open[g]) || !genre.sortBy);
                let artistCondition3 = (album.getNumberOf(i, "artist") === 0 && album.getAbsoluteNumberOf(i, "artist") > 0 && search.isActive());

                if (artistCondition1 || artistCondition2 || artistCondition3) {continue;}

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
                NoAlbumsContainer.innerHTML = album.getNumberOf(i, "artist");
                NoAlbumsContainer.style.position = "absolute";
                NoAlbumsContainer.style.left = "60.4%";
                NoAlbumsContainer.style.width = "40px";

                let ratingContainer = document.createElement("div");
                ratingContainer.classList.add("container-artist-info")
                ratingContainer.innerHTML = album.getAverageRating(i, "artist").toFixed(1);
                ratingContainer.style.color = "rgb("+artist.getColor(Number(album.getAverageRating(i, "artist")))+")";
                ratingContainer.style.position = "absolute";
                ratingContainer.style.left = "80.7%";
                ratingContainer.style.width = "40px";

                let genreContainer = create.newElement("div", "container-artist-info-genre", genre.name[artist.getGenreIndex(i)]);

                let editButton = document.createElement("div");
                editButton.classList.add("button-edit");
                editButton.classList.add("button-image");
                editButton.style.backgroundImage = "url(images/edit.png)";
                editButton.style.marginRight = "5%";
                editButton.style.marginTop = "0.5%";
                editButton.addEventListener("click", () => {
                    create.new("artist", i, "edit");
                })

                let addButton = document.createElement("div");
                addButton.classList.add("button-edit");
                addButton.classList.add("button-image");
                addButton.style.backgroundImage = "url(images/add.png)";
                addButton.style.marginRight = "8%";
                addButton.style.marginTop = "0.5%";
                addButton.addEventListener("click", () => {
                    create.new("album", i, "add");
                })

                let removeButton = document.createElement("div");
                removeButton.classList.add("button-edit");
                removeButton.classList.add("button-image");
                removeButton.style.backgroundImage = "url(images/remove.png)";
                removeButton.style.right = "11%";
                removeButton.style.marginTop = "0.5%";
                removeButton.addEventListener("click", () => {
                    artist.remove(i)
                })

                let albumContainer = document.createElement("div");
                albumContainer.classList.add("container-album");

                artistUI.appendChild(nameContainer);
                artistUI.appendChild(NoAlbumsContainer);
                artistUI.appendChild(ratingContainer);
                artistUI.appendChild(genreContainer);
                artistWrapper.appendChild(editButton);
                artistWrapper.appendChild(addButton);
                artistWrapper.appendChild(removeButton);

                artistWrapper.appendChild(artistUI);
                artistWrapper.appendChild(albumContainer);

                container.appendChild(artistWrapper);

                artistUI.addEventListener("click", (e) => {
                    create.toggleOpen("artist", i);
                })

                if (artist.open[i] && album.getNumberOf(i, "artist") > 0) {
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
                    if (artist.open[i] && album.artistIndex[I] === i && search.passesCheck(I, "album")) {
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

                        let albumGenre = create.newElement("div", "container-artist-info-genre", genre.name[album.genreIndex[I]]);
                        albumGenre.style.color = "#303030";
                        albumGenre.style.top = "20%";

                        let editAlbumButton = document.createElement("div");
                        editAlbumButton.classList.add("button-edit");
                        editAlbumButton.classList.add("button-image");
                        editAlbumButton.style.backgroundImage = "url(images/edit.png)";
                        editAlbumButton.addEventListener("click", () => {
                            create.new("album", I, "edit");
                        })

                        let removeAlbumButton = document.createElement("div");
                        removeAlbumButton.classList.add("button-edit");
                        removeAlbumButton.classList.add("button-image");
                        removeAlbumButton.style.backgroundImage = "url(images/remove.png)";
                        removeAlbumButton.style.right = "25px";
                        removeAlbumButton.addEventListener("click", () => {
                            album.remove(I, "manual");
                        })

                        albumUI.appendChild(albumName);
                        albumUI.appendChild(albumYear);
                        albumUI.appendChild(albumRating);
                        albumUI.appendChild(albumGenre)
                        albumUI.appendChild(editAlbumButton);
                        albumUI.appendChild(removeAlbumButton);
                        

                        albumContainer.appendChild(albumUI);
                    }
                }
            }
        }
        for (let i = 0; i < document.getElementsByClassName("album").length; i++) {
            if (i%2==0) {
                document.getElementsByClassName("album")[i].style.backgroundColor = "#757575";
            }
        }
        container.appendChild(buffer2);
        if (container.children.length < 3) {buffer2.innerHTML = "No data found"};
        buffer2.style.textAlign = "center";
        container.scrollTop = display.scroll;
        display.updateStatistics();
    },
    updateSectionRight: function(type) {
        if (type == "import") {
            display.updateImport();
        } else if (type == "filter") {
            display.updateFilter();
        } else if (type == "notes") {
            display.updateNotes();
        }
        openRight = type;
    },
    updateImport: function() {
        let e = document.getElementById("section-right");
        e.innerHTML = '';

        let header = document.createElement("div");
        header.classList.add("header-left");
        header.innerHTML = "Import & Export"
        header.style.height = "10%";

        let inputField = document.createElement("input");
        inputField.classList.add("field-import-input");
        inputField.type = "text";
        inputField.placeholder = "paste your list or leave empty to export";

        let previewButton = document.createElement("div");
        previewButton.classList.add("button-preview-import");
        previewButton.innerHTML = "Preview";

        let addButton = document.createElement("div");
        addButton.classList.add("button-preview-import");
        addButton.innerHTML = "Add";
        addButton.style.left = "80%";

        let typeSelector = document.createElement("select");
        typeSelector.classList.add("field-type-select", "button-preview-import");
        typeSelector.name = "type";

        let option1 = document.createElement("option");
        option1.value = 1;
        option1.innerHTML = "Molme";
        let option2 = document.createElement("option");
        option2.value = 2;
        option2.innerHTML = "A & V";

        typeSelector.appendChild(option1);
        typeSelector.appendChild(option2);

        let previewContainer = document.createElement("div");
        previewContainer.id = "container-preview-import";

        let clearButton = document.createElement("div");
        clearButton.classList.add("button-preview-import");
        clearButton.innerHTML = "🗑";
        clearButton.style.left = "5%";
        clearButton.style.lineHeight = "20px";
        clearButton.style.fontSize = "30px";
        clearButton.addEventListener("click", () => {
            inputField.value = '';
            previewContainer.innerHTML = '';
        })

        addButton.addEventListener("click", () => {
            let previousArtistName;
            let artistAcceptedCount = 0;
            let artistRejectedCount = 0;
            let albumAcceptedCount = 0;
            let albumRejectedCount = 0;
            for (let i = 0; i < previewContainer.children.length; i++) {
                if (previewContainer.children[i].classList.contains("artist-preview")) {
                    let artistAmount1 = artist.name.length;
                    artist.add(previewContainer.children[i].innerHTML);
                    previousArtistName = previewContainer.children[i].innerHTML;
                    let artistAmount2 = artist.name.length;
                    if (artistAmount1 === artistAmount2) {artistRejectedCount++}
                    else {artistAcceptedCount++};
                } else if (previewContainer.children[i].classList.contains("album-preview")) {
                    let index = getIndexByName(previousArtistName, "artist");
                    let albumAmount1 = album.name.length;
                    album.add(previewContainer.children[i].children[0].innerHTML, index, Number(previewContainer.children[i].children[1].innerHTML), 2000, 0);
                    let albumAmount2 = album.name.length;
                    if (albumAmount1 === albumAmount2) {albumRejectedCount++}
                    else {albumAcceptedCount++};
                }
            }
            display.updateSectionRight("import");
            alert("Added "+artistAcceptedCount+" artists and "+albumAcceptedCount+" albums with "+artistRejectedCount+" artists and "+albumRejectedCount+" albums rejected as duplicates");
        })

        e.appendChild(header);
        e.appendChild(inputField);
        e.appendChild(previewButton);
        e.appendChild(addButton);
        e.appendChild(typeSelector);
        e.appendChild(clearButton);
        e.appendChild(previewContainer);

        previewButton.addEventListener("click", () => {
            let text = inputField.value;
            let type = Number(typeSelector.value);
            if (text !== "") {display.updateImportPreview(text, type); return}
            else {display.updateExportPreview();} 
        })
    },
    updateImportPreview: function(text, type) { // EI SAA LAITTAA ":", "/"
        if (developerMode) {console.log(type, typeof type)};
        let e = document.getElementById("container-preview-import");
        e.innerHTML = '';
        let textClump = "";
        let artistCutOff;
        let albumCutOff;

        for (let i = 0; i < text.length+1; i++) {
            if (developerMode) {console.log(textClump)}
            if (type === 1) {
                artistCutOff = text[i-1] === ":";
                albumCutOff = text[i-1] === "0" && text[i-2] === "1" && text[i-3] === "/";
            } else if (type === 2) {
                artistCutOff = text[i] === " " && text[i-1] === " " && !(text[i-4] === ":" || text[i-5] === ":" || text[i-6] === ":");
                albumCutOff = (text[i] === " " && text[i-1] !== " " && (text[i-3] === ":" || text[i-4] === ":" || text[i-5] === ":")) || text[i] === undefined;
            }
            if (artistCutOff || albumCutOff) {
                if (artistCutOff) {
                    if (developerMode) {console.log("artistCutOff")}
                    let previewArtist = document.createElement("div")
                    previewArtist.classList.add("artist-preview");
                    while (textClump[0] === " ") {
                        textClump = removeChar(textClump, 0);
                    }
                    previewArtist.innerHTML = removeChar(textClump, textClump.length-1);

                    e.appendChild(previewArtist);
                } else if (albumCutOff) {
                    if (developerMode) {console.log("albumCutOff")}
                    let previewAlbum = document.createElement("div")
                    previewAlbum.classList.add("album-preview");
                    let previewRating = "";
                    
                    if (type === 1) {
                        while (textClump[textClump.length-1] !== "/") {
                            textClump = removeChar(textClump, textClump.length-1);
                        }
                        textClump = removeChar(textClump, textClump.length-1);
                        while (textClump[0] === " ") {
                            textClump = removeChar(textClump, textClump[0]);
                        }
                    }

                    while (textClump[textClump.length-1] !== " ") {
                        previewRating+=textClump[textClump.length-1]
                        textClump = removeChar(textClump, textClump.length-1);
                    }
                    previewRating = reverseString(previewRating);

                    if (type === 1) {
                        for (let a = 0; a < 3; a++) {
                            textClump = removeChar(textClump, textClump.length-1);
                        }
                    } else if (type === 2) {
                        textClump = removeChar(textClump, textClump.length-1);
                        textClump = removeChar(textClump, textClump.length-1);
                        textClump = removeChar(textClump, 0);
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
    updateExportPreview: function() {
        let previewContainer = document.getElementById("container-preview-import");
        let exportText = "";
        for (let i = 0; i < artist.name.length; i++) {
            exportText += artist.name[i] + ":" + '<br>';
            if (developerMode) {console.log(artist.name[i])}
            for (let a = 0; a < album.name.length; a++) {
                if (developerMode) {console.log("scan for albums " + album.artistIndex[a] + " " + i)}
                if (album.artistIndex[a] === i) {
                    exportText += album.name[a] + " - " + album.rating[a] + "/10" + '<br>';
                    if (developerMode) {console.log(album.name[a])}
                }
            }
            exportText += '<br>';
        }
        previewContainer.innerHTML += exportText;
    },
    updateFilter: function() {
        let e = document.getElementById("section-right");
        e.innerHTML = '';

        let header = create.newElement("div", "header-left", "Filter");
        header.style.height = "10%";
        e.appendChild(header);

        let filterSubject = ["artist", "album", "genre"];
        
        for (let i = 0; i < filterSubject.length; i++) {
            let nameSearchField = create.newTextInput("field-filter-input", "Search "+filterSubject[i]+" name");
            nameSearchField.addEventListener("keyup", () => {
                search[filterSubject[i]][0] = nameSearchField.value;
                display.updateSectionMiddle();
            })

            let ratingSearchFieldLower = create.newTextInput("field-filter-input", "<");
            ratingSearchFieldLower.style.width = "10%";
            ratingSearchFieldLower.addEventListener("keyup", (e) => {
                clearIfNaNOrTooLong(ratingSearchFieldLower, 3);
                search[filterSubject[i]][1] = Number(ratingSearchFieldLower.value);
                display.updateSectionMiddle();
            })

            let ratingSearchFieldUpper = create.newTextInput("field-filter-input", ">");
            ratingSearchFieldUpper.style.width = "10%";
            ratingSearchFieldUpper.addEventListener("keyup", (e) => {
                clearIfNaNOrTooLong(ratingSearchFieldUpper, 3);
                let n = Number(ratingSearchFieldUpper.value)
                search[filterSubject[i]][2] = n;
                if (n === 0) {search[filterSubject[i]][2] = 10}
                display.updateSectionMiddle();
            })

            e.appendChild(nameSearchField);
            e.appendChild(ratingSearchFieldLower);
            e.appendChild(ratingSearchFieldUpper);
        }
    },
    updateNotes: function() {
        let e = document.getElementById("section-right");
        e.innerHTML = '';

        let header = document.createElement("div");
        header.classList.add("header-left");
        header.innerHTML = "Notes"
        header.style.height = "10%";

        let notesField = document.createElement("textarea");
        notesField.id = "field-notes";
        notesField.innerHTML = notes;
        notesField.addEventListener("keyup", () => {
            notes = document.getElementById("field-notes").value;
        })

        e.appendChild(header);
        e.appendChild(notesField);
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

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function fixValues() {
    for (let i = 0; i < artist.name.length; i++) {
        artist.name[i] = artist.name[i] + "";
        artist.open[i] = false;
    }
    for (let i = 0; i < album.name.length; i++) {
        album.name[i] = album.name[i] + "";
        album.artistIndex[i] = Number(album.artistIndex[i]);
        album.rating[i] = Number(album.rating[i]);
        album.year[i] = Number(album.year[i]);
        album.genreIndex[i] = Number(album.genreIndex[i]);
        if (album.genreIndex[i] === undefined) {album.genreIndex[i] = 0};
    }
    for (let i = 0; i < genre.name.length; i++) {
        genre.name[i] = genre.name[i] + "";
        genre.open[i] = true;
    }
    reload();
}

function getConfirmedNumber(nbr) {
    if (typeof nbr === "string" && nbr.includes(",")) {
        let i = getCharIndex(nbr, ",");
        nbr = replaceChar(nbr, i, ".")
    }
    nbr = Number(nbr);
    return nbr;
}

function clearIfNaNOrTooLong(e, maxLength) {
    let n = Number(e.value);
    let len = (n + "").length;
    if (isNaN(n) || len > maxLength || n > 10) {
        e.value = '';
        e.innerHTML = '';
    }
}

function getIndexByName(name, subject) {
    for (let i = 0; i < window[subject].name.length; i++) {
        if (window[subject].name[i] === (name + "")) {
            return i;
        }
    }
}

function savePage() {
    var pageSave = {
        savedNotes: notes,
        savedOpenRight: openRight,
        developerMode: developerMode,

        artistName: artist.name,
        artistOpen: artist.open,

        albumName: album.name,
        albumArtistIndex: album.artistIndex,
        albumRating: album.rating,
        albumYear: album.year,
        albumGenreIndex: album.genreIndex,

        genreName: genre.name,
        genreOpen: genre.open,
        genreSortBy: genre.sortBy,
    };
    localStorage.setItem("pageSave", JSON.stringify(pageSave));
}

setInterval(() => {
    savePage();
}, 1000);

function loadPage() {
    var savedPage = JSON.parse(localStorage.getItem("pageSave"));

    if (localStorage.getItem("pageSave") !== null) {
        //if (typeof savedPage.XXX !== "undefined") XXX = savedPage.XXX;

        if (typeof savedPage.savedNotes !== "undefined") notes = savedPage.savedNotes;
        if (typeof savedPage.savedOpenRight !== "undefined") openRight = savedPage.savedOpenRight;
        if (typeof savedPage.developerMode !== "undefined") developerMode = savedPage.developerMode;
        if (typeof savedPage.genreSortBy !== "undefined") genre.sortBy = savedPage.genreSortBy;

        //if (typeof savedPage.XXX !== "undefined") {
        //    for ( let i = 0; i < savedPage.XXX.length; i++) {
        //        XXX[i] = savedPage.XXX[i];
        //    }
        //}


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
        if (typeof savedPage.albumGenreIndex !== "undefined") {
            for ( let i = 0; i < savedPage.albumGenreIndex.length; i++) {
                album.genreIndex[i] = savedPage.albumGenreIndex[i];
            }
        }
        if (typeof savedPage.albumYear !== "undefined") {
            for ( let i = 0; i < savedPage.albumYear.length; i++) {
                album.year[i] = savedPage.albumYear[i];
            }
        }
        if (typeof savedPage.genreName !== "undefined") {
            for ( let i = 0; i < savedPage.genreName.length; i++) {
                genre.name[i] = savedPage.genreName[i];
            }
        }
        if (typeof savedPage.genreOpen !== "undefined") {
            for ( let i = 0; i < savedPage.genreOpen.length; i++) {
                genre.open[i] = savedPage.genreOpen[i];
            }
        }
    }
}

function reset () {
    pageSave = "";
    localStorage.setItem("pageSave", JSON.stringify(pageSave));

    location.reload();
}

function reload() {
    savePage()
    location.reload();
}

window.onload = () => {
    loadPage();
    display.updateUpperBar();
    display.updateStatistics();
    display.updateSectionMiddle();
    display.updateSectionRight(openRight);
}