document.onreadystatechange = () => {
  if (document.readyState !== "complete") {
    return;
  }

  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <h1>Coloring Truchet Tiles</h1>
    <div>An app to demonstrate coloring truchet tiles.</div>
  `;
};
