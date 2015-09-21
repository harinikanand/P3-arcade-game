
Author: Harini

Date: 9/20/2015

Title: Arcade Frogger Game

Description: In this game you have a Player and Enemies (Bugs). The goal of the player is to reach the water, without colliding into any one of the enemies. The player can move left, right, up and down. The enemies move in varying speeds on the paved block portion of the scene. Once a the player collides with an enemy, the game is reset and the player moves back to the start square. Once the player reaches the water the game is won.

I have also implemented collectible gems and timed games.

For collectible gems, I implemented a Gem class and modified engine.js file (updateentities and renderentities functions and also added additional resources at line 181).
I also resized the gems png files to smaller files so that they show up better in the game rendering.

For timed game, I implemented 2 functions timerfunc and enableTimeout and also modified engine.js (init function to involed enableTimeout). I referred to http://stackoverflow.com/questions/1280263/changing-the-interval-of-setinterval-while-its-running for ideas on this implementation.

I also modified engine.js to check requestanimation flag. 
setting this flag to false causes the animation to stop. This flag is set to false when the
timeout is reached and also when the player wins.

I changed the player image file to char-pink-girl.png in the player class constructor.
To support this, I changed engine.js resources at lne 181.

Steps to run the application:

git clone the arcade game repo

In the folder P3-arcade-game, there should be 3 folders css, images and js
and two files index.html and README.md

In the folder P3-arcade-game, double click on the file index.html
This will bring up the arcade game.
There will be 3 enemies (bugs) scrolling at different speeds (sometimes, the speed can be same for all 3 enemies depending on the random value used) from left to right.
There will be a girl at the bottom in the middle.
The game is to move the girl to the water without colliding with the bugs.
On the grass, there will be gems to collect.
The player can be moved up, down, left and right using the arrow keys on the key board.


Note:
For  gem collection, my implementation was to remove the gem (award it to the player) when the player is within 40 units (box) from all sides of a gem. This is to determine the proximity of the player. However, there is some issue where sometimes the player coordinates obtained seem to be not correct. I noticed this where the player is right on top of or under a gem but their coordinates show vast difference (more than 100 units at times). I am not sure how to resolve this issue.
