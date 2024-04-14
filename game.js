var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;
var difficulty = 'easy'; // Default to easy

// Start the game with button click
$("#easy, #hard").click(function() {
    difficulty = this.id; // 'easy' or 'hard'
    $("#menu").hide(); // Hide the menu
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
});

// Handle button click
$(".btn").click(function() {
    if (!started) return;
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
});

// Modify nextSequence to account for difficulty
function nextSequence() {
    disableButtons(); // Disable buttons during sequence playback
    userClickedPattern = [];
    level++;
    $("#level-title").text("Level " + level);

    if (difficulty === 'easy' && gamePattern.length > 0) {
        // In Easy mode, blink all previous sequences first
        blinkSequence(gamePattern.slice()); // Pass a copy of the gamePattern
    } else {
        // Hard mode or first sequence
        addRandomColor();
    }
}

function blinkSequence(sequence) {
    if (sequence.length > 0) {
        var color = sequence.shift();
        $("#" + color).fadeOut(200).fadeIn(200, function() {
            playSound(color); // Play sound for each color during sequence
            blinkSequence(sequence);
        });
    } else {
        addRandomColor(); // Add new color after all blinks
        enableButtons(); // Enable buttons after sequence is done
    }
}

function addRandomColor() {
    var randomChosenColour = buttonColours[Math.floor(Math.random() * buttonColours.length)];
    gamePattern.push(randomChosenColour);
    $("#" + randomChosenColour).fadeOut(200).fadeIn(200);
    setTimeout(function() {
        $(".btn").removeClass("disabled"); // Enable buttons after animation
        enableButtons();
    }, 400);
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    playSound(currentColor); // Play the sound associated with the button
    setTimeout(function() {
        $("#" + currentColor).removeClass("pressed");
    }, 200);
}

function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length){
            setTimeout(function () {
                nextSequence();
            }, 1000);
        }
    } else {
        playSound("wrong"); // Play wrong sound if the user is incorrect
        $("body").addClass("game-over");
        $("#level-title").text("Game Over, Refresh the page to Restart");
        disableButtons(); // Disable further input after game over

        setTimeout(function () {
            $("body").removeClass("game-over");
            startOver();
        }, 2000);
    }
}

function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
}

function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function disableButtons() {
    $(".btn").css("pointer-events", "none");
}

function enableButtons() {
    $(".btn").css("pointer-events", "auto");
}

