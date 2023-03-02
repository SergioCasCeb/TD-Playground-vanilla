/**** Ace editor ****/
const editorElement = document.querySelector("#editor");
const editor = ace.edit("editor");
editor.setOptions({
    mode: "ace/mode/javascript",
    selectionStyle: "text",
    theme: "ace/theme/chrome",
    showPrintMargin: false,
    displayIndentGuides: true,
    scrollPastEnd: 0.5
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
    const deltaX = clientX - (resizerX._clientX || clientX);
    resizerX._clientX = clientX;
    const l = resizerX.previousElementSibling;
    const r = resizerX.nextElementSibling;

    // LEFT
    if (deltaX < 0) {
      const w = Math.round(parseInt(getComputedStyle(l).width) + deltaX);
      console.log("wL: ", w);
      l.style.flex = `0 ${w < 35 ? 35 : w}px`;
      r.style.flex = "1 0";
    }

    // RIGHT
    console.log(deltaX);
    if (deltaX > 0) {
      const w = Math.round(parseInt(getComputedStyle(r).width) - deltaX);
      console.log("wR: ", w);
      if( w <= 35 ){
        clientX = 1851;
        console.log(clientX); 
        delete e._clientX;
      }
      r.style.flex = `0 ${w < 35 ? 36 : w}px`;
      l.style.flex = "1 0";
    }  
}

function onmouseup(e) {
    e.preventDefault();
    document.removeEventListener("mousemove", onmousemove);
    document.removeEventListener("mouseup", onmouseup);
    delete e._clientX;
}


/*** Vertical sizing ***/
resizerY.addEventListener("mousedown", (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", onmousemoveY);
    document.addEventListener("mouseup", onmouseupY);
    console.log("mouse donw");
  })
  
  function onmousemoveY(e) {
    e.preventDefault();
    const clientY = e.clientY;
    const deltaY = clientY - (resizerY._clientY || clientY);
    resizerY._clientY = clientY;
    const t = resizerY.previousElementSibling;
    const b = resizerY.nextElementSibling;

    console.log(deltaY);
    // UP
    if (deltaY < 0) {
      const h = Math.round(parseInt(getComputedStyle(t).height) + deltaY);
      t.style.flex = `0 ${h < 10 ? 10 : h}px`;
      b.style.flex = "1 0";
    }
    // DOWN
    if (deltaY > 0) {
      const h = Math.round(parseInt(getComputedStyle(b).height) - deltaY);
      b.style.flex = `0 ${h < 10 ? 10 : h}px`;
      t.style.flex = "1 0";
    }
  }
  function onmouseupY(e) {
    e.preventDefault(); 
    document.removeEventListener("mousemove", onmousemoveY);
    document.removeEventListener("mouseup", onmouseupY);
    delete e._clientY;
  }


