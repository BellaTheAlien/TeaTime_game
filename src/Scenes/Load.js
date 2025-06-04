class Load extends Phaser.Scene {
    constructor(){
        super("loadScene");
    }

    preload(){
        this.load.setPath("./assets/");

        //load in the charater sheet
        this.load.image("rogue_char", "purple_townie.png");

        //load in the tiles
        this.load.image("tilemap", "roguelikeSheet_transparent.png");
        this.load.tilemapTiledJSON("homeLevel", "homeLevel.tmj");

        //load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "roguelikeSheet_transparent.png",{
            frameWidth: 16,
            frameHeight: 16
        });
    }

    create(){
        this.scene.start('homeScene');
    }
}