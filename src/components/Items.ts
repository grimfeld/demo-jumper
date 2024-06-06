import { JumperScene } from './Scene'

const HEART_COOLDOWN = 5000
const COIN_COOLDOWN = 5000
const HEART_PROBABILITY = 10
const COIN_PROBABILITY = 10
const HEART_SPAWN_TRIAL_INTERVAL = 100
const COIN_SPAWN_TRIAL_INTERVAL = 100

export class HeartItem extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: JumperScene, x: number, y: number) {
    super(scene, x, y, 'heart')
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
    this.setSize(30, 30).setOffset(0, 0)
    this.setDisplaySize(30, 30)

    if (!scene.player?.player) return
    scene.physics.add.collider(this, scene.player.player, () => {
      scene.health?.increaseHealth()
      this.destroy()
    })
  }
}

export class CoinItem extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: JumperScene, x: number, y: number) {
    super(scene, x, y, 'coin')
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
    this.setSize(50, 50).setOffset(0, 0)
    this.setDisplaySize(30, 30)

    if (!scene.player?.player) return
    scene.physics.add.collider(this, scene.player.player, () => {
      scene.score?.incrementScore(10)
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

  private handleHeartSpawn() {
    const position = this.scene?.grid?.getEmptySpot(1, 1, this.scene.cameras.main.scrollY)
    if (!position) return

    new HeartItem(this.scene, position.x, position.y)
  }

  private handleCoinSpawn() {
    const position = this.scene?.grid?.getEmptySpot(1, 1, this.scene.cameras.main.scrollY)
    if (!position) return

    new CoinItem(this.scene, position.x, position.y)
  }

  create() {
    const heartSpawner = new ItemSpawner(
      this.scene,
      HEART_SPAWN_TRIAL_INTERVAL,
      HEART_COOLDOWN,
      HEART_PROBABILITY,
      this.handleHeartSpawn
    )
    heartSpawner.createTimer()
    const coinSpawner = new ItemSpawner(
      this.scene,
      COIN_SPAWN_TRIAL_INTERVAL,
      COIN_COOLDOWN,
      COIN_PROBABILITY,
      this.handleCoinSpawn
    )
    coinSpawner.createTimer()
  }

  update() {
    // No need to call handleHeartSpawn directly in update anymore
  }
}
