const textIcon = document.querySelectorAll(".text-icon");
const closeSettings = document.querySelector(".settings-menu__close i");
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
/** Monaco editor **/
require.config({ paths: { vs: '../monaco-editor/min/vs' } });
require(['vs/editor/editor.main'], function () {

  var editor = monaco.editor.create(document.getElementById('editor'), {
    value: ['{',
      '  "id": "urn:simple",',
      '  "@context": "https://www.w3.org/2022/wot/td/v1.1",',
      '  "title": "MyLampThing",',
      '  "description": "Valid TD copied from the specs first example",',
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
  });

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

  if(clientX > screen.width){
    resizerX.clientX = screen.width;
  }
  else if(clientX < 0){
    resizerX.clientX = 0;
  }
  else{
    resizerX.clientX = clientX;

    // LEFT
    if (deltaX < 0) {
      const w = Math.round(parseInt(getComputedStyle(l).width) + deltaX);
      l.style.flex = `0 ${w < 45 ? 30 : w}px`;
      r.style.flex = "1 0";
      if( w < 65 ){ 
        textIcon.forEach (text => {
          text.classList.add("hiddenH");
        })
      }
    }

    // RIGHT
    if (deltaX > 0) {
      const w = Math.round(parseInt(getComputedStyle(l).width) + deltaX);
      console.log(w);
      l.style.flex = `0 ${w > 65 ? 80 : w}px`;
      r.style.flex = "1 0";
      if( w > 65 ){ 
        textIcon.forEach (text => {
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

  if(clientY > screen.height){
    resizerY.clientY = screen.height;
  }
  else if(clientY < 0){
    resizerY.clientY = 0;
  }
  else{
    resizerY.clientY = clientY;
    // DOWN
    if (deltaY > 0) {
      const h = Math.round(parseInt(getComputedStyle(b).height) - deltaY);
      b.style.flex = `0 ${h < 55 ? 50 : h}px`;
      t.style.flex = "1 0";
      if( Math.round(parseInt(getComputedStyle(t).height) + deltaY) > 290 ){ 
        textIcon.forEach (text => {
          text.classList.remove("hiddenV");
        })
      }
    }
    // UP
    if (deltaY < 0) {
      const h = Math.round(parseInt(getComputedStyle(t).height) + deltaY);
      t.style.flex = `0 ${h < 155 ? 145 : h}px`;
      b.style.flex = "1 0";
      if( h < 290 ){ 
        textIcon.forEach (text => {
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


/* main page functionality */

//settings menu
closeSettings.addEventListener("click", () => {
  settingsMenu.classList.add("closed");
})

settingsBtn.addEventListener("click", () => {
  settingsMenu.classList.toggle("closed")
})

//adding new editor views
const addTab = document.querySelector(".ide__tabs__add")
const tabsLeftContainer = document.querySelector(".ide__tabs__left")
let closeTabs = document.querySelectorAll(".close-tab")
let tabsLeft = document.querySelectorAll(".ide__tabs__left li:not(:last-child)")

let i = 1
let j = 1
addTab.addEventListener("click",  () => {
  const newTab = document.createElement("li")
  newTab.innerText =`Thing Description ${++i}`
  newTab.setAttribute("data-tab", `${((newTab.innerText).toLowerCase()).replace(/\s/g, '')}`)
  const closeBtn = document.createElement("div")
  closeBtn.classList.add("close-tab")
  const closeIcon = document.createElement("i")
  closeIcon.classList.add("fa-solid", "fa-xmark")
  closeBtn.appendChild(closeIcon)
  newTab.appendChild(closeBtn)
  tabsLeftContainer.insertBefore(newTab, tabsLeftContainer.children[(tabsLeftContainer.children.length) - 1])

  tabsLeft = document.querySelectorAll(".ide__tabs__left li:not(:last-child)")
    tabsLeft.forEach(tab => {
      tab.addEventListener("contextmenu", (e) => {
        e.preventDefault()
        alert("success")
        return false
      }, false)

      tab.addEventListener("click", (e) => {
        console.log(e.target.localName);

        if(e.target.localName == "li"){
          tabsLeft.forEach(tab => {
            tab.classList.remove("active")
          })
          tab.classList.add("active")
        }

        if((e.target.localName == "i" || e.target.localName == "div")){

          if(tab.classList == "active"){
            tab.remove()
            tabsLeft[0].classList.add("active")
          }
          else{
            tab.remove()
          }
        }
      })
    })
})

/** Themes picker functionality **/
const themePicker = document.querySelector("#theme-picker")

//Store the selected theme
const storeTheme = function(theme) {
  localStorage.setItem("theme", theme)
}

const setTheme = function() {
  const activeTheme = localStorage.getItem("theme")
  themePicker.value = activeTheme
  document.documentElement.className = activeTheme

  if(activeTheme == "dark-mode"){
    monaco.editor.setTheme('vs-dark')
  }
  
  if(activeTheme == "light-mode"){
    monaco.editor.setTheme('vs')
  }

  if(activeTheme == "monochrome-mode"){
    monaco.editor.setTheme('monochrome')
  }
}

themePicker.addEventListener("change", () => {
  storeTheme(themePicker.value)
  document.documentElement.className = themePicker.value

  if(themePicker.value == "dark-mode"){
    monaco.editor.setTheme('vs-dark')
  }
  
  if(themePicker.value == "light-mode"){
    monaco.editor.setTheme('vs')
  }

  if(themePicker.value == "monochrome-mode"){
    monaco.editor.setTheme('monochrome')
  }
  
})













