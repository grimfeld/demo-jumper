import { JumperScene } from './Scene'

export class BaseItem extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: JumperScene,
    x: number,
    y: number,
    name: string,
    width: number,
    height: number,
    effect: string,
    data: any
  ) {
    super(scene, x, y, name)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setImmovable(true)
    // @ts-ignore
    this.body.checkCollision.down = false
    // @ts-ignore
    this.body.checkCollision.left = false
    // @ts-ignore
    this.body.checkCollision.right = false
    // @ts-ignore
    this.body.checkCollision.up = false
    this.setOrigin(0.5, 0.5)
    this.setSize(width, height).setOffset(0, 0)
    this.setDisplaySize(30, height / (width / 30))

    if (!scene.player?.player) return
    scene.physics.add.collider(this, scene.player.player, () => {
      switch (effect) {
        case 'increaseHealth':
          scene.health?.increaseHealth(data)
          break
        case 'decreaseHealth':
          scene.health?.decreaseHealth(data)
          break
        case 'increaseScore':
          scene.score?.incrementScore(data)
          break
        case 'decreaseScore':
          scene.score?.decrementScore(data)
          break
      }
      this.destroy()
    })
  }
}

export class ItemSpawner {
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

export class ItemsManager {
  scene: JumperScene

  constructor(scene: JumperScene) {
    this.scene = scene
  }

  create() {
    this.scene.config.items.forEach((item) => {
      const spawner = new ItemSpawner(
        this.scene,
        item.interval,
        item.cooldown,
        item.probability,
        () => {
          const position = this.scene.grid?.getEmptySpot(1, 1, this.scene.cameras.main.scrollY)
          if (!position) return
          new BaseItem(
            this.scene,
            position.x,
            position.y,
            item.id,
            item.assetWidth,
            item.assetHeight,
            item.effect,
            item.data
          )
        }
      )
      spawner.createTimer()
    })
  }

  update() {
    // No need to call handleHeartSpawn directly in update anymore
  }
}
