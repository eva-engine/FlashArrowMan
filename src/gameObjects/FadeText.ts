import { GameObject, TransformParams } from "@eva/eva.js";
import { Render } from "@eva/plugin-renderer-render";
import { Text, TextParams } from "@eva/plugin-renderer-text";

export interface FadeTextShowOptions {
  duration?: number
  speed?: {
    x?: number
    y?: number
  }
  fade?: boolean
}

export class FadeText extends GameObject {
  constructor(obj: TransformParams) {
    super('fadeText', obj);
  }
  show(text: string | TextParams, fadeOption: FadeTextShowOptions) {
    this.addComponent(new Render());
    this.addComponent(new FadeTextComponent(typeof text === 'string' ? { text } : text, fadeOption));
    return this;
  }

}
class FadeTextComponent extends Text {
  constructor(option: TextParams, public fadeOption: FadeTextShowOptions) {
    super(option);
    setTimeout(() => {
      this.gameObject?.destroy();
    }, fadeOption.duration ?? 1000);
  }
  update() {
    this.gameObject.transform.position.x += this.fadeOption.speed?.x ?? 0;
    this.gameObject.transform.position.y += this.fadeOption.speed?.y ?? 0;
    this.gameObject.getComponent(Render).alpha -= 16.6 / (this.fadeOption.duration ?? 1000);
  }
}