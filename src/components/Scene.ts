import { Scene } from 'phaser'
import { PlatformManager } from './Platforms'
import { Player } from './Player'
import { Score } from './Score'
import { Grid } from './Grid'
import { Health } from './Health'
import { ItemsManager } from './Items'
import { Controls } from './Controls'
import { Background } from './Background'

export interface JumperItem {
  id: string
  image: string
  effect: string
  data?: any
  interval: number
  cooldown: number
  probability: number
  assetWidth: number
  assetHeight: number
}

export interface JumperPlatform {
  id: string
  image: string
  interval: number
  cooldown: number
  probability: number
  requiredRows: number
  requiredColumns: number
  assetWidth: number
  assetHeight: number
  xOffset: number
  yOffset: number
  verticalOffset: number
  bounciness: number
  effect: string
  data?: any
}

export interface JumperSkinConfig {
  skin: string
  items: JumperItem[]
  platforms: JumperPlatform[]
  assets: {
    background: {
      image: string
      assetWidth: number
      assetHeight: number
      isLooping?: boolean
      isScrolling?: boolean
    }
    platform: {
      image: string
      assetWidth: number
      assetHeight: number
      xOffset: number
      yOffset: number
    }
    player: {
      textures: {
        idle: {
          image: string
          assetWidth: number
          assetHeight: number
        }
        left: {
          image: string
          assetWidth: number
          assetHeight: number
        }
        right: {
          image: string
          assetWidth: number
          assetHeight: number
        }
      }
    }
    health: {
      image: string
      assetWidth: number
      assetHeight: number
    }
    score: {
      image: string
      assetWidth: number
      assetHeight: number
    }
    controls: {
      left: {
        image: string
        assetWidth: number
        assetHeight: number
        rotation: number
      }
      right: {
        image: string
        assetWidth: number
        assetHeight: number
        rotation: number
      }
    }
  }
}

export class JumperScene extends Scene {
  config: JumperSkinConfig
  player: Player | undefined
  platformManager: PlatformManager | undefined
  itemsManager: ItemsManager | undefined
  score: Score | undefined
  health: Health | undefined
  grid: Grid | undefined
  debugGraphics: Phaser.GameObjects.Graphics | undefined
  controls: Controls | undefined
  background: Background | undefined

  constructor(config: JumperSkinConfig) {
    super()
    this.config = config
  }

  preload() {
    if (!this.config) return

    this.load.image(
      'background',
      `https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/${this.config.skin}/${this.config.assets.background.image}`
    )

    this.config.items.forEach((item) => {
      this.load.image(
        item.id,
        `https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/${this.config.skin}/${item.image}`
      )
    })

    this.config.platforms.forEach((platform) => {
      this.load.image(
        platform.id,
        `https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/${this.config.skin}/${platform.image}`
      )
    })

    this.load.image(
      'platform',
      `https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/${this.config.skin}/${this.config.assets.platform.image}`
    )

    this.load.image(
      'player-idle',
      `https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/${this.config.skin}/${this.config.assets.player.textures.idle.image}`
    )

    this.load.image(
      'player-left',
      `https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/${this.config.skin}/${this.config.assets.player.textures.left.image}`
    )

    this.load.image(
      'player-right',
      `https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/${this.config.skin}/${this.config.assets.player.textures.right.image}`
    )

    this.load.image(
      'health',
      `https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/${this.config.skin}/${this.config.assets.health.image}`
    )

    this.load.image(
      'score',
      `https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/${this.config.skin}/${this.config.assets.score.image}`
    )

    this.load.image(
      'coconut',
      'https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/default/jp-coconut.png'
    )

    this.load.image(
      'control',
      `https://s3.eu-west-3.amazonaws.com/cadeaudelamaison.com/jetpack/skins/${this.config.skin}/${this.config.assets.controls.left.image}`
    )
  }

  create() {
    this.background = new Background(this)
    this.background.create()
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

    // this.time.addEvent({
    //   delay: 10000,
    //   callback: () => {
    //     // Create a sprite that falls down from the top of the screen. When the player collides with the sprite, the player's health decreases.
    //     const x = Phaser.Math.Between(this.scale.width * 0.2, this.scale.width * 0.8)
    //     const y = this.cameras.main.scrollY - 100
    //     const coconut = this.physics.add.sprite(x, y, 'coconut')
    //     coconut.setBounce(0.5)
    //     coconut.setCollideWorldBounds(true)
    //     coconut.body.gravity.y = 500
    //     coconut.body.setSize(50, 50)
    //     this.physics.add.overlap(coconut, this.player?.player!, () => {
    //       this.health?.decreaseHealth()
    //       coconut.destroy()
    //     })
    //   },
    //   callbackScope: this,
    //   loop: true
    // })

    this.debugGraphics = this.add.graphics()
  }

  update() {
    this.grid?.update()
    this.player?.update()
    this.platformManager?.update()
    this.itemsManager?.update()
    this.controls?.update()
    this.background?.update()
  }

  public kill() {
    this.scene.stop()
    setTimeout(() => {
      this.scene.restart()
    }, 1000)
  }
}
