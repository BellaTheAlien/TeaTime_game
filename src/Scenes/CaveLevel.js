class CaveLevel extends Phaser.Scene {
    constructor(){
        super("caveScene");
    }

    //preload for animated tiles
    preload() {
        //this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    init(){
        this.TILESIZE = 16;
        this.SCALE = 3.0;
        this.TILEWIDTH = 48;
        this.TILEHEIGHT = 25;

        this.SPEED = 3;
    }

    create(){
        //crate a new tilemap game, 16x16, tiles are 48 width and 25 tall 
        this.map = this.add.tilemap("caveLevel", this.TILESIZE, this.TILESIZE, this.TILEHEIGHT, this.TILEWIDTH);

        //adding the tileset to the map
        this.tileset = this.map.addTilesetImage("roguelikeSheet_transparent", "tilemap");

        //the layeres in the tile map
        this.walls_Ground = this.map.createLayer("Wall-n-Ground", this.tileset, 0, 0);

        //this.animatedTiles.init(this.map);

        //making the charater sprite
        my.sprite.rogueChar = this.physics.add.sprite(this.tileXtoWorld(3), this.tileYtoWorld(8), "rogue_char").setOrigin(0,0);

        //this.physics.world.setBounds(this.TILESIZE*this.SCALE, this.TILESIZE*this.SCALE, this.map.widthInPixels - this.SCALE, this.map.heightInPixels - this.SCALE);
        this.physics.world.setBounds(this.TILESIZE, this.TILESIZE, this.map.widthInPixels, this.map.heightInPixels);

        my.sprite.rogueChar.setCollideWorldBounds(true, 1, 1, true);

        this.walls_Ground.setCollisionByProperty({
            wall: true
        });

        this.physics.add.collider(my.sprite.rogueChar, this.walls_Ground);

        cursors = this.input.keyboard.createCursorKeys();

        //camera logic
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        //this.cameras.main.setViewport(0, 0, 640, 1200);
        this.cameras.main.startFollow(my.sprite.rogueChar, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

    }

    update(){

        //this.checkPlayerAtDoor();

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