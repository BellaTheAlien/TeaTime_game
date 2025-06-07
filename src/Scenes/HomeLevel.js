class HomeLevel extends Phaser.Scene {
    constructor(){
        super("homeScene");
    }

    //preload for animated tiles
    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    init(data){
        this.TILESIZE = 16;
        this.SCALE = 3.0;
        this.TILEWIDTH = 48;
        this.TILEHEIGHT = 25;

        this.SPEED = 3;

        //the default spawn if there is not data, 
        // in cave scene the player spawns back infront of the cave door
        // default the player spawns infront of the house
        this.spawnX = data.spawnX ?? this.tileXtoWorld(3);
        this.spawnY = data.spawnY ?? this.tileYtoWorld(8);

        if(!my.fromCave){
            my.fromCave = false;
        }
    }

    create(){
        //crate a new tilemap game, 16x16, tiles are 48 width and 25 tall 
        this.map = this.add.tilemap("homeLevel", this.TILESIZE, this.TILESIZE, this.TILEHEIGHT, this.TILEWIDTH);

        //adding the tileset to the map
        this.tileset = this.map.addTilesetImage("roguelikeSheet_transparent", "tilemap");

        //the layeres in the tile map
        this.grassLayer = this.map.createLayer("Grass", this.tileset, 0, 0);
        this.pathLayer = this.map.createLayer("Path-n-Stuff", this.tileset, 0, 0);
        this.wallLayer = this.map.createLayer("Walls", this.tileset, 0, 0);
        this.switcherLayer = this.map.createLayer("switcher", this.tileset, 0, 0);
        this.openDoor = this.map.createLayer("Open-door", this.tileset, 0, 0);
        this.roof_doorsLayers = this.map.createLayer("Roof-n-Doors", this.tileset, 0, 0);


        //the walking audio
        this.walkingAudio = this.sound.add("walking", {
            volume: 0.2,
        });
        this.walkingAudio.stop();

        //the background audio
        this.backgroundMusic = this.sound.add("backgroundAudio", {
            volume: 0.1,
        });
        this.backgroundMusic.play();

        //switch audio vfx
        this.switchAudio = this.sound.add("switchAudio",{
            volume: 0.3,
            delay: 0.6,
            rate: 0.5
        });
        this.switchAudio.stop();

        //checking if the player has the cup and kettle
        //on campfire and collected everything restart level
        this.campfire = this.pathLayer.filterTiles((tile) => {
            if(tile.properties.endGame == "end"){
                return true;
            }
            else{
                return false;
            }
        });
        


        //adding the event case logic, when the switch is flipped show the right tiles

        //closed door case
        this.closedSwitchable = this.roof_doorsLayers.filterTiles((tile) => {
            if (tile.properties.switchable == "closed"){
                return true;
            }
            else{
                return false;
            }
        });

        for( let tile of this.closedSwitchable){
            tile.visible = true;
        }

        this.openSwitchable = this.openDoor.filterTiles((tile) => {
             if (tile.properties.switchable == "open"){
                return true;
            }
            else{
                return false;
            }
        });

        for( let tile of this.openSwitchable){
            tile.visible = false;
        }
        
        this.switchCollisionOngoing = false;

        let collisionProces = (obj1, obj2) => {
            //one way collisions
            if (obj2.properties.oneway){
                return false;
            }

            if(!obj2.visible){
                this.switchAudio.stop();
                return false;
            }

            // the switch handler - for left to right
            if (obj2.properties.switch && my.sprite.rogueChar.body.velocity.x > 0){
                obj2.index = 954;
                for(let tile of this.closedSwitchable){
                    tile.visible = true;
                }
                for(let tile of this.openSwitchable){
                    tile.visible = false;
                }
                this.switchAudio.play();
                return false;
            }

            //swirch from right to left
            if (obj2.properties.switch && my.sprite.rogueChar.body.velocity.x < 0){
                obj2.index = 955;
                for(let tile of this.closedSwitchable){
                    tile.visible = false;
                }
                for(let tile of this.openSwitchable){
                    tile.visible = true;
                }
                this.switchAudio.play();
                return false;
            }
            return true;
        }
       

        //making the charater sprite
        my.sprite.rogueChar = this.physics.add.sprite(this.spawnX, this.spawnY, "rogue_char").setOrigin(0,0);

        //this.physics.world.setBounds(this.TILESIZE*this.SCALE, this.TILESIZE*this.SCALE, this.map.widthInPixels - this.SCALE, this.map.heightInPixels - this.SCALE);
        this.physics.world.setBounds(this.TILESIZE, this.TILESIZE, this.map.widthInPixels, this.map.heightInPixels);

        my.sprite.rogueChar.setCollideWorldBounds(true, 1, 1, true);

        //adding all the collision walls for each layer
        this.pathLayer.setCollisionByProperty({
            wall: true,
        });
        this.wallLayer.setCollisionByProperty({
            wall: true
        });
        this.roof_doorsLayers.setCollisionByProperty({
            wall: true,
            switch: true
        });
        this.openDoor.setCollisionByProperty({
            switch: true
        });
        this.physics.add.overlap(my.sprite.rogueChar, this.switcherLayer, collisionProces);


        this.physics.add.collider(my.sprite.rogueChar, this.pathLayer, collisionProces);
        this.physics.add.collider(my.sprite.rogueChar, this.wallLayer, collisionProces);
        this.physics.add.collider(my.sprite.rogueChar, this.roof_doorsLayers, collisionProces);
        this.physics.add.collider(my.sprite.rogueChar, this.openDoor, collisionProces);
        this.physics.add.collider(my.sprite.rogueChar, this.switcherLayer, collisionProces);


        //Phasher key inputs
        //the cursor keys
        cursors = this.input.keyboard.createCursorKeys();


        //camera logic
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        //this.cameras.main.setViewport(0, 0, 640, 1200);
        this.cameras.main.startFollow(my.sprite.rogueChar, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        //the text logic - "lets make tea, I need my kettle and cup from my storage"

        let message;

        if(my.fromCave){
            message = "Time to make some tea\nI need my campfire";
            my.fromCave = false;
        }
        else{
            message = "Let's make tea.\nI need my things from my storage";
        }

        this.openText = this.add.text(
            my.sprite.rogueChar.x + 30,
            my.sprite.rogueChar.y,
            message,
            {
                font: "Comic Sans MS",
                fill: "#ffffff",
                backgroundColor: "#000000",
                padding: {x: 4, y: 2}
            }
        );
        this.openText.setAlpha(0);

        //fade in
        this.tweens.add({
            targets: this.openText,
            alpha: 1,
            duration: 1000,
            ease: 'Linear'
        });
        //fade out in 5 seconds
        this.time.delayedCall(5000, ()=> {
            this.tweens.add({
                targets: this.openText,
                alpha: 0,
                duration: 1000,
                ease: 'Linear',
                onComplete: () => {
                    this.openText.destroy();
                }
            });
        });

        //logic for animated tiles
        this.animatedTiles.init(this.map);

    }

    update(){

        this.checkPlayerAtDoor();
        this.checkEndGame();

        //the movment of the charater with cursor keys

        if(cursors.left.isDown){
            my.sprite.rogueChar.body.setVelocityX(-this.SPEED * 40);
           // the walking audio to play
           if(!this.walkingAudio.isPlaying){
            this.walkingAudio.play();
           }
        }

        else if(cursors.right.isDown) {
            my.sprite.rogueChar.body.setVelocityX(this.SPEED * 40);
            //walking audio
            if(!this.walkingAudio.isPlaying){
            this.walkingAudio.play();
           }
        }

        else if(cursors.up.isDown) {
            my.sprite.rogueChar.body.setVelocityY(-this.SPEED * 40);
            //walking audio
            if(!this.walkingAudio.isPlaying){
            this.walkingAudio.play();
           }
        }
        else if(cursors.down.isDown) {
           my.sprite.rogueChar.body.setVelocityY(this.SPEED * 40);
           //walking audio
           if(!this.walkingAudio.isPlaying){
            this.walkingAudio.play();
           }
        }
        else{
            my.sprite.rogueChar.setVelocityX(0);
            my.sprite.rogueChar.setVelocityY(0);
            this.walkingAudio.stop();

        }

        //making the text follow the player
        this.openText.setPosition(
            my.sprite.rogueChar.x + 30,
            my.sprite.rogueChar.y
        );
    }

    tileXtoWorld(tileX) {
        return tileX * this.TILESIZE;
    }

    tileYtoWorld(tileY) {
        return tileY * this.TILESIZE;
    }

    checkPlayerAtDoor() {
        if(!this.openSwitchable) return;

        for(let tile of this.openSwitchable){
            if (tile.visible){

                let tileWorldX = tile.pixelX;
                let tileWorldY = tile.pixelY;
                let tileWidth = this.map.tileWidth;
                let tileHight = this.map.tileHeight;

                let playerBounds = my.sprite.rogueChar.getBounds();

                let tileBounds = new Phaser.Geom.Rectangle(tileWorldX, tileWorldY, tileWidth, tileHight);

                if(Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, tileBounds)) {
                   this.scene.start('caveScene');
                   this.walkingAudio.stop();
                   this.backgroundMusic.stop();
                }
            }
        }
    }

    checkEndGame(){
        if(!this.campfire) return;
        for(let tile of this.campfire){
            let tileWorldX = tile.pixelX;
            let tileWorldY = tile.pixelY;
            let tileWidth = this.map.tileWidth;
            let tileHight = this.map.tileHeight;
            let playerBounds = my.sprite.rogueChar.getBounds();

            let tileBounds = new Phaser.Geom.Rectangle(tileWorldX, tileWorldY, tileWidth, tileHight);

            if(Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, tileBounds) && tile && my.inventory.kettle && my.inventory.cup) {
                   this.game.destroy(true);
                   window.location.reload();
                }
        }
    }

}