# FarmApp (tentative name)

This is the central repository for the "FarmApp"- a group project for the class "Introduction to Database Management" at UMKC

# Prerequisites

To debug, run or build this project you are going to need the latest version of NodeJS.

VSCode is not strictly a requirement, but it is highly recommended as the launch script for VSCode contained within `.vscode/launch.json` makes debugging the program that much easier.

# Running

Run `npm install` followed by `npm run start` in a terminal whose CD is set to this README's folder

# Project Structure

`src` - contains all program source files

`src/pages` - contains folders that contain all the assets (HTML, CSS, Javascript, etc.) needed by one Electron page

`src/helpers` - contains all helper libraries that are used by `main.js`