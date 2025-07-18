//game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render:{
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 1200,
    height: 640,
    scene: [Load, HomeLevel, CaveLevel]
}

var cursors;
const SCALE = 2.0;
var my = {sprite: {}, text: {}, vfx: {}, inventory: {cup: false, kettle: false}, fromCave: false};

const game = new Phaser.Game(config);