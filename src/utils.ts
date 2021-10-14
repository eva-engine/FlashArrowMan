export const makeHorizental = (canvas: Element) => {
  const _ = canvas.addEventListener

  const list = [...new Set(['altKey', 'altitudeAngle', 'azimuthAngle', 'bubbles', 'button', 'buttons', 'cancelBubble', 'cancelable', 'clientX', 'clientY', 'composed', 'ctrlKey', 'currentTarget', 'defaultPrevented', 'detail', 'eventPhase', 'fromElement', 'height', 'isPrimary', 'isTrusted', 'layerX', 'layerY', 'metaKey', 'movementX', 'movementY', 'offsetX', 'offsetY', 'pageX', 'pageY', 'path', 'pointerId', 'pointerType', 'pressure', 'relatedTarget', 'returnValue', 'screenX', 'screenY', 'shiftKey', 'sourceCapabilities', 'srcElement', 'tangentialPressure', 'target', 'tiltX', 'tiltY', 'timeStamp', 'toElement', 'twist', 'type', 'view', 'which', 'width', 'x', 'y'])]
  const list2 = ['altKey', 'touches', 'targetTouches', 'changedTouches', 'ctrlKey', 'shiftKey', 'metaKey']
  const touchList = ['clientX', 'clientY', 'force', 'identifier', 'pageX', 'pageY', 'radiusX', 'radiusY', 'rotationAngle', 'screenX', 'screenY']
  const changeXY = (touch: any, event: any) => {
    touch.clientX = event.clientY
    touch.clientY = window.innerWidth - event.clientX
  }
  const gr = canvas.getBoundingClientRect
  canvas.getBoundingClientRect = () => {
    const rect = gr.call(canvas)
    const newRect = {} as any
    newRect.width = rect.height
    newRect.height = rect.width
    newRect.x = rect.y
    newRect.y = innerWidth - rect.width - rect.left
    Object.assign(rect, newRect)
    return rect
  }
  canvas.addEventListener = function (eventName: string, callback: (event: any) => void, c: any) {
    _.call(canvas, eventName, (event: any) => {
      const a = {} as any
      let l = event instanceof TouchEvent ? list2 : list
      l.forEach(name => {
        a[name] = event[name]
      })
      //     console.log(Object.keys(a), 123)
      //     a.xxx = 123123
      if (event instanceof PointerEvent) {
        changeXY(a, event)
      }
      //     console.log(a, 123999)
      if (event.touches) {
        a.touches = []
        a.changedTouches = []
        a.targetTouches = []
        Object.values(event.touches).map((x: any, i) => {
          const touch = {} as any
          touchList.forEach(touchName => {
            touch[touchName] = x[touchName]
          })
          changeXY(touch, event.touches[i])
          touch.target = canvas
          a.touches.push(new Touch(touch))
        })
        Object.values(event.changedTouches).map((x: any, i) => {
          const touch = {} as any
          touchList.forEach(touchName => {
            touch[touchName] = x[touchName]
          })
          changeXY(touch, event.changedTouches[i])


          touch.target = canvas
          a.changedTouches.push(new Touch(touch))
        })
        Object.values(event.targetTouches).map((x: any, i) => {
          const touch = {} as any
          touchList.forEach(touchName => {
            touch[touchName] = x[touchName]
          })
          changeXY(touch, event.targetTouches[i])

          touch.target = canvas
          a.targetTouches.push(new Touch(touch))
        })


      }

      let evt
      if (event instanceof TouchEvent) {
        evt = new TouchEvent(eventName, a)
      } else {
        evt = new PointerEvent(eventName, a)
      }

      return callback.call(canvas, evt)
    }, c)
    // return _.apply(this, arguments)
  }

}