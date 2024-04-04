import { Forma } from "forma-embedded-view-sdk/auto";

/**
 * Creates an element that's usable within the forma application.
 * To learn more about elements, please see <link>
 *
 * @param {string} name
 * @param {ArrayBuffer} glbContents
 * @returns {string}
 */
export async function createElementFromGlb(name, glbContents) {
  const projectId = Forma.getProjectId();
  const { fileId } = await Forma.integrateElements.uploadFile({
    authcontext: projectId,
    data: glbContents,
  });

  const element = {
    id: "some-element-id",
    children: [],
    properties: {
      name,
      geometry: {
        type: "File",
        format: "glb",
        s3Id: fileId,
      },
    },
  };

  // Model is assumed to be in cm, so we scale it up to meters
  // Change the scale to fit your model
  // In Forma, 1 unit is 1 meter
  const scale = 100;
  const scalingElement = {
    id: "root",
    children: [
      {
        id: element.id,
        transform: [
          [scale, 0, 0, 0],
          [0, scale, 0, 0],
          [0, 0, scale, 0],
          [0, 0, 0, 1],
        ].flat(),
      },
    ],
  };

  const { urn } = await Forma.integrateElements.createElementHierarchy({
    authcontext: projectId,
    data: {
      rootElement: scalingElement.id,
      elements: { [scalingElement.id]: scalingElement, [element.id]: element },
    },
  });
  return urn;
}

/**
 * Puts a element into the forma library. The element that the urn is point
 * to is assumed to be complete. The status is therefore assumed to be "success".
 * TODO: replace with placemode.
 * @param {string} urn
 * @param {string} name
 */
export async function putInLibrary(urn, name) {
  const libraryItem = await Forma.library.createItem({
    authcontext: Forma.getProjectId(),
    data: {
      name,
      urn,
      status: "success",
    },
  });

  return libraryItem;
}
