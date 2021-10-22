import { RESOURCE_TYPE } from '@eva/eva.js';
export default [
  {
    name: 'arrow',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: './statics/arrow.png',
      },
    },
    preload: true,
  },
  {
    name: 'bow',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url:
          './statics/bow.png',
      },
    },
    preload: true,
  },
  {
    name: 'btn',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url:
          './statics/btn.png',
      },
    },
    preload: true,
  },
  {
    name: 'box',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url:
          './statics/box.png',
      },
    },
    preload: true,
  },
  {
    name: 'background',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url:
          './statics/background.jpg',
      },
    },
    preload: true,
  },{
    name: 'invite',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url:
          'https://gw.alicdn.com/imgextra/i1/O1CN01cK0uHl1hG5b2PEudQ_!!6000000004249-2-tps-669-210.png',
      },
    },
    preload: true,
  },
  {
    name: 'shoot',
    type: RESOURCE_TYPE.AUDIO,
    src: {
      audio: {
        type: 'audio',
        url: './statics/shoot.wav'
      }
    },
    preload: true
  },
  {
    name: 'attack',
    type: RESOURCE_TYPE.AUDIO,
    src: {
      audio: {
        type: 'audio',
        url: './statics/attack.wav'
      }
    },
    preload: true
  },
  {
    name: 'shoot2',
    type: RESOURCE_TYPE.AUDIO,
    src: {
      audio: {
        type: 'audio',
        url: './statics/shoot2.wav'
      }
    },
    preload: true
  },
  {
    name: 'attack2',
    type: RESOURCE_TYPE.AUDIO,
    src: {
      audio: {
        type: 'audio',
        url: './statics/attack2.wav'
      }
    },
    preload: true
  },
  {
    name: 'emitter',
    type: RESOURCE_TYPE.PARTICLES,
    src: {
      img_0: {
        type: 'png',
        url: "https://gw.alicdn.com/imgextra/i2/O1CN01Fi8ma31eWAcqY8pXg_!!6000000003878-2-tps-99-99.png"
      },
      json: {
        type: 'json',
        url: './statics/emitter.json'
      }
    },
    preload: true
  }
];
