import * as mapboxgl from "mapbox-gl";

const size = 70;

interface PulsingDot {
  width: number;
  height: number;
  data: Uint8ClampedArray;
  context: CanvasRenderingContext2D | null;
  mapRef: React.RefObject<mapboxgl.Map> | null;

  onAdd(): void;
  render(): boolean;
}

export const pulsingDot: PulsingDot = {
  width: size,
  height: size,
  data: new Uint8ClampedArray(size * size * 4),
  context: null,
  mapRef: null,

  onAdd: function () {
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext("2d");
  },

  render: function () {
    if (!this.context) return false;

    const duration = 1000;
    const t = (performance.now() % duration) / duration;

    const radius = (size / 2) * 0.3;
    const outerRadius = (size / 2) * 0.7 * t + radius;
    const context = this.context;

    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
    context.fill();

    context.beginPath();
    context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 100, 100, 1)";
    context.strokeStyle = "white";
    context.lineWidth = 2 + 4 * (1 - t);
    context.fill();
    context.stroke();

    this.data = context.getImageData(0, 0, this.width, this.height).data;

    if (this.mapRef && this.mapRef.current) {
      this.mapRef.current.triggerRepaint();
    }

    return true;
  },
};
