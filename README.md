# Playground-vanilla
The goal of this project is to recreate and redesign the current [Thing Description Playground](http://plugfest.thingweb.io/playground/) to improve the UI/UX as well as improve the overall "feel" of the application.

Try it online: https://td-playground-beta.netlify.app/ (currently under maintenance)

## Main Implementations
- A main editor where the Thing Descriptions and Thing Models can be edited and modified
- A tab system to have multiple editors open (tab names can be changed by the user)
- A JSON to YAML and YAML to JSON conversion
- Spellchecking/suggestions for typos int he current editor
- An examples menu with the newest TD/TM examples, which can be used by the users as templates and call also show snipets of the most relevant information for the respective TD/TM
- A save menu, which allows you to share your current TD/TM as a URL, download it as yaml/json and in supported browser syncing with your file manager system
- A settings menu, where user preferences can be changed such as font size and editor theme
- A defaults visualization section that allows the user to see their current TD with or without defaults (with JSON and yaml conversion)
- An OpenAPI visualization section that allows the user to transfer the current TD into Open API (with JSON and yaml conversion)
- An AsyncAPI visualization section that allows the user to transfer the current TD into Async API (with JSON and yaml conversion)
- A Visualize section that allows the user to visualize their current TD/TM as a graph or a tree, each with the possibility to download as SVG or PNG
- A Validation section where the user can check if their current TD/TM passes the different validation tests (JSON validation, JSON schema validation, JSON schema validation with defaults, JSON-LD validation and additional checks)
- A Canonicalize section
- A Linting section

## Installation and running the application
- Install all packages and their dependencies via `npm install` in the root directory.
- This application can then be run with the "live server" extension in Visual Studio Code
