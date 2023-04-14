const textIcon = document.querySelectorAll(".text-icon");
const closeSettings = document.querySelector(".settings__close i");
const settingsMenu = document.querySelector(".settings-menu");
const settingsBtn = document.querySelector("#settings-btn");

/** New monaco theme **/
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
// /** Monaco editor **/
require.config({ paths: { vs: '../monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], function () {

  monaco.editor.defineTheme('monochrome', themeData);
  document.onload = setTheme()
});

/***** Resizing functionality *****/
const resizerY = document.querySelector(".horizontal-divider");
const resizerX = document.querySelector(".vertical-divider");

/*** Vertical sizing ***/
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


/*** Vertical sizing ***/
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

/* Editor and tabs */
//adding new editor tabs
const addTab = document.querySelector(".ide__tabs__add")
const tabsLeftContainer = document.querySelector(".ide__tabs__left")
let closeTabs = document.querySelectorAll(".close-tab")
let tabsLeft = document.querySelectorAll(".ide__tabs__left li:not(:last-child)")
let ideList = document.querySelectorAll(".editor")
const ideContainer = document.querySelector(".ide__container")

let i = 1
let j = 1

createTab(i)
createIde(i)

//Function to create new tabs
function createTab(tabNumber) {
  const newTab = document.createElement("li")
  newTab.setAttribute("data-tab-id", tabNumber)
  newTab.setAttribute('id', 'tab');

  const tabContent = document.createElement("p")
  tabContent.innerText = `Thing Description ${tabNumber}`
  tabContent.classList.add("content-tab")
  // tabContent.setAttribute("contenteditable", "false")
  const closeBtn = document.createElement("div")
  closeBtn.classList.add("close-tab")

  const closeIcon = document.createElement("i")
  closeIcon.classList.add("fa-solid", "fa-xmark")

  closeBtn.appendChild(closeIcon)
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

function createIde(ideNumber){
  const newIde = document.createElement("div")
  newIde.classList.add("editor")
  newIde.setAttribute('id', `editor${ideNumber}`);
  newIde.setAttribute("data-ide-id", ideNumber)
  ideContainer.appendChild(newIde)

  require.config({ paths: { vs: '../monaco-editor/min/vs' } });
  require(['vs/editor/editor.main'], function () {

    var editor = monaco.editor.create(document.getElementById(`editor${ideNumber}`), {
      value: ['{',
        '  "id": "urn:simple",',
        '  "@context": "https://www.w3.org/2022/wot/td/v1.1",',
        `  "title": "My Thing ${ideNumber}",`,
        '  "description": "Empty thing description",',
        '  "securityDefinitions": {',
        '    "basic_sc": {',
        '      "scheme": "basic",',
        '      "in": "header"',
        '    }',
        '  },',
        '  "security": [',
        '    "basic_sc"',
        '  ],',
        '  "properties": {',
        '  },',
        '  "actions": {',
        '  },',
        '  "events": {',
        '  }',
        '}'].join('\n'),
      language: 'json',
      automaticLayout: true
    })

    document.onload = setFontSize(editor)
    fontSizeSlider.addEventListener("input", () => {
      setFontSize(editor)
    })

    editorForm.addEventListener("reset", (e) => {
      setFontSize(editor)
    })
  })

  ideList = document.querySelectorAll(".editor")
  ideList.forEach(ide => {
    ide.classList.remove("active")
  })
  newIde.classList.add("active")
}

//Create a new tab when clicking on the plus tab
addTab.addEventListener("click", () => {
  createTab(++i)
  createIde(i)
})

//Getting the taget when clicking on the tabs container
tabsLeftContainer.addEventListener("click", (e) => {
  const selectedElement = e.target

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

/***  Setting menu ***/
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

/* Themes picker and font picker functionality */

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

/*** Examples menu functionality ***/
const closeExamples = document.querySelector(".examples-menu-container__close i")
const examplesMenu = document.querySelector(".examples-menu")
const examplesBtn = document.querySelector("#examples-btn")
const thingTypeSelect = document.querySelector('#thing-type')
const categorySelect = document.querySelector('#thing-category')
const filterForm = document.querySelector('.examples-menu-container__filter')

const tdCategories = ["Basic", "Properties", "Actions", "Events", "Protocols", "Security", "Complex Data", "Meta Interactions", "Versioning", "Response/Additional Response", "Multilanguage", "URI Variables", "Semantic Annotations", "Nonstandard", "Link Relation Type", "TD/TM relationshiops"]
const tmCategories = ["Basic", "Versioning", "Extends/Imports", "Optional", "Submodel", "Placeholder"]

closeExamples.addEventListener("click", () => {
  examplesMenu.classList.add("closed")
})

examplesBtn.addEventListener("click", () => {
  examplesMenu.classList.remove("closed")
})

//Function that checks if TD or TM and updated the category list
function checkThingType(){
  const selectOptions = [...categorySelect.options]
  selectOptions.forEach(option => {
    option.remove()
  })

  if(thingTypeSelect.value === "thing-description"){
    tdCategories.forEach(category => {
      const opt = document.createElement('option')
      opt.value = category
      opt.innerText = category
      categorySelect.appendChild(opt)
    })
  }

  if(thingTypeSelect.value === "thing-model"){
    tmCategories.forEach(category => {
      const opt = document.createElement('option')
      opt.value = category
      opt.innerText = category
      categorySelect.appendChild(opt)
    })
  }
}

checkThingType()

thingTypeSelect.addEventListener("change", checkThingType)

filterForm.addEventListener("submit", (e) => {
  e.preventDefault()
})

/* examples functionality */

const examples = document.querySelectorAll('.example__name')
const examplesCloseBtns = document.querySelectorAll('.example__btn--close')

examples.forEach(example => {
  example.addEventListener('click', () => {
    example.parentElement.classList.add("open")
  })
})

examplesCloseBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.parentElement.parentElement.parentElement.classList.remove("open")
  })
})

/**** Loader ****/
const loader = document.querySelector(".loader-container")
let stateCheck = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(stateCheck);
    loader.classList.add("hidden")
  }
}, 100);
