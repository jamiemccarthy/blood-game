var game = new Phaser.Game(1000, 650, Phaser.AUTO, '');

game.state.add('pregame', pregameState);
game.state.add('play', playState);
game.state.add('end', endState);

game.state.start('pregame');
