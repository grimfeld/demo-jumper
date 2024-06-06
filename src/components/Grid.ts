import { JumperScene } from './Scene'

interface Tile {
  id: string
  free: boolean
  x: number
  y: number
  center: { x: number; y: number }
}

export class Grid {
  private scene: JumperScene
  grid: Tile[][] = []
  private tileSize: number = 50
  graphics: Phaser.GameObjects.Graphics | undefined

  constructor(scene: JumperScene) {
    this.scene = scene
    this.graphics = this.scene.add.graphics()
  }

  createGrid() {
    const screenWidth = this.scene.scale.width
    const screenHeight = this.scene.scale.height

    const rows = Math.ceil(screenHeight / this.tileSize) + 10 // Extra rows for off-screen
    const cols = Math.ceil(screenWidth / this.tileSize)

    for (let i = 0; i < rows; i++) {
      this.grid[i] = []
      for (let j = 0; j < cols; j++) {
        const x = j * this.tileSize
        const y = i * this.tileSize
        this.grid[i][j] = {
          id: `${i}-${j}`,
          free: true,
          x: x,
          y: y,
          center: {
            x: x + this.tileSize / 2,
            y: y + this.tileSize / 2
          }
        }
      }
    }
  }

  create() {
    this.createGrid()
  }

  update() {
    this.handleVerticalScroll()
    // this.drawGrid();
  }

  handleVerticalScroll() {
    const scrollY = this.scene.cameras.main.scrollY
    const screenHeight = this.scene.scale.height
    const topRow = this.grid[0]
    const bottomRow = this.grid.pop()
    if (!bottomRow) return
    if (bottomRow[0].y > scrollY + screenHeight) {
      bottomRow.forEach((tile) => {
        tile.free = true
        tile.y = topRow[0].y - this.tileSize
        tile.center.y = tile.y + this.tileSize / 2
      })
      this.grid.unshift(bottomRow)
    } else {
      this.grid.push(bottomRow)
    }
  }

  drawGrid() {
    if (!this.graphics) return
    this.graphics.clear() // Clear previous drawings

    this.grid.forEach((row) => {
      // Add row index to each row as text on the left of the screen
      // this.scene.add.text(0, row[0].y, `${row[0].id}`, {
      //   color: "red",
      //   fontSize: "16px",
      // });
      row.forEach((tile) => {
        this.graphics?.lineStyle(1, 0xff0000, 0.2)
        this.graphics?.strokeRect(tile.x, tile.y, this.tileSize, this.tileSize)

        if (!tile.free) {
          this.graphics?.fillStyle(0xff0000, 0.1)
          this.graphics?.fillRect(tile.x, tile.y, this.tileSize, this.tileSize)
        }
      })
    })
  }

  isSpotEmpty(
    startRow: number,
    startCol: number,
    rowsNeeded: number,
    colsNeeded: number,
    onEmptyRow?: boolean
  ): boolean {
    for (let row = startRow; row < startRow + rowsNeeded; row++) {
      if (onEmptyRow) {
        const isRowEmpty = this.grid[row]?.every((tile) => tile.free)
        if (!isRowEmpty) {
          return false
        }
      }
      for (let col = startCol; col < startCol + colsNeeded; col++) {
        if (!this.grid[row] || !this.grid[row][col] || !this.grid[row][col].free) {
          return false
        }
      }
    }
    return true
  }

  markSpotAsOccupied(startRow: number, startCol: number, rowsNeeded: number, colsNeeded: number) {
    for (let row = startRow; row < startRow + rowsNeeded; row++) {
      for (let col = startCol; col < startCol + colsNeeded; col++) {
        this.grid[row][col].free = false
      }
    }
  }

  getEmptySpot(
    rowsNeeded: number,
    colsNeeded: number,
    minY: number = 0
  ): { x: number; y: number } | null {
    const emptySpots: { row: number; col: number }[] = []

    for (let row = 0; row <= this.grid.length - rowsNeeded; row++) {
      for (let col = 0; col <= this.grid[0].length - colsNeeded; col++) {
        if (this.isSpotEmpty(row, col, rowsNeeded, colsNeeded) && this.grid[row][col].y <= minY) {
          emptySpots.push({ row, col })
        }
      }
    }

    if (emptySpots.length === 0) {
      return null
    }

    const randomSpot = Phaser.Math.RND.pick(emptySpots)
    this.markSpotAsOccupied(randomSpot.row, randomSpot.col, rowsNeeded, colsNeeded)

    return {
      x: this.grid[randomSpot.row][randomSpot.col].x + (this.tileSize * colsNeeded) / 2,
      y: this.grid[randomSpot.row][randomSpot.col].y + (this.tileSize * rowsNeeded) / 2
    }
  }

  findNearestEmptySpot(
    startX: number,
    startY: number,
    rowsNeeded: number,
    colsNeeded: number,
    onEmptyRow?: boolean
  ): { x: number; y: number } | null {
    // Get the startRow and startCol based on the startX and startY and the grid
    const startRow = this.grid?.findIndex(
      (row) => row[0].y <= startY && row[0].y + this.tileSize >= startY
    )
    const startCol = this.grid[startRow]?.findIndex(
      (tile) => tile.x <= startX && tile.x + this.tileSize >= startX
    )

    if (this.isSpotEmpty(startRow, startCol, rowsNeeded, colsNeeded, onEmptyRow)) {
      this.markSpotAsOccupied(startRow, startCol, rowsNeeded, colsNeeded)
      return {
        x: this.grid[startRow][startCol].x + (this.tileSize * colsNeeded) / 2,
        y: this.grid[startRow][startCol].y + (this.tileSize * rowsNeeded) / 2
      }
    }

    // Search radius in terms of number of tiles
    const maxRadius = Math.max(this.grid.length, this.grid[0].length)

    for (let radius = 1; radius < maxRadius; radius++) {
      for (let row = startRow - radius; row <= startRow + radius; row++) {
        for (let col = startCol - radius; col <= startCol + radius; col++) {
          if (row >= 0 && row < this.grid.length && col >= 0 && col < this.grid[0].length) {
            if (this.isSpotEmpty(row, col, rowsNeeded, colsNeeded, onEmptyRow)) {
              this.markSpotAsOccupied(row, col, rowsNeeded, colsNeeded)
              return {
                x: this.grid[row][col].x + (this.tileSize * colsNeeded) / 2,
                y: this.grid[row][col].y + (this.tileSize * rowsNeeded) / 2
              }
            }
          }
        }
      }
    }

    return null
  }
}
