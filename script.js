// Run script after DOM has loaded
document.addEventListener('DOMContentLoaded', function() {

// Store submit button in a variable for easy reference
let optionsButton = document.getElementById("options_submit");

// Capture input value to determine board size and color and set up the board
optionsButton.addEventListener("click", function(){

// If play button is clicked, change to reset
optionsButton.innerHTML = "Reset";

// If button is reset, change button background and color
optionsButton.style.backgroundColor = 'red';
optionsButton.style.color = 'white';

// These functions will come in handy
function isEven(value){
    if (value % 2 == 0) {
       	return true;
    } else {
        return false;
	};
};

function isOdd(value){
	if (value % 1 == 0) {
		return true;
	} else {
		return false;
	};
};

function allSame(array) {
   
    let first = array[0];

    if (array[0] == "") {
    	return false;
    } else {
    	return array.every(function(element) {
        	return element == first;
    	});
    };
};

// Set board size according to input value parsed to integer
let boardSize = parseInt(document.getElementById("boardsize_input").value);

// Create variable game board (empty array)
let gameBoard = [];

// create variable numSquares, which is gameboard size squared
let numSquares = (boardSize * boardSize);

// Create gameboard array containing [] of board size squared
for (let i = 0; i < numSquares; i++) {
	gameBoard.push(i);
};

// Create a wrapper div called "board" inside of "game" div
document.getElementById("game").innerHTML = '<div id="board"></div>';

// Store board div inside of a variable
let board = document.getElementById("board");

// Center board in middle of page by adding margin css
board.style.margin = '0 auto';

// To make scalable, set wrapper div width and height 100px* board size
board.style.height = (100 * boardSize) + 'px';
board.style.width = (100 * boardSize) + 'px';

// Add border to board for visibility
board.style.border = 'solid 1px white';

// Iterate over gameboard, for every index in gameboard, print to document a div
for (let i = 0; i < numSquares; i++) {
	board.innerHTML += '<div class="square"></div>'; // Need to add += or else divs overwrite each other!!
};

// Store square divs in a variable - need to include in global scope
let squares = document.getElementsByClassName("square");

// Mandatory square div styling
for (let i = 0; i < numSquares; i++) {
	// set div squares to 100px x 100px
	squares[i].style.height = '100px';
	squares[i].style.width = '100px';
	// Float square divs left
	squares[i].style.float = "left";
	// Set div line height to 100px
	squares[i].style.lineHeight = "100px";
	// Set unique DIV IDs to each square 
	squares[i].setAttribute("id", i.toString());
};

// ** Fancy! Make every other square gray
if (numSquares % 2 !== 0) { // If board size is odd
	for (let i = 0; i < numSquares; i += 2) { // make every other square gray
		squares[i].style.backgroundColor = 'gray';
	};
} else { // If board size is even ### This was extremely hard to nail down ###
	for (i = 0; i < numSquares; i += 1) {
		if (isEven(i/boardSize)) { // make even rows alternate color
			for (let squareNum = i; squareNum < (i + boardSize); squareNum += 2) {
				squares[squareNum].style.backgroundColor = 'gray';	
			};
		} else if (isOdd(i/boardSize)) { // make odd rows alternate color
			for (let squareNum = i+1; squareNum < (i + boardSize); squareNum += 2) {
				squares[squareNum].style.backgroundColor = 'gray';	
			};
		} else {
		};
	};
};

// Store turn indicator div in a variable for easy access
let turnIndicator = document.getElementById("turnIndicator")

// After board is made, indicate who goes first
turnIndicator.style.color = "white";
turnIndicator.innerHTML = "X's Turn";

// Declare a global click counter
let boardClicks = 0;

// If board is clicked, increment global click counter
board.addEventListener("click", function() {
if (determineWinner()) { // determineWinner will return true if it finds a winning combination
	turnIndicator.style.color = "aqua";
	turnIndicator.innerHTML = winningPlayer[0] + ' wins!';
} else if (isEven(boardClicks)) {
	turnIndicator.style.color = "red";
	turnIndicator.innerHTML = "O's Turn";
} else {
	turnIndicator.style.color = "white";
	turnIndicator.innerHTML = "X's Turn";
};
boardClicks++;

// Check if boardClicks is max of squarenum and indicator is not wins
if (boardClicks === (boardSize * boardSize) && !turnIndicator.innerHTML.includes('wins')) {
	document.getElementById("options_submit").innerHTML = "Play again?"
	optionsButton.style.backgroundColor = 'green';
	optionsButton.style.color = 'white';
	turnIndicator.style.color = "gold";
	turnIndicator.innerHTML = "Game Draw!";
}
}); // End board click function

// Make an array to hold square click data
let squareClicks = [];

// Set squareclick data for each square to 0
for (let i = 0; i < numSquares; i++) {
	squareClicks[i] = 0;
};

// Make a letiable to store winning combination
let winningPlayer;

// Add function to determine winner based on clicks array
let determineWinner = function() {
	// Check for win by row
	for (let i = 0; i < numSquares; i++) { // iterate over entire board
		if ((i % boardSize) == 0) {
			let rowCheck = [];
			for (let squareNum = i; squareNum < (i + boardSize); squareNum += 1) { // iteration over column 1	
				rowCheck.push(squares[squareNum].innerHTML);
			};

			if (allSame(rowCheck)) {
				winningPlayer = rowCheck; // Push winning player data
				return true;
			};
		};
	};
	// Check for win by column
	for (i = 0; i < numSquares; i += 1) { // iterate over entire board
		if (i < boardSize) { // 
			let colCheck = [];
			for (let squareNum = i; squareNum < numSquares; squareNum += boardSize) { // iteration over row 1	
				colCheck.push(squares[squareNum].innerHTML);
			};
			
			if (allSame(colCheck)) {
				winningPlayer = colCheck; // Push winning player data
				return true;
			};	
		};
	};
	// Check for win by left diagonal
	let diag1Check = []; // Needs to be outside of for loop to prevent overwriting array
	for (i = 0; i < numSquares; i += 1) { // first iteration over board
		if ((i % (boardSize + 1)) == 0) { // use condition if iterator % BOARDSIZE + 1 === 0 to get left diagonals
			diag1Check.push(squares[i].innerHTML);
		};
	};
	if (allSame(diag1Check)) { // As does the return statement
		winningPlayer = diag1Check; // Push winning player data
		return true;
	};
	// Check for win by right diagonal
	let diag2Check = []; // Needs to be outside of for loop to prevent overwriting array
	for (i = (boardSize - 1); i < (numSquares - 1); i += 1) { // first iteration over board
		if ((i % (boardSize - 1)) == 0) { // use condition if iterator % BOARDSIZE - 1 === 0 to get right diagonals
			diag2Check.push(squares[i].innerHTML);
		};
	};
	if (allSame(diag2Check)) { // As does the return statement
		winningPlayer = diag2Check; // Push winning player data
		return true;
	};
}; // End determineWinner function

// Add function to count square clicks
let countClicks = function() {
	let divID = this.getAttribute("id");
	squareClicks[divID] += 1;
	// If global click counter is odd and local click is == 1, change innerhtml of div to 'X' 
	if (isEven(boardClicks) && squareClicks[divID] == 1) {
		this.innerHTML = 'X';
	// If global click counter is even and local click is == 1, change innerhtml of div to 'O'
	} else if (isOdd(boardClicks) && squareClicks[divID] == 1) {
		this.innerHTML = 'O';
		this.style.color = "red";
	// If local click counter is greater than 1, alert player and subtract 1 from global clicks
	} else if (!determineWinner()){
		alert('You cannot move there. That space is taken.');
		boardClicks -= 1;
	} else {
	};
	// Check for winner, if true, lock all local clicks
	if (determineWinner()) { // determine winner will return true or false if it identifies a winning combination
		// Set all square clicks to 2 to "lock" them to prevent further moves from taking place
		for (let i = 0; i < numSquares; i++) {
			squareClicks[i] = 2;
		};
		// Change play button to say play again
		document.getElementById("options_submit").innerHTML = "Play again?"
		optionsButton.style.backgroundColor = 'green';
		optionsButton.style.color = 'white';
	};
};

// Add local click counter to each square on the board
for (let i = 0; i < numSquares; i++) {
	squares[i].addEventListener("click", countClicks);
};

}); // End makeboard function

}); // End document load function