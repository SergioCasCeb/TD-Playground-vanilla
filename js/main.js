/*
const editor = document.querySelector("#editor");

ace.edit(editor, {
    mode: "ace/mode/javascript",
    selectionStyle: "text",
    theme: "ace/theme/twilight",
    showPrintMargin: false,
    displayIndentGuides: true,
    scrollPastEnd: 0.5
});*/

const editorElement = document.querySelector("#editor");
const editor = ace.edit("editor");
editor.setOptions({
    mode: "ace/mode/javascript",
    selectionStyle: "text",
    theme: "ace/theme/twilight",
    showPrintMargin: false,
    displayIndentGuides: true,
    scrollPastEnd: 0.5
});

console.log(editorElement);





