export function isSupportedFiletype(filename) {
  return filename.endsWith(".glb");
}

/**
 * Filter function to check if a file or folder is in a specific directory
 */
export function isInCurrentFolder(directory, { url, label }) {
  // Remove trailing slash:
  const path = directory.slice(0, -1).split("/");
  const entryPath = url.slice(0, -1).split("/"); // same length as path if file, if directory, one more

  const hasSamePath = path.every((it, i) => it === entryPath[i]);
  const hasCorrectNumberOfFolders =
    path.length === entryPath.length || path.length + 1 === entryPath.length;

  const isNotUp = path[path.length - 1] !== label;
  return hasCorrectNumberOfFolders && hasSamePath && isNotUp;
}

/**
 * Scrapes a chrome default file explorer page for links
 * @param {string} url
 * @returns {Array<{name: string, url: string, isDirectory: boolean, size: string}>}
 */
async function scrapeChromeDefaultFileExplorerPageForLinks(url) {
  const response = await fetch(url);
  if (!response.ok) return [];
  const text = await response.text();

  const page = new DOMParser().parseFromString(text, "text/html");
  const data = [];
  const entry = page.querySelectorAll("body > table > tbody > tr");
  for (let fileOrFolder of entry) {
    const date = fileOrFolder.querySelector("td:nth-child(3)").innerText;
    const size = fileOrFolder.querySelector("td:nth-child(4)").innerText;
    const name = fileOrFolder.querySelector("td:nth-child(5)").innerText.trim();
    const isDirectory = name.endsWith("/");

    if (name === "../") continue;
    const entry = {
      label: isDirectory ? name.slice(0, -1) : name,
      url: url + name,
      isDirectory,
      date,
      size: size === "" ? undefined : size,
    };
    data.push(entry);
  }
  return data;
}

/**
 * Recursivly goes through a directory structure and returns all files and folders
 * in a flat list.
 * @param {string} url
 * @returns {Array<{name: string, url: string, isDirectory: boolean, size: string}>}
 */
export async function browseFolderStructureRecursivly(url = "/public/") {
  let data = await scrapeChromeDefaultFileExplorerPageForLinks(url);
  for (let it of data) {
    if (it.isDirectory) {
      const newData = await browseFolderStructureRecursivly(it.url);
      data = data.concat(newData);
    }
  }
  return data;
}
