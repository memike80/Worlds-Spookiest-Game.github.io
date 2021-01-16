var WorldHardest = WorldHardest || {};

var totalCandyCollected;
var totalCandyNeededToCollect;

var speed;

var leftBtn;
var rightBtn;
var upBtn;
var downBtn;

// Ghost 1 properties (default wandering ghosts)
const GHOST1_COUNT = 80;
const GHOST1_SPEED_MIN = 50;
const GHOST1_SPEED_MAX = 150;

// Ghost 2 properties (chasing ghosts)
const GHOST2_COUNT = 10;
const GHOST2_SPEED = 100;

const SPAWN_PROTECTION_SIZE = 500;
const HITBOX_WIDTH = 25;
const HITBOX_HEIGHT = 45;
const CANDY_HITBOX = 10;
 
//title screen
WorldHardest.Game = function(){};
 
WorldHardest.Game.prototype = {
    create: function() {
        console.log("Game Create Func");
        //set world dimensions
        this.game.world.setBounds(0, 0, 1920, 1920);

        //background
        this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'wall');

        //create player
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ghost');
        this.player.scale.setTo(1);
        this.player.animations.add('moveRight', [0, 1, 2], 5, true);
        this.player.animations.add('moveLeft', [3, 4, 5], 5, true);
        this.player.animations.play('moveLeft');

        //Set speed
        speed = 3;

        //Set initial totalCandyCollected to 0
        this.totalCandyCollected = 0;
        this.totalCandyNeededToCollect = 10;

        //enable player physics
        this.game.physics.arcade.enable(this.player);
        this.playerSpeed = 120;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(HITBOX_WIDTH, HITBOX_HEIGHT);

        //Tell camera to follow player
        this.game.camera.follow(this.player);

        //generate elements
        this.SpawnCandy();
        this.SpawnEnemies();        //Call method that generates enemies here

        //Display score
        this.DisplayScore();

		//Add audio
		this.collectCandySound = this.game.add.audio('collect');

        //Capture keys so they do not affect the browser page
        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR
        ]);
        },
    update: function() {
        //Player movement
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {      //Left
            this.player.body.x -= speed;
            this.player.animations.play('moveLeft');
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {    //Right
            this.player.body.x += speed;
            this.player.animations.play('moveRight');
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {       //Up
            this.player.body.y -= speed;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {     //Down
            this.player.body.y += speed;
        }
        
        // Moving Ghost2's toward player
        this.enemies.children.forEach(enemy => {
            if(enemy.key == 'evilGhost2') {
                
                let xDiff = enemy.body.x - this.player.body.x;
                let yDiff = enemy.body.y - this.player.body.y;
                let xMult = (Math.abs(xDiff) > Math.abs(yDiff)) ? 1 : xDiff/yDiff;
                let yMult = (Math.abs(yDiff) > Math.abs(xDiff)) ? 1 : yDiff/xDiff;
                
                if(xMult == 1 && xDiff > 0) {
                    xMult *= -1;
                    yMult *= -1;
                }
                
                else if(yMult == 1 && yDiff > 0) {
                    xMult *= -1;
                    yMult *= -1;
                }
                                
                let xVel = xMult*GHOST2_SPEED;
                let yVel = yMult*GHOST2_SPEED;
                
                enemy.body.velocity.x = xVel;
                enemy.body.velocity.y = yVel;

            }
        });

        //Collision between player and candy
        WorldHardest.game.physics.arcade.overlap(this.player, this.candy, this.CollectCandy, null, this);

        //Collision between player and enemy
        WorldHardest.game.physics.arcade.collide(this.player, this.enemies, this.KillPlayer, null, this);

        //Win condition
        if(this.totalCandyCollected == 10) {
            this.game.state.start('GameOverWin');
        }
    },
    SpawnCandy: function() {
        this.candy = WorldHardest.game.add.group(); //create group of candy
        this.candy.enableBody = true;
        this.candy.physicsBodyType = Phaser.Physics.ARCADE;
        console.log("Spawn Candy");
        for (var i = 0; i < this.totalCandyNeededToCollect; i++) {
            console.log("Spawning candy piece " + i.toString());
            var candyPiece = this.candy.create(WorldHardest.game.world.randomX, WorldHardest.game.world.randomY, 'candy');
            candyPiece.scale.setTo(0.1);
            candyPiece.body.setSize(CANDY_HITBOX, CANDY_HITBOX);
        }
    },
    SpawnEnemies: function() {
        //Create group of enemies
        this.enemies = WorldHardest.game.add.group();

        //Enable physics for enemies
        this.enemies.enableBody = true;

        var enemy;
        
        // Spawning Ghost1's - aimlessly wandering ghosts
        for( var i = 0; i < GHOST1_COUNT; i++) {
            
            // Prevent enemy spawning inside spawn protection zone
            let x = this.game.world.randomX;
            let y = this.game.world.randomY;
            let wH = this.game.world.width/2;
            let hH = this.game.world.height/2;
            let SPR = SPAWN_PROTECTION_SIZE/2;
            
            if(x > wH-SPR && x < wH+SPR && y > hH-SPR && y < hH+SPR)
                x += SPAWN_PROTECTION_SIZE;
            
            // Create new enemy
            enemy = this.enemies.create(x, y, 'evilGhost1');
            enemy.animations.add('move', [0, 1, 2], 5, true);
            enemy.animations.play('move');

            //physics properties
            let xVel = this.game.rnd.integerInRange(GHOST1_SPEED_MIN,
                                                    GHOST1_SPEED_MAX)
                       * ((this.game.rnd.integerInRange(0,1) == 1)
                       ? 1 : -1);
            let yVel = this.game.rnd.integerInRange(GHOST1_SPEED_MIN,
                                                    GHOST1_SPEED_MAX)
                       * ((this.game.rnd.integerInRange(0,1) == 1)
                       ? 1 : -1);
            enemy.body.velocity.x = xVel;
            enemy.body.velocity.y = yVel;
            enemy.body.immovable = true;
            enemy.body.collideWorldBounds = true;
            enemy.body.bounce.set(1);
            enemy.body.setSize(HITBOX_WIDTH, HITBOX_HEIGHT);
        }
        
        // Spawning Ghost2's - ghosts that chase the player
        for( var i = 0; i < GHOST2_COUNT; i++) {
            
            // Prevent enemy spawning inside spawn protection zone
            let x = this.game.world.randomX;
            let y = this.game.world.randomY;
            let wH = this.game.world.width/2;
            let hH = this.game.world.height/2;
            let SPR = SPAWN_PROTECTION_SIZE/2;
            
            if(x > wH-SPR && x < wH+SPR && y > hH-SPR && y < hH+SPR)
                x += SPAWN_PROTECTION_SIZE;
            
            // Create new enemy
            enemy = this.enemies.create(x, y, 'evilGhost2');
            enemy.animations.add('move', [0, 1, 2], 5, true);
            enemy.animations.play('move');

            //physics properties
            enemy.body.immovable = true;
            enemy.body.collideWorldBounds = true;
            enemy.body.bounce.set(1);
            enemy.body.setSize(HITBOX_WIDTH, HITBOX_HEIGHT);
        }
    },
    KillPlayer: function() {
        this.player.kill();
        this.game.state.start('GameOver');
    },
    CollectCandy: function(player, candyPiece) {
        console.log("Collecting candy");
        candyPiece.kill();
		    this.collectCandySound.play();

        this.totalCandyCollected++;
        this.scoreLabel.text = "Candies: " + this.totalCandyCollected
                               + " / " + this.totalCandyNeededToCollect;
	},
	DisplayScore: function() {
        var text = "0 / " + this.totalCandyNeededToCollect;
        var style = { font: "30px Arial", fill: "#fff", align: "center" };
        this.scoreLabel = this.game.add.text((this.game.width/2)-100, 20, "Candies: " + text, style);
        this.scoreLabel.fixedToCamera = true;
	}
};
