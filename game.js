$(function(){
  document.body.addEventListener("keydown", moveCharacter);

  var randDropNum = Math.floor(Math.random() * (5000-1000+1)) + 1000;
  setInterval(dropBlood, randDropNum);
});

function moveCharacter(evt) {
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
}

function dropBlood() {
  var vial = $('#blood-vial-1').clone().removeAttr("id");
  vial.css({left: Math.floor(Math.random() * 101) + "vw"});
  $('.game-container').append(vial);
  

  setInterval(function() { vial.remove(); }, 10000);

  // somewhere between every .5 seconds and 2 seconds, drop a new vial of blood in a random area

}