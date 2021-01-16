WorldHardest.MainMenu = function(){};
 
WorldHardest.MainMenu.prototype = {
  create: function() {
	  console.log("Main Menu");
   //show the space tile, repeated
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'wall');
    
    //give it speed in x
    //this.background.autoScroll(-20, 0);
 
    //start game text
    var text = "Tap to begin";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width/2, this.game.height/2, text, style);
    t.anchor.set(0.5);

  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('Game');
    }
  }
};