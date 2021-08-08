import { GameObject } from "@eva/eva.js";
import { Text } from "@eva/plugin-renderer-text";
import HPText from "../components/HPText";

export default function createHP({ position }: { position: { x: number, y: number } }) {
  const hp = new GameObject('hp', {
    position: position
  })

  hp.addComponent(new Text({
    text: '匹配中...',
    style: {
      fontSize: 50,
      fill: 0xffffff
    }
  }))

  const hpText = hp.addComponent(new HPText())

  return {hp, hpText}
}