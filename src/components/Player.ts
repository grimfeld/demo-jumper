import { JumperScene } from './Scene'

export class Player {
  private scene: JumperScene
  public player: Phaser.Physics.Arcade.Sprite | undefined
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined
  private jumpButton: Phaser.Input.Keyboard.Key | undefined
  private yOrig: number
  private yChange: number
  private cameraYMin: number

  constructor(scene: JumperScene) {
    this.scene = scene
    this.yOrig = 0
    this.yChange = 0
    this.cameraYMin = 99999
  }

  public create(): void {
    this.player = this.scene.physics.add.sprite(
      this.scene.scale.width / 2,
      this.scene.scale.height - 180,
      'player-idle'
    )
    this.player.setOrigin(0.5, 0.5)
    if (!this.player.body) return
    this.player.body.setSize(
      this.scene.config.assets.player.textures.idle.assetWidth,
      this.scene.config.assets.player.textures.idle.assetHeight
    )
    this.player.setDisplaySize(
      50,
      this.scene.config.assets.player.textures.idle.assetHeight /
        (this.scene.config.assets.player.textures.idle.assetWidth / 50)
    )
    this.player.setCollideWorldBounds(true)
    this.player.body.gravity.y = Phaser.Math.Between(500, 800)
    this.player.setBounce(0.2)
    this.player.setDepth(5)

    this.jumpButton = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.cursors = this.scene.input.keyboard?.createCursorKeys()

    this.yOrig = this.player.y
    this.yChange = 0
    this.cameraYMin = 99999
  }

  public update(): void {
    this.scene.physics.world.setBounds(
      0,
      -this.yChange,
      this.scene.scale.width,
      this.scene.scale.height + this.yChange
    )
    if (!this.player || !this.cursors) return
    this.cameraYMin = Math.min(this.cameraYMin, this.player.y - this.scene.scale.height + 300)
    this.scene.cameras.main.scrollY = this.cameraYMin
    this.handleMovement()
    if (this.player.y > this.scene.cameras.main.scrollY + this.scene.scale.height) {
      this.scene.kill()
    }
  }

  public handleMovement(): void {
    if (!this.player?.body || !this.cursors || !this.jumpButton) return

    let t1 = Math.abs(this.player.y)
    this.yChange = Math.max(Math.abs(t1 + this.yOrig) + 2000)
  }

  public moveLeft(): void {
    if (!this.player || !this.player.body) return
    this.player.setVelocityX(-150)
    this.player.setTexture('player-left')
    this.player.body.setSize(
      this.scene.config.assets.player.textures.left.assetWidth,
      this.scene.config.assets.player.textures.left.assetHeight
    )
  }

  public moveRight(): void {
    if (!this.player || !this.player.body) return
    this.player.setVelocityX(150)
    this.player.setTexture('player-right')
    this.player.body.setSize(
      this.scene.config.assets.player.textures.right.assetWidth,
      this.scene.config.assets.player.textures.right.assetHeight
    )
  }

  public setIdle(): void {
    if (!this.player || !this.player.body) return
    this.player.setVelocityX(0)
    this.player.setTexture('player-idle')
    this.player.body.setSize(
      this.scene.config.assets.player.textures.idle.assetWidth,
      this.scene.config.assets.player.textures.idle.assetHeight
    )
  }

  public render(): void {
    if (!this.player || !this.player.body) return
    // Debugging in Phaser 3 should be done differently; consider using graphics or UI elements.
    let debugText = `Player Info: Y: ${this.player.y}, Vel: ${this.player.body.velocity.y}`
    console.log(debugText)
  }
}
