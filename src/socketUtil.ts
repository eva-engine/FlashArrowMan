import { EmitDataStruct, MessageStruct } from "./type"

export function onAttack({ hp }: { hp: number }) {

}
const list: ((n: MessageStruct) => void)[] = []

export function emitQian(data: EmitDataStruct) {
  list.forEach((fn) => {
    fn({
      type: 'turn',
      data
    })
  })
}

export function on(fn: (n: MessageStruct) => void) {
  list.push(fn)
}
