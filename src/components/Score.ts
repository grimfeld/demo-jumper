export class Score {
  private scene: Phaser.Scene;
  private score: number;
  private scoreText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.score = 0;
    this.scene.add
      .image(this.scene.cameras.main.width - 16, 16, "coin")
      .setDisplaySize(30, 30)
      .setOrigin(1, 0)
      .setScrollFactor(0);
    this.scoreText = this.scene.add
      .text(this.scene.cameras.main.width - 50, 16, "0", {
        fontSize: "32px",
        color: "#fff",
      })
      .setOrigin(1, 0)
      .setScrollFactor(0);
  }

  public incrementScore(amount: number): void {
    this.score += amount;
    this.scoreText.setText(`${this.score}`);
  }

  public getScore(): number {
    return this.score;
  }
}
