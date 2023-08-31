import { EmbeddedViewApi } from "spacemaker-embedded-view-sdk";

/*
 * Sets up the SDK to communicate with the Forma application that hosts this iFrame.
 * This allows us to use all of the Forma APIs.
 *
 * The project ID is used for authentication, and is the current auth context we are under.
 */
const { origin, projectId } = EmbeddedViewApi.parseHostParams();
const embeddedViewApi = new EmbeddedViewApi({
  origin,
});

/**
 * Creates an element that's usable within the forma application.
 * To learn more about elements, please see <link>
 *
 * @param {string} name
 * @param {ArrayBuffer} glbContents
 * @returns {string}
 */
export async function createElementFromGlb(name, glbContents) {
  const { fileId } = await embeddedViewApi.integrate.uploadFile({
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

  const scale = 1; // Model is assumed to be in meters
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

  const { urn } = await embeddedViewApi.integrate.createElementHierarchy({
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
  await embeddedViewApi.library.createItem({
    authcontext: projectId,
    data: {
      name,
      urn,
      status: "success",
    },
  });
}
