"use strict";
import {Const as Const} from './const.js';
import {UIScene as UIScene} from './UI.js';
class PreLoader extends Phaser.Scene {
    constructor (){
        super({ key: 'PreLoader' });
    }
    preload(){
        //display loading...
        this.loadText = this.add.text(512, 360, 'Loading ...', { fontFamily: 'Arial', fontSize: 74, color: '#e3f2ed' });
        this.loadText.setOrigin(0.5);
        this.loadText.setStroke('#203c5b', 6);
        this.loadText.setShadow(2, 2, '#2d2d2d', 4, true, false);

        //  Audio ...
        this.load.setPath('assets/sounds/');
        //TODO this.load.audio('music', [ 'sci_fi_platformer02.ogg']);
    }
    create(){
        if (this.sound.locked){ //Mobile devices require sounds to be triggered from an explicit user action, such as a tap, before any sound can be loaded/played on a web page.
            this.loadText.setText('Click to Start');
            this.input.once('pointerdown', () => {
                this.scene.start('GameScene');
            });
        } else {
            this.scene.start('GameScene');
        }
    }
}
class MainMenu extends Phaser.Scene {
    constructor (){
        super({ key: 'MainMenu' });
    }
    preload(){
        
        this.loadText = this.add.text(512, 360, 'Main-Menu', { fontFamily: 'Arial', fontSize: 74, color: '#e3f2ed' });
        this.loadText.setOrigin(0.5);
        this.loadText.setStroke('#203c5b', 6);
        this.loadText.setShadow(2, 2, '#2d2d2d', 4, true, false);
    }
    create(){
        this.input.keyboard.on('keyup-ESC', () => {this.scene.switch('GameScene');}, this);
        /*this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        }, this);
        this.input.once('pointerdown', () => {
            this.scene.start('GameScene');

        });*/
    }
}
class Player extends Phaser.Physics.Arcade.Sprite{//Phaser.GameObjects.Sprite {
    constructor (scene,x,y) {
        super(scene,x, y, 'hero');
        this.scene=scene;
        scene.physics.add.existing(this);
        scene.physics.world.enable(this);
        //this=scene.physics.add.sprite(x, y, 'dude');
        this.onLadder = false;
        this.setScale(2); //scale sprite & bounding box
        this.body.setSize(2*10, 2*20);
        this.body.setOffset(this.body.offset.x+2*-2, this.body.offset.y+2*-1);
        //this.body.setBounce(0.2);
        this.body.setGravityY(300)
        this.anims.play('idle'); //bounding box is calculated by constructor but we can change graphics here
        this.addToDisplayList() //TODO why is this not automatically added
    }
    update(){
        super.update();
        if (this.scene.cursors.left.isDown) {
            this.setVelocityX(-160);
            this.flipX = true;
            this.anims.play('right', true);
        }else if (this.scene.cursors.right.isDown) {
            this.setVelocityX(160);
            this.flipX = false;
            this.anims.play('right', true);
        } else {
            this.setVelocityX(0);
            this.anims.play('idle');
        }

        if (this.scene.cursors.up.isDown && (this.body.blocked.down || this.body.touching.down)) { //tiles are chedked with blocked while other bodys cause touching??
            this.setVelocityY(-330);
        }
        if (this.onLadder) {
            this.body.gravity.y = 0;
        } else {
            this.body.gravity.y = 300;
        }
            this.onLadder = false;
    }

}

class GameScene extends Phaser.Scene
{
    constructor () {
        super({ key: 'GameScene' });
    }

    preload ()
    {
        this.load.image('bg', 'assets/environment/gradient1.png');
        this.load.image('ground', 'assets/environment/platform.png');
        this.load.image('star', 'assets/sprites/star.png');
        this.load.image('block', 'assets/sprites/crate.png');
        this.load.spritesheet('dude', 'assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('hero', 'assets/Warrior/SpriteSheet/Warrior_SheetnoEffect.png', { frameWidth: 69, frameHeight: 44 });

        this.load.image('kenny_platformer_64x64', 'assets/atlas/kenny_platformer_64x64.png');
        this.load.tilemapTiledJSON('multiple-layers-map', 'assets/maps/multiple-layers.json');//'assets/maps/tileset-collision-property-v12.json');

        this.load.atlas('atlas', 'assets/Warrior/export/texture.png', 'assets/Warrior/export/texture.json');
    }
    setupAnims(){
        var a=0,b=0;
        if(false){//dude
            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'idle',
                frames: [ { key: 'dude', frame: 4 } ],
                frameRate: 20
            });
            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
        } else
        {//hero
            a=0,b=6;
            this.anims.create({
                key: 'idle',
                frames: this.anims.generateFrameNumbers('hero', { start: a, end: b }),
                frameRate: 10,
                repeat: -1
            });
            a=a+b,b=a+8;
            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('hero', { start: a, end: b }),
                frameRate: 10,
                repeat: -1
            });
            a=a+b,b=a+12;
            this.anims.create({
                key: 'attack1',
                frames: this.anims.generateFrameNumbers('hero', { start: a, end: b }),
                frameRate: 10,
                repeat: -1
            });
            a=a+b,b=a+11;
            this.anims.create({
                key: 'death',
                frames: this.anims.generateFrameNumbers('hero', { start: a, end: b }),
                frameRate: 10,
                repeat: -1
            });
            a=a+b,b=a+4;
            this.anims.create({
                key: 'hurt',
                frames: this.anims.generateFrameNumbers('hero', { start: a, end: b }),
                frameRate: 10,
                repeat: -1
            });
            a=a+b,b=a+3;
            this.anims.create({
                key: 'jump',
                frames: this.anims.generateFrameNumbers('hero', { start: a, end: b }),
                frameRate: 10,
                repeat: -1
            });
            a=a+b,b=a+2;//uptofall
            a=a+b,b=a+3;
            this.anims.create({
                key: 'fall',
                frames: this.anims.generateFrameNumbers('hero', { start: a, end: b }),
                frameRate: 10,
                repeat: -1
            });
            a=a+b,b=a+5;
            this.anims.create({
                key: 'edgegrab',
                frames: this.anims.generateFrameNumbers('hero', { start: a, end: b }),
                frameRate: 10,
                repeat: -1
            });
            a=a+b,b=a+6;
            this.anims.create({
                key: 'edgegrabidle',
                frames: this.anims.generateFrameNumbers('hero', { start: a, end: b }),
                frameRate: 10,
                repeat: -1
            });
            a=a+b,b=a+3;
            this.anims.create({
                key: 'wallslide',
                frames: this.anims.generateFrameNumbers('hero', { start: a, end: b }),
                frameRate: 10,
                repeat: -1
            });
            a=a+b,b=a+6;
            this.anims.create({
                key: 'crouch',
                frames: this.anims.generateFrameNumbers('hero', { start: a, end: b }),
                frameRate: 10,
                repeat: -1
            });
            a=a+b,b=a+7;
            this.anims.create({
                key: 'dash',
                frames: this.anims.generateFrameNumbers('hero', { start: a, end: b }),
                frameRate: 10,
                repeat: -1
            });
            a=a+b,b=a+10;
            this.anims.create({
                key: 'attack3',
                frames: this.anims.generateFrameNumbers('hero', { start: a, end: b }),
                frameRate: 10,
                repeat: -1
            });
            a=a+b,b=a+5;
            this.anims.create({
                key: 'slide',
                frames: this.anims.generateFrameNumbers('hero', { start: a, end: b }),
                frameRate: 10,
                repeat: -1
            });
            a=a+b,b=a+8;
            this.anims.create({
                key: 'ladder',
                frames: this.anims.generateFrameNumbers('hero', { start: a, end: b }),
                frameRate: 10,
                repeat: -1
            });
        }
    }
    create () {
        this.cursors = this.input.keyboard.createCursorKeys();
        //  Set the camera and physics bounds to be the size of 4x4 bg images
        this.cameras.main.setBounds(-Const.gameWidth/2, -Const.gameHeight/2, Const.gameWidth * 1, Const.gameHeight * 1);
        this.physics.world.setBounds(-Const.gameWidth/2, -Const.gameHeight/2, Const.gameWidth * 1, Const.gameHeight * 1);

        //TODO this.sound.play('music', { loop: true, delay: 2 });
        var bg_1=this.add.tileSprite(0,0, 0, 0, 'bg'); //this.add.image(400, 300, 'bg');
        //g_1.setTileScale(1,1);  //can only be <1?
        this.scene.launch('UIScene'); //run UI as parallel scene

        /*for (let i = 0; i < 64; i++)  {
            const x = Phaser.Math.Between(-Const.gameWidth/2+20, Const.gameWidth/2-20);
            const y = Phaser.Math.Between(-Const.gameHeight/2+20, Const.gameHeight/2-20);
            const box = this.add.image(x, y, 'star');
            //  Make them all input enabled
            box.setInteractive();
        }*/
        this.map = this.make.tilemap({ key: 'multiple-layers-map' });
        const tiles = this.map.addTilesetImage('kenny_platformer_64x64');
        var offsetX=64*-8,offsetY=64*-8;
        this.rockLayer = this.map.createLayer('Rock Layer', tiles,offsetX,offsetY);
        this.waterLayer = this.map.createLayer('Water Layer', tiles,offsetX,offsetY);
        this.platformLayer = this.map.createLayer('Platform Layer', tiles,offsetX,offsetY);
        this.stuffLayer = this.map.createLayer('Stuff Layer', tiles, offsetX,offsetY);
        this.platformLayer.setCollisionByProperty({ collides: true }); //collides property has to be set for tile
        this.rockLayer.setCollisionByProperty({ collides: true }); //

        //create a platform from code
        let platforms = this.physics.add.staticGroup();
        platforms.create(40, 240, 'ground').setScale(2).refreshBody();
        let stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: -Const.gameWidth/2+20, y: -Const.gameHeight/2-20, stepX: 70 }
        });
        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        
        this.setupAnims();
        const t1 = this.textures.addSpriteSheetFromAtlas(
            'region_',
            {
                atlas: 'atlas',
                frame: 'region_0',
                frameWidth: 69,
                frameHeight: 44,
                endFrame: 5
            });
        //this.anims.create({key: 'explode1',
        //    frames: this.anims.generateFrameNumbers('region_', { start: 0, end: 5}),
        //    frameRate: 10,
        //    repeat: -1
        //});
        this.anims.create({
            key: 'explode1',
            frameRate: 10,repeat: -1,
            frames: this.anims.generateFrameNames('atlas', {
              prefix: 'region_',
              start:0,end: 100
              //,zeroPad: 4
            })
          });
        //this.anims.add('explode1', Phaser.Animation.generateFrameNames('region_', 1, 4, '', 0), 10, true);
        this.add.sprite(0, 0).play('explode1');


        this.player = new Player(this,0,0); //this.physics.add.sprite(0, 0, 'dude');// 
        this.physics.add.collider(stars, [platforms,this.platformLayer,this.rockLayer]);
        this.player.setCollideWorldBounds(true); //disallow to leave world bounds
        this.physics.add.collider(this.player, [platforms,this.platformLayer,this.rockLayer]);
        this.physics.add.overlap(this.player, stars, this.collectStar, null, this);
        this.cameras.main.startFollow(this.player, true);

        const combo2 = this.input.keyboard.createCombo('TZU',{resetOnMatch:true}); //triggers when keys are pressed in order - usable for combos?
        this.input.keyboard.on('keycombomatch', event => {
            debugger
            console.log('Key Combo matched!'+event.keyCodes);
        });
        let spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        spaceKey.on('up', ()=> {
            // event.stopPropagation();     //disable propagation to other scenes
            // event.stopImmediatePropagation();    //disable propagation to other, more global handlers in this scene
            this.scene.switch('MainMenu');
        });
        /*this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.switch('MainMenu');
        }, this);*/
        this.input.on('gameobjectup', this.clickHandler, this);
        
    }

    update(){
        this.player.update();
        //this.player.setVelocity(0);  dont zero Y or gravity will not work
        /* if not using gravity....
        if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-300);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.setVelocityY(300);
        }*/
    }
    collectStar (player, star) {
        this.events.emit('addScore');
        star.disableBody(true, true);
    }
    clickHandler (pointer, box)
    {
        //  Disable our box
        box.input.enabled = false;
        box.setVisible(false);

        //  Dispatch a Scene event
        this.events.emit('addScore');
    }
}

export { PreLoader,GameScene,MainMenu };
