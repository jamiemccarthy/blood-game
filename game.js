var game = new Phaser.Game(1000, 650, Phaser.AUTO, '');

// add states but hold off on turning on pregame state for now so it isnt hell to develop
// game.state.add('pregame', pregameState);
game.state.add('play', playState);
game.state.add('end', endState);
//change this to pregame later
game.state.start('play');
