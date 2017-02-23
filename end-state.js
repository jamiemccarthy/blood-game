var endState = {
  create: function() {
    var skey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    var startGraphic = game.add.text(80,200, "Press 'S' to restart", {font: "25px VT323", fill: "red"});
    skey.onDown.addOnce(this.restart, this);
  },

  restart: function() {
    game.state.start('play');
  }
}