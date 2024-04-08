import {
  browseFolderStructureRecursivly,
  isInCurrentFolder,
  isSupportedFiletype,
} from "./filebrowser.js";
import { createElementFromGlb, putInLibrary } from "./sdk.js";

/**
 * Parses a string and returns an HTML element of the parent element
 * of that string.
 * @param {string} text
 * @returns
 */
function htmlElementFromString(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  return doc.body.firstChild;
}

/**
 * Creates a row in the file browser
 * @returns {HTMLDivElement}
 */
function createRow({ entry, isDisabled, onclick, iconUrl }) {
  const container = htmlElementFromString(`
    <div class="item" ${isDisabled ? "disabled" : ""}">
      <img class="icon" src="${iconUrl}" />
      <div class="label">${entry.label}</div>
      <div class="date">${entry.date}</div>
      <div class="size">${entry.size ?? ""}</div>
    </div>`);
  container.onclick = onclick;
  return container;
}

/**
 * Sets the back button's text to current directory and the onclick handler
 * to naviagate to the parent directory.
 * @param {string} path
 * @param {Array<{name: string, url: string, isDirectory: boolean, size: string}>} allFilesAndFolders
 */
function setBackDirectory(path, allFilesAndFolders) {
  const container = document.getElementById("back");
  if (path.split("/").length > 3) {
    const folderName = path.split("/").slice(-2)[0];
    container.style.display = "flex";
    container.querySelector("span").innerText = folderName;
    container.onclick = () => {
      const parentDirectory = path.split("/").slice(0, -2).join("/") + "/";
      renderDirectory(parentDirectory, allFilesAndFolders);
    };
  } else {
    container.style.display = "none";
    container.onclick = null;
  }
}

/**
 * Renders out a HTML page of the current directory data
 * @param {string} path
 * @param {Array<{name: string, url: string, isDirectory: boolean, size: string}>} allFilesAndFolders
 */
function renderDirectory(path, allFilesAndFolders) {
  // Get all files and folders in current directory
  const currentDirectory = allFilesAndFolders.filter((entry) =>
    isInCurrentFolder(path, entry)
  );
  currentDirectory.sort((a, b) => a.label.localeCompare(b.label));

  // Clear current view
  const container = document.getElementById("list");
  container.innerHTML = "";

  // Handle back button
  setBackDirectory(path, allFilesAndFolders);

  // Create folder elements
  currentDirectory
    .filter((entry) => entry.isDirectory)
    .map((entry) =>
      createRow({
        entry,
        iconUrl: "/icons/folder.svg",
        onclick: () => renderDirectory(entry.url, allFilesAndFolders),
      })
    )
    .forEach((elem) => container.appendChild(elem));

  // Create file elements
  currentDirectory
    .filter((entry) => !entry.isDirectory && isSupportedFiletype(entry.label))
    .map((entry) =>
      createRow({
        entry,
        iconUrl: "/icons/file.svg",
        onclick: (e) => {
          const progressBarElement =
            document.createElement("weave-progress-bar");
          void fetch(entry.url)
            .then((res) => res.arrayBuffer())
            .then((bytes) => {
              (e.target.parentElement == container
                ? e.target
                : e.target.parentElement
              ).insertAdjacentElement("afterend", progressBarElement);
              return bytes;
            })
            .then((bytes) => createElementFromGlb(entry.label, bytes))
            .then((urn) => putInLibrary(urn, entry.label))
            .then(() => alert("File added to library"))
            .finally(() => progressBarElement.remove())
            .catch((err) => console.error(err));
        },
      })
    )
    .forEach((elem) => container.appendChild(elem));
}

async function main() {
  const root = "/public/";
  const allFilesAndFolders = await browseFolderStructureRecursivly(root);
  renderDirectory(root, allFilesAndFolders);
}

main();
