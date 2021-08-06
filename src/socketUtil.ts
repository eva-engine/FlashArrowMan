import { EmitDataStruct, EmitMsgStruct, InitDataStruct, MessageStruct } from "./type"

let ws: WebSocket

export const userInfo: { id: number } = {
  id: -1
}


export function goInRoom() {


  ws = new WebSocket('wss://www.anxyser.xyz/qianserver')

  ws.onopen = (r) => {
    console.log('open', r)
    ws.send(JSON.stringify({
      type: 'in',
      data: {
        token: 'aaa',
      }
    }))
  }

  ws.onmessage = ({ data: _data }) => {
    const data = JSON.parse(_data) as MessageStruct
    console.log('message', data)
    switch (data.type) {
      case 'turn':
        emitQian(data.data as any)
        break;
      case 'init':
        init(data.data as any)
        break;
    }
  }

  ws.onclose = () => {
    console.log('onClose')
    goInRoom()
  }


 
}

export function sendEmitQian(data: EmitDataStruct) {
  console.log('send', data)
  ws.send(JSON.stringify({
    type: 'turn',
    data: data
  }))
}

export function onAttack({ hp }: { hp: number }) {

}
const list: ((n: MessageStruct) => void)[] = []

export function emitQian(data: EmitDataStruct) {
  console.log(data.userId , userInfo.id, 123)
  if (data.userId === userInfo.id) {
    return
  }
  list.forEach((fn) => {
    fn({
      type: 'turn',
      data
    })
  })
}

export function init(data: InitDataStruct) {
  console.log('init', data)
  userInfo.id = data.id
}

export function on(fn: (n: MessageStruct) => void) {
  list.push(fn)
}


goInRoom()

