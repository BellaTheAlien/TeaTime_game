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

        //vxf audio
        this.load.audio("walking", "footstep_grass_004.ogg");
        this.load.audio("caveWalking", "footstep_concrete_000.ogg");
        this.load.audio("collected", "jingles_PIZZI09.ogg");
        this.load.audio("switchAudio", "impactMetal_heavy_001.ogg");

        //background audio
        //downloaded from free audio
        //https://freesound.org/people/Sonic-ranger/sounds/234350/
        this.load.audio("backgroundAudio", "234350__sonic-ranger__cuckoo-tophill-low-nature-reserve-6am-easter-sunday-2014.wav");
    }

    create(){
        this.scene.start('homeScene');
    }
}