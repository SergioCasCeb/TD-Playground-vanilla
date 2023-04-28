var fs = require('fs');
const path = require('path');
const initialPath = "C:\\Users\\sergh\\Documents\\GitHub\\Playground-vanilla\\examples";
const rawFilePath = "https://raw.githubusercontent.com/thingweb/thingweb-playground/master/examples"
var files = fs.readdirSync(initialPath);

let examplesPaths = {}
// console.log(files);

files.forEach(file => {
    // console.log(file);
    examplesPaths[file] = {}
    
    let categories = fs.readdirSync(initialPath+"/"+file)
    categories.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    // console.log(categories);
    categories.forEach(category => {
        // console.log(category)
        examplesPaths[file][category] = {}
        let examples = fs.readdirSync(initialPath+"/"+file+"/"+category)
        // console.log(examples)
        examples.forEach(example => {
            if(path.extname(example) == ".jsonld"){
                examplesPaths[file][category][example] = {
                    "path": `${rawFilePath}/${file}/${category}/${example}`
                }
            }
        })
    })
})

// console.log(examplesPaths)

fs.writeFile("C:\\Users\\sergh\\Documents\\GitHub\\Playground-vanilla\\examples-paths.json", JSON.stringify(examplesPaths, null, 2), 'utf-8', (err) => {
    if(err){
        console.log(err)
    }else{
        console.log("File created succesfully");
    }
})
