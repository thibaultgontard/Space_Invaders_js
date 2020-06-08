const CANVAS_WIDTH = 1000
const CANVAS_HEIGHT = 580

const BLOCK_WIDTH = 40
const BLOCK_HEIGHT = 40

const CARRE_WIDTH = 25
const CARRE_HEIGHT = 5

const SPEED_MIN = 200

const gInput = new InputManager()
const gStages = new Map()
const gsm = new StageManager()
let gTextures = {}
let gSounds = {}
let gFonts =[]


//
function preload() {
	gTextures["paysage"] = loadImage("assets/images/background.jpg")
	gTextures["ecran_fin"] = loadImage("assets/images/ecran_fin.jpg")
	gTextures["bouton_start"] = loadImage("assets/images/start.png")
	gTextures["game_over"] = loadImage("assets/images/gameover.png")
	gTextures["fond"] = loadImage("assets/images/fond.jpg")
	gTextures["obj"] = loadImage("assets/images/obj.png")
	gTextures["logo"] = loadImage("assets/images/logo.png")
	gTextures["fin"] = loadImage("assets/images/fin.png")
	gTextures["bouton"] = loadImage("assets/images/bouton.png")
	gTextures["cadre"] = loadImage("assets/images/cadre.png")
	gTextures["mistery"] = loadImage("assets/images/mystery.png")
	gTextures["obj1"] = loadImage("assets/images/obj1.png")
	gTextures["obj2"] = loadImage("assets/images/obj2.png")
	gTextures["carre_bleu2"] = loadImage("assets/images/carre_bleu2.png")
	gTextures["carre_violet2"] = loadImage("assets/images/carre_violet2.png")
	gTextures["carre_rouge"] = loadImage("assets/images/carre_rouge.png")
	gTextures["vaisseau_1"] = loadImage("assets/images/vaisseau_1.png")
	gTextures["avion"] = loadImage("assets/images/avion.png")
	gTextures["press1"] = loadImage("assets/images/press1.png")
	gTextures["space"] = loadImage("assets/images/space.png")
	gTextures["coeur"] = loadImage("assets/images/coeur.png")
	gTextures["vaisseau"] = loadImage("assets/images/ship.png")
	gTextures["alien_blue"] = loadImage("assets/images/alien_blue_sheet.png")
	gTextures["alien_green"] = loadImage("assets/images/alien_green_sheet.png")
	gTextures["alien_purple"] = loadImage("assets/images/alien_purple_sheet.png")
	gTextures["laser"] = loadImage("assets/images/laser.png")
	gTextures["bomb"] = loadImage("assets/images/bomb.png")
	gFonts["ltg"] = loadFont("assets/fonts/ltg.ttf")
	gFonts["sketch"] = loadFont("assets/fonts/Sketch.ttf")
	gFonts["lettre"] = loadFont("assets/fonts/lettre.otf")
	gTextures["explosion_blue"] = loadImage("assets/images/explosionblue.png")
	gTextures["explosion_green"] = loadImage("assets/images/explosiongreen.png")
	gTextures["explosion_purple"] = loadImage("assets/images/explosionpurple.png")
	gTextures["explo"] = loadImage("assets/images/explosion.png")
	gSounds["tir"] = loadSound("assets/sounds/tir.wav")
	gSounds["mystery_sound"] = loadSound("assets/sounds/mystery.wav")
	gSounds["explosion"] = loadSound("assets/sounds/alienkilled.wav")
	gSounds["explosion1"] = loadSound("assets/sounds/explosion.wav")
	gSounds["intro"] = loadSound("assets/musics/depart.mp3")
	gSounds["game"] = loadSound("assets/musics/game.mp3")
	gSounds["fin"] = loadSound("assets/musics/space.mp3")
	gSounds["tir_alien"] = loadSound("assets/sounds/tiralien.wav")
	
}

//
function setup() {
	pixelDensity(1)
	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
	//background(50)

	gStages.set("intro", new IntroStage(gsm))
	gStages.set("play", new PlayStage(gsm))
	gStages.set("gameover", new GameOverStage(gsm))

	gsm.pushStage(gStages.get("intro"))

}

let ancien = 0
let now = 0
let dt = 0

//
function draw() {
	//background(10)
	now = millis()
	dt = (now - ancien) / 1000
	//
	gsm.update(dt)

	//ras inputManager
	gInput.update()

	gsm.render()

	ancien = now
}
//
function keyPressed() {
	gInput.setKeyboardPressed(keyCode)
}
//
function keyReleased() {
	gInput.setKeyboardReleased(keyCode)
}
//
function mousePressed() {
	gInput.setMouseClicked(mouseX, mouseY)
}

function mouseReleased() {
	gInput.setMouseReleased(mouseX, mouseY)
}
//