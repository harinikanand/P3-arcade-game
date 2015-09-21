
// width and height hold the width and height of the game rendering
// on the canvas
var width = 430;
var height = 430;

// variables to hold new calculated position (x and y) of the player
// prior to rendering (prior to actually making the move)
// These are used to check against the boundaries and are only used
// if the new position is with in the boundaries
var newX = 0;
var newY = 0;

// Default position of player is stored in MIDDLEX and HEIGHT
var MIDDLEX = 200;
var HEIGHT = 430;

// variable to control game animation
var requestanimation = true;

// variable to hold game status
var gamewon = false;

// Enemies our player must avoid
// Enemy class
/**
* @descriptor holds properties of an enemy
* @constructor
* @param {integer} number - Number of the enemy
*/
var Enemy = function(number) {
    // Variables applied to each of our instances go here,

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Assign a number to the enemy
    this.enemy_number = number;

    // Assign starting coordinates to the enemy
    // Each enemy starts at the left most end (x)
    // on the stones (starting at 100 units)(y)
    // Each enemy is placed 75 units from each.
    this.x = 0;
    this.y = 100 + (number-1) * 75;

    // Each enemy is assigned a random speed between 1 and 4
    // 4 - fast speed
    // 1 - slowest speed
    this.speed = Math.floor((Math.random() * 4) + 1);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // During each update, the position of each enemy (x) is
    // updated by 60 * speed * dt
    this.x = this.x + 60 * this.speed * dt;

    // If the new position (x) is outside the game
    // reset the position to the left most edge
    if (this.x > width)
       this.x = 0;

    // To check if the position of the enemy collides
    // with current position of the player
    // Obtain the position coordinates of the player
    var playerLocation = player.getPlayerLocation();
    var playerX = playerLocation[0];
    var playerY = playerLocation[1];

    // Check if the position of the enemy is within 30 units
    // of the player on all sides
    // If yes, that means collision of player and enemy - reset the game
    // by resetting the player's position to default position
    if ((this.x >= (playerX-30)) &&
        (this.x <= (playerX+30)) &&
        (this.y >= (playerY-30)) &&
        (this.y <= (playerY+30))) {
        player.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now instantiate your objects
// Place all enemy objects in an array called allEnemies
// allEnemies is an array 
// Create 3 elements in that array
// one for each enemy
var allEnemies = [];
var count = 3;
for (var i=1; i <= count ; ++i) {
    allEnemies.push(new Enemy(i));
}

// Player Class
/**
* @descriptor holds player's properties
* @constructor
* @param No parameters
*/
var Player = function() {
    // The image/sprite for the player, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-pink-girl.png';

    //Default position is in the middle of the canvas (X)
    //at the bottom (Y)
    this.x = MIDDLEX;
    this.y = HEIGHT;

    //Save the current position to newX and newY
    //HandleInput function only changes newX and newY
    //The purpose of these variables to hold possible 
    //new position; Player will not use values in newX
    //and newY if they are outside boundaries
    newX = this.x;
    newY = this.y;
};

// Handle the four inputs of the keyEvent
// Depending on the move, the player is moved 
// left, up, right or down by 25 units
Player.prototype.handleInput = function(key) {
     if (key === 'left') {
        newX = this.x - 25;
     } else if (key === 'up') {
        newY = this.y - 25;
     } else if (key === 'right') {
        newX = this.x + 25;
     } else if (key === 'down') {
        newY = this.y + 25;
     }
};

// Updates the player's position
// It uses the newX and newY (the calculated positions based on keyInput)
// to determine if the new position is still within the boundaries of the
// rendering. 
// If the height indicates the player has reached the banks of the water
// the player is declared to have won
Player.prototype.update = function() {
 
      // Check if newX is within left and right edges of the game
      if (newX != this.x && newX >= 0 && newX <= width) {
         this.x = newX;
      }

      // Check if newY is within top and bottom edges of the game
      if (newY != this.y && newY >= 0 && newY <= height) {
         this.y = newY;
         // Player is within top and bottom edge
         // Now check if player is at the water edge
         // If yes, declare player has won
         if (newY - 5 <= 0) {
            ctx.font = "20pt sans-serif";
            ctx.fillStyle = "red";
            ctx.fillText("PLAYER WON!!", 300, this.y+40);
            gamewon = true; //Setting gamewon to true causes animation to stop
        }
      }
};

// getPlayerLocation returns the current position of the player
Player.prototype.getPlayerLocation = function() {
      return [this.x, this.y];
};

// Updates the position of the player on the canvas
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Resets the position  of the player
// to the default position which is in the middle of the canvas (X)
//at the bottom (Y)
Player.prototype.reset = function() {
      newX= MIDDLEX;
      newY = HEIGHT;
};

// Now instantiate your objects
// Place the player object in a variable called player
var player = new Player(); 

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//This function shows a timeout value on top of the game
//When the GAME_TIMEOUT is reached, then the game stops
//Invoked by init in engine.js
function enableTimeout (timerfunc)
{
    var GAME_TIMEOUT = 120001; // 2 mins
    var initial_time = Date.now();
    var internalCallback = function(){
        return function() {
                var current_time = Date.now();
                //Determine the number of milliseconds that elapsed
                //and check against GAME_TIMEOUT
                //If not reached GAME_TIMEOUT, invoke this function
                //again in 10 milliseconds
                var time_lapsed = current_time - initial_time;
                if ((time_lapsed <= GAME_TIMEOUT) && (!gamewon)) {
                  window.setTimeout(internalCallback, 10);
                } else {
                  //GAME_TIMEOUT is reached
                  //stop animation and show message about how to play again
                  requestanimation = false;
                  ctx.font = "15pt sans-serif";
                  ctx.fillStyle = "blue";
                  ctx.fillText("To play again, reset the page",5, 600);
                }
                timerfunc(time_lapsed);
        };
    }();
    window.setTimeout(internalCallback, 10);
}
 
// Function to show the time elapsed
// This is shown at the top of the game
// Invoked by enableTimeout
function timerfunc(time_lapsed) {
    ctx.clearRect(0,0,300,300);
    ctx.font = "10pt sans-serif";
    ctx.fillStyle = "blue";
    time_lapsed = Math.floor(time_lapsed/1000);
    if (time_lapsed < 60) {
      ctx.fillText("Time Elapsed (out of 2 mins): "+ time_lapsed + " secs", 10, 50);
    } else if (time_lapsed < 120) {
      ctx.fillText("Time Elapsed (out of 2 mins): 1 min "+ (time_lapsed - 60)+" secs", 10, 50);
    } else {
      ctx.fillText("Time Elapsed (out of 2 mins): 2 mins ", 10, 50);
    }
}

// variable that keeps track of number of gems gathered by player 
var count_gems_gathered = 0;

// Gem Class
/**
* @descriptor Class to hold a Gem properties
* @constructor
* @param No parameters
*/
var Gem = function() {
    // The image/sprite for each Gem, this uses
    // a helper we've provided to easily load images

    //Assign a number which identified the gem
    //one of the 7 gems is randomly picked,
    //It is possible to pick the same gem multiple times
    //in which case, fewer gems are shown on the screen
    //due to duplicates
    this.number = Math.floor(Math.random() * 7 + 1);
    //this.number = number;

    //Default value whether this gem should be rendered
    //Later, when player gets within 40 positions of the Gem
    //the player gets the gem and it is not shown on the screen
    //anymore
    this.show = false;

    //Based on the number randomly picked, the x and y positions
    //are assigned. show is set to true so that the gem is shown
    //on the screen.
    if (this.number === 1) {
        this.sprite = 'images/Gem-Blue-modified.png';
        this.x = 275;
        this.y = 415;
        this.show = true;
    } else if (this.number == 2) {
        this.sprite = 'images/Gem-Green-modified.png';
        this.x = 340;
        this.y = 410;
        this.show = true;
    } else if (this.number == 3) {
        this.sprite = 'images/Gem-Orange-modified.png';
        this.x = 100;
        this.y = 390;
        this.show = true;
    } else if (this.number == 4) {
        this.sprite = 'images/Heart-modified.png';
        this.x = 80;
        this.y = 410;
        this.show = true;
    } else if (this.number == 5) {
        this.sprite = 'images/Key-modified.png';
        this.x = 275;
    	this.y = 380;
        this.show = true;
    } else if (this.number == 6) {
        this.sprite = 'images/Rock-modified.png';
        this.x = 355;
        this.y = 390;
        this.show = true;
    } else if (this.number == 7) {
        this.sprite = 'images/Star-modified.png';
        this.x = 425;
        this.y = 400;
        this.show = true;
    }

};

// Update function for Gem
// checks if the player has stepped on the Gem
// if yes, the Gem is given to the player and is not shown anymore
Gem.prototype.update = function() {
    // Obtain the position coordinates of the player
    var playerLocation = player.getPlayerLocation();
    var playerX = playerLocation[0];
    var playerY = playerLocation[1];

    // Check if the position of the player is within 40 units
    // of the Gem on all sides
    // If yes, that means player stepped on a Gem
    // The Gem is not shown anymore
    if ((playerX >= (this.x-40)) &&
        (playerX <= (this.x+40)) &&
        (playerY >= (this.y-40)) &&
        (playerY <= (this.y+40))) {
           //Check if the Gem is currently being shown
           if (this.show) {
                //If so, show is turned to false
                //Also, update the gems collected count
                //This is only done once for a gem number
                //Below logic also implements the gem is only counted once
                //as random number assigned above can result in duplicates
                this.show = false;
                ctx.font = "12pt sans-serif";
                ctx.fillStyle = "white";
                ctx.fillText("Gems gathered: "+ count_gems_gathered,370,600);
               var found = false;
                for (var i=0; i <= gemcount-1; ++i) {
                    if (this.number === gems_collected[i])
                        found = true;
                }
                if (!found) {
                   gems_collected.push(this.number);
                   count_gems_gathered++;
                }
                ctx.font = "12pt sans-serif";
                ctx.fillStyle = "green";
                ctx.fillText("Gems gathered: "+ count_gems_gathered,370,600);
           }
        }
};

// Draw the enemy on the screen, required method for game
Gem.prototype.render = function() {
    //Only show the gem if show is set to true
    if (this.show) {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};


// Now instantiate your objects
// Place all Gem objects in an array called allGems
// allGems is an array 
// Create 7 elements in that array
// one for each enemy
var allGems = [];
var gemcount = 7;
for (var i=1; i <= gemcount ; ++i) {
    allGems.push(new Gem());
}

// This array is used to store the numbers of the gems(this.number)
// the player has gotten within 40 units
var gems_collected = [];