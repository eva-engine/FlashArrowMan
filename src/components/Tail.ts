import { Component, GameObject } from "@eva/eva.js";
import { Particles } from "@eva/plugin-renderer-particles";

export class Tail extends Component {
	static componentName = 'Tail'
	go: GameObject
	particles: Particles

	init({ resource } = { resource: '' }) {
		this.go = new GameObject('')
		this.particles = new Particles({
			resource
		})
		this.go.addComponent(this.particles);
		this.particles.play();
		window.game.scene.addChild(this.go);
		console.log('init')
	}
	update(e: any) {
		console.log('update');
		const rotation = -this.gameObject.transform.rotation;
		const scale = this.gameObject.transform.scale.x;

		this.particles.emitter?.ownerPos.set(
			this.gameObject.transform.position.x + Math.sin(rotation) * 40 * scale,
			this.gameObject.transform.position.y + Math.cos(rotation) * 40 * scale,
		)
	}
	onDestroy(){
		this.go.destroy();
	}
}