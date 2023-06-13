# Playground-vanilla
The goal of this project is to recreate and redesign the current [Thing Description Playground](http://plugfest.thingweb.io/playground/) to improve the UI/UX as well as improve the overall "feel" of the application.

Try it online: https://td-playground-beta.netlify.app/ (currently under maintenance)

## Current Implementations
As of now, the application has the following working implementations:
- A main editor where the Thing Descriptions and Thing Models can be edited and modified
- A tab system to have multiple editors open
- A JSON to YAML and YAML to JSON conversion
- An examples menu with the newest TD/TM examples, which can be used by the users as templates
- A save menu, which allows you to share your current TD/TM as a URL as well as to download it
- A settings menu, where user preferences can be changed such as font size and editor theme
- A defaults visualization section that allows the user to see their current TD with or without defaults
- An OpenAPI visualization section that allows the user to transfer the current TD into Open API (with JSON and yaml conversion)
- An AsyncAPI visualization section that allows the user to transfer the current TD into Async API (with JSON and yaml conversion)

## Installation and running the application
- Install all packages and their dependencies via `npm install` in the root directory.
- This application can then be run with the "live server" extension in Visual Studio Code
