const textIcon = document.querySelectorAll(".text-icon");
const closeSettings = document.querySelector(".settings-menu__close i");
const settingsMenu = document.querySelector(".settings-menu");
const settingsBtn = document.querySelector("#settings-btn");
/**** Ace editor ****/
const editorElement = document.querySelector("#editor");
const editor = ace.edit("editor");
editor.setOptions({
  mode: "ace/mode/javascript",
  selectionStyle: "text",
  theme: "ace/theme/chrome",
  showPrintMargin: false,
  displayIndentGuides: true,
  scrollPastEnd: 0.5,
  fontSize: 16
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
  settingsMenu.classList.toggle("closed");
})