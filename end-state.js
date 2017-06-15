var title;

var endState = {
  preload: function() {
    game.load.spritesheet('title', 'img/end_screen/game_over_spritesheet.png', 528, 275);
    game.load.image('background', 'img/end_screen/bg.png');
  },

  create: function() {
    var rkey = game.input.keyboard.addKey(Phaser.Keyboard.R);
    game.add.sprite(0, 0, 'background');
    title = game.add.sprite(game.world.centerX - 263, 100, 'title');
    game.add.text(game.world.centerX - 95, 450, "press 'r' to restart", {font: "25px VT323", fill: "white"});
    title.animations.add('blink', [0, 1], 2, true);
    title.animations.play('blink');

    rkey.onDown.addOnce(this.restart, this);
  },

  restart: function() {
    game.state.start('play');
  }
}
