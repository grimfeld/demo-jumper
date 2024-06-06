import { JumperScene } from './Scene'

export class Controls {
  scene: JumperScene
  leftControl: Phaser.GameObjects.Image | undefined
  rightControl: Phaser.GameObjects.Image | undefined
  moveLeft: boolean = false
  moveRight: boolean = false

  constructor(scene: JumperScene) {
    this.scene = scene
  }

  create() {
    this.leftControl = this.scene.add
      .image(100, this.scene.scale.height - 150, 'control')
      .setDisplaySize(150, 150)
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(10)
      .setAlpha(0.5)
    this.leftControl.rotation = Math.PI

    this.rightControl = this.scene.add
      .image(this.scene.scale.width - 100, this.scene.scale.height - 150, 'control')
      .setDisplaySize(150, 150)
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(10)
      .setAlpha(0.5)

    // Handle left button touch input
    this.leftControl.on('pointerdown', () => {
      this.moveLeft = true
    })

    this.leftControl.on('pointerup', () => {
      this.moveLeft = false
    })

    this.leftControl.on('pointerout', () => {
      this.moveLeft = false
    })

    // Handle right button touch input
    this.rightControl.on('pointerdown', () => {
      this.moveRight = true
    })

    this.rightControl.on('pointerup', () => {
      this.moveRight = false
    })

    this.rightControl.on('pointerout', () => {
      this.moveRight = false
    })
  }

  update() {
    if (this.moveLeft) {
      this.scene.player?.player?.setVelocityX(-150)
    } else if (this.moveRight) {
      this.scene.player?.player?.setVelocityX(150)
    } else {
      this.scene.player?.player?.setVelocityX(0)
    }
  }
}
