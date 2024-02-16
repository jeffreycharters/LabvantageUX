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
    /* OPTIONS */
    var _a, _b;
    // Rainbow mode
    const rainbowMode = false;
    // Easy Method Select Mode
    const easyMethodSelectMode = true;
    const methodButtons = [
        "CHEM-055",
        "CHEM-057",
        "CHEM-114",
        "CHEM-162",
        "CHEM-354",
        "TOXI-064",
    ];
    // Manage Page Advanced Search Queries to remove
    // Comment out a line to show the query.
    const manageQueriesToHide = [
        "By Creation Date",
        "By Status",
        // "TodaysSamples",
        "AHL Link# samples",
        "Bacteriology Counts",
        "Bees to Test",
        "CFIA Sa_Cult Isolate",
        "CFIA to Test",
        "CompletedbyParam",
        "CompletedbyParamList",
        // "CompletedbyTestUser",
        // "Data In Progress Short...",
        // "Data entered Short code",
        "FM samples more than 1...",
        "Milk to Test",
        // "Need approval Short code",
        // "NeedApproval",
        // "NeedApproval Extern",
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
        // "SampleSpeciesbyresultv...",
        // "SampleToTest NO OMAF",
        // "SampleToTest OMAFRA",
        "SampleVTHAccessionID",
        // "SamplebySingleTest",
        // "Samples To Test",
        // "Samples Worklist ID",
        // "Samples by Method ID",
        // "Samples by Method ID R...",
        "SamplesByEmpVet",
        "SamplesByFarm",
        // "SamplesByInvoice#",
        // "SamplesByOwner",
        "SamplesByPremiseID",
        // "SamplesByProducer",
        // "SamplesByProject",
        // "SamplesForClient",
        "SamplesInStorage",
        // "SamplesTo Test ALL",
        "SamplesWithHolds",
        // "Short Code DateRange",
        // "SubmitterCaseNumber",
        // "TOXI - Inorganic",
        // "TOXI - Organic",
        // "Test date to Test",
        // "TestsByClient",
        "To Test by Labsect",
    ];
    // Receive Page Advanced Search Queries to remove
    // Comment out a line to show the query.
    const receiveQueriesToHide = [
        // "Rush Samples To Receive",
        // "All Feeds to Receive",
        "AllSamplesToReceive",
        // "Bees to Receive",
        // "CFIA to receive",
        // "GLP to Receive",
        "QE0587 to Receive",
        "QE0843 to Receive",
        "Receive by Project",
        "SampleBySubmission",
        // "SamplesForClient",
        "SamplesReceiveDate",
        "SamplestoReceiveLS",
        // "Test date reached",
        "TodaysSamplesToRec",
    ];
    // Cleaning up clutter
    const removeExtraColumns = true;
    const headingsToRemove = [
        "list_header3",
        "list_header13",
        "list_header14",
        "list_header19",
        "list_header20",
    ];
    const cellsToRemove = [
        "column43",
        "Sampling Date",
        "Due Date",
        "Incident link",
        "column42",
    ];
    /* END OF OPTIONS */
    if (((_a = window.self.frameElement) === null || _a === void 0 ? void 0 : _a.id) === "_nav_frame1") {
        /* WELCOME TO THE NAVFRAME                                            */
        /* This starts below the "receive sample | create worklist | ..." row */
        console.log("Doing navFrame Stuff");
        window.addEventListener("load", () => {
            const onReceivePage = Boolean(document.getElementById("Receive"));
            const queriesToHide = onReceivePage
                ? receiveQueriesToHide
                : manageQueriesToHide;
            hideAdvancedSearchQueries(queriesToHide);
            if (easyMethodSelectMode)
                addAutoCompleteButtons(methodButtons);
        });
        return;
    }
    if (((_b = window.self.frameElement) === null || _b === void 0 ? void 0 : _b.id) === "list_iframe") {
        /* WELCOME TO THE LISTIFRAME            */
        /* This contains the sample list tables */
        console.log("Doing listIFrame Stuff");
        if (removeExtraColumns)
            removeColumns(headingsToRemove, cellsToRemove);
        if (rainbowMode)
            activateRainbowMode();
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
function hideAdvancedSearchQueries(queriesToRemove) {
    var _a, _b;
    // Advanced search
    const queryList = document.querySelectorAll("#querysearch_row tr");
    for (const query of queryList !== null && queryList !== void 0 ? queryList : []) {
        if (queriesToRemove.includes((_b = (_a = query.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : ""))
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
            if (queriesToRemove.includes((_b = (_a = item.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : ""))
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
    buttonsDiv.style.marginTop = "5px";
    buttonsDiv.style.display = "flex";
    buttonsDiv.style.flexWrap = "wrap";
    buttonsDiv.style.gap = "5px";
    const buttons = document.createDocumentFragment();
    for (const buttonText of methodButtons) {
        const newButton = document.createElement("button");
        newButton.textContent = buttonText;
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
