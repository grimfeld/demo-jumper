import { JumperScene } from './Scene'

export class Health {
  scene: JumperScene
  health: number = 3
  healthContainer: Phaser.GameObjects.Container
  text: Phaser.GameObjects.Text
  cooldown: boolean = false

  constructor(scene: JumperScene) {
    this.scene = scene
    this.healthContainer = this.scene.add.container(10, 10)
    this.text = this.scene.add
      .text(30, 0, `${this.health}`, {
        fontSize: '32px',
        color: '#fff'
      })
      .setScrollFactor(0)
    const heartIcon = this.scene.add
      .image(15, 15, 'heart')
      .setDisplaySize(30, 30)
      .setScrollFactor(0)
    this.healthContainer.add([heartIcon, this.text])
  }

  create() {
    this.updateHealth()
  }

  updateHealth() {
    this.text.setText(`${this.health}`)
  }

  decreaseHealth() {
    if (this.cooldown) return
    if (this.health > 1) {
      this.cooldown = true
      this.health--
      this.scene.time.addEvent({
        delay: 5000,
        callback: () => {
          this.cooldown = false
        }
      })
    } else {
      this.scene.kill()
    }
    this.updateHealth()
  }

  increaseHealth() {
    this.health++
    this.updateHealth()
  }

  getHealth() {
    return this.health
  }
}
