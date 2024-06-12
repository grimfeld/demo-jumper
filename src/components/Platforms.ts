import { JumperPlatform, JumperScene } from './Scene'

const PLATFORMS_DISPLAYED = 10

export class BasePlatform extends Phaser.Physics.Arcade.Sprite {
  scene: JumperScene
  constructor(scene: JumperScene, x: number, y: number, name: string, config: JumperPlatform) {
    super(scene, x, y, name)
    this.scene = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setImmovable(true)
    // @ts-ignore
    this.body.checkCollision.down = false
    // @ts-ignore
    this.body.checkCollision.left = false
    // @ts-ignore
    this.body.checkCollision.right = false

    this.setOrigin(0.5, 0.5)
    this.setSize(config.assetWidth, config.assetHeight).setOffset(config.xOffset, config.yOffset)
    this.setDisplaySize(125, config.assetHeight / (config.assetWidth / 125))

    if (!this.scene.player?.player) return
    this.scene.physics.add.collider(this, this.scene.player?.player, () => {
      if (
        this.body?.y &&
        this.scene.player?.player?.body?.touching.down &&
        this.scene.player?.player.body.y + this.scene.player?.player?.height >= this.body.y
      ) {
        // Handle bounce
        const max = config.bounciness + 100
        const min = config.bounciness - 100
        this.scene.player?.player?.setVelocityY(Phaser.Math.Between(-min, -max))
        // Handle effect
        switch (config.effect) {
          case 'increaseHealth':
            this.scene.health?.increaseHealth(config.data)
            break
          case 'decreaseHealth':
            this.scene.health?.decreaseHealth(config.data)
            break
          case 'increaseScore':
            this.scene.score?.incrementScore(config.data)
            break
          case 'decreaseScore':
            this.scene.score?.decrementScore(config.data)
            break
        }
      }
    })

    // Add an update event to the scene that checks the position of this platform
    this.scene.events.on('update', this.checkOutOfBounds, this)
  }

  checkOutOfBounds() {
    if (this.y > this.scene?.cameras.main.scrollY + this.scene?.scale.height) {
      this.destroy()
    }
  }
}

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
    this.setSize(
      this.scene.config.assets.platform.assetWidth,
      this.scene.config.assets.platform.assetHeight
    ).setOffset(
      this.scene.config.assets.platform.xOffset,
      this.scene.config.assets.platform.yOffset
    )
    this.setDisplaySize(
      125,
      this.scene.config.assets.platform.assetHeight /
        (this.scene.config.assets.platform.assetWidth / 125)
    )

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

    this.scene.config.platforms.forEach((platform) => {
      const spawner = new PlatformSpawner(
        this.scene,
        platform.interval,
        platform.cooldown,
        platform.probability,
        () => {
          const position = this.scene.grid?.getEmptySpot(
            platform.requiredRows,
            platform.requiredColumns,
            this.scene.cameras.main.scrollY
          )
          if (!position) return
          new BasePlatform(
            this.scene,
            position.x,
            position.y + platform.verticalOffset,
            platform.id,
            platform
          )
        }
      )
      spawner.createTimer()
    })
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
