import staticServer from "../upload/staticServer";
import domToImage from "dom-to-image";

export interface GetPreviewImageProps {
  element: HTMLDivElement;
  name?: string;
}
const getPreviewImage = async ({ element, name }: GetPreviewImageProps) => {
  if (!element) {
    throw new Error("element is null");
  }
  const fileId = getUrlParam('id');

  // const div = document.createElement("div");

  // div.style.width = "fit-content";
  // div.appendChild(element);
  // document.body.append(div);

  // const imageBlob = await htmlToImage.toBlob(element);

  // document.body.removeChild(div);

  const imageBlob = await snapshot(element);

  const res = (await staticServer({
    content: imageBlob,
    folderPath: `/imgs/${fileId || Date.now()}`,
    fileName: name || `${fileId || uuid()}.png`,
    noHash: true
  })) as { url: string };

  return res.url;
};

const getUrlParam = (key: string): string | undefined => {
  const searchAry: string[] = location.search.slice(1).split('&');

  for(let i = 0; i < searchAry.length; i++) {
    const kv = searchAry[i].split('=');
    if (kv[0] === key) {
      return kv[1];
    }
  }

  return;
}

const snapshot = async (dom: HTMLDivElement) => {
  const container = document.createElement("div");
  container.style.width = "fit-content";
  container.appendChild(dom);
  document.body.append(container);
  const imageBlob = await domToImage.toBlob(container);
  document.body.removeChild(container);
  return imageBlob;
};

function uuid(pre = "u_", len = 6) {
  const seed = "abcdefhijkmnprstwxyz0123456789",
    maxPos = seed.length;
  let rtn = "";
  for (let i = 0; i < len; i++) {
    rtn += seed.charAt(Math.floor(Math.random() * maxPos));
  }
  return pre + rtn;
}

export default getPreviewImage;
