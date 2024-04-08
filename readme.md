# Embedded view example: Local file explorer

![Google Chrome](https://img.shields.io/badge/Google%20Chrome-4285F4?logo=GoogleChrome&logoColor=white)
![Platforms](https://img.shields.io/badge/platform-windows%20%7C%20macos%20%7C%20linux-lightgrey)

[![License](http://img.shields.io/:license-MIT-blue.svg)](http://opensource.org/licenses/MIT)
![Beginner](https://img.shields.io/badge/Level-Beginner-green.svg)

## Description

This example demonstrates the process of creating a personalized extension within Forma by utilizing raw HTML and CSS. The extension will function as a GLB file browser integrated into Forma, facilitating the exploration of publicly hosted files within a designated locally hosted directory.

The goal of this example is to have an easy-to-use example that anyone can start to build upon.
To know more about extensions, please visit [the official documentation found on Autodesk platform services](https://aps.autodesk.com/en/docs/forma/v1/overview/extension-types/).

## Thumbnail

![video demonstration](documentation-resources/screenshots/demonstration.gif)

# Setup

## Prerequisites:

- Some understanding of what [Forma](https://www.autodesk.com/ca-en/products/forma/overview?term=1-YEAR&tab=subscription&plc=SPCMKR) is.
- Some prior knowledge of web technologies, html, javascript and CSS.
- Make sure you have `nodejs` installed on your machine. You can get it at https://nodejs.org/.

## How to run it

1. Clone this repository.

2. Acquire models, such as those available on [Sketchfab](https://sketchfab.com/), under the license [Attribution-NonCommercial 4.0 International](https://creativecommons.org/licenses/by-nc/4.0/#ref-appropriate-credit).

3. We suggest downloading files in either the GLB or glTF file formats. In FORMA, we employ the [glTF validator](https://github.khronos.org/glTF-Validator/) for validation purposes, so make sure to validate the file after downloading. Subsequently, place the files inside the `src/public/` folder.

4. Host the files statistically by executing the command `npx http-server ./src --port 5173 --cors -c-1` from the root of this repository.

5. Next, we suggest you develop your own extension for Forma. Please adhere to the [guidelines](https://aps.autodesk.com/en/docs/forma/v1/overview/getting-started/) provided to accomplish this. _NOTE:_ the local development [section](https://aps.autodesk.com/en/docs/forma/v1/overview/getting-started/#local-development) will be replaced with steps 1-4.

   > The extension will load the server running on port `5173` inside an iFrame and enable it to interact with the Forma scene.

## Project Contents

There are 4 files:

- `src/index.html`: This file serves as the starting point for your application, including import statements and certain CSS styles.
- `src/main.js`: This is the primary file, containing the code responsible for rendering the user interface based on user interactions.
- `src/filebrowser.js`: This file navigates through Google Chrome's default local file viewer and organizes the results.
- `src/sdk.js`: In this file, all interactions with the host Forma application take place. An element is created from a GLB file and placed in the Forma library.

## Further reading

Familiarize yourself with the Forma [embedded view](https://aps.autodesk.com/en/docs/forma/v1/embedded-views/introduction/) concept. This understanding is crucial as you proceed to develop your own extension.

Read more about the Forma [API](https://aps.autodesk.com/en/docs/forma/v1/reference/http-reference/) and [SDK](https://app.autodeskforma.com/forma-embedded-view-sdk/docs/).

For questions regarding this repository, please feel free to ask them on the GitHub [issues](https://github.com/autodesk-platform-services/aps-forma-extension-file-explorer/issues) feature.

Or, post your question in the Forma developer [forum](https://forums.autodesk.com/t5/forma-developer-forum/bd-p/forma_api_forum) and join the community.

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

## Written by

This repository was created and is maintained by the Interoperability Squad, Unified Design, Autodesk Inc.
