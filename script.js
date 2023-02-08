
let flippedCard1, flippedCard2;
let flippedCards = 0;
let count = 0;
let timer = 0;
let intervalId;

const gameContainer = document.getElementById("game");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
restartButton.style.display = "none";

let HARD = randomRGB(24);
let MEDIUM = randomRGB(12);
let EASY = randomRGB(6);

function randomRGB(num) {
  let colors = [];
  for (let i = 0; i < num; i++) {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    let rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
    if (rgb != 'rgb(0,0,0)' && rgb != 'rgb(255,255,255)' && rgb != 'rgb(223, 243, 194)') {
      colors.push(rgb);
    }
  }
  return colors;
}
//add in future
// function randomGIF(num) {
//   let gifs = [];
//   for (let i = 0; i < num; i++) {
//     let gif = 'https://media.giphy.com/media/' + Math.floor(Math.random() * 10000000) + '/giphy.gif';
//     gifs.push(gif);
//   }
//   return gifs;
// }

let difficulty = document.querySelector('#difficulty');
const difficultySelector = document.getElementById('difficultySelect');
const difficultySelect = document.getElementById("difficulty-select");
let selectedOption;
let shuffledColors;
difficultySelect.addEventListener("change", function(e) {
  
selectedOption = difficultySelect.options[difficultySelect.selectedIndex].value;
let COLORS = [];
//mode selector/ show best score
 if (selectedOption === "easy") {
COLORS = EASY.concat(EASY).concat(EASY).concat(EASY);
difficulty.innerText = 'Easy Mode';
difficulty.style.color = 'lightgreen'; 
leastClicks.innerText = `${leastClicksEasy} clicks`;
bestTime.innerText = `${bestTimeEasy} seconds`;
} else if (selectedOption === "medium") {
COLORS = MEDIUM.concat(MEDIUM).concat(MEDIUM).concat(MEDIUM);
difficulty.innerText = 'Medium Mode';
difficulty.style.color = 'orange'; 
leastClicks.innerText = `${leastClicksMedium} clicks`;
bestTime.innerText = `${bestTimeMedium} seconds`;
} else if (selectedOption === "hard") {
COLORS = HARD.concat(HARD).concat(HARD).concat(HARD);
difficulty.innerText = 'Hard Mode';
difficulty.style.color = 'red'; 
leastClicks.innerText = `${leastClicksHard} clicks`;
bestTime.innerText = `${bestTimeHard} seconds`;
}
else if(selectedOption === "selector" || selectedOption === "null"){
    alert('Select a gamemode to begin')
}
shuffledColors = shuffle(COLORS);
console.log(shuffledColors);
});


//start game
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div");
    newDiv.dataset.color = color;
    newDiv.classList.add("card");
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
}
//local storage bit
let timerr = document.querySelector('#timer');
let clickCounter = document.querySelector('#click-counter');
let bestTime = document.querySelector('#bestTime');
let leastClicks = document.querySelector('#leastClicked');
let bestTimeEasy = localStorage.getItem('bestTimeEasy');
let bestTimeMedium = localStorage.getItem('bestTimeMedium');
let bestTimeHard = localStorage.getItem('bestTimeHard');
let leastClicksEasy = localStorage.getItem('leastClicksEasy');
let leastClicksMedium = localStorage.getItem('leastClicksMedium');
let leastClicksHard = localStorage.getItem('leastClicksHard');

function updateLocalStorage() {
  if (selectedOption == 'easy') {
    if (bestTimeEasy == null || bestTimeEasy > timer) {
      localStorage.setItem('bestTimeEasy', timer);
    }
    if (leastClicksEasy == null || leastClicksEasy > count) {
      localStorage.setItem('leastClicksEasy', count);
    }
  } else if (selectedOption == 'medium') {
    if (bestTimeMedium == null || bestTimeMedium > timer) {
      localStorage.setItem('bestTimeMedium', timer);
    }
    if (leastClicksMedium == null || leastClicksMedium > count) {
      localStorage.setItem('leastClicksMedium', count);
    }
  } else if (selectedOption == 'hard') {
    if (bestTimeHard == null || bestTimeHard > timer) {
      localStorage.setItem('bestTimeHard', timer);
    }
    if (leastClicksHard == null || leastClicksHard > count) {
      localStorage.setItem('leastClicksHard', count);
    }
  }
}

const gameInfo = document.querySelector('#game-info');
//start button 
startButton.addEventListener("click", function(){
  if (selectedOption === "default" || selectedOption === undefined) {
    alert('Please Select a Difficulty');
  }// this prevents a bug where game wouldnt start because no option was selected
  else {
    gameContainer.innerHTML = "";
    createDivsForColors(shuffledColors);
    startButton.style.display = "none";
    difficultySelector.style.display = "none";
    restartButton.style.display = "block";
    timerr.style.display = "block";
    difficulty.style.display = "block";
    clickCounter.style.display = "block";
    bestTime.style.display = "none";
    leastClicks.style.display = "none";
    gameInfo.style.height = '100px';
    startTimer();

  }
});


//shuffle for colors
function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

//card clicks
function handleCardClick(event) {
  if (event.target.classList.contains("disabled")) {
    return;
  }
  if (flippedCards >= 2) {
    alert("You can only flip two cards at a time.");
    return;
  }
  const clickedCard = event.target;
  clickedCard.classList.add("disabled");
  count++;
  clickedCard.style.background = clickedCard.dataset.color;
  document.getElementById("click-counter").innerHTML = "Clicks: " + count;
  if (clickedCard.classList.contains("match")) {
    return;
  }
  if(!flippedCard1){
    flippedCard1 = clickedCard;
    flippedCards++;
  }else if(flippedCard1 === clickedCard || flippedCard2 === clickedCard){
    alert("Please don't select the same card twice");
  }
  else{
    flippedCard2 = clickedCard;
    flippedCards++;
  }
  if(flippedCards === 2){
    setTimeout(function() {
      if (flippedCard1.dataset.color === flippedCard2.dataset.color) {
        flippedCard1.classList.add("match");
        flippedCard2.classList.add("match");
        checkForWin();
      } else {
        flippedCard1.style.background = "linear-gradient(to bottom, #ffffff, #000000)";
        flippedCard2.style.background = "linear-gradient(to bottom, #ffffff, #000000)";
      }
      const cards = document.querySelectorAll(".card");
      cards.forEach(card => card.classList.remove("disabled"));
      flippedCard1 = null;
      flippedCard2 = null;
      flippedCards = 0;
    }, 200);
  }
}

//Did You Win?
function checkForWin(){
  if(document.querySelectorAll(".match").length === document.querySelectorAll('.card').length ){
    alert("You Win! Time: " + timer + " seconds. Clicks: " + count);
    stopTimer();
    updateLocalStorage(); 
   }
}
//Start Timer
function startTimer() {
  intervalId = setInterval(function() {
    timer++;
    document.getElementById("timer").innerHTML = "Time: " + timer + "s";
  }, 1000);
}
//Stop Timer
function stopTimer() {
  clearInterval(intervalId);
}
//End Game
restartButton.addEventListener("click", function(){
  location.reload();
  restartButton.style.display = "none";
  stopTimer();
});


