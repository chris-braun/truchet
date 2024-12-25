document.onreadystatechange = () => {
  if (document.readyState !== "complete") {
    return;
  }

  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const primaryColor = "#00a4cc";
  const secondaryColor = "#edff00";
  const stroke = "#28334a";
  let color = primaryColor;

  const drawCanvas = () => {
    context.fillStyle = color;
    context.strokeStyle = stroke;
    context.lineWidth = 2;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(0, 0, canvas.width, canvas.height);
  };

  canvas.onclick = () => {
    color = color === primaryColor ? secondaryColor : primaryColor;
    drawCanvas();
  };

  drawCanvas();
};
