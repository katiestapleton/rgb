var numSquares = 6;
var colors = [];
var pickedColor;
var squares = document.querySelectorAll(".square");
var colorDisplay = document.getElementById("colorDisplay");
var messageDisplay = document.querySelector("#message");
var h1 = document.querySelector("h1");
var resetButton = document.querySelector("#reset");
var modeButtons = document.querySelectorAll(".mode");
var score = 0; 
var scoreDisplay = document.querySelector("#scoreDisplay"); 
var resetPressed = true; 


init();

/* initiate game
 * set up buttons and squares
 * fetch, set, and store score. Alter score as game process
 */
function init(){
	setupModeButtons();
	setupSquares();
	var lsScore = localStorage.getItem('score');
	if( lsScore !== null ){
		score = lsScore; 
		scoreDisplay.textContent = score;
	}
	else {
		localStorage.setItem('score', score); 
	}
	reset();
}

/* setup mode buttons
 * turn rounded-end square images into buttons
 * if the square is selected, it is removed from display.
 * user can select the difficulty level of game and restart
 */
function setupModeButtons(){
	for(var i = 0; i < modeButtons.length; i++){
		modeButtons[i].addEventListener("click", function(){
			modeButtons[0].classList.remove("selected");
			modeButtons[1].classList.remove("selected");
			this.classList.add("selected");
			this.textContent === "Easy" ? numSquares = 3: numSquares = 6;
			reset();
		});
	}
}

/* set up squares
 * assign action that will execute the function
 * when square is clicked on, compares current square color with winning color
 * if colors match, display "correct", increase score and ask to play again
 * if incorrect, display try again, reduce score, store score locally
 */
function setupSquares(){
	for(var i = 0; i < squares.length; i++){
	//add click listeners to squares
		squares[i].addEventListener("click", function(){
			//grab color of clicked square
			var clickedColor = this.style.background;
			//compare color to pickedColor
			if(clickedColor === pickedColor){ 
				updateColorName();
				//console.log(colorName);
				messageDisplay.textContent = "Correct!";
				resetButton.textContent = "Play Again?"
				changeColors(clickedColor);
				h1.style.background = clickedColor;
				if(resetPressed){
					score+=5; 
					resetPressed = false;
				}
				scoreDisplay.textContent = score;
				localStorage.setItem('score', score);
			} else {
				this.style.background = "#232323";
				messageDisplay.textContent = "Try Again"
				score--;
				scoreDisplay.textContent = score; 
				localStorage.setItem('score', score);
			}
		});
	}
}

/* udpate color name = updates color name in the head/top of display
 * check the website for the color name
 * if the color name is an exact match, it display the color name
 * if the color name is not an exact match, it display the color name with an -ish
 */
async function updateColorName(){
	const regex = /\([^\)]+\)/g; 
	var rgbColors = pickedColor.match(regex); 
	const url = "https://www.thecolorapi.com/id?rgb="+rgbColors[0];
	var requestOptions = {
	  method: 'GET',
	  redirect: 'follow'
	};

	let result = await fetch(url, requestOptions); 
	let colorData = await result.json(); 

	if(colorData.name.exact_match_name) {
		colorDisplay.textContent = colorData.name.value; 
	}
	else {
		colorDisplay.textContent = colorData.name.value + "-ish"; 
	}
}

/* reset the colors for the squares if reset pressed
 * use the generate random colors function to produce different colors equal to the number of squares
 * reset the current colors with the newly generated colors
 * for all squares, display the block with its new color
 */
function reset(){
	resetPressed = true;
	colors = generateRandomColors(numSquares);
	//pick a new random color from array
	pickedColor = pickColor();
	//change colorDisplay to match picked Color
	colorDisplay.textContent = pickedColor;
	resetButton.textContent = "New Colors"
	messageDisplay.textContent = "";
	//change colors of squares
	for(var i = 0; i < squares.length; i++){
		if(colors[i]){
			squares[i].style.display = "block"
			squares[i].style.background = colors[i];
		} else {
			squares[i].style.display = "none";
		}
	}
	h1.style.background = "steelblue";
}


resetButton.addEventListener("click", function(){
	reset();
})

/* change colors for all squares
 * using a for loop, change the color of the square at index i until all squares have been changed
 */
function changeColors(color){
	//loop through all squares
	for(var i = 0; i < squares.length; i++){
		//change each color to match given color
		squares[i].style.background = color;
	}
}

/* generate a random index number for the colors array
 * assign randomly selected color to the random variable
 * the "random" variable is assigned to the index for the color array
 */ 
function pickColor(){
	var random = Math.floor(Math.random() * colors.length);
	return colors[random];
}

//

/* assign random colors to an array.
 * creates an empty array to hold a set of random colors
 * using "for" loop to add to colors into array
 * generates the colors to add by using the randomcolor function 
 * returns arrays*/
function generateRandomColors(num){
	//make an array
	var arr = []
	//repeat num times
	for(var i = 0; i < num; i++){
		//get random color and push into arr
		arr.push(randomColor())
	}
	//return that array
	return arr;
}

/* generate random color through randomizing RGB numbers
 * generate a number from 0-255 for each color
 * assignment number as value to corresponding RBG variable 
 * return as RGB set when called
 */
function randomColor(){
	//pick a "red" from 0 - 255
	var r = Math.floor(Math.random() * 256);
	//pick a "green" from  0 -255
	var g = Math.floor(Math.random() * 256);
	//pick a "blue" from  0 -255
	var b = Math.floor(Math.random() * 256);
	return "rgb(" + r + ", " + g + ", " + b + ")";
}