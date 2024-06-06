import { Scene } from 'phaser'
import { PlatformManager } from './Platforms'
import { Player } from './Player'
import { Score } from './Score'
import { Grid } from './Grid'
import { Health } from './Health'
import { ItemsManager } from './Items'
import { Controls } from './Controls'

interface JumperConfig {
  assets: {
    background: string
    player: string
    platforms: string[]
    bonus: string[]
  }
}

export class JumperScene extends Scene {
  config: JumperConfig
  player: Player | undefined
  platformManager: PlatformManager | undefined
  itemsManager: ItemsManager | undefined
  score: Score | undefined
  health: Health | undefined
  grid: Grid | undefined
  debugGraphics: Phaser.GameObjects.Graphics | undefined
  controls: Controls | undefined

  constructor(config: JumperConfig) {
    super()
    this.config = config
  }

  preload() {
    this.load.image(
      'platform',
      'https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/default/jp-platform-3.png'
    )
    this.load.image(
      'booster-platform',
      'https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/default/jp-booster-platform.png'
    )
    this.load.image(
      'danger-platform',
      'https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/default/jp-danger-platform.png'
    )
    this.load.image(
      'knight',
      'https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/default/jp-knight.png'
    )
    this.load.image(
      'heart',
      'https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/default/jp-heart.png'
    )
    this.load.image(
      'coin',
      'https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/default/jp-coin.png'
    )
    this.load.image(
      'coconut',
      'https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/default/jp-coconut.png'
    )
    this.load.image(
      'control',
      'https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/default/jp-control-button.png'
    )
    this.load.spritesheet(
      'player',
      'https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/default/jp-monkey.png',
      {
        frameWidth: 63,
        frameHeight: 70
      }
    )
  }

  create() {
    this.score = new Score(this)
    this.health = new Health(this)
    this.health.create()
    this.grid = new Grid(this)
    this.grid.create()

    this.player = new Player(this)
    this.player.create()

    this.platformManager = new PlatformManager(this)
    this.platformManager.create()

    this.itemsManager = new ItemsManager(this)
    this.itemsManager.create()

    this.controls = new Controls(this)
    this.controls.create()

    this.time.addEvent({
      delay: 10000,
      callback: () => {
        // Create a sprite that falls down from the top of the screen. When the player collides with the sprite, the player's health decreases.
        const x = Phaser.Math.Between(this.scale.width * 0.2, this.scale.width * 0.8)
        const y = this.cameras.main.scrollY - 100
        const coconut = this.physics.add.sprite(x, y, 'coconut')
        coconut.setBounce(0.5)
        coconut.setCollideWorldBounds(true)
        coconut.body.gravity.y = 500
        coconut.body.setSize(50, 50)
        this.physics.add.overlap(coconut, this.player?.player!, () => {
          this.health?.decreaseHealth()
          coconut.destroy()
        })
      },
      callbackScope: this,
      loop: true
    })

    this.debugGraphics = this.add.graphics()
  }

  update() {
    this.grid?.update()
    this.player?.update()
    this.platformManager?.update()
    this.itemsManager?.update()
    this.controls?.update()
  }

  public kill() {
    this.scene.stop()
  }
}
