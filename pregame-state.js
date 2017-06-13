var pregameState = {
  create: function() {
    var skey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    var titleGraphic = game.add.text(80,80, 'Become a young Peter Thiel', {font: "50px VT323", fill: "red"});
    var startGraphic = game.add.text(80,200, "Press 'S' to start", {font: "25px VT323", fill: "red"});
    
    skey.onDown.addOnce(this.start, this);
  },

  start: function() {
    game.state.start('play');
  }
}