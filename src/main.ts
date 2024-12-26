import { Truchet } from "./truchet";

document.onreadystatechange = () => {
  if (document.readyState !== "complete") {
    return;
  }

  const mosaicCanvas = document.querySelector("canvas") as HTMLCanvasElement;
  const mosaic = mosaicCanvas.getContext("2d");
  if (!mosaic) {
    throw new Error("Could not create mosaic because getContext returned null");
  }

  const truchet = new Truchet(mosaic, mosaicCanvas.width, mosaicCanvas.height);

  mosaicCanvas.onclick = () => {
    truchet.draw();
  };

  truchet.draw();
};
