/**
 * @file The `main.js` takes care of setting eventHandlers
 * and connecting the functionality of `util.js` with
 * the html document. Furthermore it contains the code
 * to integrate the monaco editor
 */


import * as util from "./util.js"
import * as jVis from "./jsonld-vis.js"
import * as vVis from "./vega-vis.js"
import themeData from "./monochrome-theme.js"

/***********************************************************/
/*                          Loader                         */
/***********************************************************/
//Show loader until the document is fully loaded
const loader = document.querySelector(".loader-container")
let stateCheck = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(stateCheck);
    loader.classList.add("hidden")
  }
}, 100);

/***********************************************************/
/*                Resizing functionality                   */
/***********************************************************/
const textIcon = document.querySelectorAll(".text-icon");
const resizerY = document.querySelector(".horizontal-divider");
const resizerX = document.querySelector(".vertical-divider");

/*** Horizontal sizing section ***/

/**
 * Mouse down event listener for the resizerX element which
 * then runs the onmousemoveX and the onmouseupX functions
 * @param {event} e - the mousedown event
 */
resizerX.addEventListener("mousedown", (e) => {
  e.preventDefault();
  document.addEventListener("mousemove", onmousemoveX);
  document.addEventListener("mouseup", onmouseupX);
})

/**
 * Function to calculate the x position of the element to be
 * dragged and resize the right and left elements
 * @param {event} e - the mousemove event
 */
function onmousemoveX(e) {
  e.preventDefault();
  let clientX = e.clientX;
  const deltaX = clientX - (resizerX.clientX || clientX);
  const l = resizerX.previousElementSibling;
  const r = resizerX.nextElementSibling;

  if (clientX > screen.width) {
    resizerX.clientX = screen.width;
  }
  else if (clientX < 0) {
    resizerX.clientX = 0;
  }
  else {
    resizerX.clientX = clientX;

    // LEFT
    if (deltaX < 0) {
      const w = Math.round(parseInt(getComputedStyle(l).width) + deltaX);
      l.style.flex = `0 ${w < 45 ? 30 : w}px`;
      r.style.flex = "1 0";
      if (w < 65) {
        textIcon.forEach(text => {
          text.classList.add("hiddenH");
        })
      }
    }

    // RIGHT
    if (deltaX > 0) {
      const w = Math.round(parseInt(getComputedStyle(l).width) + deltaX);
      l.style.flex = `0 ${w > 65 ? 80 : w}px`;
      r.style.flex = "1 0";
      if (w > 65) {
        textIcon.forEach(text => {
          text.classList.remove("hiddenH");
        })
      }
    }
  }
}

/**
 * Function to remove the mousemove and mouseup events
 * and stop the onmousemoveX and onmouseupX functions
 * @param {event} e - the mouseup event
 */
function onmouseupX(e) {
  e.preventDefault();
  document.removeEventListener("mousemove", onmousemoveX);
  document.removeEventListener("mouseup", onmouseupX);
  delete e.clientX;
}


/*** Vertical sizing section ***/

/**
 * Mouse down event listener for the resizerY element which
 * then runs the onmousemoveY and the onmouseupY functions
 * @param {event} e - the mousedown event
 */
resizerY.addEventListener("mousedown", (e) => {
  e.preventDefault();
  document.addEventListener("mousemove", onmousemoveY);
  document.addEventListener("mouseup", onmouseupY);
})

/**
 * Function to calculate the y position of the element to be
 * dragged and resize the top and bottom elements
 * @param {event} e - the mousemove event
 */
function onmousemoveY(e) {
  e.preventDefault();
  const clientY = e.clientY;
  const deltaY = clientY - (resizerY.clientY || clientY);
  const t = resizerY.previousElementSibling;
  const b = resizerY.nextElementSibling;

  if (clientY > screen.height) {
    resizerY.clientY = screen.height;
  }
  else if (clientY < 0) {
    resizerY.clientY = 0;
  }
  else {
    resizerY.clientY = clientY;
    // DOWN
    if (deltaY > 0) {
      const h = Math.round(parseInt(getComputedStyle(b).height) - deltaY);
      b.style.flex = `0 ${h < 55 ? 50 : h}px`;
      t.style.flex = "1 0";
      if (Math.round(parseInt(getComputedStyle(t).height) + deltaY) > 290) {
        textIcon.forEach(text => {
          text.classList.remove("hiddenV");
        })
      }
    }
    // UP
    if (deltaY < 0) {
      const h = Math.round(parseInt(getComputedStyle(t).height) + deltaY);
      t.style.flex = `0 ${h < 205 ? 195 : h}px`;
      b.style.flex = "1 0";
      if (h < 290) {
        textIcon.forEach(text => {
          text.classList.add("hiddenV");
        })
      }
    }
  }
}

/**
 * Function to remove the mousemove and mouseup events
 * and stop the onmousemoveY and onmouseupY functions
 * @param {event} e - the mouseup event
 */
function onmouseupY(e) {
  e.preventDefault();
  document.removeEventListener("mousemove", onmousemoveY);
  document.removeEventListener("mouseup", onmouseupY);
  delete e.clientY;
}

/***********************************************************/
/*              Set New Theme Monaco editor                */
/***********************************************************/

/*** Monaco editor initialization ***/
// require.config({ paths: { vs: 'node_modules/monaco-editor/min/vs' } });
// require.config({ paths: { vs: '../monaco-editor/min/vs' } });
require.config({ paths: { 'vs': '../node_modules/monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], async function () {
  //Get new monochrome theme from monochrome.js file
  monaco.editor.defineTheme('monochrome', themeData);
  document.onload = setTheme()
});

/***********************************************************/
/*                    Editor and tabs                      */
/***********************************************************/

//Decalre all necessary item from the DOM
const addTab = document.querySelector(".ide__tabs__add")
const tabsLeftContainer = document.querySelector(".ide__tabs__left")
const ideContainer = document.querySelector(".ide__container")
let tabsLeft = document.querySelectorAll(".ide__tabs__left li:not(:last-child)")
//Editor list array where all the generated editor will be added and referenced from
let editorList = []
let i = 1

//Initiate by generating the first editor and the respective tab
createIde(i)

/**
 * Funtion which creates a tab for the respective editor
 * and adds all other tab component such as the close button
 * @param {Number} tabNumber - the "id" number for the tab
 * @param {String} exampleName - the initial/default name shown in the tab
 * @param {String} thingType - the type of the object TD or TM
 */
function createTab(tabNumber, exampleName, thingType) {

  const newTab = document.createElement("li")
  //assign the tabNumber to the data-tab-id property
  newTab.setAttribute("data-tab-id", tabNumber)
  newTab.setAttribute('id', 'tab');

  //Add thing type icon to the tab
  const tabIcon = document.createElement("p")
  tabIcon.classList.add("tab-icon")
  if(thingType === "TM"){
    tabIcon.innerText = "TM"
  }else{
    tabIcon.innerText = "TD"
  }

  const tabContent = document.createElement("p")
  //If there is not specified example name give the default Thing Description + tabNumber
  //Else, if the the user uses TD/TM example use the example name as the tab name
  if(exampleName === undefined || exampleName === ""){
    tabContent.innerText = `Thing Description ${tabNumber}`
  }
  else{
    tabContent.innerText = exampleName
  }
  tabContent.classList.add("content-tab")
  //Add the close btn element
  const closeBtn = document.createElement("div")
  closeBtn.classList.add("close-tab")
  //Assign icon to the close btn
  const closeIcon = document.createElement("i")
  closeIcon.classList.add("fa-solid", "fa-xmark")

  closeBtn.appendChild(closeIcon)
  newTab.appendChild(tabIcon)
  newTab.appendChild(tabContent)
  newTab.appendChild(closeBtn)

  //Insert the newly created list at the end of the tab container but before the add new tab button
  tabsLeftContainer.insertBefore(newTab, tabsLeftContainer.children[(tabsLeftContainer.children.length) - 1])
  tabsLeft = document.querySelectorAll(".ide__tabs__left li:not(:last-child)")

  //Once the new tab is created remove "active class from all other tab" as well as the
  //contenteditable attribute and give the class "active to the new tab"
  tabsLeft.forEach(tab => {
    tab.classList.remove("active")
    tab.children[0].removeAttribute("contenteditable")
  })
  newTab.classList.add("active")
}

/**
 * Function which takes care of creating the new editor from monaco
 * and appends them to the DOM
 * @param {Number} ideNumber - the id which is assign to the editor in order to connect to the respective tab
 * @param {Object} exampleValue - the td or tm as a json object
 */
function createIde(ideNumber, exampleValue){
  const url = util.getEditorValue(window.location.hash.substring(1));
  let defaultValue = {}
  let language = "json"

  //check if the user inputed a url wiht a td/tm
  // else check if there is an exampleValue
  if(url === ""){
    //If example value is empty utilize a preset of the most basic form of a td
    //else utilize the td/tm from the exampleValue
    if(exampleValue === undefined){
      defaultValue = {
        "@context": "https://www.w3.org/2022/wot/td/v1.1",
        "id": "urn:uuid:0804d572-cce8-422a-bb7c-4412fcd56f06",
        "@type": "Thing",
        "title": `My thing ${ideNumber}`,
        "description": "Thing Description for a Lamp thing",
        "securityDefinitions": {
            "basic_sc": {"scheme": "basic", "in": "header"}
        },
        "security": "basic_sc",
        "properties": {},
        "actions": {},
        "events": {}
      }
      defaultValue = JSON.stringify(defaultValue, null, 2)
    }
    else{
      clearConsole()
      delete exampleValue["$title"]
      delete exampleValue["$description"]
      defaultValue = JSON.stringify(exampleValue, null, 2)
    }
  }
  else{
    if(url.substring(2,6) === "json"){
      const urlValue = JSON.parse(url.substring(6))
      defaultValue = JSON.stringify(urlValue, null, 2)
    }
    else{
      defaultValue = url.substring(6)
    }
    language = url.substring(2,6)
    //remove the hash from the url to allow new editor to be created
    window.history.replaceState("", "", window.location.origin);
  }

  //Create the container for the new editor and add all necessary attributes for styling and identifiers
  const newIde = document.createElement("div")
  newIde.classList.add("editor")
  newIde.setAttribute('id', `editor${ideNumber}`)
  newIde.setAttribute("data-ide-id", ideNumber)
  ideContainer.appendChild(newIde)

  /**
   * Function to call the monaco script from the node modules and generate a new monaco editor
   */
  require(['vs/editor/editor.main'], async function() {
    //assing the new monaco edito to the previously created container and assign the new value, language and other necessary properties
    var editor = monaco.editor.create(document.getElementById(`editor${ideNumber}`), {
      // value: JSON.stringify(defaultValue, null, 2),
      value: defaultValue, 
      language: language,
      automaticLayout: true,
      formatOnPaste: true
    })

    //Get the td/tm schemas
    const tdSchema = await (await fetch('../node_modules/@thing-description-playground/core/td-schema.json')).json();
	  const tmSchema = await (await fetch('../node_modules/@thing-description-playground/core/tm-schema.json')).json();

    //Bind the font size slider from the settings to the editor and assign the specified font size
    document.onload = setFontSize(editor)
    fontSizeSlider.addEventListener("input", () => {
      setFontSize(editor)
    })

    //Bind the reset button form the settings to the editor and assign the specied font size
    editorForm.addEventListener("reset", () => {
      setFontSize(editor)
    })

    editor.getModel().onDidChangeContent(_ => {
      clearConsole()
      let editorContent = ""
      let thingType = ""

      if(jsonBtn.checked === true){
        editorContent = JSON.parse(editor.getValue())
      }else{
        editorContent = JSON.parse(Validators.convertTDYamlToJson(editor.getValue()))
      }

      if(editorContent["@type"] === "tm:ThingModel"){
        thingType = "TM"
      }else{
        thingType = "TD"
      }

      changeThingIcon(thingType)

      try{
        //Only use the spell checker if file is json
        if(jsonBtn.checked === true){
          //Get if thing type and set the respective schema
          if(editorContent["@type"] === "tm:ThingModel"){
            // Configure JSON language support with schemas and schema associations
            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
              validate: true,
              schemas: [
                {
                  fileMatch: [editor.getModel().uri.toString()],
                  schema: tmSchema,
                  uri: 'file:///tm-schema.json'
                }
              ]
            });
          }
          else{
            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
              validate: true,
              schemas: [
                {
                  fileMatch: [editor.getModel().uri.toString()],
                  schema: tdSchema,
                  uri: 'file:///td-schema.json'
                }
              ]
            });
          }

          markTypos(editor.getModel());
          //TODO add auto validate functionality
          util.validate('auto', autoValidateBtn.checked, thingType.toLocaleLowerCase(), editor);
          // util.validate('auto', autoValidate, docType);
        }
      }catch(err){
        console.log("Not a proper JSON object");
      }
    });

    //Add the new editor to the editor list array
    editorList.push(editor)

    if(url === ""){
      jsonBtn.checked = true
    }
    else{
      if(url.substring(2, 6) === "json"){
        jsonBtn.checked = true
      }
      else{
        yamlBtn.checked = true
      }
    }
  })

  //remove the active class from previous editor
  editorList.forEach(editor => {
    editor.db.classList.remove("active")
  })

  //Add active class to new editor
  newIde.classList.add("active")
  //Create the new tab depending if its a TM or TD
  if(JSON.parse(defaultValue)["@type"] === "tm:ThingModel"){
    createTab(ideNumber,JSON.parse(defaultValue)["title"],"TM")
  }
  else{
    createTab(ideNumber,JSON.parse(defaultValue)["title"],"TD")
  }
}

/**
 * Marks the possible typos on the editor
 * @param {object} model - The model that represents the loaded Monaco editor
 */
function markTypos(model) {
	const markers = []

	JsonSpellChecker.configure()
	const typos = JsonSpellChecker.checkTypos(model.getValue())

	typos.forEach(typo => {
		markers.push({
			message: typo.message,
			severity: monaco.MarkerSeverity.Warning,
			startLineNumber: typo.startLineNumber,
			startColumn: typo.startColumn,
			endLineNumber: typo.endLineNumber,
			endColumn: typo.endColumn
		})
	})

	monaco.editor.setModelMarkers(model, 'typo', markers)
}

/**
 * Findst the current active tab and modifies the icon accordingly
 * @param { string } thingType - TM or TD to modify the tab icon
 */
function changeThingIcon(thingType){
  tabsLeft.forEach(tab => {
    if(tab.classList.contains("active")){
      tab.children[0].innerText = thingType
    }
  })
}


/**
 * Create a new editor and respective tab when clicking on the plus tab
 * Always initialized the new added thing as a TD
 * Set the json btn to true
 */
addTab.addEventListener("click", () => {
  createIde(++i)
  jsonBtn.checked = true
})

/**
 * Getting and managing all event inside the tabs, such as closing and selecting each tab
 * @param {event} e - click event
 */
tabsLeftContainer.addEventListener("click", (e) => {
  //getting the initial target
  const selectedElement = e.target

  clearConsole()

  //Add the active styling when tab is clicked
  if (selectedElement.id == "tab" || selectedElement.parentElement.id == "tab") {

    //Removing the active style from all tabs and contenteditable attribute
    tabsLeft.forEach(tab => {
      tab.classList.remove("active")
      tab.children[0].removeAttribute("contenteditable")
    })
    //removing the active style from all editors
    editorList.forEach(ide => {
      ide.db.classList.remove("active")
    })

    //if the target element is the tab itself add the active class
    //else if the target element is a child of the element add the active
    //calss to the parent element
    if (selectedElement.id == "tab") {
      selectedElement.classList.add("active")
    }
    else {
      selectedElement.parentElement.classList.add("active")
    }

    //Get the id of the element and setting the active style to the respective editor
    if(selectedElement.dataset.tabId){
      editorList.forEach(ide => {
        if(selectedElement.dataset.tabId === ide.db.dataset.ideId){
          ide.db.classList.add("active")
        }
      })
    }
    else{
      editorList.forEach(ide => {
        if(selectedElement.parentElement.dataset.tabId === ide.db.dataset.ideId){
          ide.db.classList.add("active")
        }
      })
    }

    findFileType()
  }

  //Closing tabs only when the click event happens on the close icon of the tab
  if (selectedElement.className == "close-tab" && tabsLeft.length >= 1) {
    //If there is only one tab and its closed create a completely editor and tab and restart the counter
    //If not the last one adjust the styling accordingly and update the amount of tabs
    if (tabsLeft.length == 1) {
      i = 0
      editorList.forEach(ide => {
        if(selectedElement.parentElement.dataset.tabId === ide.db.dataset.ideId){
          //remove the editor from the editor list array and from the DOM
          const index = editorList.indexOf(ide)
          editorList.splice(index, 1)
          ide.db.remove()
        }
      })
      //remove tab
      selectedElement.parentElement.remove()
      //create new tab
      createIde(++i)
      // jsonBtn.checked = true
    }
    else {
      editorList.forEach(ide => {
        if(selectedElement.parentElement.dataset.tabId === ide.db.dataset.ideId){
          const index = editorList.indexOf(ide)
          editorList.splice(index, 1)
          ide.db.remove()
        }
      })
      selectedElement.parentElement.remove()
      tabsLeft = document.querySelectorAll(".ide__tabs__left li:not(:last-child)")
      tabsLeft[0].classList.add("active")
      editorList[0].db.classList.add("active")
    }
  }
  findFileType()
})

/**
 * Event listener to allow the user to change the name of the name by double clicking
 * @param {event} e - dblclick event
 */
tabsLeftContainer.addEventListener("dblclick", (e) => {
  const selectedElement = e.target

  //If target has the calss of content-tab set the attribute contenteditable to true and focus the element
  if (selectedElement.className == "content-tab") {
    selectedElement.setAttribute("contenteditable", "true")
    selectedElement.focus()

    //Once user presses enter disable the contenteditable attribute and stop focus
    selectedElement.addEventListener("keypress", (e) => {
      e.preventDefault()
      //If element is left empty add a default text
      //else remove the content editable attribute and stop focus
      if(e.key === "Enter"){
        if(selectedElement.innerText === "\n"){
          selectedElement.innerText = "My Thing"
        }
        else{
          selectedElement.setAttribute("contenteditable", "false")
          selectedElement.blur()
        }
      }
    })
  }
})

/***********************************************************/
/*                     Settings menu                       */
/***********************************************************/
const closeSettings = document.querySelector(".settings__close i");
const settingsMenu = document.querySelector(".settings-menu");
const settingsBtn = document.querySelector("#settings-btn");
const editorForm = document.querySelector(".settings__editor")
const themePicker = document.querySelector("#theme-picker")
const fontSizeTxt = document.querySelector(".editor-font-size")
const fontSizeSlider = document.querySelector("#font-size")
const autoValidateBtn = document.querySelector('#auto-validate')
const resetLoggingBtn = document.querySelector('#reset-logging')
const validateJSONLDBtn = document.querySelector('#validate-jsonld')
const tmConformanceBtn = document.querySelector('#tm-conformance')

//Bind the font size text to the slider element
fontSizeTxt.innerText = fontSizeSlider.value

/**
 * Event listener for reseting all the settings and preferences values
 * @param {event} e - reset event
 */
editorForm.addEventListener("reset", (e) => {
  e.preventDefault()
  //reset preference values
  fontSizeSlider.value = 14
  fontSizeTxt.innerText = fontSizeSlider.value
  themePicker.value = "light-mode"
  document.documentElement.className = themePicker.value
  storeTheme(themePicker.value)
  storeFontSize(fontSizeSlider.value)
  if (themePicker.value == "dark-mode") {
    monaco.editor.setTheme('vs-dark')
  }else if (themePicker.value == "light-mode") {
    monaco.editor.setTheme('vs')
  }else{
    monaco.editor.setTheme('monochrome')
  }

  //reset setting values
  autoValidateBtn.checked = false
  resetLoggingBtn.checked = true
  validateJSONLDBtn.checked = true
  tmConformanceBtn.checked = true
})

/**
 * Event listeners to open and close the settings menu
 */
closeSettings.addEventListener("click", () => {
  settingsMenu.classList.add("closed");
})
settingsBtn.addEventListener("click", () => {
  settingsMenu.classList.toggle("closed")
})

/****** Themes picker and font picker functionality *******/

/**
 * Store the selected themek in the localStorage
 * @param {String} theme - the name of the theme
 */
const storeTheme = function (theme) {
  localStorage.setItem("theme", theme)
}

/**
 * Store the selected font size in the localStorage
 * @param {Number} fontSize - The number of the font size
 */
const storeFontSize = function (fontSize) {
  localStorage.setItem("fontSize", fontSize)
}

/**
 * Gets the theme value from the localStorage and sets the new theme
 */
const setTheme = function () {
  const activeTheme = localStorage.getItem("theme")
  themePicker.value = activeTheme
  document.documentElement.className = activeTheme

  if (activeTheme == "dark-mode") {
    monaco.editor.setTheme('vs-dark')
  }else if(activeTheme == "light-mode") {
    monaco.editor.setTheme('vs')
  }else{
    monaco.editor.setTheme('monochrome')
  }
}

/**
 * Function which gets the value from the localStorage and sets the new font size
 * @param {object} editor - the editor object which references the created monaco editor
 */
const setFontSize = function (editor) {
  const activeFontSize = localStorage.getItem("fontSize")
  editor.updateOptions({
    fontSize: activeFontSize
  })
}

/**
 * Event listener to change the theme when the theme select input is changed
 */
themePicker.addEventListener("change", () => {
  storeTheme(themePicker.value)
  document.documentElement.className = themePicker.value

  if (themePicker.value == "dark-mode") {
    monaco.editor.setTheme('vs-dark')
  }else if (themePicker.value == "light-mode") {
    monaco.editor.setTheme('vs')
  }else{
    monaco.editor.setTheme('monochrome')
  }
})

/**
 * Event listener to change the font size when the font size input is changed
 */
fontSizeSlider.addEventListener("input", () => {
  fontSizeTxt.innerText = fontSizeSlider.value
  storeFontSize(fontSizeSlider.value)
})

/***********************************************************/
/*                      Examples menu                      */
/***********************************************************/
const closeExamples = document.querySelector(".examples-menu-container__close i")
const examplesMenu = document.querySelector(".examples-menu")
const examplesBtn = document.querySelector("#examples-btn")
const thingTypeSelect = document.querySelector('#thing-type')
const categorySelect = document.querySelector('#thing-category')
const filterForm = document.querySelector('.examples-menu-container__filter')
const tdExamplesContainer = document.querySelector(".examples-container__td")
const tmExamplesContainer = document.querySelector(".examples-container__tm")
const searchInput = document.querySelector(".search-input")
const tdSearchResults = tdExamplesContainer.querySelector("#filtered-results")
const tmSearchResults = tmExamplesContainer.querySelector("#filtered-results")

/**
 * Close examples menu when clicking on x icon and
 * clearing all info inside the examples menu
 */
closeExamples.addEventListener("click", () => {
  examplesMenu.classList.add("closed")

  while(tdExamplesContainer.children.length > 1){
    tdExamplesContainer.lastElementChild.remove()
  }

  while(tmExamplesContainer.children.length > 1){
    tmExamplesContainer.lastElementChild.remove()
  }
})

/**
 * Open examples menu when clicking on examples btn
 * as well as populating the examples and filter selects
 */
examplesBtn.addEventListener("click", () => {
  examplesMenu.classList.remove("closed")
  filterThingType()
  populateCategories()
})

/**
 * Checks the TD/TM select and updates the
 * categories select respectively
 */
function filterThingType(){
  //Clear all elments inside the categories select
  const selectOptions = [...categorySelect.options]
  selectOptions.forEach(option => {
    option.remove()
  })

  if(thingTypeSelect.value === "thing-description"){
    tdExamplesContainer.classList.remove("hidden")
    tmExamplesContainer.classList.add("hidden")
    tdCategories.forEach(category => {
      const opt = document.createElement('option')
      opt.value = category.id
      opt.innerText = category.name
      categorySelect.appendChild(opt)
    })
  }

  if(thingTypeSelect.value === "thing-model"){
    tmExamplesContainer.classList.remove("hidden")
    tdExamplesContainer.classList.add("hidden")
    tmCategories.forEach(category => {
      const opt = document.createElement('option')
      opt.value = category.id
      opt.innerText = category.name
      categorySelect.appendChild(opt)
    })
  }
}

/**
 * Event listeners to check for changes and scroll to the respective category
 */
thingTypeSelect.addEventListener("change", () => {
  filterThingType()
  const element = document.getElementById(categorySelect.value);
  element.scrollIntoView({behavior: "smooth", block: "start"})
})
categorySelect.addEventListener("change", () => {
  const element = document.getElementById(categorySelect.value);
  element.scrollIntoView({behavior: "smooth", block: "start"})
})

/**
 * Listener when search input is used in the examples menu
 * Gets all the examples that match the inputed text to the title and
 * description of the examples, clones them and adds them to the
 * search result category
 * @param {event} e - submit event
 */
filterForm.addEventListener("submit", (e) => {
  e.preventDefault()

  //Check if the thingType select is TD or TM
  if(thingTypeSelect.value === "thing-description"){
    //Only ge the container for the searched results
    const examplesContainer = tdSearchResults.querySelector(".examples-category__container")
    //Clean all the children component
    while(examplesContainer.children.length > 0){
      examplesContainer.firstElementChild.remove()
    }
    //Show the td examples container and hide the tm examples container
    tdSearchResults.classList.remove("hidden")
    tmSearchResults.classList.add("hidden")

    //Get all the categories and their title and description values
    const categories = tdExamplesContainer.querySelectorAll(".examples-category:not(:first-child)")
    categories.forEach(category => {
      const examples = [...category.children[2].children]
      examples.forEach(example => {
        //If value of the search input mataches the title or description
        //clone it, append it and add the respective event listeners
        if((example.firstChild.childNodes[1].innerText.toLowerCase()).includes(searchInput.value.toLowerCase()) || (example.children[1].children[0].innerText.toLowerCase()).includes(searchInput.value.toLowerCase())){
          let clonedElement = example.cloneNode(true)
          clonedElement.children[0].addEventListener('click', () => {
            clonedElement.classList.toggle("open")
          })

          clonedElement.querySelector(".example__btn--use").addEventListener('click', () => {
            example.querySelector(".example__btn--use").click()
            clonedElement.classList.toggle("open")
          })
          examplesContainer.appendChild(clonedElement)
        }
        //If input value is empty clear all the search results and hide the category
        if(searchInput.value === ""){
          while(examplesContainer.children.length > 0){
            examplesContainer.firstElementChild.remove()
          }
          tdSearchResults.classList.add("hidden")
        }
      })
    })
  }
  else{
    const examplesContainer = tmSearchResults.querySelector(".examples-category__container")
    while(examplesContainer.children.length > 0){
      examplesContainer.firstElementChild.remove()
    }
    tmSearchResults.classList.remove("hidden")
    tdSearchResults.classList.add("hidden")
    const categories = tmExamplesContainer.querySelectorAll(".examples-category:not(:first-child)")
    categories.forEach(category => {
      const examples = [...category.children[2].children]
      examples.forEach(example => {
        if((example.firstChild.childNodes[1].innerText.toLowerCase()).includes(searchInput.value.toLowerCase()) || (example.children[1].children[0].innerText.toLowerCase()).includes(searchInput.value.toLowerCase())){
          let clonedElement = example.cloneNode(true)
          clonedElement.children[0].addEventListener('click', () => {
            clonedElement.classList.toggle("open")
          })

          clonedElement.querySelector(".example__btn--use").addEventListener('click', () => {
            example.querySelector(".example__btn--use").click()
            clonedElement.classList.toggle("open")
          })
          examplesContainer.appendChild(clonedElement)
        }

        if(searchInput.value === ""){
          while(examplesContainer.children.length > 0){
            examplesContainer.firstElementChild.remove()
          }
          tmSearchResults.classList.add("hidden")
        }
      })
    })
  }
})

// Creating categories arrays and populating them with async call
let tdCategories = []
let tmCategories = []
getCategories()

/**
 * Get all the td and tm names, description and id from the paths file
 */
async function getCategories(){
  const res = await fetch('./examples-paths.json')
  const data = await res.json()

  const categoriesTD = Object.entries(data["td"])
  categoriesTD.forEach(category => {
    const newCategory = {
      name: "",
      description: "",
      id: ""
    }
    //Removing all "-" from the category to use as the name
    const categoryName = (category[0].substring(category[0].indexOf("-") + 1)).replaceAll('-', ' ')
    //Use the category as the id
    const categoryId = category[0]
    //Utilze the path to the raw file to fetch the description
    fetch(category[1].description)
      .then(response => response.text())
      .then(textString => {
        newCategory["description"] = textString
      })

    newCategory["name"] = categoryName
    newCategory["id"] = categoryId
    //Push to the td categories array
    tdCategories.push(newCategory)
  })

  const categoriesTM = Object.entries(data["tm"])
  categoriesTM.forEach(category => {
    const newCategory = {
      name: "",
      description: "",
      id: ""
    }
    //Removing all "-" from the category to use as the name
    const categoryName = (category[0].substring(category[0].indexOf("-") + 1)).replaceAll('-', ' ')
    //use the category as the id
    const categoryId = category[0]
    //Utilze the path to the raw file to fetch the description
    fetch(category[1].description)
      .then(response => response.text())
      .then(textString => {
        newCategory["description"] = textString
      })

    newCategory["name"] = categoryName
    newCategory["id"] = categoryId
    //Push to the td categories array
    tmCategories.push(newCategory)
  })
}

/**
 * Creates all the html container elements for the TD and TM categories
 * and initializes the getAllExamples function
 */
function populateCategories(){
  tdCategories.forEach(category => {
    const categoryContainer = document.createElement('div')
    categoryContainer.classList.add("examples-category")
    categoryContainer.setAttribute("data-category", category.id)
    categoryContainer.setAttribute("id", category.id)
    tdExamplesContainer.appendChild(categoryContainer)

    const categoryTitle = document.createElement('div')
    categoryTitle.classList.add("examples-category__title")
    categoryContainer.appendChild(categoryTitle)

    const title = document.createElement('h3')
    title.innerText = category.name
    categoryTitle.appendChild(title)

    const categoryDescription = document.createElement('div')
    categoryDescription.classList.add("examples-category__description")
    categoryContainer.appendChild(categoryDescription)

    const description = document.createElement('p')
    description.innerText = category.description
    categoryDescription.appendChild(description)

    const categoryContent = document.createElement('div')
    categoryContent.classList.add("examples-category__container")
    categoryContainer.appendChild(categoryContent)

    getAllExamples(category.id, "td")
  })

  tmCategories.forEach(category => {
    const categoryContainer = document.createElement('div')
    categoryContainer.classList.add("examples-category")
    categoryContainer.setAttribute("data-category", category.id)
    categoryContainer.setAttribute("id", category.id)
    tmExamplesContainer.appendChild(categoryContainer)

    const categoryTitle = document.createElement('div')
    categoryTitle.classList.add("examples-category__title")
    categoryContainer.appendChild(categoryTitle)

    const title = document.createElement('h3')
    title.innerText = category.name
    categoryTitle.appendChild(title)

    const categoryDescription = document.createElement('div')
    categoryDescription.classList.add("examples-category__description")
    categoryContainer.appendChild(categoryDescription)

    const description = document.createElement('p')
    description.innerText = category.description
    categoryDescription.appendChild(description)

    const categoryContent = document.createElement('div')
    categoryContent.classList.add("examples-category__container")
    categoryContainer.appendChild(categoryContent)

    getAllExamples(category.id, "tm")
  })
}

/**
 * Utilizes the paths file to get all examples from github
 * and calls the create example function with the id and raw path
 * @param {string} categoryId - the name of the category
 * @param {string} thingType - td or tm
 */
async function getAllExamples(categoryId, thingType){
  const res = await fetch('./examples-paths.json')
  const data = await res.json()
  const examples = Object.entries(data[thingType][categoryId]["examples"])
  examples.forEach(example => {
    createExample(categoryId, example[1]["path"])
  })
}

/**
 * Create all the html container element for the examples
 * and utilizes the raw paths to fetch all the respective
 * information
 * @param { String } folderName - id of the category
 * @param { String } rawPath - the raw path to the github example
 */
async function createExample(folderName, rawPath){
  const res = await fetch(rawPath)
  const data = await res.json()

  //get category
  const categoryContainer = document.querySelector(`[data-category='${folderName}'] .examples-category__container`)

  //individual examples
  const exampleContainer = document.createElement('div')
  exampleContainer.classList.add("example")
  categoryContainer.appendChild(exampleContainer)

  //create example title
  const exampleName = document.createElement('div')
  exampleName.classList.add("example__name")
  const exampleNameIcon = document.createElement('i')
  exampleNameIcon.classList.add("fa-solid", "fa-file-code")
  exampleName.appendChild(exampleNameIcon)
  const exampleNameTitle = document.createElement('p')
  exampleNameTitle.innerText = data['$title']
  exampleName.appendChild(exampleNameTitle)
  exampleContainer.appendChild(exampleName)

  //add event listener to show example information and interaction btns
  exampleName.addEventListener('click', () => {
    exampleName.parentElement.classList.toggle("open")
  })

  //create example content
  const exampleContent = document.createElement('div')
  exampleContent.classList.add("example__content")
  exampleContainer.appendChild(exampleContent)

  const exampleDescription = document.createElement('p')
  exampleDescription.innerText = data['$description']
  exampleDescription.classList.add('example__description')
  exampleContent.appendChild(exampleDescription)

  const exampleBtns = document.createElement('div')
  exampleBtns.classList.add("example__btn")
  exampleContent.appendChild(exampleBtns)

  const exampleBtnUse = document.createElement('button')
  exampleBtnUse.classList.add("example__btn--use")
  exampleBtns.appendChild(exampleBtnUse)

  const exampleBtnShow = document.createElement('button')
  exampleBtnShow.classList.add("example__btn--show")
  exampleBtns.appendChild(exampleBtnShow)

  const exampleIconShow = document.createElement('i')
  exampleIconShow.classList.add("fa-solid", "fa-eye")
  exampleBtnShow.appendChild(exampleIconShow)

  const exampleTxtShow = document.createElement('p')
  exampleTxtShow.innerText = "Show Snipet"
  exampleBtnShow.appendChild(exampleTxtShow)

  const exampleIconUse = document.createElement('i')
  exampleIconUse.classList.add("fa-solid", "fa-file-pen")
  exampleBtnUse.appendChild(exampleIconUse)

  const exampleTxtUse = document.createElement('p')
  exampleTxtUse.innerText = "Use as Template"
  exampleBtnUse.appendChild(exampleTxtUse)

  //Listenr to generate an editor with the examples information
  exampleBtnUse.addEventListener('click', () => {
    createIde(++i, data)
    examplesMenu.classList.add("closed")
    // Clear all the categories content
    while(tdExamplesContainer.children.length > 1){
      tdExamplesContainer.lastElementChild.remove()
    }
    while(tmExamplesContainer.children.length > 1){
      tmExamplesContainer.lastElementChild.remove()
    }
  })
}

/***********************************************************/
/*                   Yaml functionality                    */
/***********************************************************/

const yamlBtn = document.querySelector("#file-type-yaml")
const jsonBtn = document.querySelector("#file-type-json")
const yamlWarning = document.querySelector('.json-yaml-warning')
const yamlConfirmBtn = document.querySelector("#yaml-confirm-btn")
const yamlCancelBtn = document.querySelector("#yaml-cancel-btn")
jsonBtn.checked = true

//Click event to show the warning text before converting the td/tm
yamlBtn.addEventListener("click", ()=> {
  editorList.forEach(editor => {
    if(editor.db.classList.contains("active")){
      try{
        JSON.parse(editor.getValue())
      }
      catch(err){
        alert('TD is not a valid JSON');
        jsonBtn.checked  = true
        return
      }
      yamlWarning.classList.remove('closed')
    }
  })
})

//Close the warning without converting
yamlCancelBtn.addEventListener("click", () => {
  yamlWarning.classList.add('closed')
  jsonBtn.checked  = true
})

//Confirm the json to yaml convertion
yamlConfirmBtn.addEventListener("click", () => {
  yamlWarning.classList.add('closed')
  convertJsonYaml()
})

jsonBtn.addEventListener("click", ()=> {
  convertJsonYaml()
})

/**
 * Get the currently active editor and its value and convert to json or yaml
 */
function convertJsonYaml(){
  editorList.forEach(editor => {
    if(editor.db.classList.contains("active")){
      util.generateTD(jsonBtn.checked === true ? "json" : "yaml", editor)
    }
  })
}

/**
 * Find if active editor is json or yaml and change the json/yaml btns repectively
 */
function findFileType(){
  editorList.forEach(editor => {
    if(editor.db.classList.contains("active")){
      // console.log(editor.db);
      if(editor.db.dataset.modeId === "json"){
        jsonBtn.checked = true
      }
      else{
        yamlBtn.checked = true
      }
    }
  })
}

/***********************************************************/
/*                 Save Menu functionality                 */
/***********************************************************/
const saveMenu = document.querySelector(".save-menu")
const saveMenuBtn = document.querySelector("#save-btn")
const closeSaveMenu = document.querySelector(".save-menu-close i")
const shareUrlContainer =  document.querySelector("#share-url-input")
const shareUrlBtn = document.querySelector("#share-url-btn")
const downloadBtn = document.querySelector("#download-btn")
const saveAsBtn = document.querySelector("#save-as-btn")
const saveAsWarning = document.querySelector(".save-warning")
let fileHandle;

shareUrlContainer.value = ""

//Open the save menu
saveMenuBtn.addEventListener("click", () => {
  saveMenu.classList.remove("closed")
})

//Hide save menu
closeSaveMenu.addEventListener("click", () => {
  saveMenu.classList.add("closed")
  shareUrlContainer.value = ""
})

/**
 * Get the active editor, the format type, doc type and editor
 * and call the saveAsURL function
 */
shareUrlBtn.addEventListener("click", () => {
  try{
    editorList.forEach(editor => {
      if(editor.db.classList.contains("active")){
        const formatType = editor.db.dataset.modeId
        let editorContent = {}
        let docType = ""
        if(formatType === "json"){
          editorContent = JSON.parse(editor.getValue())
        }
        else{
          editorContent = JSON.parse(Validators.convertTDYamlToJson(editor.getValue()))
        }
  
        if(editorContent["@type"] === "tm:ThingModel"){
          docType = "tm"
        }
        else{
          docType = "td"
        }
  
        saveAsURL(docType, formatType, editor)
      }
    })
  }catch(err){
    //if error show message
    shareUrlContainer.value = "Invalid JSON Object"
    shareUrlContainer.classList.add("error")
    setTimeout(() => {
      shareUrlContainer.value = ""
      shareUrlContainer.classList.remove("error")
    }, 1500)
  }
})

/**
 * Get the doc type, format type and editor and calls the utils save function
 * It then copies the link to the clipboard and the url container
 * finally removes the hash from the url
 * @param { String } docType - tm or td
 * @param { String } format - json or yaml
 * @param { Object } editor - the editor reference object
 */
async function saveAsURL(docType, format, editor){
  const result = await util.save(docType, format, editor)
  shareUrlContainer.value = result
  window.history.replaceState("", "", window.location.origin);
}

/**
 * Gets the active editor, editor content type and tab name,
 * then it calls the utils offerFileDownload
 */
downloadBtn.addEventListener("click", () => {
  editorList.forEach(editor => {
    if(editor.db.classList.contains("active")){
      let tabName = ''
      tabsLeft.forEach(tab => {
        if(tab.classList.contains("active")){
          tabName = tab.children[1].innerText.replaceAll(' ', '-');
        }
      })
      const contentType = `application/${editor.db.dataset.modeId};charset=utf-8;`

      util.offerFileDownload(
        `${tabName}.${editor.db.dataset.modeId}`,
        editor.getValue(),
        contentType
      )
    }
  })
  saveMenu.classList.add("closed")
})

/* Save as btn functionality */
saveAsBtn.addEventListener("click", () => {
  saveAsFile()
})

/**
 * Saves the td as a file in the file system
 * @param {*} content 
 */
async function saveFile(content){
  let stream = await fileHandle.createWritable()
  await stream.write(content)
  await stream.close()
}

/**
 * Opens the file system allows the user to input a file 
 * name and save it as json , jsonld or yaml
 * This function only works for chrome, edge and oper as of now (26.05.2023)
 */
async function saveAsFile(){
  try{
    const opts = {
      types: [
        {
          description: "json, jsonld or ymal files only",
          accept: { "text/plain": [".jsonld", ".json"] },
        },
      ],
      excludeAcceptAllOption: true,
    };
    fileHandle = await window.showSaveFilePicker(opts);
    editorList.forEach(editor => {
      if(editor.db.classList.contains("active")){
        let editorContent = editor.getValue()
        // console.log(editorContent);
        saveFile(editorContent)
      }
    })
  }catch(err){
    const errTxt = `${err}`
    if(errTxt === "AbortError: The user aborted a request.")
    {
      console.log(err);
    }
    else{
      saveAsWarning.classList.add("active")
      setTimeout(() => {
        saveAsWarning.classList.remove("active")
      },1500)
    }
  }
}

//TODO IMPORT FROM FILES
/** Experimental file manager fucntion*/
// const visualizeView = document.querySelector("#visualize-view p")
// async function getFile() {
//   // Open file picker and destructure the result the first handle
//   [fileHandle] = await window.showOpenFilePicker()
//   let fileData = await fileHandle.getFile()
//   let text = await fileData.text()
//   visualizeView.innerText = text
//   console.log(JSON.parse(text));
// }


/***********************************************************/
/*     Validate, Console, visualization functionality      */
/***********************************************************/
const validateBtn = document.querySelector("#validate-btn")
const errorContainer = document.querySelector(".console__content #console-error")
const errorTxt = document.querySelector(".console-error__txt")
const eraseConsole = document.querySelector(".console__tabs .trash")
const visualizationOptions = document.querySelectorAll(".visualization__option")
const visualizationContainers = document.querySelectorAll(".console-view")
const openApiTab = document.querySelector(".api-view-btn")
const openApiJsonBtn = document.querySelector("#open-api-json")
const openApiYamlBtn = document.querySelector("#open-api-yaml")
const asyncApiTab = document.querySelector(".async-view-btn")
const asyncApiJsonBtn = document.querySelector("#async-api-json")
const asyncApiYamlBtn = document.querySelector("#async-api-yaml")
const defaultTab = document.querySelector(".defaults-view-btn")
const defaultsJsonBtn = document.querySelector("#defaults-json")
const defaultsYamlBtn = document.querySelector("#defaults-yaml")
const defaultsAddBtn = document.querySelector("#defaults-add")
const defaultsRemoveBtn = document.querySelector("#defaults-remove")
const validationHeaderIcons = document.querySelectorAll(".validation-view-cotainer .title-icon")

//Visualizations download btns
const openApiDownload = document.querySelector("#open-api-download")
const asyncApiDownload = document.querySelector("#async-api-download")
const defaultsDownload = document.querySelector("#defaults-download")

visualizationOptions.forEach(option => {
  option.checked = false
})

validateBtn.addEventListener("click", () => {
  visualizationOptions.forEach(option => {
    if(option.id === "validation-view"){
      option.checked = true
    }
    visualizationContainers.forEach(container => {
      container.classList.add("hidden")
      if(container.id === "validation-view"){
        container.classList.remove("hidden")
      }
    })
  })
  // clearConsole()
  // clearVisualizationConsoles()
  editorList.forEach(editor => { 
    if(editor.db.classList.contains("active")){
      util.validate('manual', autoValidateBtn.checked, "td", editor);
    }
  })
})

eraseConsole.addEventListener("click", () => {
  clearConsole()
  clearVisualizationConsoles()
})

/**
 * Unchecks all visualizatin btns and hiddes all visualization containers
 */
function clearConsole(){
  visualizationContainers.forEach(container => {
    container.classList.add("hidden")
  })
  visualizationOptions.forEach(option => {
    option.checked = false
  })
}

function clearVisualizationConsoles(){
  window.openApiEditor.getModel().setValue('')
  window.asyncApiEditor.getModel().setValue('')
  window.defaultsEditor.getModel().setValue('')
}

//Donwload visualizations

openApiDownload.addEventListener("click", () => {
  const contentType = `application/${window.openApiEditor.db.dataset.modeId};charset=utf-8;`
  let visualizationName = JSON.parse(Validators.convertTDYamlToJson(window.openApiEditor.getModel().getValue()))["info"]["title"]
  visualizationName = visualizationName.replace(/\s/g, "-")
  util.offerFileDownload(
    `${visualizationName}-OpenAPI.${openApiEditor.db.dataset.modeId}`,
    window.openApiEditor.getModel().getValue(),
    contentType
  )
})

asyncApiDownload.addEventListener("click", () => {
  const contentType = `application/${window.asyncApiEditor.db.dataset.modeId};charset=utf-8;`
  let visualizationName = JSON.parse(Validators.convertTDYamlToJson(window.asyncApiEditor.getModel().getValue()))["info"]["title"]
  visualizationName = visualizationName.replace(/\s/g, "-")
  util.offerFileDownload(
    `${visualizationName}-AsyncAPI.${asyncApiEditor.db.dataset.modeId}`,
    window.asyncApiEditor.getModel().getValue(),
    contentType
  )
})

defaultsDownload.addEventListener("click", () => {
  const contentType = `application/${window.defaultsEditor.db.dataset.modeId};charset=utf-8;`
  let visualizationName = JSON.parse(Validators.convertTDYamlToJson(window.defaultsEditor.getModel().getValue()))["title"]
  visualizationName = visualizationName.replace(/\s/g, "-")
  util.offerFileDownload(
    `${visualizationName}-Defaults.${defaultsEditor.db.dataset.modeId}`,
    window.defaultsEditor.getModel().getValue(),
    contentType
  )
})

/*** Visualization ***/
//TODO MAYBE CHANGE THE WAY THE CONTAINER OPEN
visualizationOptions.forEach(option => {
  option.addEventListener("click", () => {
    clearVisualizationConsoles()
    visualizationContainers.forEach(container => {
      container.classList.add("hidden")
      if(option.id == container.id){
        container.classList.remove("hidden")
      }
    })

    if(option.id === "open-api-view"){
      editorList.forEach(editor => {
        if(editor.db.classList.contains("active")){
          let td = editor.getValue()
          if(editor.db.dataset.modeId === "yaml"){
            td = Validators.convertTDYamlToJson(td)
            openApiJsonBtn.disabled = false
            openApiYamlBtn.disabled = true
          }else{
            openApiJsonBtn.disabled = true
            openApiYamlBtn.disabled = false
          }
          if(JSON.parse(td)["@type"] === "tm:ThingModel"){
            errorTxt.innerText = "This function is only allowed for Thing Descriptions!"
            errorContainer.classList.remove("hidden")
          }else{
            errorContainer.classList.add("hidden")
            enableAPIConversionWithProtocol(editor)
          }
        }
      })
    }

    if(option.id === "async-api-view"){
      editorList.forEach(editor => {
        if(editor.db.classList.contains("active")){
          let td = editor.getValue()
          if(editor.db.dataset.modeId === "yaml"){
            td = Validators.convertTDYamlToJson(td)
            asyncApiJsonBtn.disabled = false
            asyncApiYamlBtn.disabled = true
          }else{
            asyncApiJsonBtn.disabled = true
            asyncApiYamlBtn.disabled = false
          }

          if(JSON.parse(td)["@type"] === "tm:ThingModel"){
            errorTxt.innerText = "This function is only allowed for Thing Descriptions!"
            errorContainer.classList.remove("hidden")
          }else{
            errorContainer.classList.add("hidden")
            enableAPIConversionWithProtocol(editor)
          }
        }
      })
    }

    if(option.id === "defaults-view"){
      editorList.forEach(editor => {
        if(editor.db.classList.contains("active")){
          let td = editor.getValue()
          if(editor.db.dataset.modeId === "yaml"){
            td = Validators.convertTDYamlToJson(td)
            defaultsJsonBtn.disabled = false
            defaultsYamlBtn.disabled = true
          }else{
            defaultsJsonBtn.disabled = true
            defaultsYamlBtn.disabled = false
          }
          if(JSON.parse(td)["@type"] === "tm:ThingModel"){
            errorTxt.innerText = "This function is only allowed for Thing Descriptions!"
            errorContainer.classList.remove("hidden")
          }else{
            errorContainer.classList.add("hidden")
            util.addDefaults(editor)
          }
        }
      })
    }
  })
})


/**
 * Enable Open/Async API elements according to the protocol schemes of a TD
 * @param {object} editor - currently active monaco editor
 */
function enableAPIConversionWithProtocol(editor) {
  let td = editor.getValue()
	if (yamlBtn.checked === true) {
		td = Validators.convertTDYamlToJson(td)
	}

	const protocolSchemes = Validators.detectProtocolSchemes(td)

	if (protocolSchemes) {
		
    if(openApiTab.checked === true){
      if (["http", "https"].some(p => protocolSchemes.includes(p))) {
        util.generateOAP(editor.db.dataset.modeId, editor)
      } else {
        errorTxt.innerText = "Please insert a TD which uses HTTP"
        errorContainer.classList.remove("hidden")
      }
    }

    if(asyncApiTab.checked === true){
      if (["mqtt", "mqtts"].some(p => protocolSchemes.includes(p))) {
        util.generateAAP(editor.db.dataset.modeId, editor)
      } else {
        errorTxt.innerText = "Please insert a TD which uses MQTT"
        errorContainer.classList.remove("hidden")
      }
    }
	}
}

openApiJsonBtn.addEventListener("click", () => {
  util.generateTD("json", window.openApiEditor)
  openApiJsonBtn.disabled = true
  openApiYamlBtn.disabled = false
})

openApiYamlBtn.addEventListener("click", () => {
  util.generateTD("yaml", window.openApiEditor)
  openApiJsonBtn.disabled = false
  openApiYamlBtn.disabled = true
})

require(['vs/editor/editor.main'], async function() {
  //assing the new monaco edito to the previously created container and assign the new value, language and other necessary properties
  window.openApiEditor = monaco.editor.create(document.getElementById('open-api-container'), {
    value: "", 
    language: "json",
    automaticLayout: true,
		readOnly: true,
		formatOnPaste: true
  })

  document.onload = setFontSize(window.openApiEditor)
  fontSizeSlider.addEventListener("input", () => {
    setFontSize(window.openApiEditor)
  })

  //Bind the reset button form the settings to the editor and assign the specied font size
  editorForm.addEventListener("reset", () => {
    setFontSize(window.openApiEditor)
  })

})

asyncApiJsonBtn.addEventListener("click", () => {
  util.generateTD("json", window.asyncApiEditor)
  asyncApiJsonBtn.disabled = true
  asyncApiYamlBtn.disabled = false
})

asyncApiYamlBtn.addEventListener("click", () => {
  util.generateTD("yaml", window.asyncApiEditor)
  asyncApiJsonBtn.disabled = false
  asyncApiYamlBtn.disabled = true
})

require(['vs/editor/editor.main'], async function() {
  //assing the new monaco edito to the previously created container and assign the new value, language and other necessary properties
  window.asyncApiEditor = monaco.editor.create(document.getElementById('async-api-container'), {
    value: "", 
    language: "json",
    automaticLayout: true,
		readOnly: true,
		formatOnPaste: true
  })

  document.onload = setFontSize(window.asyncApiEditor)
  fontSizeSlider.addEventListener("input", () => {
    setFontSize(window.asyncApiEditor)
  })

  //Bind the reset button form the settings to the editor and assign the specied font size
  editorForm.addEventListener("reset", () => {
    setFontSize(window.asyncApiEditor)
  })
})

defaultsJsonBtn.addEventListener("click", () => {
  util.generateTD("json", window.defaultsEditor)
  defaultsJsonBtn.disabled = true
  defaultsYamlBtn.disabled = false
})

defaultsYamlBtn.addEventListener("click", () => {
  util.generateTD("yaml", window.defaultsEditor)
  defaultsYamlBtn.disabled = true
  defaultsJsonBtn.disabled = false
})

defaultsAddBtn.addEventListener("click", () => {
  util.addDefaults(window.defaultsEditor)
})

defaultsRemoveBtn.addEventListener("click", () => {
  util.removeDefaults(window.defaultsEditor)
})


require(['vs/editor/editor.main'], async function() {
  //assing the new monaco edito to the previously created container and assign the new value, language and other necessary properties
  window.defaultsEditor = monaco.editor.create(document.getElementById('defaults-container'), {
    value: "", 
    language: "json",
    automaticLayout: true,
		readOnly: true,
		formatOnPaste: true
  })

  document.onload = setFontSize(window.defaultsEditor)
  fontSizeSlider.addEventListener("input", () => {
    setFontSize(window.defaultsEditor)
  })

  //Bind the reset button form the settings to the editor and assign the specied font size
  editorForm.addEventListener("reset", () => {
    setFontSize(window.defaultsEditor)
  })
})