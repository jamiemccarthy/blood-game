var state = new Kiwi.State('state');

state.preload = function(){
  Kiwi.State.prototype.preload.call(this);
  this.addImage('background', 'img/bg.svg');
  this.addImage("character", "img/character.svg");
  this.addImage("bloodDrop", "img/blood.svg");
}

state.create = function(){
  Kiwi.State.prototype.create.call(this);
  this.background = new Kiwi.GameObjects.StaticImage(this, this.textures.background, 0, 0);
  this.character = new Kiwi.GameObjects.StaticImage(this, this.textures.character, 0, 0);
  this.addChild( this.background );
  this.addChild( this.character );

  this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
  this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
  this.upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);

  this.character.animation.add( "moveright", [ 2, 3, 4, 5, 6, 7 ], 0.1, true );
  this.character.animation.add( "moveleft", [ 15, 14, 13, 12, 11, 10 ], 0.1, true );

  this.facing = "right";

}

state.update = function(){
  Kiwi.State.prototype.update.call(this);
};

var gameOptions = {
  width: 1000,
  height: 800
};

var game = new Kiwi.Game("game-container", 'Load Texture', state, gameOptions);

game.states.addState(state, true);
game.states.switchState( "state" );