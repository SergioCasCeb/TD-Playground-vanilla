import * as util from "./util.js"

const textIcon = document.querySelectorAll(".text-icon");
const closeSettings = document.querySelector(".settings__close i");
const settingsMenu = document.querySelector(".settings-menu");
const settingsBtn = document.querySelector("#settings-btn");

/***********************************************************/
/*                     Monaco editor                       */
/***********************************************************/
//New monaco theme
const themeData = {
  "base": "vs-dark",
  "inherit": true,
  "rules": [
    { 'token': '', 'foreground': 'ffffff', 'background': '549087' },
    { 'token': 'invalid', 'foreground': 'f44747' },
    { 'token': 'emphasis', 'fontStyle': 'italic' },
    { 'token': 'strong', 'fontStyle': 'bold' },

    { 'token': 'variable', 'foreground': 'ffbb00' },
    { 'token': 'variable.predefined', 'foreground': 'ffbb00' },
    { 'token': 'variable.parameter', 'foreground': 'ffbb00' },
    { 'token': 'constant', 'foreground': 'ffbb00' },
    { 'token': 'comment', 'foreground': '7b2d8a' },
    { 'token': 'number', 'foreground': 'fffffe' },
    { 'token': 'number.hex', 'foreground': 'fffffe' },
    { 'token': 'regexp', 'foreground': 'be3989' },
    { 'token': 'annotation', 'foreground': 'cc6666' },
    { 'token': 'type', 'foreground': '00fcce' },

    { token: 'delimiter', foreground: 'ffffff' },
    { token: 'delimiter.html', foreground: '808080' },
    { token: 'delimiter.xml', foreground: '808080' },

    { token: 'tag', foreground: '7b2d8a' },
    { token: 'tag.id.pug', foreground: '7b2d8a' },
    { token: 'tag.class.pug', foreground: '7b2d8a' },
    { token: 'meta.scss', foreground: 'A79873' },
    { token: 'meta.tag', foreground: 'd1744f' },
    { token: 'metatag', foreground: 'DD6A6F' },
    { token: 'metatag.content.html', foreground: 'ffbb00' },
    { token: 'metatag.html', foreground: 'ffbb00' },
    { token: 'metatag.xml', foreground: 'ffbb00' },
    { token: 'metatag.php', fontStyle: 'bold' },

    { token: 'key', foreground: 'ffbb00' },
    { token: 'string.key.json', foreground: 'ffbb00' },
    { token: 'string.value.json', foreground: 'd06c44' },

    { token: 'attribute.name', foreground: 'ffbb00' },
    { token: 'attribute.value', foreground: 'd06c44' },
    { token: 'attribute.value.number.css', foreground: '6ca74c' },
    { token: 'attribute.value.unit.css', foreground: '6ca74c' },
    { token: 'attribute.value.hex.css', foreground: 'D4D4D4' },

    { token: 'string', foreground: 'd06c44' },
    { token: 'string.sql', foreground: 'FF0000' },

    { token: 'keyword', foreground: 'ffbb00' },
    { token: 'keyword.flow', foreground: 'b33ea9' },
    { token: 'keyword.json', foreground: 'd06c44' },
    { token: 'keyword.flow.scss', foreground: 'ffbb00' },

    { token: 'operator.scss', foreground: '909090' },
    { token: 'operator.sql', foreground: 'ffbb00' },
    { token: 'operator.swift', foreground: '909090' },
    { token: 'predefined.sql', foreground: 'FF00FF' },
  ],
  "colors": {
    "editor.foreground": "#FFFFFF",
    "editor.background": "#549087",
    "editor.selectionBackground": "#73597EE0",
    "editor.lineHighlightBackground": "#067362",
    "editorCursor.foreground": "#FFFFFF"
  }

}
//Monaco editor initialization
require.config({ paths: { vs: '../monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], function () {

  monaco.editor.defineTheme('monochrome', themeData);
  document.onload = setTheme()
});

/***********************************************************/
/*                Resizing functionality                   */
/***********************************************************/
const resizerY = document.querySelector(".horizontal-divider");
const resizerX = document.querySelector(".vertical-divider");

//Vertical sizing
resizerX.addEventListener("mousedown", (e) => {
  e.preventDefault();
  document.addEventListener("mousemove", onmousemove);
  document.addEventListener("mouseup", onmouseup);
})

function onmousemove(e) {
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

function onmouseup(e) {
  e.preventDefault();
  document.removeEventListener("mousemove", onmousemove);
  document.removeEventListener("mouseup", onmouseup);
  delete e.clientX;
}


//Vertical sizing
resizerY.addEventListener("mousedown", (e) => {
  e.preventDefault();
  document.addEventListener("mousemove", onmousemoveY);
  document.addEventListener("mouseup", onmouseupY);
})

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
      t.style.flex = `0 ${h < 155 ? 145 : h}px`;
      b.style.flex = "1 0";
      if (h < 290) {
        textIcon.forEach(text => {
          text.classList.add("hiddenV");
        })
      }
    }

  }
}
function onmouseupY(e) {
  e.preventDefault();
  document.removeEventListener("mousemove", onmousemoveY);
  document.removeEventListener("mouseup", onmouseupY);
  delete e._clientY;
}

/***********************************************************/
/*                    Editor and tabs                      */
/***********************************************************/

//adding new editor tabs
const addTab = document.querySelector(".ide__tabs__add")
const tabsLeftContainer = document.querySelector(".ide__tabs__left")
let closeTabs = document.querySelectorAll(".close-tab")
let tabsLeft = document.querySelectorAll(".ide__tabs__left li:not(:last-child)")
let ideList = document.querySelectorAll(".editor")
const ideContainer = document.querySelector(".ide__container")
let editorList = []

let i = 1
let j = 1

createTab(i)
createIde(i)

//Function to create new tabs
function createTab(tabNumber, exampleName) {

  const newTab = document.createElement("li")
  newTab.setAttribute("data-tab-id", tabNumber)
  newTab.setAttribute('id', 'tab');

  const tabIcon = document.createElement("p")
  tabIcon.classList.add("tab-icon")

  const tabContent = document.createElement("p")
  if(exampleName === undefined){
    tabContent.innerText = `Thing Description ${tabNumber}`
  }
  else{
    tabContent.innerText = exampleName
  }
  tabContent.classList.add("content-tab")
  // tabContent.setAttribute("contenteditable", "false")
  const closeBtn = document.createElement("div")
  closeBtn.classList.add("close-tab")

  const closeIcon = document.createElement("i")
  closeIcon.classList.add("fa-solid", "fa-xmark")

  closeBtn.appendChild(closeIcon)
  newTab.appendChild(tabIcon)
  newTab.appendChild(tabContent)
  newTab.appendChild(closeBtn)

  tabsLeftContainer.insertBefore(newTab, tabsLeftContainer.children[(tabsLeftContainer.children.length) - 1])
  tabsLeft = document.querySelectorAll(".ide__tabs__left li:not(:last-child)")
  tabsLeft.forEach(tab => {
    tab.classList.remove("active")
    tab.children[0].removeAttribute("contenteditable")
  })
  newTab.classList.add("active")
}

function createIde(ideNumber, exampleValue){
  let defaultValue
  if(exampleValue === undefined){
    defaultValue = {
      "@context": "https://www.w3.org/2022/wot/td/v1.1",
      "id": "urn:uuid:0804d572-cce8-422a-bb7c-4412fcd56f06",
      "@type": "Thing",
      "title": `My thing ${ideNumber}`,
      "$title": "Basic TD Example",
      "description": "Thing Description for a Lamp thing",
      "$description": "This is an example of the most basic form of a td", 
      "securityDefinitions": {
          "basic_sc": {"scheme": "basic", "in": "header"}
      },
      "security": "basic_sc",
      "properties": {},
      "actions": {},
      "events": {}
    }
  }
  else{
    defaultValue = exampleValue
  }
  const newIde = document.createElement("div")
  newIde.classList.add("editor")
  newIde.setAttribute('id', `editor${ideNumber}`);
  newIde.setAttribute("data-ide-id", ideNumber)
  ideContainer.appendChild(newIde)


  require.config({ paths: { vs: '../monaco-editor/min/vs' } });
  require(['vs/editor/editor.main'], function initializeEditor() {
    var editor = monaco.editor.create(document.getElementById(`editor${ideNumber}`), {
      value: JSON.stringify(defaultValue, null, 2),
      language: 'json',
      automaticLayout: true
    })

    document.onload = setFontSize(editor)
    fontSizeSlider.addEventListener("input", () => {
      setFontSize(editor)
    })

    editorForm.addEventListener("reset", () => {
      setFontSize(editor)
    })
    editorList.push(editor)
    findFileType(ideNumber)
  })

  ideList = document.querySelectorAll(".editor")
  ideList.forEach(ide => {
    ide.classList.remove("active")
  })
  newIde.classList.add("active")
}

function findFileType(tabNumber){
  if(tabNumber === undefined){
    editorList.forEach(editor => {
      if(editor.db.classList.contains("active")){
        const tabIcon = document.querySelector(`[data-tab-id="${editor.db.dataset.ideId}"] .tab-icon`)
        const editorContent = JSON.parse(editor.getValue())
        if(editorContent["@type"] === "tm:ThingModel"){
          tabIcon.innerText = "TM"
        }
        else{
          tabIcon.innerText = "TD"
        }
      }
    })
  }
  else{
    const tabIcon = document.querySelector(`[data-tab-id="${tabNumber}"] .tab-icon`)
    const editorContent = JSON.parse(editorList[tabNumber - 1].getValue())
    if(editorContent["@type"] === "tm:ThingModel"){
      tabIcon.innerText = "TM"
    }
    else{
      tabIcon.innerText = "TD"
    }
  }
}

//Create a new tab when clicking on the plus tab
addTab.addEventListener("click", () => {
  createTab(++i)
  createIde(i)
  jsonBtn.checked = true
  convertJsonYaml()
})

//Getting the taget when clicking on the tabs container
tabsLeftContainer.addEventListener("click", (e) => {
  const selectedElement = e.target
  visualizationOptions.forEach(option => {
    option.checked = false
  })

  //Add the active styling when tab clicked
  if (selectedElement.id == "tab" || selectedElement.parentElement.id == "tab") {

    tabsLeft.forEach(tab => {
      tab.classList.remove("active")
      tab.children[0].removeAttribute("contenteditable")
    })

    ideList.forEach(ide => {
      ide.classList.remove("active")
    })

    if (selectedElement.id == "tab") {
      selectedElement.classList.add("active")
    }
    else {
      selectedElement.parentElement.classList.add("active")
    }

    if(selectedElement.dataset.tabId){
      ideList.forEach(ide => {
        if(selectedElement.dataset.tabId === ide.dataset.ideId){
          ide.classList.add("active")
        }
      })
    }
    else{
      ideList.forEach(ide => {
        if(selectedElement.parentElement.dataset.tabId === ide.dataset.ideId){
          ide.classList.add("active")
        }
      })
    }

    // jsonBtn.checked = true
    // convertJsonYaml()
    checkFileType()
  }

  //Closing tabs only when the click event happens on the close icon of the tab
  if (selectedElement.className == "close-tab" && tabsLeft.length >= 1) {
    //If there is only one more tab and its closed create a completely new one
    //If not the last one adjust the styling accordingly and update the amount of tabs
    if(selectedElement.parentElement.dataset.tabId){
      ideList.forEach(ide => {
        if(selectedElement.parentElement.dataset.tabId === ide.dataset.ideId){
          ide.remove()
        }
      })
    }
    if (tabsLeft.length == 1) {
      i = 0
      selectedElement.parentElement.remove()
      createTab(++i)
      createIde(i)
      tabsLeft[0].classList.add("active")
      ideList[0].classList.add("active")
      findFileType(i)
    }
    else {
      if (selectedElement.parentElement.className == "active") {
        selectedElement.parentElement.remove()
        tabsLeft = document.querySelectorAll(".ide__tabs__left li:not(:last-child)")
        ideList = document.querySelectorAll(".editor")
        tabsLeft[0].classList.add("active")
        ideList[0].classList.add("active")
      }
      else {
        selectedElement.parentElement.remove()
        tabsLeft = document.querySelectorAll(".ide__tabs__left li:not(:last-child)")
      }
    }
  }
})

tabsLeftContainer.addEventListener("dblclick", (e) => {
  const selectedElement = e.target

  if (selectedElement.className == "content-tab") {
    selectedElement.setAttribute("contenteditable", "true")
    selectedElement.focus()

    selectedElement.addEventListener("keypress", (e) => {
      if(e.key === "Enter"){
        e.preventDefault()
        selectedElement.setAttribute("contenteditable", "false")
        selectedElement.blur()
      }
    })
  }

})

/***********************************************************/
/*                      Setting menu                       */
/***********************************************************/

const editorForm = document.querySelector(".settings__editor")
const themePicker = document.querySelector("#theme-picker")
const fontSizeTxt = document.querySelector(".editor-font-size")
const fontSizeSlider = document.querySelector("#font-size")

fontSizeTxt.innerText = fontSizeSlider.value

editorForm.addEventListener("reset", (e) => {
  e.preventDefault()
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
})

//settings menu
closeSettings.addEventListener("click", () => {
  settingsMenu.classList.add("closed");
})

settingsBtn.addEventListener("click", () => {
  settingsMenu.classList.toggle("closed")
})

/***********************************************************/
/*      Themes picker and font picker functionality        */
/***********************************************************/

//Store the selected theme
const storeTheme = function (theme) {
  localStorage.setItem("theme", theme)
}

//store the selected font size
const storeFontSize = function (fontSize) {
  localStorage.setItem("fontSize", fontSize)
}

//Function which gets the value from the localStorage and sets the new theme
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
//Function which gets the value from the localStorage and sets the new font size
const setFontSize = function (editor) {
  const activeFontSize = localStorage.getItem("fontSize")
  editor.updateOptions({
    fontSize: activeFontSize
  })
}

//Event listener to change the theme when the select is changed
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

//Event listener to change the font size when the font size input is changed
fontSizeSlider.addEventListener("input", () => {
  fontSizeTxt.innerText = fontSizeSlider.value
  storeFontSize(fontSizeSlider.value)
})

/***********************************************************/
/*               Examples menu functionality               */
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

//Close examples menu when clicking on x icon
closeExamples.addEventListener("click", () => {
  examplesMenu.classList.add("closed")

  // Clear all info inside the examples menu
  while(tdExamplesContainer.children.length > 1){
    tdExamplesContainer.lastElementChild.remove()
  }

  while(tmExamplesContainer.children.length > 1){
    tmExamplesContainer.lastElementChild.remove()
  }
})

//Open examples menu when clicking on examples btn as well as giving a preset value to the dropdown
examplesBtn.addEventListener("click", () => {
  examplesMenu.classList.remove("closed")
  checkThingType()
  populateExamples()
})

//Function that checks if TD or TM and updated the category list
function checkThingType(){
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

//Fucntion to update the categories dropdown when thing type dropdown changes
thingTypeSelect.addEventListener("change", () => {
  checkThingType()
  const element = document.getElementById(categorySelect.value);
  element.scrollIntoView({behavior: "smooth", block: "start"})
})

categorySelect.addEventListener("change", () => {
  const element = document.getElementById(categorySelect.value);
  element.scrollIntoView({behavior: "smooth", block: "start"})
})

//Listener when search input is used
filterForm.addEventListener("submit", (e) => {
  e.preventDefault()

  console.log(searchInput.value);

  if(thingTypeSelect.value === "thing-description"){
    console.log("hi");
    const examplesContainer = tdSearchResults.querySelector(".examples-category__container")
    while(examplesContainer.children.length > 0){
      examplesContainer.firstElementChild.remove()
    }
    tdSearchResults.classList.remove("hidden")
    tmSearchResults.classList.add("hidden")
    const categories = tdExamplesContainer.querySelectorAll(".examples-category:not(:first-child)")
    categories.forEach(category => {
      const examples = [...category.children[2].children]
      examples.forEach(example => {
        console.log(example);
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
          tdSearchResults.classList.add("hidden")
        }
      })
    })
  }

  if(thingTypeSelect.value === "thing-model"){
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
getTDCategories()
getTMCategories()

//function to get all the td examples categories from github repo
async function getTDCategories(){
  const res = await fetch('../examples-paths.json')
  const data = await res.json()
  const categories = Object.entries(data["td"])

  categories.forEach(category => {

    const newCategory = {
      name: "",
      description: "",
      id: ""
    }
    const categoryName = (category[0].substring(category[0].indexOf("-") + 1)).replaceAll('-', ' ')
    const categoryId = category[0]
    fetch(category[1].description)
      .then(response => response.text())
      .then(textString => {
        newCategory["description"] = textString
      })

    newCategory["name"] = categoryName
    newCategory["id"] = categoryId

    tdCategories.push(newCategory)
  })
}

//function to get all the tm examples categories from github repo
async function getTMCategories(){
  const res = await fetch('../examples-paths.json')
  const data = await res.json()

  const categories = Object.entries(data["tm"])
  categories.forEach(category => {
    const newCategory = {
      name: "",
      description: "",
      id: ""
    }
    const categoryName = (category[0].substring(category[0].indexOf("-") + 1)).replaceAll('-', ' ')
    const categoryId = category[0]
    fetch(category[1].description)
      .then(response => response.text())
      .then(textString => {
        newCategory["description"] = textString
      })

    newCategory["name"] = categoryName
    newCategory["id"] = categoryId

    tmCategories.push(newCategory)
  })
}

function populateExamples(){
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

async function getAllExamples(categoryId, thingType){
  const res = await fetch('../examples-paths.json')
  const data = await res.json()
  const examples = Object.entries(data[thingType][categoryId]["examples"])
  examples.forEach(example => {
    createExample(categoryId, example[1]["path"])
  })
}

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

  exampleBtnUse.addEventListener('click', () => {
    createTab(++i, data['$title'])
    createIde(i, data)
    checkFileType()
    examplesMenu.classList.add("closed")
    // Clear all info inside the examples menu
    while(tdExamplesContainer.children.length > 1){
      tdExamplesContainer.lastElementChild.remove()
    }
    while(tmExamplesContainer.children.length > 1){
      tmExamplesContainer.lastElementChild.remove()
    }
  })
}

/***********************************************************/
/*                          Loader                         */
/***********************************************************/
const loader = document.querySelector(".loader-container")
let stateCheck = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(stateCheck);
    loader.classList.add("hidden")
  }
}, 100);



/***********************************************************/
/*                   Yaml functionality                    */
/***********************************************************/

/* Yaml functionality */
const yamlBtn = document.querySelector("#file-type-yaml")
const jsonBtn = document.querySelector("#file-type-json")
jsonBtn.checked  = true

yamlBtn.addEventListener("click", ()=> {
  convertJsonYaml()
})

jsonBtn.addEventListener("click", ()=> {
  convertJsonYaml()
})

function convertJsonYaml(){
  editorList.forEach(editor => {

    if(editor.db.classList.contains("active")){
      util.generateTD(jsonBtn.checked === true ? "json" : "yaml", editor)
    }
  })
}

function checkFileType(){
  editorList.forEach(editor => {
    if(editor.db.classList.contains("active")){
      console.log(editor.db.dataset.modeId);

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
/*     Validate, Console, visualization functionality      */
/***********************************************************/
const validateBtn = document.querySelector("#validate-btn")
let errorMessage = document.querySelector(".console__content #console-error")
const eraseConsole = document.querySelector(".console__tabs .trash")
const consoleContent = document.querySelector(".console__content")
const visualizationOptions = document.querySelectorAll(".visualization__option")
const visualizationContainers = document.querySelectorAll(".console-view")

visualizationOptions.forEach(option => {
  option.checked = false
})

validateBtn.addEventListener("click", () => {
  findFileType()
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
})

eraseConsole.addEventListener("click", () => {

})


/*** Visualization ***/


visualizationOptions.forEach(option => {
  option.addEventListener("click", () => {
    visualizationContainers.forEach(container => {
      container.classList.add("hidden")
      if(option.id == container.id){
        container.classList.remove("hidden")
      }
    })
  })
})
/* OpenAPI Functionality */


