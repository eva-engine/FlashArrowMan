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
  },
];
