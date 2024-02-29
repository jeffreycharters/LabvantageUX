"use strict";
// ==UserScript==
// @name         De-uglify LV8
// @namespace    https://goobers.ca
// @version      0.1
// @description  Remove columns from the manage screen (and slightly breaks the receive page but not unusable).
// @author       You
// @match        https://sapphire.lsd.uoguelph.ca:8443/labservices/*
// @match        https://jaguar.lsd.uoguelph.ca:8443/labservices/*
// @grant        none
// ==/UserScript==
(function () {
    var _a, _b, _c, _d, _e;
    /* OPTIONS */
    const options = {
        // Rainbow mode
        rainbowMode: false,
        // Make festive holiday links Halloweenier
        halloweenifyHolidays: true,
        // Submission Form links
        submissionFormLinks: true,
        fastgridLinks: true,
        // Truncate notes so they don't take up too much space
        truncateNotes: true,
        // Enable toxi-centric options
        toxiUpgrades: {
            idexxMod: true, // make IDEXX appear in red, add "uncheck idexx" button to manage
            iconifyLocations: true, // receive page location simplified and upgrade Kemptville obviousness
        },
        // Easy Method Select Mode
        easyMethodSelectMode: true,
        methodButtons: [
            "CHEM-055",
            "CHEM-057",
            "CHEM-114",
            "CHEM-162",
            "CHEM-354",
            "TOXI-064",
        ],
        // Manage Page Advanced Search Queries to remove
        // Comment out a line to show the query.
        manageQueriesToHide: new Set([
            "By Creation Date",
            "By Status",
            "TodaysSamples",
            "AHL Link# samples",
            "Bacteriology Counts",
            "Bees to Test",
            "CFIA Sa_Cult Isolate",
            "CFIA to Test",
            "CompletedbyParam",
            "CompletedbyParamList",
            "CompletedbyTestUser",
            // "Data In Progress Short...",
            // "Data entered Short code",
            "FM samples more than 1...",
            "FM samples more than 14 days",
            "Milk to Test",
            // "Need approval Short code",
            // "NeedApproval",
            "NeedApproval Extern",
            "NeedsApprovalCFIAPBS",
            "OMAFRA_SamplesByDate",
            // "Result level > or < value",
            "SN - Combustion",
            "Sample To Dispose",
            "Sample Type by Date",
            "Sample by Group",
            // "Sample by Short Code",
            // "Sample by Test",
            "Sample by resultvalu",
            // "SampleAnimalClientID",
            // "SampleBySubmission",
            "SampleByVTH Hosp#",
            "SampleInProgress#day",
            "SampleSpeciesbyresultv...",
            "SampleSpeciesbyresultvalue",
            "SampleToTest NO OMAF",
            // "SampleToTest OMAFRA",
            "SampleVTHAccessionID",
            "SamplebySingleTest",
            // "Samples To Test",
            // "Samples Worklist ID",
            "Samples by Method ID",
            // "Samples by Method ID R...",
            "SamplesByEmpVet",
            "SamplesByFarm",
            // "SamplesByInvoice#",
            // "SamplesByOwner",
            "SamplesByPremiseID",
            "SamplesByProducer",
            // "SamplesByProject",
            "SamplesForClient",
            "SamplesInStorage",
            // "SamplesTo Test ALL",
            "SamplesWithHolds",
            // "Short Code DateRange",
            // "SubmitterCaseNumber",
            // "TOXI - Inorganic",
            // "TOXI - Organic",
            "Test date to Test",
            "TestsByClient",
            "To Test by Labsect",
        ]),
        // Receive Page Advanced Search Queries to remove
        // Comment out a line to show the query.
        receiveQueriesToHide: new Set([
            // "Rush Samples To Receive",
            // "All Feeds to Receive",
            // "AllSamplesToReceive",
            "Bees to Receive",
            // "CFIA to receive",
            "GLP to Receive",
            "QE0587 to Receive",
            "QE0843 to Receive",
            // "Receive by Project",
            "SampleBySubmission",
            // "SamplesForClient",
            // "SamplesReceiveDate",
            // "SamplestoReceiveLS",
            "Test date reached",
            // "TodaysSamplesToRec",
        ]),
        // Cleaning up clutter
        removeExtraColumns: true,
        headingsToRemove: [
            "list_header3",
            "list_header13",
            "list_header14",
            "list_header19",
            "list_header20",
        ],
        cellsToRemove: [
            "column43",
            "Sampling Date",
            "Due Date",
            "Incident link",
            "column42",
        ],
    };
    /* END OF OPTIONS */
    if (document.location.toString().includes("logon.jsp") &&
        options.halloweenifyHolidays) {
        halloweenifyHolidays();
        return;
    }
    if (document.body.id === "layoutbody") {
        // Hijack the main loader to prettify the spinner
        // No option for this because everyone wants it.
        (_a = window.top) === null || _a === void 0 ? void 0 : _a.addEventListener("load", () => {
            upgradeAwfulUglySpinner();
        });
    }
    if (((_b = window.self.frameElement) === null || _b === void 0 ? void 0 : _b.id) === "_nav_frame1") {
        /* WELCOME TO THE NAVFRAME                                            */
        /* This starts below the "receive sample | create worklist | ..." row */
        window.addEventListener("load", () => {
            if (options.easyMethodSelectMode)
                addAutoCompleteButtons(options.methodButtons);
            const onReceivePage = Boolean(document.getElementById("Receive"));
            if (onReceivePage) {
                if (options.toxiUpgrades.iconifyLocations)
                    iconifyLocations();
                hideAdvancedSearchQueries(options.receiveQueriesToHide);
            }
            else
                hideAdvancedSearchQueries(options.manageQueriesToHide);
        });
        return;
    }
    if (((_c = window.self.frameElement) === null || _c === void 0 ? void 0 : _c.id) === "list_iframe") {
        /* WELCOME TO THE LISTIFRAME            */
        /* This contains the sample list tables */
        // If on the specifications lookup page, remove old versions
        if (document.location.toString().includes("SpecLookup")) {
            removeExtraSpecifications();
            return;
        }
        if (options.rainbowMode)
            activateRainbowMode();
        if (options.submissionFormLinks)
            addSubmissionFormLinks();
        if (options.truncateNotes)
            truncateNotes();
        const onReceivePage = (_d = document.location.search) === null || _d === void 0 ? void 0 : _d.includes("Receive");
        if (onReceivePage) {
            if (options.toxiUpgrades.iconifyLocations)
                iconifyLocations();
        }
        if (!onReceivePage && options.toxiUpgrades.idexxMod)
            addUncheckIdexxButton();
        if (!onReceivePage && options.removeExtraColumns)
            removeColumns(options.headingsToRemove, options.cellsToRemove);
        return;
    }
    if (((_e = window.self.frameElement) === null || _e === void 0 ? void 0 : _e.id) === "rightframe") {
        /* WELCOME TO THE RIGHTFRAME            */
        /* This contains the fastgrid tables    */
        const observer = new MutationObserver((_mutations, observer) => {
            const submissionDivs = document.querySelectorAll("div.dataentry2-rowheaderdiv:first-child > .gwt-HTML");
            if (submissionDivs.length > 0) {
                observer.disconnect();
                addFastgridLinks();
            }
        });
        observer.observe(window.document.body, { childList: true, subtree: true });
        return;
    }
    // create date width fix
    const dateHeader = document.getElementById("list_header12");
    if (dateHeader)
        dateHeader.style.minWidth = "110px";
    // change top table line to match page header
    const tableHeader = document.getElementById("list_tableheaderdiv");
    if (tableHeader)
        tableHeader.style.backgroundColor = "#005e8a";
})();
/* CLEANING UP SAMPLE LIST UNUSED COLUMS */
function removeColumns(headingsToRemove, cellsToRemove) {
    const headers = document.querySelectorAll("#list_list th");
    for (const header of Array.from(headers !== null && headers !== void 0 ? headers : [])) {
        if (headingsToRemove.includes(header.id)) {
            header.style.display = "none";
        }
    }
    const cells = document.querySelectorAll("#list_list td");
    for (const cell of Array.from(cells !== null && cells !== void 0 ? cells : [])) {
        if (cellsToRemove.includes(cell.id)) {
            cell.style.display = "none";
        }
    }
}
/* RAINBOW MODE!!! */
function activateRainbowMode() {
    var _a, _b;
    // These next few lines make the Submission Header rows less ugly
    const rows = Array.from((_a = document.querySelectorAll("tr.list_grouptitle")) !== null && _a !== void 0 ? _a : []);
    for (const row of rows) {
        const tds = ((_b = Array.from(row.children)) !== null && _b !== void 0 ? _b : []);
        for (const [index, td] of tds.entries()) {
            if (index === 0) {
                td.style.background = "orange";
            }
            else {
                td.style.background =
                    "linear-gradient(to right, orange , yellow, green, cyan, blue, violet)";
            }
            td.style.filter = "saturate(0.5)";
            td.style.fontSize = "90%";
        }
    }
}
/* HIDE RECEIVE PAGE QUERIES */
function hideAdvancedSearchQueries(queriesToHide) {
    var _a, _b;
    // Advanced search
    const queryList = document.querySelectorAll("#querysearch_row tr");
    for (const query of queryList !== null && queryList !== void 0 ? queryList : []) {
        if (queriesToHide.has((_b = (_a = query.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : ""))
            query.style.display = "none";
    }
    // Dropdown queries
    const dropdownDiv = document.querySelector("table.topsearch_querylabel_div");
    if (!dropdownDiv)
        return;
    /* The stupid dropdown gets added/removed from DOM as needed */
    dropdownDiv.addEventListener("click", () => {
        var _a, _b;
        const items = document.querySelectorAll("table.topsearch_queryselector_item");
        for (const item of Array.from(items !== null && items !== void 0 ? items : [])) {
            if (queriesToHide.has((_b = (_a = item.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : ""))
                item.style.display = "none";
        }
    });
}
function addAutoCompleteButtons(methodButtons) {
    var _a;
    const searchDiv = (_a = document.getElementById("argsdiv_Samples by Method ID Received")) !== null && _a !== void 0 ? _a : document.getElementById("argsdiv_WorkList By Method ID");
    if (!searchDiv)
        return;
    const buttonsDiv = document.createElement("div");
    buttonsDiv.setAttribute("style", "width: 85%; margin-top: 5px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;");
    const buttons = document.createDocumentFragment();
    for (const buttonText of methodButtons) {
        const newButton = document.createElement("button");
        newButton.textContent = buttonText;
        newButton.setAttribute("style", "padding: 0 3px; white-space: nowrap;");
        newButton.addEventListener("click", () => {
            const searchInput = searchDiv.querySelector("input");
            const searchSubmit = searchDiv.querySelector("table.button_modern");
            if (!searchInput)
                return;
            searchInput.value = buttonText;
            searchSubmit === null || searchSubmit === void 0 ? void 0 : searchSubmit.click();
        });
        buttons.appendChild(newButton);
    }
    buttonsDiv.append(buttons);
    searchDiv.append(buttonsDiv);
}
function addSubmissionFormLinks() {
    var _a, _b;
    const titleRows = document.querySelectorAll("tr>.list_grouptitle:nth-child(2)");
    if (!titleRows)
        return;
    const externalLinkImage = `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="14" height="14" viewBox="0 0 24 24" stroke-width="1.25" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5" /><line x1="10" y1="14" x2="20" y2="4" /><polyline points="15 4 20 4 20 9" /></svg>`;
    const linkInitial = `https://${window.location.host}/labservices/rc?command=ViewAttachment&sdcid=Submission&keyid1=`;
    const linkFinal = "&keyid2=(null)&keyid3=(null)&attachmentnum=1";
    const submissionRegex = /\d{2}-\d{6}/;
    for (const row of titleRows) {
        const submissionID = (_b = submissionRegex.exec((_a = row.textContent) !== null && _a !== void 0 ? _a : "")) === null || _b === void 0 ? void 0 : _b[0];
        const submissionLinkDiv = document.createElement("div");
        submissionLinkDiv.setAttribute("style", "border: 1px solid  #999; padding: 0 3px; border-radius: 3px; margin-left: 35px; background: #eed; filter: opacity(0.65); display: inline");
        const submissionLink = document.createElement("a");
        submissionLink.href = linkInitial + submissionID + linkFinal;
        submissionLink.setAttribute("style", "font-weight: normal; color: #000; letter-spacing: normal; display: inline-flex; align-items: center; gap: 2px;");
        submissionLink.innerHTML = `Submission Form ${externalLinkImage}`;
        submissionLink.target = "_blank";
        submissionLink.title = "Open Submission Form in new tab";
        submissionLinkDiv.append(submissionLink);
        row.append(submissionLinkDiv);
    }
}
function addFastgridLinks() {
    var _a, _b, _c;
    const submissionRegex = /\d{2}-\d{6}/;
    const submissionDivs = document.querySelectorAll("table.dataentry2-gridheader td:first-child div.dataentry2-rowheaderdiv:first-child > .gwt-HTML");
    for (const div of submissionDivs !== null && submissionDivs !== void 0 ? submissionDivs : []) {
        const submissionID = (_b = submissionRegex.exec((_a = div.textContent) !== null && _a !== void 0 ? _a : "")) === null || _b === void 0 ? void 0 : _b[0];
        if (!submissionID)
            continue;
        const submissionLink = document.createElement("a");
        submissionLink.href = `https://${window.location.host}/labservices/rc?command=ViewAttachment&sdcid=Submission&keyid1=${submissionID}&keyid2=(null)&keyid3=(null)&attachmentnum=1`;
        submissionLink.text = (_c = div.textContent) !== null && _c !== void 0 ? _c : "";
        submissionLink.target = "_blank";
        submissionLink.title = "Open submission form in new tab";
        div.textContent = "";
        div.append(submissionLink);
    }
}
function upgradeAwfulUglySpinner() {
    var _a;
    const spinner = (_a = window.top) === null || _a === void 0 ? void 0 : _a.document.querySelector("img[src='WEB-CORE/images/spinners/bluetone.gif']");
    if (!spinner)
        return;
    spinner.src = "https://svgshare.com/i/Ri2.svg";
    spinner.style.width = "176px";
    spinner.style.height = "176px";
}
function iconifyLocations() {
    const rows = document.querySelectorAll("#list_list [class^=list_tablerow]");
    if (!rows)
        return;
    rows.forEach((row) => {
        row.childNodes.forEach((cell) => {
            if (cell.textContent === "In Transit from AHL to AFL")
                cell.textContent = "AHL ➜ AFL";
            if (cell.textContent === "In Transit from Kemptville to AHL")
                cell.textContent = "Kemptville ➜ AFL";
            if (cell.textContent === "K") {
                cell.style.fontWeight = "800";
                cell.style.color = "hsl(40, 100%, 45%)";
                const animalNameColumn = 7;
                const kemptvilleStyling = "color: hsl(0, 0%, 60%); font-style: italic;";
                row.childNodes[animalNameColumn].innerHTML =
                    row.childNodes[animalNameColumn].textContent +
                        ` <span style="${kemptvilleStyling}">(Kemptville)</span>`;
            }
        });
    });
}
const idexxButtonfunctions = {
    addRemoveIdexxButton: () => {
        var _a;
        const button = document.createElement("button");
        button.textContent = "Uncheck Idexx";
        button.id = "remove-idexx-button";
        button.setAttribute("style", "padding: 0 0.2rem; font-size: 0.75rem; transition: opacity 0.2s ease-out;");
        button.addEventListener("click", idexxButtonfunctions.uncheckIdexxInputs);
        const advancedSearch = document.querySelector("select#groupbycolumns");
        (_a = advancedSearch === null || advancedSearch === void 0 ? void 0 : advancedSearch.parentNode) === null || _a === void 0 ? void 0 : _a.append(button);
    },
    removeRemoveIdexxButton: () => {
        const removeIdexxButton = document.querySelector("#remove-idexx-button");
        if (removeIdexxButton) {
            removeIdexxButton.addEventListener("transitionend", () => removeIdexxButton.remove());
            removeIdexxButton.style.opacity = "0";
        }
    },
    uncheckIdexxInputs: () => {
        var _a;
        const submissionRows = document.querySelectorAll("[class^=list_tablerow]");
        const selectors = document.getElementsByName("selector");
        for (let i = 0; i < submissionRows.length; ++i) {
            const submissionSource = submissionRows[i].childNodes[11];
            if ((_a = submissionSource.textContent) === null || _a === void 0 ? void 0 : _a.includes("IDEXX")) {
                selectors[i].click();
            }
        }
    },
};
function addUncheckIdexxButton() {
    const selectAllInput = document.querySelector("#headerselector1");
    selectAllInput === null || selectAllInput === void 0 ? void 0 : selectAllInput.addEventListener("click", () => {
        if (selectAllInput.checked) {
            idexxButtonfunctions.addRemoveIdexxButton();
        }
        else {
            idexxButtonfunctions.removeRemoveIdexxButton();
        }
    });
}
function truncateNotes() {
    var _a;
    const rows = document.querySelectorAll("tr[class^=list_tablerow]");
    for (const row of rows) {
        const notesCell = row.querySelector("#column40");
        if (!notesCell)
            continue;
        notesCell.style.maxWidth = "10rem";
        notesCell.style.whiteSpace = "nowrap";
        notesCell.style.overflow = "hidden";
        notesCell.style.textOverflow = "ellipsis";
        notesCell.style.color = "red";
        notesCell.setAttribute("title", (_a = notesCell.textContent) !== null && _a !== void 0 ? _a : "");
    }
}
function removeExtraSpecifications() {
    var _a, _b, _c, _d, _e, _f;
    const rows = document.querySelectorAll("#list_tablebody tr");
    if (!rows)
        return;
    const versions = new Map();
    for (const row of rows) {
        const specification = (_a = row.childNodes[3]) === null || _a === void 0 ? void 0 : _a.textContent;
        const version = Number((_b = row.childNodes[5]) === null || _b === void 0 ? void 0 : _b.textContent);
        if (!specification || !version)
            continue;
        if (versions.has(specification)) {
            if (versions.get(specification) > version)
                continue;
        }
        versions.set(specification, version);
    }
    for (const row of rows) {
        const specification = (_c = row.childNodes[3]) === null || _c === void 0 ? void 0 : _c.textContent;
        const version = Number((_d = row.childNodes[5]) === null || _d === void 0 ? void 0 : _d.textContent);
        if (!specification || !version)
            continue;
        const maxVersion = versions.get(specification);
        if (version != maxVersion ||
            ((_f = (_e = row.childNodes[4]) === null || _e === void 0 ? void 0 : _e.textContent) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes("do not use"))) {
            row.style.display = "none";
        }
    }
}
function halloweenifyHolidays() {
    // Look I hate this code so much that I take time out of each day to look at it
    // and hate it, but until dexember rolls around I can't fix it properly. It works.
    const imgs = Array.from(document.getElementsByTagName("img"));
    const afl = imgs.filter((img) => img.src.endsWith("AFL.gif"))[0]
        .parentElement;
    const ahl = imgs.filter((img) => img.src.endsWith("AHL.gif"))[0]
        .parentElement;
    const changeStyles = (link, section) => {
        link.innerHTML = `Click for ${section} Holiday Hours`;
        if (section === "AFL") {
            link.innerHTML = `🎃 ${link.innerHTML} 🦇<br>`;
            link.style.color = "orange";
        }
        else {
            link.innerHTML = `🕷️ ${link.innerHTML} 👻`;
            link.style.color = "black";
        }
        link.style.fontSize = "1.4rem";
        link.style.textDecoration = "none";
        if (document.querySelector(".font"))
            document.querySelector(".font").textContent = "HAPPY HALLOWDAYS!!";
    };
    if (ahl && afl) {
        changeStyles(afl, "AFL");
        changeStyles(ahl, "AHL");
    }
}
