var title,
    subtitle,
    playButton,
    arrowKeys,
    bloodVials,
    goals,
    music;

var pregameState = {
  preload: function() {
    game.load.image('background', 'img/start_screen/bg.png');
    game.load.image('title', 'img/start_screen/title.png');
    game.load.image('subtitle', 'img/start_screen/subtitle.png');
    game.load.spritesheet('playButton', 'img/start_screen/play_button_spritesheet.png', 189, 67);
    game.load.image('arrowKeys', 'img/start_screen/arrow_keys.png');
    game.load.image('bloodVials', 'img/start_screen/blood_vials.png');
    game.load.image('goals', 'img/start_screen/goal_explanation.png');
    game.load.audio('introMusic', 'audio/intro_music.mp3');
  },

  create: function() {
    game.add.sprite(0, 0, 'background');
    title = game.add.sprite(game.world.centerX - 260, 60, 'title');
    subtitle = game.add.sprite(game.world.centerX - 402, 215, 'subtitle');
    playButton = game.add.button(game.world.centerX - 95, 315, 'playButton', this.startGame, this, 1, 0, 2);
    bloodVials = game.add.sprite(0, 450, 'bloodVials');
    arrowKeys = game.add.sprite(380, 470, 'arrowKeys');
    goals = game.add.sprite(680, 455, 'goals');
    playButton.animations.add('blink', [0, 1], 2, true);

    // Set to 0 so these elements are hidden initially
    title.alpha = 0;
    subtitle.alpha = 0;

    // Set the animations
    game.add.tween(title).to( {alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);
    setTimeout(function() {
      game.add.tween(subtitle).to( {alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
    }, 300);
    playButton.animations.play('blink');

    // Add music
    music = game.add.audio('introMusic', 0.3, true);
    music.play();
  },

  startGame: function() {
    music.stop();
    game.state.start('play');
  }
}
