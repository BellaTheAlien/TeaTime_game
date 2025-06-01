class HomeLevel extends Phaser.Scene {
    constructor(){
        super("homeScene");
    }

    init(){

    }

    create(){
        //crate a new tilemap game, 16x16, tiles are 48 width and 25 tall 
        this.map = this.add.tilemap("homeLevel", 16, 16, 48, 25);

        //adding the tileset to the map
        this.tileset = this.map.addTilesetImage("roguelikeSheet_transparent", "tilemap");

        //the layeres in the tile map
        this.grassLayer = this.map.createLayer("Grass", this.tileset, 0, 0);
        this.pathLayer = this.map.createLayer("Path-n-Stuff", this.tileset, 0, 0);
        this.wallLayer = this.map.createLayer("Walls", this.tileset, 0, 0);
        this.roof_doorsLayers = this.map.createLayer("Roof-n-Doors", this.tileset, 0, 0);

        this.pathLayer.setCollisionByProperty({
            wall: true
        });
    }

    update(){
        
    }
}