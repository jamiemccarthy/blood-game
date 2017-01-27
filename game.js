$(function(){
  var canvas = $("#game"),
      ctx = canvas.getContext("2d"),
      canvasWidth = $("#game").width(),
      canvasHeight = $("#game").height();
  var currGame = new Game();
  var character = new GameCharacter();
  var 


});

function Game() {
  
}

function GameCharacter() {
  document.body.addEventListener("keydown", moveCharacter);
}

GameCharacter.prototype.youth = 100;

function GameObject() {
  var randDropNum = Math.floor(Math.random() * (5000-1000+1)) + 1000;
  setInterval(dropBlood, randDropNum);
}

function GameScore() {

}





GameCharacter.prototype.moveCharacter = function(evt) {
  var character = character || $('.character'),
      xVal = parseInt(character.css("left").replace("px", "")),
      gameContainerWidth = $('.game-container').width() - character.width(),
      moveIncrement = 20;

  switch (evt.keyCode) {
    case 37:
      xVal = xVal - moveIncrement;
      character.addClass('flip');
      break;
    case 39:
      xVal = xVal + moveIncrement;
      character.removeClass('flip');
      break;
  }

  if (xVal > gameContainerWidth) { xVal = gameContainerWidth; } 
  else if (xVal < 0) { xVal = 0; }

  character.css("left", xVal + "px");
};

GameObject.prototype.dropBlood = function() {
  var vial = $('#blood-vial-1').clone().removeAttr("id");
  vial.css({left: Math.floor(Math.random() * 101) + "vw"});
  $('.game-container').append(vial);
  
  setInterval(function() { vial.remove(); }, 10000);
};