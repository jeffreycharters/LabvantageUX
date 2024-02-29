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
  const options = {
    // Rainbow mode
    rainbowMode: false,

    // Make festive holiday links Halloweenier
    halloweenifyHolidays: true,

    // Submission Form links
    submissionFormLinks: true,
    fastgridLinks: true,

    // Truncate notes so they don't take up too much space
    truncateSampleIDs: true,
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

  if (
    options.halloweenifyHolidays &&
    document.location.toString().includes("logon.jsp")
  ) {
    halloweenifyHolidays();
    return;
  }

  if (document.body.id === "layoutbody") {
    // Hijack the main loader to prettify the spinner
    // No option for this because everyone wants it.
    window.top?.addEventListener("load", () => {
      upgradeAwfulUglySpinner();
    });
  }

  if (window.self.frameElement?.id === "_nav_frame1") {
    /* WELCOME TO THE NAVFRAME                                            */
    /* This starts below the "receive sample | create worklist | ..." row */
    window.addEventListener("load", () => {
      if (options.easyMethodSelectMode)
        addAutoCompleteButtons(options.methodButtons);

      const onReceivePage = Boolean(document.getElementById("Receive"));

      if (onReceivePage) {
        if (options.toxiUpgrades.iconifyLocations) iconifyLocations();
        hideAdvancedSearchQueries(options.receiveQueriesToHide);
      } else hideAdvancedSearchQueries(options.manageQueriesToHide);
    });
    return;
  }

  if (window.self.frameElement?.id === "list_iframe") {
    /* WELCOME TO THE LISTIFRAME            */
    /* This contains the sample list tables */

    // If on the specifications lookup page, remove old versions
    if (document.location.toString().includes("SpecLookup")) {
      removeExtraSpecifications();
      return;
    }

    if (options.rainbowMode) activateRainbowMode();

    if (options.submissionFormLinks) addSubmissionFormLinks();

    if (options.truncateNotes || options.truncateSampleIDs)
      truncate(options.truncateSampleIDs, options.truncateNotes);

    const onReceivePage = document.location.search?.includes("Receive");

    if (onReceivePage) {
      if (options.toxiUpgrades.iconifyLocations) iconifyLocations();
    }

    if (!onReceivePage && options.toxiUpgrades.idexxMod)
      addUncheckIdexxButton();

    if (!onReceivePage && options.removeExtraColumns)
      removeColumns(options.headingsToRemove, options.cellsToRemove);

    return;
  }

  if (window.self.frameElement?.id === "rightframe") {
    /* WELCOME TO THE RIGHTFRAME            */
    /* This contains the fastgrid tables    */
    const observer = new MutationObserver((_mutations, observer) => {
      const submissionDivs = document.querySelectorAll(
        "div.dataentry2-rowheaderdiv:first-child > .gwt-HTML"
      );

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
  if (dateHeader) dateHeader.style.minWidth = "110px";

  // change top table line to match page header
  const tableHeader = document.getElementById("list_tableheaderdiv");
  if (tableHeader) tableHeader.style.backgroundColor = "#005e8a";
})();

/* CLEANING UP SAMPLE LIST UNUSED COLUMS */
function removeColumns(headingsToRemove: string[], cellsToRemove: string[]) {
  const headers = document.querySelectorAll(
    "#list_list th"
  ) as NodeListOf<HTMLTableCellElement> | null;

  for (const header of headers ?? []) {
    if (headingsToRemove.includes(header.id)) {
      header.style.display = "none";
    }
  }

  const cells = document.querySelectorAll(
    "#list_list td"
  ) as NodeListOf<HTMLTableCellElement> | null;
  for (const cell of cells ?? []) {
    if (cellsToRemove.includes(cell.id)) {
      cell.style.display = "none";
    }
  }
}

/* RAINBOW MODE!!! */
function activateRainbowMode() {
  // These next few lines make the Submission Header rows less ugly
  const rows = document.querySelectorAll("tr.list_grouptitle");

  for (const row of rows ?? []) {
    const tds = (Array.from(row.children) ?? []) as HTMLTableCellElement[];
    const styles = [
      "orange",
      "linear-gradient(to right, orange , yellow, green, cyan, blue, violet)",
    ];

    for (const [index, td] of tds.entries()) {
      td.style.filter = "saturate(0.5)";
      td.style.fontSize = "90%";
      td.style.background = styles[index % styles.length];
    }
  }
}

/* HIDE RECEIVE PAGE QUERIES */
function hideAdvancedSearchQueries(queriesToHide: Set<string>) {
  // Advanced search
  const queryList = document.querySelectorAll(
    "#querysearch_row tr"
  ) as NodeListOf<HTMLTableRowElement> | null;

  for (const query of queryList ?? []) {
    if (queriesToHide.has(query.textContent?.trim() ?? ""))
      query.style.display = "none";
  }

  // Dropdown queries
  const dropdownDiv = document.querySelector("table.topsearch_querylabel_div");
  if (!dropdownDiv) return;

  /* The stupid dropdown gets added/removed from DOM as needed */
  dropdownDiv.addEventListener("click", () => {
    const items = document.querySelectorAll(
      "table.topsearch_queryselector_item"
    ) as NodeListOf<HTMLTableRowElement> | null;

    for (const item of items ?? []) {
      if (queriesToHide.has(item.textContent?.trim() ?? ""))
        item.style.display = "none";
    }
  });
}

function addAutoCompleteButtons(methodButtons: string[]) {
  const searchDiv =
    document.getElementById("argsdiv_Samples by Method ID Received") ??
    document.getElementById("argsdiv_WorkList By Method ID");

  if (!searchDiv) return;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.setAttribute(
    "style",
    "width: 85%; margin-top: 5px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;"
  );

  const buttons = document.createDocumentFragment();

  for (const buttonText of methodButtons) {
    const newButton = document.createElement("button");
    newButton.textContent = buttonText;
    newButton.setAttribute("style", "padding: 0 3px; white-space: nowrap;");

    newButton.addEventListener("click", () => {
      const searchInput = searchDiv.querySelector(
        "input"
      ) as HTMLInputElement | null;
      const searchSubmit = searchDiv.querySelector(
        "table.button_modern"
      ) as HTMLButtonElement | null;

      if (!searchInput) return;

      searchInput.value = buttonText;
      searchSubmit?.click();
    });

    buttons.appendChild(newButton);
  }

  buttonsDiv.append(buttons);
  searchDiv.append(buttonsDiv);
}

function addSubmissionFormLinks() {
  const titleRows = document.querySelectorAll(
    "tr>.list_grouptitle:nth-child(2)"
  );
  if (!titleRows) return;

  const externalLinkImage = `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="14" height="14" viewBox="0 0 24 24" stroke-width="1.25" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5" /><line x1="10" y1="14" x2="20" y2="4" /><polyline points="15 4 20 4 20 9" /></svg>`;

  const linkInitial = `https://${window.location.host}/labservices/rc?command=ViewAttachment&sdcid=Submission&keyid1=`;
  const linkFinal = "&keyid2=(null)&keyid3=(null)&attachmentnum=1";
  const submissionRegex = /\d{2}-\d{6}/;

  for (const row of titleRows) {
    const submissionID = submissionRegex.exec(row.textContent ?? "")?.[0];

    const submissionLinkDiv = document.createElement("div");
    submissionLinkDiv.setAttribute(
      "style",
      "border: 1px solid  #999; padding: 0 3px; border-radius: 3px; margin-left: 35px; background: #eed; filter: opacity(0.65); display: inline"
    );

    const submissionLink = document.createElement("a");
    submissionLink.href = linkInitial + submissionID + linkFinal;
    submissionLink.setAttribute(
      "style",
      "font-weight: normal; color: #000; letter-spacing: normal; display: inline-flex; align-items: center; gap: 2px;"
    );
    submissionLink.innerHTML = `Submission Form ${externalLinkImage}`;
    submissionLink.target = "_blank";
    submissionLink.title = "Open Submission Form in new tab";

    submissionLinkDiv.append(submissionLink);
    row.append(submissionLinkDiv);
  }
}

function addFastgridLinks() {
  const submissionRegex = /\d{2}-\d{6}/;

  const submissionDivs = document.querySelectorAll(
    "table.dataentry2-gridheader td:first-child div.dataentry2-rowheaderdiv:first-child > .gwt-HTML"
  );

  for (const div of submissionDivs ?? []) {
    const submissionID = submissionRegex.exec(div.textContent ?? "")?.[0];
    if (!submissionID) continue;

    const submissionLink = document.createElement("a");
    submissionLink.href = `https://${window.location.host}/labservices/rc?command=ViewAttachment&sdcid=Submission&keyid1=${submissionID}&keyid2=(null)&keyid3=(null)&attachmentnum=1`;
    submissionLink.text = div.textContent ?? "";
    submissionLink.target = "_blank";
    submissionLink.title = "Open submission form in new tab";

    div.textContent = "";

    div.append(submissionLink);
  }
}

function upgradeAwfulUglySpinner() {
  const spinner = window.top?.document.querySelector(
    "img[src='WEB-CORE/images/spinners/bluetone.gif']"
  ) as HTMLImageElement | null;

  if (!spinner) return;

  spinner.src = "https://svgshare.com/i/Ri2.svg";
  spinner.style.width = "176px";
  spinner.style.height = "176px";
}

function iconifyLocations() {
  const rows = document.querySelectorAll("#list_list [class^=list_tablerow]");
  if (!rows) return;

  const animalNameColumn = 7;
  const kemptvilleStyling = "color: hsl(0, 0%, 60%); font-style: italic;";

  rows.forEach((row) => {
    (row.childNodes as NodeListOf<HTMLTableCellElement>).forEach((cell) => {
      if (cell.textContent === "In Transit from AHL to AFL")
        cell.textContent = "AHL ➜ AFL";
      if (cell.textContent === "In Transit from Kemptville to AHL")
        cell.textContent = "Kemptville ➜ AFL";
      if (cell.textContent === "K") {
        cell.style.fontWeight = "800";
        cell.style.color = "hsl(40, 100%, 45%)";
        (row.childNodes[animalNameColumn] as HTMLTableCellElement).innerHTML =
          row.childNodes[animalNameColumn].textContent +
          ` <span style="${kemptvilleStyling}">(Kemptville)</span>`;
      }
    });
  });
}

const idexxButtonfunctions = {
  addRemoveIdexxButton: () => {
    const button = document.createElement("button");
    button.textContent = "Uncheck Idexx";
    button.id = "remove-idexx-button";
    button.setAttribute(
      "style",
      "padding: 0 0.2rem; font-size: 0.75rem; transition: opacity 0.2s ease-out;"
    );

    button.addEventListener("click", idexxButtonfunctions.uncheckIdexxInputs);

    const advancedSearch = document.querySelector("select#groupbycolumns");
    advancedSearch?.parentNode?.append(button);
  },

  removeRemoveIdexxButton: () => {
    const removeIdexxButton = document.querySelector(
      "#remove-idexx-button"
    ) as HTMLButtonElement;
    if (removeIdexxButton) {
      removeIdexxButton.addEventListener("transitionend", () =>
        removeIdexxButton.remove()
      );
      removeIdexxButton.style.opacity = "0";
    }
  },

  uncheckIdexxInputs: () => {
    const submissionRows = document.querySelectorAll("[class^=list_tablerow]");
    const selectors = document.getElementsByName("selector");
    for (let i = 0; i < submissionRows.length; ++i) {
      const submissionSource = submissionRows[i].childNodes[11];
      if (submissionSource.textContent?.includes("IDEXX")) {
        selectors[i].click();
      }
    }
  },
};

function addUncheckIdexxButton() {
  const selectAllInput = document.querySelector(
    "#headerselector1"
  ) as HTMLInputElement;

  selectAllInput?.addEventListener("click", () => {
    if (selectAllInput.checked) {
      idexxButtonfunctions.addRemoveIdexxButton();
    } else {
      idexxButtonfunctions.removeRemoveIdexxButton();
    }
  });
}

function truncate(sampleIDs: boolean, notes: boolean) {
  const rows = document.querySelectorAll(
    "tr[class^=list_tablerow]"
  ) as NodeListOf<HTMLTableRowElement>;

  // I'm sure this can be tidied up if you're bored
  // also add "common name" as an option
  for (const row of rows) {
    if (sampleIDs) {
      const sampleIDCell = row.querySelector(
        "#column22"
      ) as HTMLTableCellElement | null;
      if (!sampleIDCell) continue;

      sampleIDCell.style.maxWidth = "10rem";
      sampleIDCell.style.whiteSpace = "nowrap";
      sampleIDCell.style.overflow = "hidden";
      sampleIDCell.style.textOverflow = "ellipsis";

      sampleIDCell.setAttribute("title", sampleIDCell.textContent ?? "");
    }

    if (notes) {
      const notesCell = row.querySelector(
        "#column40"
      ) as HTMLTableCellElement | null;
      if (!notesCell) continue;

      notesCell.style.maxWidth = "10rem";
      notesCell.style.whiteSpace = "nowrap";
      notesCell.style.overflow = "hidden";
      notesCell.style.textOverflow = "ellipsis";
      notesCell.style.color = "red";

      notesCell.setAttribute("title", notesCell.textContent ?? "");
    }
  }
}

function removeExtraSpecifications() {
  const rows = document.querySelectorAll(
    "#list_tablebody tr"
  ) as NodeListOf<HTMLTableRowElement>;
  if (!rows) return;

  const versions = new Map<string, number>();

  for (const row of rows) {
    const specification = row.childNodes[3]?.textContent;
    const version = Number(row.childNodes[5]?.textContent);

    if (!specification || !version) continue;

    if (versions.has(specification)) {
      if (versions.get(specification)! > version) continue;
    }

    versions.set(specification, version);
  }

  for (const row of rows) {
    const specification = row.childNodes[3]?.textContent;
    const version = Number(row.childNodes[5]?.textContent);

    if (!specification || !version) continue;

    const maxVersion = versions.get(specification);
    const containsDoNotUse = row.childNodes[4]?.textContent
      ?.toLowerCase()
      .includes("do not use");

    if (version != maxVersion || containsDoNotUse) {
      row.style.display = "none";
    }
  }
}

function halloweenifyHolidays() {
  // Look I hate this function so much that I take time out of each day to look at it
  // and hate it, but until dexember rolls around I can't fix it properly. It works.
  const imgs = Array.from(document.getElementsByTagName("img"));

  const afl = imgs.filter((img) => img.src.endsWith("AFL.gif"))[0]
    .parentElement;
  const ahl = imgs.filter((img) => img.src.endsWith("AHL.gif"))[0]
    .parentElement;

  const changeStyles = (link: HTMLElement, section: string) => {
    link.innerHTML = `Click for ${section} Holiday Hours`;
    if (section === "AFL") {
      link.innerHTML = `🎃 ${link.innerHTML} 🦇<br>`;
      link.style.color = "orange";
    } else {
      link.innerHTML = `🕷️ ${link.innerHTML} 👻`;
      link.style.color = "black";
    }
    link.style.fontSize = "1.4rem";
    link.style.textDecoration = "none";

    if (document.querySelector(".font") as HTMLDivElement | null)
      document.querySelector(".font")!.textContent = "HAPPY HALLOWDAYS!!";
  };

  if (ahl && afl) {
    changeStyles(afl, "AFL");
    changeStyles(ahl, "AHL");
  }
}
