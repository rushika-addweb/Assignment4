
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
let then = Date.now();


const EASY_IMAGE_SIZE = 150;
const NORMAL_IMAGE_SIZE = 100;
const HARD_IMAGE_SIZE = 75;
let IMAGE_SIZE = 100;


IMAGE_SIZE = NORMAL_IMAGE_SIZE;

const zombie1Path = "./assets/zombie1.png";
const zombie2Path = "./assets/zombie2.png";
const zombie3Path = "./assets/zombie3.png";
const zombie4Path = "./assets/zombie4.png";
const zombie5Path = "./assets/zombie5.png";
const zombie6Path = "./assets/zombie6.png";
const heartPath = "./assets/heart.png";
const imageURL = [heartPath, zombie1Path, zombie2Path, zombie3Path, zombie4Path, zombie5Path, zombie6Path];
const images = [];
let imageCount = 0;
let allLoaded = false;


let MIN_CANVAS_WIDTH = 1080;
let MIN_CANVAS_HEIGHT = 720;


let playerScore = 0;
let playerAccuracy = 100;
let numberOfClicks = 0;
let monstersKilled = 0;


let gameOver = false;
let gameStarted = false;

const easyText = "Easy";
const normalText = "Normal";
const hardText = "Hard";
let difficultyText = normalText;



let gameOverDifficultyText = difficultyText;

// UI
const statsFont = {
	fontSize: 30,
	fontStyle: "Comic Sans MS",
	colour: "white"
};
const buttonFont = {
	fontSize: 20,
	fontStyle: "Comic Sans MS",
	colour: "white"
}
const scoreFont = {
	fontSize: 40,
	fontStyle: "Comic Sans MS",
	colour: "white"
}
const buttons = {
	
	easy: {
		x: 250,
		y: canvas.height - statsFont.fontSize * 2,
		width: 100,
		height: statsFont.fontSize * 2,
		textX: 300,
		colour: "#FFA500",
		text: "Easy\nTargets"
	},
	normal: {
		x: 350,
		y: canvas.height - statsFont.fontSize * 2,
		width: 100,
		height: statsFont.fontSize * 2,
		textX: 400,
		colour: "#CC8400",
		text: "Normal\nTargets"
	},
	hard: {
		x: 450,
		y: canvas.height - statsFont.fontSize * 2,
		width: 100,
		height: statsFont.fontSize * 2,
		textX: 500,
		colour: "red",
		text: "Hard\nTargets"
	},
	start: {
		x: 600,
		y: canvas.height - statsFont.fontSize * 2,
		width: 100,
		height: statsFont.fontSize * 2,
		textX: 650,
		colour: "green",
		text: "Start\nGame"
	},
	stop: {
		x: 700,
		y: canvas.height - statsFont.fontSize * 2,
		width: 100,
		height: statsFont.fontSize * 2,
		textX: 750,
		colour: "red",
		text: "Stop\nGame"
	},
	lineHeight: 20
}
let stopButtonPressed = false;

// Survival Mode
let allowedTimeToKill = 3000; // ms
let playerLives = 5;
const hearts = {
	x: 0,
	y: 0,
	width: statsFont.fontSize,
	height: statsFont.fontSize
}
const monstersToKill = {
	unlockZombie2: 20,
	unlockZombie3: 40,
	unlockZombie4: 60,
	unlockZombie5: 80,
	unlockZombie6: 100
}

// Timed Mode
let timeLeft = 30;
let timePassed = 0;
const timePassedForZombie = {
	unlockZombie2: 5,
	unlockZombie3: 10,
	unlockZombie4: 15,
	unlockZombie5: 20,
	unlockZombie6: 25
}

// Objects
let mouseClicks = {};
const zombie1 = {
	x: 0,
	y: 0,
	timeElapsed: 0,
	ready: true
}
const zombie2 = {
	x: 0,
	y: 0,
	timeElapsed: 0,
	ready: false
}
const zombie3 = {
	x: 0,
	y: 0,
	timeElapsed: 0,
	ready: false
}
const zombie4 = {
	x: 0,
	y: 0,
	timeElapsed: 0,
	ready: false
}
const zombie5 = {
	x: 0,
	y: 0,
	timeElapsed: 0,
	ready: false
}
const zombie6 = {
	x: 0,
	y: 0,
	timeElapsed: 0,
	ready: false
}
const zombieArray = [zombie1, zombie2, zombie3, zombie4, zombie5, zombie6];


let bloodItems = [];
const bloodValues = {
	particles: 50,
	scatter: 0.2,
    gravity: 0.05
}


const zombieDeathSounds = [];
const zombieDeathSrc = "./assets/death.mp3";
const playerHitSounds = [];
const playerHitSrc = "./assets/hit.mp3";
let soundToPlay = 0;
let soundToPlay1 = 0;


const imagesInit = () => {
	imageURL.forEach(src => {
		const image = new Image();
		image.src = src;
		imageCount++;
		image.onload = () => {
			if (imageCount == imageURL.length) {
				allLoaded = true;
			}
		}
		images.push(image);
	})
}


const soundInit = () => {
	for (let i = 0; i < 4; i++) {
		let sound = new Audio();
		sound.src = zombieDeathSrc;
		zombieDeathSounds.push(sound);
	}
	for (let i = 0; i < 4; i++) {
		let sound = new Audio();
		sound.src = playerHitSrc;
		playerHitSounds.push(sound);
	}
}


const playZombieDeath = () => {
	let sound = zombieDeathSounds[soundToPlay % zombieDeathSounds.length];
	sound.currentTime = 0;
	sound.play();
	soundToPlay++;
}

const playPlayerHit = () => {
	let sound = playerHitSounds[soundToPlay1 % playerHitSounds.length];
	sound.currentTime = 0;
	sound.play();
	soundToPlay1++;
}

const addBlood = (x, y, array) => {
	for (let i = 0; i < bloodValues.particles; i++) {
		let size = Math.random() * Math.PI;
		let dirX = (((Math.random() < .5) ? 3 : -3) * (Math.random() * 3)) * bloodValues.scatter;
		let dirY = (((Math.random() < .5) ? 3 : -3) * (Math.random() * 3)) * bloodValues.scatter;

		array.push({
			x: x,
			y: y,
			dx: dirX,
			dy: dirY,
			size: size
		})
	}
}


const drawBlood = (array) => {
	let len = array.length;
	while (len--) {
		let blood = array[len];
		let x = blood.x;
		let y = blood.y;
		let s = blood.size;
		drawCircle(x, y, s);

		blood.dy -= bloodValues.gravity;
		blood.x -= blood.dx;
		blood.y -= blood.dy;
		blood.size = Math.max(blood.size - 0.05, 0);

		if (array[len].size < 0.3) {
			drawCircle(blood.x, blood.y, blood.size);
			array.splice(len, 1);
			
		}
	}
}


const drawCircle = (x, y, size) => {
	ctx.beginPath();
	ctx.arc(x, y, size * 5, 0, 2 * Math.PI, false);
	ctx.fillStyle = "Blue";
	ctx.fill();
	ctx.closePath();
}


const resetZombieReady = () => {
	for (let i = 0; i < zombieArray.length; i++) {
		if (i != 0) {
			zombieArray[i].ready = false;
		}
		zombieArray[i].timeElapsed = 0;
	}
}


const startSurvivalMode = () => {
	let newGame = {
		playerLives: 5,
		playerScore: 0,
		playerAccuracy: 100,
		numberOfClicks: 0,
		monstersKilled: 0
	}

	playerLives = newGame.playerLives;
	playerScore = newGame.playerScore;
	playerAccuracy = newGame.playerAccuracy;
	numberOfClicks = newGame.numberOfClicks;
	monstersKilled = newGame.monstersKilled;
	resetZombieReady();
}


const startTimedMode = () => {
	let newGame = {
		playerScore: 0,
		playerAccuracy: 100,
		numberOfClicks: 0,
		monstersKilled: 0,
		timePassed: 0
	}
	playerScore = newGame.playerScore;
	playerAccuracy = newGame.playerAccuracy;
	numberOfClicks = newGame.numberOfClicks;
	monstersKilled = newGame.monstersKilled;
	timePassed = newGame.timePassed;
	resetZombieReady();
}



const updateScore = () => {
	playerScore += parseInt(playerAccuracy * 100 / IMAGE_SIZE); 
	monstersKilled++;
}


const resetZombie = (zombieNumber) => { 
	let spaceForUI = 100;
	zombieArray[zombieNumber].timeElapsed = 0;

	let otherZombieX = [];
	let otherZombieY = [];
	for (let i = 0; i < zombieArray.length; i++) {
		otherZombieX.push(zombieArray[i].x);
		otherZombieY.push(zombieArray[i].y);
	}
	otherZombieX.splice(zombieNumber, 1);
	otherZombieY.splice(zombieNumber, 1);

	const resetXY = () => {
		zombieArray[zombieNumber].x = Math.random() * (canvas.width - IMAGE_SIZE);
		zombieArray[zombieNumber].y = statsFont.fontSize + Math.random() * (canvas.height - IMAGE_SIZE - spaceForUI); // font size added for topcentred score
	}

	resetXY();

	const overlapXY = () => {
		for (let i = 0; i < otherZombieX.length; i++) {
			let leftXOverlap = zombieArray[zombieNumber].x >= otherZombieX[i] && zombieArray[zombieNumber].x <= otherZombieX[i] + IMAGE_SIZE;
			let rightXOverlap = (zombieArray[zombieNumber].x + IMAGE_SIZE) >= otherZombieX[i] && (zombieArray[zombieNumber].x + IMAGE_SIZE) <= (otherZombieX[i] + IMAGE_SIZE);
			
			if (leftXOverlap || rightXOverlap) {
				let topYOverlap = zombieArray[zombieNumber].y >= otherZombieY[i] && zombieArray[zombieNumber].y <= (otherZombieY[i] + IMAGE_SIZE);
				let botYOverlap = (zombieArray[zombieNumber].y + IMAGE_SIZE) >= otherZombieY[i] && (zombieArray[zombieNumber].y+ IMAGE_SIZE) <= (otherZombieY[i] + IMAGE_SIZE)
				
				if (topYOverlap || botYOverlap) {
					return true;
				}
			}
		}
		return false;
	}

	while (overlapXY()) {
		resetXY();
	}
}


const update = (modifier) => {
	for (let key in mouseClicks) {
		let hitChecks = [false, false, false, false, false, false];

		
		for (let i = 0; i < hitChecks.length; i++) {
			if (zombieArray[i].ready) {
				hitChecks[i] = Math.sqrt(Math.pow((mouseClicks[key].x - (zombieArray[i].x + (IMAGE_SIZE / 2))), 2) + Math.pow((mouseClicks[key].y - (zombieArray[i].y + (IMAGE_SIZE / 2))), 2)) < (IMAGE_SIZE / 2);
			}
		}

		
		for (let i = 0; i < hitChecks.length; i++) {
			if (zombieArray[i].ready && hitChecks[i]) {
				playZombieDeath();
				updateScore();
				addBlood(zombieArray[i].x + IMAGE_SIZE / 2, zombieArray[i].y + IMAGE_SIZE / 2, bloodItems);
				delete mouseClicks[key];
				resetZombie(i);
			}
		}
		delete mouseClicks[key];
	}
	
	playerAccuracy = (numberOfClicks == 0) ? 100 : (monstersKilled / numberOfClicks * 100);
}


const render = () => {
	if (gameStarted && allLoaded) {

		for (let i = 1; i <= zombieArray.length; i++) {
			if (zombieArray[i - 1].ready) {
				ctx.drawImage(images[i], zombieArray[i - 1].x, zombieArray[i - 1].y, IMAGE_SIZE, IMAGE_SIZE);
			}
		}

		drawBlood(bloodItems);

		

		
	}

	drawStaticUI();
}


const drawStaticUI = () => {
	
	

	const easyMode = () => {
		ctx.fillStyle = buttons.easy.colour;
		ctx.fillRect(buttons.easy.x, buttons.easy.y, buttons.easy.width, buttons.easy.height);

		ctx.fillStyle = buttonFont.colour;
		ctx.font = `${buttonFont.fontSize}px ${buttonFont.fontStyle}`;
		ctx.textAlign = "center";
		ctx.textBaseline = "top";

		let text = buttons.easy.text;
		let lines = text.split('\n');
		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], buttons.easy.textX, canvas.height - 50 + (i * buttons.lineHeight));
		}
	}
	const normalMode = () => {
		ctx.fillStyle = buttons.normal.colour;
		ctx.fillRect(buttons.normal.x, buttons.normal.y, buttons.normal.width, buttons.normal.height);

		ctx.fillStyle = buttonFont.colour;
		ctx.font = `${buttonFont.fontSize}px ${buttonFont.fontStyle}`;
		ctx.textAlign = "center";
		ctx.textBaseline = "top";

		let text = buttons.normal.text;
		let lines = text.split('\n');
		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], buttons.normal.textX, canvas.height - 50 + (i * buttons.lineHeight));
		}
	}
	const hardMode = () => {
		ctx.fillStyle = buttons.hard.colour;
		ctx.fillRect(buttons.hard.x, buttons.hard.y, buttons.hard.width, buttons.hard.height);

		ctx.fillStyle = buttonFont.colour;
		ctx.font = `${buttonFont.fontSize}px ${buttonFont.fontStyle}`;
		ctx.textAlign = "center";
		ctx.textBaseline = "top";

		let text = buttons.hard.text;
		let lines = text.split('\n');
		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], buttons.hard.textX, canvas.height - 50 + (i * buttons.lineHeight));
		}
	}
	const startGame = () => {
		ctx.fillStyle = buttons.start.colour;
		ctx.fillRect(buttons.start.x, buttons.start.y, buttons.start.width, buttons.start.height);

		ctx.fillStyle = buttonFont.colour;
		ctx.font = `${buttonFont.fontSize}px ${buttonFont.fontStyle}`;
		ctx.textAlign = "center";
		ctx.textBaseline = "top";

		let text = buttons.start.text;
		let lines = text.split('\n');
		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], buttons.start.textX, canvas.height - 50 + (i * buttons.lineHeight));
		}
	}
	const stopGame = () => {
		ctx.fillStyle = buttons.stop.colour;
		ctx.fillRect(buttons.stop.x, buttons.stop.y, buttons.stop.width, buttons.stop.height);

		ctx.fillStyle = buttonFont.colour;
		ctx.font = `${buttonFont.fontSize}px ${buttonFont.fontStyle}`;
		ctx.textAlign = "center";
		ctx.textBaseline = "top";

		let text = buttons.stop.text;
		let lines = text.split('\n');
		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], buttons.stop.textX, canvas.height - 50 + (i * buttons.lineHeight));
		}
	}

	easyMode();
	normalMode();
	hardMode();
	startGame();
	stopGame();

	const addDifficultyText = () => {
		ctx.fillStyle = buttonFont.colour;
		ctx.font = `${buttonFont.fontSize}px ${statsFont.fontStyle}`;
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.fillText(`${difficultyText}` , canvas.width / 5, 0);
	}
	const addGameModeText = () => {
		ctx.fillStyle = buttonFont.colour;
		ctx.font = `${buttonFont.fontSize}px ${statsFont.fontStyle}`;
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		
	}

	addDifficultyText();
	addGameModeText();

	const addScoreText = () => {
		ctx.fillStyle = buttonFont.colour;
		ctx.font = `${statsFont.fontSize}px ${statsFont.fontStyle}`;
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.fillText(`Score: ${playerScore}` , canvas.width / 2, 0);
	}

	const addMonstersKilled = () => {
		ctx.fillStyle = buttonFont.colour;
		ctx.font = `${statsFont.fontSize}px ${statsFont.fontStyle}`;
		ctx.textAlign = "right";
		ctx.textBaseline = "top";
		ctx.fillText(`balls hit: ${monstersKilled}` , canvas.width, canvas.height - statsFont.fontSize);
	}

	const addAccuracyText = () => {
		ctx.fillStyle = buttonFont.colour;
		ctx.font = `${statsFont.fontSize}px ${statsFont.fontStyle}`;
		ctx.textAlign = "right";
		ctx.textBaseline = "top";
		ctx.fillText(`Accuracy: ${playerAccuracy.toFixed(1)}%` , canvas.width, canvas.height - statsFont.fontSize * 2);
	}

	addScoreText();
	addMonstersKilled();
	addAccuracyText();

	if (stopButtonPressed) {
		drawEndScore();
	}
}


const drawEndScore = () => {
	ctx.fillStyle = scoreFont.colour;
	ctx.font = `${scoreFont.fontSize}px ${scoreFont.fontStyle}`;
	ctx.textAlign = "center";
	ctx.textBaseline = "top";

	let text = `Game over!`
	for (let i = 0; i < lines.length; i++) {
		ctx.fillText(lines[i], canvas.width / 2, canvas.height / 3 + (i * 50));
	}
}


const zombieTimer = (delta) => {
	for (let i = 0; i < zombieArray.length; i++) {
		if (zombieArray[i].ready) {
			zombieArray[i].timeElapsed += delta;
		}
	}
}

const setGameOverText = () => {
	gameOverModeText = gameModeText;
	gameOverDifficultyText = difficultyText;
}


const main = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	let now = Date.now();
	let delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	
	if (gameStarted) {
		requestAnimationFrame(main);
	}
	
	if (timedMode) {
		timePassed += delta / 1000;
		
		if (timePassed >= timeLeft) {
			gameStarted = false;
			gameOver = true;
			setGameOverText();
			drawEndScore();
		}

		
		if (timePassed >= timePassedForZombie.unlockZombie6) {
			zombie6.ready = true;
		} else if (timePassed >= timePassedForZombie.unlockZombie5) {
			zombie5.ready = true;
		} else if (timePassed >= timePassedForZombie.unlockZombie4) {
			zombie4.ready = true;
		} else if (timePassed >= timePassedForZombie.unlockZombie3) {
			zombie3.ready = true;
		} else if (timePassed >= timePassedForZombie.unlockZombie2) {
			zombie2.ready = true;
		}
	
	} else if (survivalMode) {
		zombieTimer(delta);
		
		if (monstersKilled == monstersToKill.unlockZombie2) {
			zombie2.ready = true;
		} else if (monstersKilled == monstersToKill.unlockZombie3) {
			zombie3.ready = true;
		} else if (monstersKilled == monstersToKill.unlockZombie4) {
			zombie4.ready = true;
		} else if (monstersKilled == monstersToKill.unlockZombie5) {
			zombie5.ready = true;
		} else if (monstersKilled == monstersToKill.unlockZombie6) {
			zombie6.ready = true;
		}

		
		for (let i = 0; i < zombieArray.length; i++) {
			if (zombieArray[i].timeElapsed >= allowedTimeToKill) {
				resetZombie(i);
				playPlayerHit();
				playerLives -= 1;
			}
		}

		
		if (playerLives <= 0) {
			gameStarted = false;
			gameOver = true;
			setGameOverText();
			drawEndScore();
		}
	}
}


const addEventListeners = () => {
	
	canvas.addEventListener("click", (event) => {
		if (event.clientY > canvas.height - statsFont.fontSize * 2) {
			checkButton(event.clientX);
		} else if (gameStarted) {
			mouseClicks[numberOfClicks] = {
				x: event.clientX, 
				y: event.clientY
			};
			numberOfClicks++;
		}
	})
	window.addEventListener('resize', resizeCanvas, false);
}


const updateButtonPlacement = () => {
	
	
	buttons.easy.y = canvas.height - statsFont.fontSize * 2;
	buttons.normal.y = canvas.height - statsFont.fontSize * 2;
	buttons.hard.y = canvas.height - statsFont.fontSize * 2;
	buttons.start.y = canvas.height - statsFont.fontSize * 2;
	buttons.stop.y = canvas.height - statsFont.fontSize * 2;
}
const resizeCanvas = () => {
	if (window.innerWidth >= MIN_CANVAS_WIDTH) {
		canvas.width = window.innerWidth;
	}
	if (window.innerHeight >= MIN_CANVAS_HEIGHT) {
		canvas.height = window.innerHeight;
	}
	updateButtonPlacement();
	drawStaticUI();
}


const checkButton = (mouseX) => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	if (!gameStarted && allLoaded) {
		 if (mouseX < buttons.easy.x + buttons.easy.width && mouseX > buttons.easy.x) {
			IMAGE_SIZE = EASY_IMAGE_SIZE;
			difficultyText = easyText;
		} else if (mouseX < buttons.normal.x + buttons.normal.width && mouseX > buttons.normal.x) { 
			IMAGE_SIZE = NORMAL_IMAGE_SIZE;
			difficultyText = normalText;
		} else if (mouseX < buttons.hard.x + buttons.hard.width && mouseX > buttons.hard.x) { 
			IMAGE_SIZE = HARD_IMAGE_SIZE;
			difficultyText = hardText;
		} else if (mouseX < buttons.start.x + buttons.start.width && mouseX > buttons.start.x) { // Start Game
			
			gameStarted = true;
			stopButtonPressed = false;
			main();
		}
	
	} else {
		if (mouseX < buttons.stop.x + buttons.stop.width && mouseX > buttons.stop.x) { // Stop Game
			setGameOverText();
			gameStarted = false;
			stopButtonPressed = true;
		}
	}
	
	if (stopButtonPressed) {
		drawEndScore();
	}
	drawStaticUI();
}
const initializeGame = () => {
	resizeCanvas();
	imagesInit();
	soundInit();

	addEventListeners();

	
	for (let i = 0; i < zombieArray.length; i++) {
		resetZombie(i);
	}

	
	drawStaticUI();
}

initializeGame();