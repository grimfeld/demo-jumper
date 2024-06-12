import './style.css'
import Phaser from 'phaser'
import { JumperScene, JumperSkinConfig } from './components/Scene.ts'

// const defaultConfig: JumperSkinConfig = {
//   skin: 'default',
//   items: [
//     {
//       id: 'health',
//       image: 'jp-heart.png',
//       effect: 'increaseHealth',
//       data: 1,
//       interval: 100,
//       cooldown: 5000,
//       probability: 10,
//       width: 30,
//       height: 30
//     },
//     {
//       id: 'coin',
//       image: 'jp-coin.png',
//       effect: 'incrementScore',
//       data: 10,
//       interval: 100,
//       cooldown: 5000,
//       probability: 10,
//       width: 30,
//       height: 30
//     }
//   ],
//   platforms: [
//     {
//       id: 'booster-platform',
//       image: 'jp-booster-platform.png',
//       interval: 100,
//       cooldown: 5000,
//       probability: 100,
//       requiredRows: 6,
//       requiredColumns: 3,
//       assetWidth: 2688,
//       assetHeight: 1536,
//       xOffset: 0,
//       yOffset: 500,
//       verticalOffset: 100,
//       bounciness: 1100,
//       effect: ''
//     },
//     {
//       id: 'danger-platform',
//       image: 'jp-danger-platform.png',
//       interval: 100,
//       cooldown: 5000,
//       probability: 100,
//       requiredRows: 4,
//       requiredColumns: 3,
//       assetWidth: 2688,
//       assetHeight: 1536,
//       xOffset: 0,
//       yOffset: 500,
//       verticalOffset: -50,
//       bounciness: 450,
//       effect: ''
//     }
//   ],
//   assets: {
//     platform: {
//       image: 'jp-platform-3.png',
//       assetWidth: 2304,
//       assetHeight: 850,
//       xOffset: 0,
//       yOffset: 200
//     },
//     player: {
//       textures: {
//         idle: {
//           image: 'jp-knight.png',
//           assetWidth: 1097,
//           assetHeight: 1562
//         },
//         left: {
//           image: 'jp-knight.png',
//           assetWidth: 1097,
//           assetHeight: 1562
//         },
//         right: {
//           image: 'jp-knight.png',
//           assetWidth: 1097,
//           assetHeight: 1562
//         }
//       }
//     }
//   }
// }

const configJO: JumperSkinConfig = {
  skin: 'jeux-olympiques-2024_666808984298ac193c8bd158',
  items: [
    {
      id: 'health-item',
      image: 'gmtvsy0.png',
      effect: 'increaseHealth',
      data: 1,
      interval: 100,
      cooldown: 5000,
      probability: 10,
      assetWidth: 78,
      assetHeight: 34
    },
    {
      id: 'gold-medal',
      image: 'ehzcxen.png',
      effect: 'incrementScore',
      data: 25,
      interval: 100,
      cooldown: 5000,
      probability: 10,
      assetWidth: 58,
      assetHeight: 58
    },
    {
      id: 'silver-medal',
      image: 'jp42de1.png',
      effect: 'incrementScore',
      data: 15,
      interval: 100,
      cooldown: 5000,
      probability: 10,
      assetWidth: 58,
      assetHeight: 58
    },
    {
      id: 'bronze-medal',
      image: 'kjlcahb.png',
      effect: 'incrementScore',
      data: 10,
      interval: 100,
      cooldown: 5000,
      probability: 10,
      assetWidth: 58,
      assetHeight: 58
    }
  ],
  platforms: [
    {
      id: 'booster-platform',
      image: 'lbeddps.png',
      interval: 100,
      cooldown: 5000,
      probability: 100,
      requiredRows: 6,
      requiredColumns: 3,
      assetWidth: 112,
      assetHeight: 34,
      xOffset: 0,
      yOffset: 0,
      verticalOffset: 100,
      bounciness: 1100,
      effect: ''
    }
  ],
  assets: {
    background: {
      image: 'jqu124x.png',
      assetWidth: 522,
      assetHeight: 5490
    },
    platform: {
      image: '6bs2k0j.png',
      assetWidth: 112,
      assetHeight: 13,
      xOffset: 0,
      yOffset: 0
    },
    player: {
      textures: {
        idle: {
          image: '6piegp1.png',
          assetWidth: 85,
          assetHeight: 125
        },
        left: { image: '3ffa9ev.png', assetWidth: 99, assetHeight: 122 },
        right: { image: 'e11s6bu.png', assetWidth: 99, assetHeight: 122 }
      }
    },
    health: {
      image: 'gmtvsy0.png',
      assetWidth: 78,
      assetHeight: 34
    },
    score: {
      image: 'ehzcxen.png',
      assetWidth: 58,
      assetHeight: 58
    },
    controls: {
      left: {
        image: 'znkiyyt.png',
        assetWidth: 150,
        assetHeight: 150,
        rotation: Math.PI
      },
      right: {
        image: 'znkiyyt.png',
        assetWidth: 150,
        assetHeight: 150,
        rotation: 0
      }
    }
  }
}

const baseScene = new JumperScene(configJO)

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container',
  scene: baseScene,
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
}

const game = new Phaser.Game(config)

window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight)
})
