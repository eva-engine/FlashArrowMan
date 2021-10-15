import { GameObject } from "@eva/eva.js";
import { Img } from "@eva/plugin-renderer-img";

export default function createArrow({ x, y }: { x: number, y: number }, name = 'arrow') {
  const go = new GameObject(name, {
    size: {
      width: 21,
      height: 169
    },
    origin: { x: 0.5, y: 0.5 },
    position: {
      x: x,
      y: y
    }
  });
  go.addComponent(new Img({
    resource: 'arrow'
  }))
  return go
}