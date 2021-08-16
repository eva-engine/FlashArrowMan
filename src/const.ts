export const GAME_WIDTH = 1624
export const GAME_HEIGHT = innerWidth / innerHeight * 1624
// export const GAME_WIDTH = 750
// export const GAME_HEIGHT = innerHeight / innerWidth * 750
export const SCENE_HEIGHT = 750
export const SCENE_WIDTH = innerHeight / innerWidth * 1624

export const BOW_CD = 6000
export const QIAN_CD = 300

export const MOVE_SPEED = 0.5

export const QIAN_PHYSICS_CONFIG = {
  isStatic: false, // Whether the object is still, any force acting on the object in a static state will not produce any effect
  restitution: 0,
  frictionAir: 0,
  friction: 0,
  frictionStatic: 0,
}