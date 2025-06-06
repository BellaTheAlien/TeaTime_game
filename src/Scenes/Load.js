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
        this.load.tilemapTiledJSON("caveLevel", "caveLevel.tmj");

        //load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "roguelikeSheet_transparent.png",{
            frameWidth: 16,
            frameHeight: 16,
            spacing: 1
        });

        //vfx particals
        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        this.load.audio("walking", "footstep_grass_004.ogg");
        this.load.audio("caveWalking", "footstep_concrete_000.ogg");
        this.load.audio("collected", "jingles_PIZZI09.ogg");
    }

    create(){
        this.scene.start('homeScene');
    }
}