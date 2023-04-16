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
        this.input.keyboard.on('keyup-ESC', () => {
            this.scene.switch('GameScene');
        }, this);
        /*this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        }, this);
        this.input.once('pointerdown', () => {
            this.scene.start('GameScene');

        });*/
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
    }

    create () {
        //  Set the camera and physics bounds to be the size of 4x4 bg images
        this.cameras.main.setBounds(-Const.gameWidth/2, -Const.gameHeight/2, Const.gameWidth * 1, Const.gameHeight * 1);
        this.physics.world.setBounds(-Const.gameWidth/2, -Const.gameHeight/2, Const.gameWidth * 1, Const.gameHeight * 1);

        //TODO this.sound.play('music', { loop: true, delay: 2 });
        var bg_1=this.add.tileSprite(0,0, 0, 0, 'bg'); //this.add.image(400, 300, 'bg');
        //g_1.setTileScale(1,1);  //can only be <1?
        this.scene.launch('UIScene'); //run UI as parallel scene

        for (let i = 0; i < 64; i++)  {
            const x = Phaser.Math.Between(-Const.gameWidth/2+20, Const.gameWidth/2-20);
            const y = Phaser.Math.Between(-Const.gameHeight/2+20, Const.gameHeight/2-20);
            const box = this.add.image(x, y, 'star');
            //  Make them all input enabled
            box.setInteractive();
        }
        let platforms = this.physics.add.staticGroup();
        platforms.create(40, 140, 'ground').setScale(2).refreshBody();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.player = this.physics.add.sprite(0, 0, 'dude');
        //this.player.setBounce(0.2);
        this.player.body.setGravityY(300)
        this.player.setCollideWorldBounds(true); //disallow to leave world bounds
        this.physics.add.collider(this.player, platforms);
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
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) { //jump
            this.player.setVelocityY(-330);
        }
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
