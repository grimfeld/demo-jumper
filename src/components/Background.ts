import { JumperScene } from './Scene'

export class Background {
  scene: JumperScene
  background: Phaser.GameObjects.TileSprite | Phaser.GameObjects.Image | undefined
  constructor(scene: JumperScene) {
    this.scene = scene
  }

  create() {
    if (this.scene.config.assets.background.isLooping) {
      this.background = this.scene.add
        .tileSprite(0, 0, this.scene.scale.width, this.scene.scale.height, 'background')
        .setSize(
          this.scene.config.assets.background.assetWidth,
          this.scene.config.assets.background.assetHeight
        )
        .setOrigin(0, 0)
        .setDisplaySize(
          this.scene.cameras.main.width,
          this.scene.config.assets.background.assetHeight /
            (this.scene.config.assets.background.assetWidth / this.scene.cameras.main.width)
        )
    } else {
      this.background = this.scene.add
        .image(0, 0, 'background')
        .setSize(
          this.scene.config.assets.background.assetWidth,
          this.scene.config.assets.background.assetHeight
        )
        .setOrigin(0, 0)
        .setDisplaySize(
          this.scene.config.assets.background.assetWidth /
            (this.scene.config.assets.background.assetHeight / this.scene.cameras.main.height),
          this.scene.cameras.main.height
        )
        .setScrollFactor(0)
    }
  }

  update() {
    if (this.background && this.scene.config.assets.background.isScrolling) {
      // @ts-ignore
      this.background.tilePositionY = this.scene.cameras.main.scrollY * 0.5
      this.background.y = this.scene.cameras.main.scrollY
    }
  }
}
