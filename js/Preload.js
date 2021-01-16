var WorldHardest = WorldHardest || {};
 
//loading the game assets
WorldHardest.Preload = function(){};
 
WorldHardest.Preload.prototype = {
  preload: function() {
   //show logo in loading screen
   this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.splash.anchor.setTo(0.5);
 
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
 
    this.load.setPreloadSprite(this.preloadBar);
 
   //load game assets
	this.load.image('wall', 'img/WallTile.png');
	this.load.image('candy', 'img/candy.png');
	this.load.spritesheet('ghost', 'img/ghostsheet.png', 64, 64);
	this.load.spritesheet('evilGhost1', 'img/evilghost1.png', 64, 64);
    this.load.spritesheet('evilGhost2', 'img/evilghost2.png', 64, 64);
	this.load.audio('collect', 'sound/collect_candy.mp3');
	

  },
  create: function() {
   console.log("preload");
   this.state.start('MainMenu');
  }
};