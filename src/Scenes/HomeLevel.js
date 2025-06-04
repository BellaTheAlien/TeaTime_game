class HomeLevel extends Phaser.Scene {
    constructor(){
        super("homeScene");
    }

    init(){
        this.TILESIZE = 16;
        this.SCALE = 3.0;
        this.TILEWIDTH = 48;
        this.TILEHEIGHT = 25;

        this.SPEED = 3;
    }

    //preload for animated tiles
    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
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
        this.openDoor = this.map.createLayer("Open-door", this.tileset, 0, 0);
        this.roof_doorsLayers = this.map.createLayer("Roof-n-Doors", this.tileset, 0, 0);


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
                return false;
            }
            return true;
        }
       

        //making the charater sprite
        my.sprite.rogueChar = this.physics.add.sprite(this.tileXtoWorld(3), this.tileYtoWorld(8), "rogue_char").setOrigin(0,0);

        //this.physics.world.setBounds(this.TILESIZE*this.SCALE, this.TILESIZE*this.SCALE, this.map.widthInPixels - this.SCALE, this.map.heightInPixels - this.SCALE);
        this.physics.world.setBounds(this.TILESIZE, this.TILESIZE, this.map.widthInPixels, this.map.heightInPixels);

        my.sprite.rogueChar.setCollideWorldBounds(true, 1, 1, true);

        //adding all the collision walls for each layer
        this.pathLayer.setCollisionByProperty({
            wall: true
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


        this.physics.add.collider(my.sprite.rogueChar, this.pathLayer, collisionProces);
        this.physics.add.collider(my.sprite.rogueChar, this.wallLayer, collisionProces);
        this.physics.add.collider(my.sprite.rogueChar, this.roof_doorsLayers, collisionProces);
        this.physics.add.collider(my.sprite.rogueChar, this.openDoor, collisionProces);



        //Phasher key inputs
        //the cursor keys
        cursors = this.input.keyboard.createCursorKeys();

        //camera logic
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        //this.cameras.main.setViewport(0, 0, 640, 1200);
        this.cameras.main.startFollow(my.sprite.rogueChar, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        //adding the event case logic, when the switch is flipped show the right tiles

        //closed door case
        /*
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
                return false;
            }
            return true;
        }
            */

        //logic for animated tiles
        this.animatedTiles.init(this.map);

    }

    update(){
        //the movment of the charater with cursor keys

        if(cursors.left.isDown){
            //my.sprite.rogueChar.x -= this.SPEED;
            my.sprite.rogueChar.body.setVelocityX(-this.SPEED * 40);
           // my.sprite.rogueChar.resetFlip();
        }

        else if(cursors.right.isDown) {
            //my.sprite.rogueChar.x += this.SPEED;
            my.sprite.rogueChar.body.setVelocityX(this.SPEED * 40);
            //my.sprite.rogueChar.serFlip(true, false);
        }

        else if(cursors.up.isDown) {
            //my.sprite.rogueChar.y -= this.SPEED;
            my.sprite.rogueChar.body.setVelocityY(-this.SPEED * 40);
        }
        else if(cursors.down.isDown) {
           // my.sprite.rogueChar.y += this.SPEED;
           my.sprite.rogueChar.body.setVelocityY(this.SPEED * 40);
        }
        else{
            my.sprite.rogueChar.setVelocityX(0);
            my.sprite.rogueChar.setVelocityY(0);

        }
    }

    tileXtoWorld(tileX) {
        return tileX * this.TILESIZE;
    }

    tileYtoWorld(tileY) {
        return tileY * this.TILESIZE;
    }
}