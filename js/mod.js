let modInfo = {
	name: "真正的现实",
	id: "truereality",
	author: "ellepiveH",
	pointsName: "点数",
	discordName: "反命题at",
	discordLink: "https://www.bilibili.com/video/BV1vL41177sR/?t=35",
	initialStartPoints: new ExpantaNum (0), // Used for hard resets and new players
	
	offlineLimit: 168,  // In hours
	//offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.0.3",
	name: "True Reality Pre-Alpha",
}

let changelog = `<h1>更新日志：</h1><br>
	<h3>0.0.0.3</h3><br>
		- Endgame: G1.000F5点数
	<h3>0.0.0.1</h3><br>
		- 初始版本`

let winText = `你已经达到endgame，请等待更新`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]
function n(x) {
	return new ExpantaNum(x)
}
function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new ExpantaNum(0)

	let gain = new ExpantaNum(1)
	if (hasMilestone('p', 0)) gain = gain.mul(10)
	if (hasMilestone('i', 0)) gain = gain.mul(10)
	if (hasMilestone('e', 0)) gain = gain.mul(1.25)
	if (hasMilestone('e', 1)) gain = gain.mul(10)
	if (hasMilestone('r', 0)) gain = gain.mul(1.25)
	if (hasMilestone('r', 1)) gain = gain.mul(10)
	if (hasUpgrade('p', 11)) gain = gain.mul(upgradeEffect('p', 11))
	if (hasUpgrade('p', 12)) gain = gain.mul(upgradeEffect('p', 12))

	gain = gain.pow(layers.i.inf())
	gain = gain.pow(layers.r.rel())
	gain = gain.tetr(layers.e.etr())
	if (hasUpgrade('r', 26)) gain = gain.pent(100)
	gain = gain.pent(layers.ma.matter())
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte("10^^^(10^)^4 10")
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(86400) // Default is 1 day which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}