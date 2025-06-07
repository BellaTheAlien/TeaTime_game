class CaveLevel extends Phaser.Scene {
    constructor(){
        super("caveScene");
    }

    //preload for animated tiles
    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    init(){
        this.TILESIZE = 16;
        this.SCALE = 3.0;
        this.TILEWIDTH = 48;
        this.TILEHEIGHT = 25;

        this.PARTICLE_VELOCITY = 50;

        this.SPEED = 3;
    }

    create(){
        //crate a new tilemap game, 16x16, tiles are 48 width and 25 tall 
        this.map = this.add.tilemap("caveLevel", this.TILESIZE, this.TILESIZE, this.TILEHEIGHT, this.TILEWIDTH);

        //adding the tileset to the map
        this.tileset = this.map.addTilesetImage("roguelikeSheet_transparent", "tilemap");

        //the layeres in the tile map
        this.walls_Ground = this.map.createLayer("Wall-n-Ground", this.tileset, 0, 0);
        this.doorLayer = this.map.createLayer("Doors", this.tileset, 0, 0);
        this.othersLayers = this.map.createLayer("Things", this.tileset, 0, 0);

        this.openDoor = this.doorLayer.filterTiles((tile) => {
             if (tile.properties.switchable == "open"){
                return true;
            }
            else{
                return false;
            }
        });

        this.animatedTiles.init(this.map);

        //making the charater sprite
        my.sprite.rogueChar = this.physics.add.sprite(this.tileXtoWorld(4), this.tileYtoWorld(3), "rogue_char").setOrigin(0,0);

        //this.physics.world.setBounds(this.TILESIZE*this.SCALE, this.TILESIZE*this.SCALE, this.map.widthInPixels - this.SCALE, this.map.heightInPixels - this.SCALE);
        this.physics.world.setBounds(this.TILESIZE, this.TILESIZE, this.map.widthInPixels, this.map.heightInPixels);

        my.sprite.rogueChar.setCollideWorldBounds(true, 1, 1, true);

        this.walls_Ground.setCollisionByProperty({
            wall: true
        });

        //collectables logic for the cup and kettle
        //because i only have one object for both cup and kettle,
        // the use of [0] will get the 
        this.cupPickup = this.map.createFromObjects("Items", {
            name: "cup",
            key: "tilemap_sheet",
            frame: 1023,
        })[0];
        this.kettlePickup = this.map.createFromObjects("Items", {
            name: "kettle",
            key: "tilemap_sheet",
            frame: 910
        })[0];

        this.physics.world.enable(this.cupPickup, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.kettlePickup, Phaser.Physics.Arcade.STATIC_BODY);

        //vfx for collection
        my.vfx.itemCollect = this.add.particles(0, 0, "kenny-particles", {
            frame: 'star_04.png',
            scale: {start: 0.03, end: 0.1},
            lifespan: 350,
            alpha: {start: 1, end: 0.1}
        });
        my.vfx.itemCollect.stop();

        //vfx for walking
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_06.png'],
            random: true,
            scale: {start: 0.03, end: 0.07},
            maxAliveParticles: 40,
            gravity: -100,
            alpha: {start: 1, end: 0.1}
        });
        my.vfx.walking.stop();


        this.physics.add.overlap(my.sprite.rogueChar, this.cupPickup, ()=> {
            //the vfx for the pick up
            my.vfx.itemCollect.explode(10, this.cupPickup.x, this.cupPickup.y);
            //the audio
            this.sound.play("collected", {
                volume: 0.5
            });
            this.cupPickup.destroy();
            my.inventory.cup = true;
        });
        this.physics.add.overlap(my.sprite.rogueChar, this.kettlePickup, ()=> {
            //vfx pick up logic
            my.vfx.itemCollect.explode(10, this.kettlePickup.x, this.kettlePickup.y);
            //the audio
            this.sound.play("collected", {
                volume: 0.5
            });
            this.kettlePickup.destroy();
            my.inventory.kettle = true;
        });


        this.physics.add.collider(my.sprite.rogueChar, this.walls_Ground);

        cursors = this.input.keyboard.createCursorKeys();

        //camera logic
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        //this.cameras.main.setViewport(0, 0, 640, 1200);
        this.cameras.main.startFollow(my.sprite.rogueChar, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        //the walking audio
        this.walkingAudio = this.sound.add("caveWalking", {
            volume: 0.2,
            //loop: true,
            delay: 1,
            rate: 0.5
        });
        this.walkingAudio.stop();
    }

    update(){

        this.checkPlayerAtDoor();

        //the movment of the charater with cursor keys

        if(cursors.left.isDown){
            my.sprite.rogueChar.body.setVelocityX(-this.SPEED * 40);

            //the walking vfx
            my.vfx.walking.start();
            my.vfx.walking.startFollow(my.sprite.rogueChar, my.sprite.rogueChar.displayWidth/2-10, my.sprite.rogueChar.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
           //walking audio
            if(!this.walkingAudio.isPlaying){
            this.walkingAudio.play();
           }
        }

        else if(cursors.right.isDown) {
            my.sprite.rogueChar.body.setVelocityX(this.SPEED * 40);
            //the walking vfx
            my.vfx.walking.start();
            my.vfx.walking.startFollow(my.sprite.rogueChar, my.sprite.rogueChar.displayWidth/2-10, my.sprite.rogueChar.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            //walking audio
            if(!this.walkingAudio.isPlaying){
            this.walkingAudio.play();
           }
        }

        else if(cursors.up.isDown) {
            my.sprite.rogueChar.body.setVelocityY(-this.SPEED * 40);
            //the walking vfx
            my.vfx.walking.start();
            my.vfx.walking.startFollow(my.sprite.rogueChar, my.sprite.rogueChar.displayWidth/2-10, my.sprite.rogueChar.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            //walking audio
            if(!this.walkingAudio.isPlaying){
            this.walkingAudio.play();
           }
        }
        else if(cursors.down.isDown) {
           my.sprite.rogueChar.body.setVelocityY(this.SPEED * 40);
           //the walking vfx
           my.vfx.walking.start();
            my.vfx.walking.startFollow(my.sprite.rogueChar, my.sprite.rogueChar.displayWidth/2-10, my.sprite.rogueChar.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
           //walking audio
            if(!this.walkingAudio.isPlaying){
            this.walkingAudio.play();
           }
        }
        else{
            my.sprite.rogueChar.setVelocityX(0);
            my.sprite.rogueChar.setVelocityY(0);
            //stoping the audio
            this.walkingAudio.stop();
            //stoping the vfx
            my.vfx.walking.stop();

        }
    }

    tileXtoWorld(tileX) {
        return tileX * this.TILESIZE;
    }

    tileYtoWorld(tileY) {
        return tileY * this.TILESIZE;
    }

    checkPlayerAtDoor() {
        if(!my.inventory.cup || !my.inventory.kettle) return;

        for(let tile of this.openDoor){
            if (tile.visible){

                let tileWorldX = tile.pixelX;
                let tileWorldY = tile.pixelY;
                let tileWidth = this.map.tileWidth;
                let tileHight = this.map.tileHeight;

                let playerBounds = my.sprite.rogueChar.getBounds();

                let tileBounds = new Phaser.Geom.Rectangle(tileWorldX, tileWorldY, tileWidth, tileHight);

                if(Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, tileBounds)) {
                    my.fromCave = true;
                   this.scene.start('homeScene', {
                    spawnX: this.tileXtoWorld(42),
                    spawnY: this.tileYtoWorld(20)
                   });
                }
            }
        }
    }

}