const TILE_SIZE = 50;
const SUPER_TILE_SIZE = 2 * TILE_SIZE;
const CORNER_RADIUS = TILE_SIZE / 2;

const MAJOR_CORNERS = [0, 0, TILE_SIZE, TILE_SIZE];
const MINOR_CORNERS = [TILE_SIZE, 0, 0, TILE_SIZE];

const FILL_COLORS = ["#00a4cc", "#edff00"];
const REVERSED_FILL_COLORS = [FILL_COLORS[1], FILL_COLORS[0]];
const LINE_COLOR = "#28334a";
const LINE_WIDTH = 6;

export class Truchet {
  private mosaic: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  private superTiles: OffscreenCanvas[];

  private drawCorner(
    tile: OffscreenCanvasRenderingContext2D,
    cx: number,
    cy: number
  ) {
    tile.beginPath();
    tile.ellipse(cx, cy, CORNER_RADIUS, CORNER_RADIUS, 0, 0, 2 * Math.PI);
    tile.fill();
    tile.stroke();
  }

  private createTile(aligned: boolean, rotated: boolean) {
    const tileCanvas = new OffscreenCanvas(TILE_SIZE, TILE_SIZE);
    const tile = tileCanvas.getContext("2d");
    if (!tile) {
      throw new Error("Could not create tile because getContext returned null");
    }

    let [foreColor, backColor] = aligned ? FILL_COLORS : REVERSED_FILL_COLORS;
    if (rotated) {
      [foreColor, backColor] = [backColor, foreColor];
    }

    tile.fillStyle = backColor;
    tile.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

    tile.fillStyle = foreColor;
    tile.strokeStyle = LINE_COLOR;
    tile.lineWidth = LINE_WIDTH;

    const [cx1, cy1, cx2, cy2] = rotated ? MINOR_CORNERS : MAJOR_CORNERS;

    this.drawCorner(tile, cx1, cy1);
    this.drawCorner(tile, cx2, cy2);

    return tileCanvas;
  }

  private createSuperTile(
    rotateA: boolean,
    rotateB: boolean,
    rotateC: boolean,
    rotateD: boolean
  ) {
    const superTileCanvas = new OffscreenCanvas(
      SUPER_TILE_SIZE,
      SUPER_TILE_SIZE
    );
    const superTile = superTileCanvas.getContext("2d");
    if (!superTile) {
      throw new Error(
        "Could not create super tile because getContext returned null"
      );
    }

    superTile.drawImage(this.createTile(true, rotateA), 0, 0);
    superTile.drawImage(this.createTile(false, rotateB), TILE_SIZE, 0);
    superTile.drawImage(this.createTile(false, rotateC), 0, TILE_SIZE);
    superTile.drawImage(this.createTile(true, rotateD), TILE_SIZE, TILE_SIZE);

    return superTileCanvas;
  }

  private createSuperTiles() {
    const superTiles: OffscreenCanvas[] = [];

    for (let n = 0b0000; n <= 0b1111; n += 0b0001) {
      const rotateA = Boolean(n & 0b1000);
      const rotateB = Boolean(n & 0b0100);
      const rotateC = Boolean(n & 0b0010);
      const rotateD = Boolean(n & 0b0001);
      superTiles.push(this.createSuperTile(rotateA, rotateB, rotateC, rotateD));
    }

    return superTiles;
  }

  private randomSuperTile() {
    return this.superTiles[Math.floor(Math.random() * this.superTiles.length)];
  }

  constructor(mosaic: CanvasRenderingContext2D, width: number, height: number) {
    this.mosaic = mosaic;
    this.width = width;
    this.height = height;

    this.superTiles = this.createSuperTiles();
  }

  draw() {
    for (let y = 0; y < this.height; y += SUPER_TILE_SIZE) {
      for (let x = 0; x < this.width; x += SUPER_TILE_SIZE) {
        this.mosaic.drawImage(this.randomSuperTile(), x, y);
      }
    }
  }
}
