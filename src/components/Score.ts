import { JumperScene } from './Scene'

export class Score {
  private scene: JumperScene
  private score: number
  private scoreText: Phaser.GameObjects.Text

  constructor(scene: JumperScene) {
    this.scene = scene
    this.score = 0
    this.scene.add
      .image(this.scene.cameras.main.width - 16, 16, 'score')
      .setDisplaySize(
        30,
        this.scene.config.assets.score.assetHeight /
          (this.scene.config.assets.score.assetWidth / 30)
      )
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(50)
    this.scoreText = this.scene.add
      .text(this.scene.cameras.main.width - 50, 16, '0', {
        fontSize: '32px',
        color: '#fff'
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(50)
  }

  public incrementScore(amount: number): void {
    this.score += amount
    this.scoreText.setText(`${this.score}`)
  }

  public decrementScore(amount: number): void {
    this.score -= amount
    this.scoreText.setText(`${this.score}`)
  }

  public getScore(): number {
    return this.score
  }
}
