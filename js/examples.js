const fs = require('fs');
const path = require('path');
const initialPath = ".\examples";
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

        let examples = fs.readdirSync(initialPath+"/"+file+"/"+category)
        
        examplesPaths[file][category] = {
            "description": "",
            "examples": {}
        }
        // console.log(examples)
        examples.forEach(example => {
            if(path.extname(example) == ".txt"){
                examplesPaths[file][category]["description"] = `${rawFilePath}/${file}/${category}/${example}`
            }

            if(path.extname(example) == ".jsonld"){
                // console.log(examplesPaths[file][category][example]);
                examplesPaths[file][category]["examples"][example] = {
                    "path": `${rawFilePath}/${file}/${category}/${example}`
                }
            }
        })
    })
})

// console.log(examplesPaths)

fs.writeFile(".\examples-paths.json", JSON.stringify(examplesPaths, null, 2), 'utf-8', (err) => {
    if(err){
        console.log(err)
    }else{
        console.log("File created succesfully");
    }
})
