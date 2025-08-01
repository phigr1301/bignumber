// format-expantanum.js by cloudytheconqueror
// Code snippets from NumberFormating.js of ducdat0507's The Communitree,
// which is based on The Modding Tree by Acamaeda (and ported to OmegaNum by upvoid),
// in turn based on The Prestige Tree by Jacorb and Aarex

// Set to 1 to print debug information to console
let FORMAT_DEBUG = 0

// Maximum number of times you can apply 1+log10(x) to number < 10 until the result is
// indistinguishable from 1. I calculated it myself and got 45, though I set it to 48 to be safe.
// Reducing this will speed up formatting, but may lead to inaccurate results.
let MAX_LOGP1_REPEATS = 48

// Base 5 logarithm of e, used to calculate log base 5, which is used in the definition of J.
let LOG5E = 0.6213349345596119 // 1 / Math.log(5)

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    let zeroCheck = num.array ? num.array[0][1] : num
    if (zeroCheck < 0.001) return (0).toFixed(precision)
    let init = num.toString()
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    return portions[0]
}

function regularFormat(num, precision) {
    if (isNaN(num)) return "NaN"
    let zeroCheck = num.array ? num.array[0][1] : num
    if (zeroCheck < 0.001) return (0).toFixed(precision)
    let fmt = num.toString()
    let f = fmt.split(".")
    if (precision == 0) return commaFormat(num.floor ? num.floor() : Math.floor(num))
    else if (f.length == 1) return fmt + "." + "0".repeat(precision)
    else if (f[1].length < precision) return fmt + "0".repeat(precision - f[1].length)
    else return f[0] + "." + f[1].substring(0, precision)
}

// Basically does the opposite of what standardize in ExpantaNum does
// Set smallTop to true to force the top value in the result below 10
function polarize(array, smallTop=false) {
    if (FORMAT_DEBUG >= 1) console.log("Begin polarize: "+JSON.stringify(array)+", smallTop "+smallTop)
    if (array.length == 0) array = [[0,0]]
    
    let bottom = array[0][0] == 0 ? array[0][1] : 10, top = 0, height = 0
    if (!Number.isFinite(bottom)) {}
    else if (array.length <= 1 && array[0][0] == 0) {
        while (smallTop && bottom >= 10) {
            bottom = Math.log10(bottom)
            top += 1
            height = 1
        }
    }
    else {
        let elem = array[0][0] == 0 ? 1 : 0
        top = array[elem][1]
        height = array[elem][0]
        while (bottom >= 10 || elem < array.length || (smallTop && top >= 10)) {
            if (bottom >= 10) { // Bottom mode: the bottom number "climbs" to the top
                if (height == 1) {
                    // Apply one increment
                    bottom = Math.log10(bottom)
                    if (bottom >= 10) { // Apply increment again if necessary
                        bottom = Math.log10(bottom)
                        top += 1
                    }
                }
                else if (height < MAX_LOGP1_REPEATS) {
                    // Apply the first two increments (one or two logs on first, one log on second)
                    if (bottom >= 1e10) bottom = Math.log10(Math.log10(Math.log10(bottom))) + 2
                    else bottom = Math.log10(Math.log10(bottom)) + 1
                    // Apply the remaining increments
                    for (i=2;i<height;i++) bottom = Math.log10(bottom) + 1
                }
                else bottom = 1 // The increment result is indistinguishable from 1
                
                top += 1
                if (FORMAT_DEBUG >= 1) console.log("Bottom mode: bottom "+bottom+", top "+top+", height "+height+", elem "+elem)
            }
            else { // Top mode: height is increased by one, or until the next nonzero value
                // Prevent running top mode more times than necessary
                if (elem == array.length-1 && array[elem][0] == height && !(smallTop && top >= 10)) break
                
                bottom = Math.log10(bottom) + top
                height += 1
                if (elem < array.length && height > array[elem][0]) elem += 1
                if (elem < array.length) {
                    if (height == array[elem][0]) top = array[elem][1] + 1
                    else if (bottom < 10) { // Apply top mode multiple times
                        let diff = array[elem][0] - height
                        if (diff < MAX_LOGP1_REPEATS) {
                            for (i=0;i<diff;i++) bottom = Math.log10(bottom) + 1
                        }
                        else bottom = 1 // The increment result is indistinguishable from 1
                        height = array[elem][0]
                        top = array[elem][1] + 1
                    }
                    else top = 1
                }
                else top = 1
                if (FORMAT_DEBUG >= 1) console.log("Top mode: bottom "+bottom+", top "+top+", height "+height+", elem "+elem)
            }
        }
    }
    
    if (FORMAT_DEBUG >= 1) console.log("Polarize result: bottom "+bottom+", top "+top+", height "+height)
    return {bottom: bottom, top: top, height: height}
}

// Search for the value at the requested height of an ExpantaNum array,
// and return the value if it exists; otherwise return a default value.
function arraySearch(array, height) {
    for (i=0;i<array.length;i++) {
        if (array[i][0] == height) return array[i][1]
        else if (array[i][0] > height) break
    }
    return height > 0 ? 0 : 10
}

// Search for the value at the requested height of an ExpantaNum array,
// and set it to zero if it exists.
function setToZero(array, height) {
    for (i=0;i<array.length;i++) {
        if (array[i][0] == height) break
    }
    if (i<array.length) array[i][1] = 0
}

function format(num, precision=4, small=false) {
    if (ExpantaNum.isNaN(num)) return "NaN"
    let precision2 = Math.max(4, precision) // for e
    let precision3 = Math.max(4, precision) // for F, G, H
    let precision4 = Math.max(6, precision) // for J, K
    num = new ExpantaNum(num)
    let array = num.array
    if (num.abs().lt(1e-308)) return (0).toFixed(precision)
    if (num.sign < 0) return "-" + format(num.neg(), precision)
    if (num.isInfinite()) return "Infinity"
    if (num.lt("0.0001")) { return format(num.rec(), precision) + "⁻¹" }
    else if (num.lt(1)) return regularFormat(num, precision + (small ? 2 : 0))
    else if (num.lt(1000)) return regularFormat(num, precision)
    else if (num.lt(1e9)) return commaFormat(num)
    else if (num.lt("10^^5")) { // 1e9 ~ 1F5
        let bottom = arraySearch(array, 0)
        let rep = arraySearch(array, 1)-1
        if (bottom >= 1e9) {
            bottom = Math.log10(bottom)
            rep += 1
        }
        let m = 10**(bottom-Math.floor(bottom))
        let e = Math.floor(bottom)
        let p = bottom < 1000 ? precision2 : 2
        return "e".repeat(rep) + regularFormat(m, p) + "e" + commaFormat(e)
    }
    else if (num.lt("10^^1000000")) { // 1F5 ~ F1,000,000
        let pol = polarize(array)
        return regularFormat(pol.bottom, precision3) + "F" + commaFormat(pol.top)
    }
    else if (num.lt("10^^^5")) { // F1,000,000 ~ 1G5
        let rep = arraySearch(array, 2)
        if (rep >= 1) {
            setToZero(array, 2)
            return "F".repeat(rep) + format(array, precision)
        }
        let n = arraySearch(array, 1) + 1
        if (num.gte("10^^" + (n + 1))) n += 1
        return "F" + format(n, precision)
    }
    else if (num.lt("10^^^1000000")) { // 1G5 ~ G1,000,000
        let pol = polarize(array)
        return regularFormat(pol.bottom, precision3) + "G" + commaFormat(pol.top)
    }
    else if (num.lt("10^^^^5")) { // G1,000,000 ~ 1H5
        let rep = arraySearch(array, 3)
        if (rep >= 1) {
            setToZero(array, 3)
            return "G".repeat(rep) + format(array, precision)
        }
        let n = arraySearch(array, 2) + 1
        if (num.gte("10^^^" + (n + 1))) n += 1
        return "G" + format(n, precision)
    }
    else if (num.lt("10^^^^1000000")) { // 1H5 ~ H1,000,000
        let pol = polarize(array)
        return regularFormat(pol.bottom, precision3) + "H" + commaFormat(pol.top)
    }
    else if (num.lt("10^^^^^5")) { // H1,000,000 ~ 5J4
        let rep = arraySearch(array, 4)
        if (rep >= 1) {
            setToZero(array, 4)
            return "H".repeat(rep) + format(array, precision)
        }
        let n = arraySearch(array, 3) + 1
        if (num.gte("10^^^^" + (n + 1))) n += 1
        return "H" + format(n, precision)
    }
    else if (num.lt("J1000000")) { // 5J4 ~ J1,000,000
        let pol = polarize(array, true)
        return regularFormat(Math.log10(pol.bottom) + pol.top, precision4) + "J" + commaFormat(pol.height)
    }
    else if (num.lt("J^4 10")) { // J1,000,000 ~ 1K5
        let rep = num.layer
        if (rep >= 1) return "J".repeat(rep) + format(array, precision)
        let n = array[array.length-1][0]
        if (num.gte("J" + (n + 1))) n += 1
        return "J" + format(n, precision)
    }
    else if (num.lt("J^999999 10")) { // 1K5 ~ K1,000,000
        // https://googology.wikia.org/wiki/User_blog:PsiCubed2/Letter_Notation_Part_II
        // PsiCubed2 defined Jx as Gx for x < 2, resulting in J1 = 10 rather than 10^10, to
        // prevent issues when defining K and beyond. Therefore, there should be separate
        // cases for when the "top value" is below 2, and above 2.
        // ExpantaNum.js considers J1 to be equal to 1e10 rather than 10,
        // hence num.lt("J^999999 10") rather than num.lt("J^1000000 1").
        let pol = polarize(array, true)
        let layerLess = new ExpantaNum(array)
        let layer = num.layer
        let topJ
        if (layerLess.lt("10^^10")) { // Below J2: use Jx = Gx
            // layerLess is equal to (10^)^top bottom here, so calculate x in Gx directly.
            topJ = 1 + Math.log10(Math.log10(pol.bottom) + pol.top)
            layer += 1
        }
        else if (layerLess.lt("10{10}10")) { // J2 ~ J10
            topJ = pol.height + Math.log((Math.log10(pol.bottom) + pol.top) / 2) * LOG5E
            layer += 1
        }
        else { // J10 and above: an extra layer is added, thus becoming JJ1 and above, where Jx = Gx also holds
            let nextToTopJ = pol.height + Math.log((Math.log10(pol.bottom) + pol.top) / 2) * LOG5E
            let bottom = nextToTopJ >= 1e10 ? Math.log10(Math.log10(nextToTopJ)) : Math.log10(nextToTopJ)
            let top = nextToTopJ >= 1e10 ? 2 : 1
            topJ = 1 + Math.log10(Math.log10(bottom) + top)
            layer += 2
        }
        return regularFormat(topJ, precision4) + "K" + commaFormat(layer)
    }
    // K1,000,000 and beyond
    let n = num.layer + 1
    if (num.gte("J^" + n + " 10")) n += 1
    return "K" + format(n, precision)
}

function formatMass(num, precision = 4) {
    if (num.lt("1000")) {
        return format(num, precision) + " 克";
    }
    else if (num.lt("1000000")) {
        return format(num.div(1000), precision) + " 千克";
    }
    else if (num.lt("1.619e20")) {
        return format(num.div("1000000"), precision) + " 吨";
    }
    else if (num.lt("5.972e27")) {
        return format(num.div("1.619e20"), precision) + " 珠峰质量";
    }
    else if (num.lt("1.989e33")) {
        return format(num.div("5.972e27"), precision) + " 地球质量";
    }
    else if (num.lt("2.9835e45")) {
        return format(num.div("1.989e33"), precision) + " 太阳质量";
    }
    else if (num.lt("1.5e56")) {
        return format(num.div("2.9835e45"), precision) + " 银河质量";
    }
    else if (num.lt("e1e9")) {
        return format(num.div("1.5e56"), precision) + " 宇宙";
    }
    else if (num.lt("e1e24")) {
        return format(num.log10().div("1e9"), precision) + " 多宇宙";
    }
    else if (num.lt("e1e39")) {
        return format(num.log10().div("1e24"), precision) + " 兆宇宙";
    }
    else if (num.lt("e1e54")) {
        return format(num.log10().div("1e39"), precision) + " 吉宇宙";
    }
    else if (num.lt("e1e69")) {
        return format(num.log10().div("1e54"), precision) + " 太宇宙";
    }
    else if (num.lt("e1e84")) {
        return format(num.log10().div("1e69"), precision) + " 拍宇宙";
    }
    else if (num.lt("e1e99")) {
        return format(num.log10().div("1e84"), precision) + " 艾宇宙";
    }
    else if (num.lt("e1e114")) {
        return format(num.log10().div("1e99"), precision) + " 泽宇宙";
    }
    else if (num.lt("e1e129")) {
        return format(num.log10().div("1e114"), precision) + " 尧宇宙";
    }
    else {
        mlt=num.log10().div("1e9")
        arv = mlt.log10().div(15).add(2)
        arvfm = arv.floor()
        if (arv.lt(1000)) {
            return format(mlt.div(n(1e15).pow(arvfm.sub(2))), precision) + " " + format(arvfm, 0) + "阶宇宙"
        }
        else if (num.lt("ee1.7976e308")) {
            return format(arv, precision) + " 多元宇宙"
        }
        else {
            bas = num.log10().log10()
            dim = num.log10().log10().log10().div("308.254716").add(3)
            dimf = dim.floor()
            if (dim.lt(1000)) {
                return format(bas.div(n("1.7976e308").pow(dimf.sub(3))), precision) + " " + format(dimf, 0) + "维宇宙"
            }
            else if (num.lt("(10^)^5 2.08")) {
                return format(dim,precision)+" 无限宇宙"
            }
            else return format(num.log10().log10().log10().log10().log10().div(2.08),precision)+" 庞加莱回归质量"
        }
    }
}

function formatWhole(num) {
    return format(num, 0)
}

function formatSmall(num, precision=2) { 
    return format(num, precision, true)    
}

function formatTime(s) {
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 86400) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}