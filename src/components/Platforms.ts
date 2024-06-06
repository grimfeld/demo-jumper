import { JumperScene } from './Scene'

const PLATFORMS_DISPLAYED = 10

export class DefaultPlatform extends Phaser.Physics.Arcade.Sprite {
  scene: JumperScene

  constructor(scene: JumperScene, x: number, y: number) {
    super(scene, x, y, 'platform')
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)

    this.setImmovable(true)
    // @ts-ignore
    this.body.checkCollision.down = false
    // @ts-ignore
    this.body.checkCollision.left = false
    // @ts-ignore
    this.body.checkCollision.right = false

    this.setOrigin(0.5, 0.5)
    this.setSize(2304, 850).setOffset(0, 200)
    this.setDisplaySize(125, 45)

    if (!this.scene.player?.player) return
    this.scene.physics.add.collider(this, this.scene.player?.player, () => {
      if (
        this.body?.y &&
        this.scene.player?.player?.body?.touching.down &&
        this.scene.player?.player.body.y + this.scene.player?.player?.height >= this.body.y
      ) {
        this.scene.player?.player?.setVelocityY(Phaser.Math.Between(-600, -750))
      }
    })

    // Add an update event to the scene that checks the position of this platform
    this.scene.events.on('update', this.checkOutOfBounds, this)
  }

  private checkOutOfBounds() {
    if (this.y > this.scene?.cameras.main.scrollY + this.scene?.scale.height) {
      const newPosition = this.scene.grid?.findNearestEmptySpot(
        Phaser.Math.Between(this.scene.scale.width * 0.2, this.scene.scale.width * 0.8),
        this.y - this.scene.scale.height,
        2,
        3,
        false
      )
      if (!newPosition) return
      this.setPosition(newPosition.x, newPosition.y)
      this.scene.score?.incrementScore(1)
      if (this.body) {
        this.body.reset(newPosition.x, newPosition.y)
      }
    }
  }
}

export class BoosterPlatform extends Phaser.Physics.Arcade.Sprite {
  scene: JumperScene
  constructor(scene: JumperScene, x: number, y: number) {
    super(scene, x, y, 'booster-platform')
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)

    this.setImmovable(true)
    // @ts-ignore
    this.body.checkCollision.down = false
    // @ts-ignore
    this.body.checkCollision.left = false
    // @ts-ignore
    this.body.checkCollision.right = false

    this.setOrigin(0.5, 0.5)
    this.setSize(2688, 1536).setOffset(0, 500)
    this.setDisplaySize(125, 67)

    if (!this.scene.player?.player) return
    this.scene.physics.add.collider(this, this.scene.player?.player, () => {
      if (
        this.body?.y &&
        this.scene.player?.player?.body?.touching.down &&
        this.scene.player?.player.body.y + this.scene.player?.player?.height >= this.body.y
      ) {
        this.scene.player?.player?.setVelocityY(Phaser.Math.Between(-1000, -1200))
      }
    })
    // Add an update event to the scene that checks the position of this platform
    this.scene.events.on('update', this.checkOutOfBounds, this)
  }

  private checkOutOfBounds() {
    if (this.y > this.scene?.cameras.main.scrollY + this.scene?.scale.height) {
      this.destroy()
    }
  }
}

export class DangerPlatform extends Phaser.Physics.Arcade.Sprite {
  scene: JumperScene

  constructor(scene: JumperScene, x: number, y: number) {
    super(scene, x, y, 'danger-platform')
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)

    this.setImmovable(true)
    // @ts-ignore
    this.body.checkCollision.down = false
    // @ts-ignore
    this.body.checkCollision.left = false
    // @ts-ignore
    this.body.checkCollision.right = false

    this.setOrigin(0.5, 0.5)
    this.setSize(2688, 1536).setOffset(0, 500)
    this.setDisplaySize(125, 67)

    if (!this.scene.player?.player) return
    this.scene.physics.add.collider(this, this.scene.player?.player, () => {
      if (
        this.body?.y &&
        this.scene.player?.player?.body?.touching.down &&
        this.scene.player?.player.body.y + this.scene.player?.player?.height >= this.body.y
      ) {
        this.scene.health?.decreaseHealth()
        this.scene.player?.player?.setVelocityY(Phaser.Math.Between(-400, -500))
      }
    })
    // Add an update event to the scene that checks the position of this platform
    this.scene.events.on('update', this.checkOutOfBounds, this)
  }

  private checkOutOfBounds() {
    if (this.y > this.scene?.cameras.main.scrollY + this.scene?.scale.height) {
      this.destroy()
    }
  }
}

export class PlatformSpawner {
  scene: JumperScene
  cooldown: boolean
  timer: Phaser.Time.TimerEvent | undefined
  interval: number
  cooldownTime: number
  probability: number
  handleSpawn: () => void

  constructor(
    scene: JumperScene,
    interval: number,
    cooldownTime: number,
    probability: number,
    handleSpawn: () => void
  ) {
    this.scene = scene
    this.cooldown = false
    this.interval = interval
    this.cooldownTime = cooldownTime
    this.probability = probability
    this.handleSpawn = handleSpawn
  }

  handler() {
    if (this.cooldown) return
    const rand = Phaser.Math.Between(0, 1000)

    if (rand < this.probability) {
      this.handleSpawn()
      this.handleCooldown()
    }
  }

  createTimer() {
    this.timer = this.scene.time.addEvent({
      delay: this.interval,
      callback: this.handler,
      callbackScope: this,
      loop: true
    })
  }

  handleCooldown() {
    this.cooldown = true
    this.timer = this.scene.time.addEvent({
      delay: this.cooldownTime,
      callback: () => {
        this.cooldown = false
      }
    })
  }
}

export class PlatformManager {
  private readonly scene: JumperScene
  platforms: Array<Phaser.Physics.Arcade.Sprite> = []

  constructor(scene: JumperScene) {
    this.scene = scene
  }

  public create(): void {
    this.initialPlatform()
    const boosterPlatformSpawner = new PlatformSpawner(this.scene, 100, 5000, 100, () => {
      const position = this.scene.grid?.getEmptySpot(6, 3, this.scene.cameras.main.scrollY)
      if (!position) return
      new BoosterPlatform(this.scene, position.x, position.y + 100)
    })
    boosterPlatformSpawner.createTimer()
    const dangerPlatformSpawner = new PlatformSpawner(this.scene, 100, 5000, 100, () => {
      const position = this.scene.grid?.getEmptySpot(4, 3, this.scene.cameras.main.scrollY)
      if (!position) return
      new DangerPlatform(this.scene, position.x, position.y - 50)
    })
    dangerPlatformSpawner.createTimer()
  }

  private addPlatform(x: number, y: number): Phaser.Physics.Arcade.Sprite | null {
    const position = this.scene.grid?.findNearestEmptySpot(x, y, 2, 3, true)
    if (!position) return null
    const platform = new DefaultPlatform(this.scene, position.x, position.y)
    this.platforms.push(platform)
    return platform
  }

  public initialPlatform(): void {
    const initPlatform = this.addPlatform(
      this.scene.scale.width / 2 - 62,
      this.scene.scale.height - 60
    )
    if (!initPlatform) return
    for (let i = 1; i < PLATFORMS_DISPLAYED; i++) {
      this.addPlatform(
        Phaser.Math.Between(this.scene.scale.width * 0.2, this.scene.scale.width * 0.8),
        initPlatform.y - 100 * i
      )
    }
  }

  public update(): void {}
}
