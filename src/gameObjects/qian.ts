import { GameObject } from "@eva/eva.js";
import { Img } from "@eva/plugin-renderer-img";

export default function createQian({ x, y }: { x: number, y: number }) {
  const go = new GameObject('qian', {
    size: {
      width: 6,
      height: 60
    },
    origin: { x: 0.5, y: 0.5 },
    position: {
      x: x,
      y: y
    }
  })
  go.addComponent(new Img({
    resource: 'qian'
  }))
  return go
}