addLayer("AC", {
    name: "ach",
    symbol: "Ac",
    startData() {
        return {
            unlocked: true,
            points:n(0),
        }
    },
    color: "#ffdd33",
    resource: "成就",
    row: "side",
    update(diff) {
        player.devSpeed = layers.AC.devSpeedCal()
    },
    devSpeedCal() {
        let dev = n(1)
        //if(isEndgame())dev=n(0)
        return dev
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "一个成就",
            done() { return false },
            tooltip: "这是一个成就",
            textStyle: { 'color': '#FFDD33' },
        },
    },
},
)
addLayer("p", {
    name: "声望点", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#FFFFFF",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "声望点", // Name of prestige currency
    baseResource: "点数", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasMilestone('r', 0)) mult = mult.mul(1.25)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return layers.r.rel()
    },
    passiveGeneration() {
        mult = n(0)
        if (hasUpgrade('e', 13)) mult = n(0.01)
        if (hasUpgrade('i',11))mult=n(1)
        return mult
    },
    autoUpgrade() {
        upg = false
        if (hasUpgrade('i', 13)) upg = true
        return upg
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P：获得声望点", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    milestones: {
        0: {
            requirementDescription: "获得1个声望点",
            effectDescription: "获得10倍的点数",
            done() { return player.p.points.gte(1) }
        },
    },
    upgrades: {
        11: {
            title: "P1",
            description: "点数获取x点数",
            effect() {
                let eff = player.points.max(1)
                if(hasMilestone('re',2))eff=eff.pow(1e9)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(4),
            unlocked() {return true },
        },
        12: {
            title: "P2",
            description: "点数获取x声望点数",
            effect() {
                let eff = player.p.points.max(1)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new ExpantaNum(1e10),
            unlocked() { return hasUpgrade('p', 11) },
        },
        13: {
            title: "P3",
            description: "解锁下一层",
            cost: new ExpantaNum("e1e10"),
            unlocked() { return hasUpgrade('p',12) },
        },
    },
    layerShown(){return true}
})
addLayer("i", {
    name: "无限", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new ExpantaNum(0),
        }
    },
    color: "#FFFFFF",

    requires: function () {
        let a = new ExpantaNum(10)
        if (hasUpgrade('i', 12))a=n(1e10)
        return a
    }, // Can be a function that takes requirement increases into account
    resource: "无限点数", // Name of prestige currency
    baseResource: function () { if (hasUpgrade('i', 12)) return "log(声望点)"; return "log(log(声望点))" }, // Name of resource prestige is based on
    baseAmount() { if (hasUpgrade('i', 12)) return player.p.points.max(1).log10(); return player.p.points.max(10).log10().log10() }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasMilestone('r', 1)) mult = mult.mul(10)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return layers.r.rel()
    },
    passiveGeneration() {
        mult = n(0)
        if(hasUpgrade('e',11))mult=n(1)
        return mult
    },
    effectDescription() {
        return "使点数获取^"+format(layers.i.inf())
    },
    autoUpgrade() {
        upg = false
        if (hasUpgrade('e', 13)) upg = true
        return upg
    },
    inf() {
        return player.i.points.sqrt().add(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "i", description: "I：获得无限点", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    milestones: {
        0: {
            requirementDescription: "获得10个无限点",
            effectDescription: "获得10倍的点数",
            done() { return player.i.points.gte(10) }
        },
    },
    upgrades: {
        11: {
            title: "I1",
            description: "每秒获得100%的声望点",
            effect() {
                let eff = n(1)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect().mul(100))+"%"; return a; },
            cost: new ExpantaNum(5),
            unlocked() { return true },
        },
        12: {
            title: "I2",
            description: "IP公式更好",
            cost: new ExpantaNum(100),
            unlocked() { return hasUpgrade('i',11) },
        },
        13: {
            title: "I3",
            description: "解锁下一层，自动购买P层升级",
            cost: new ExpantaNum("e1e10"),
            unlocked() { return hasUpgrade('i', 12) },
        },
        14: {
            title: "I4",
            description: "解锁转生质量",
            cost: new ExpantaNum("10^^^ee4.5e8"),
            unlocked() { return hasUpgrade('i', 13) && hasMilestone('re', 2) },
        },
    },
    layerShown() { return hasUpgrade('p',13)||player.i.unlocked }
})

addLayer("e", {
    name: "永恒", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new ExpantaNum(0),
        }
    },
    color: "#FFFFFF",

    requires: function () {
        let a = new ExpantaNum(3)
        return a
    }, // Can be a function that takes requirement increases into account
    resource: "永恒点数", // Name of prestige currency
    baseResource: function () { return "slog(无限点)" }, // Name of resource prestige is based on
    baseAmount() { return player.i.points.max(1).slog() }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let ff = layers.r.rel()
        if(hasMilestone('re',2))ff=ff.mul(1e69)
        return ff
    },
    passiveGeneration() {
        mult = n(0)
        if (hasUpgrade('r', 11)) mult = n(1)
        return mult
    },
    effectDescription() {
        return "使点数获取^^" + format(layers.e.etr())
    },
    etr() {
        if (hasUpgrade('e', 14)) return player.e.points.add(1).mul(upgradeEffect('e',14))
        if(hasUpgrade('e',12))return player.e.points.add(1)
        return player.e.points.cbrt().div(2).add(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "e", description: "E：获得永恒点", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    milestones: {
        0: {
            requirementDescription: "获得1个永恒点",
            effectDescription: "获得1.25倍的点数",
            done() { return player.e.points.gte(1) }
        },
        1: {
            requirementDescription: "获得10个永恒点",
            effectDescription: "获得10倍的点数",
            done() { return player.e.points.gte(10) }
        },
    },
    upgrades: {
        11: {
            title: "E1",
            description: "每秒获得100%的无限点",
            effect() {
                let eff = n(1)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect().mul(100)) + "%"; return a; },
            cost: new ExpantaNum(5),
            unlocked() { return true },
        },
        12: {
            title: "E2",
            description: "EP效果公式更好",
            cost: new ExpantaNum(1000),
            unlocked() { return hasUpgrade('e', 11) },
        },
        13: {
            title: "E3",
            description: "自动购买I层升级，每秒获得1%的声望点",
            cost: new ExpantaNum(1e10),
            unlocked() { return hasUpgrade('e', 12) },
        },
        14: {
            title: "E4",
            description: "基于点数提升EP效果",
            effect() {
                let eff = player.points.max(10).slog()
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new ExpantaNum(1e35),
            unlocked() { return hasUpgrade('e', 13) },
        },
        15: {
            title: "E5",
            description: "解锁物质维度",
            cost: new ExpantaNum("10^^^300000"),
            unlocked() { return hasUpgrade('e', 14)&&hasMilestone('re',1) },
        },
        16: {
            title: "E6",
            description: "自动买10个维度",
            cost: new ExpantaNum("10^^^1e12"),
            unlocked() { return hasUpgrade('e', 15) },
        },
        21: {
            title: "E7",
            description: "第一维度产量x1e20",
            cost: new ExpantaNum("10^^^1e26"),
            unlocked() { return hasUpgrade('e', 16) },
        },
        22: {
            title: "E8",
            description: "所有维度价格^0.25",
            cost: new ExpantaNum("10^^^1e62"),
            unlocked() { return hasUpgrade('e', 21) },
        },
        23: {
            title: "E9",
            description: "转生点也增幅物质维度",
            cost: new ExpantaNum("10^^^1e248"),
            unlocked() { return hasUpgrade('e', 22) },
        },
        24: {
            title: "E10",
            description: "物质效果更好",
            cost: new ExpantaNum("10^^^1e264"),
            unlocked() { return hasUpgrade('e', 23) },
        },
        25: {
            title: "E11",
            description: "所有维度购买10个的乘数x2→x6.5",
            cost: new ExpantaNum("10^^^e70000"),
            unlocked() { return hasUpgrade('e', 24) },
        },
        26: {
            title: "E12",
            description: "解锁无限维度",
            cost: new ExpantaNum("10^^^e1210000"),
            unlocked() { return hasUpgrade('e', 25) },
        },
        31: {
            title: "E13",
            description: "自动购买无限维度",
            cost: new ExpantaNum("10^^^e4500000"),
            unlocked() { return hasUpgrade('e', 26) },
        },
        32: {
            title: "E14",
            description: "物质效果更好",
            cost: new ExpantaNum("10^^^e8250000"),
            unlocked() { return hasUpgrade('e', 31) },
        },
        33: {
            title: "E15",
            description: "基于物质增幅无限维度",
            effect() {
                let eff = player.ma.points.max(1).pow(0.00035)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new ExpantaNum("10^^^ee1e7"),
            unlocked() { return hasUpgrade('e', 32) },
        },
        34: {
            title: "E16",
            description: "基于转生点增幅无限维度和无限之力增幅物质维度的比率",
            effect() {
                let eff = player.re.points.add(1).log10().add(1).pow(6.75)
                return eff
            },
            effect2() {
                let eff = player.re.points.add(1).log10().add(1)
                if(hasUpgrade('e',45))eff=eff.mul(player.re.mass.max(10).log10().div(10).add(1).min(10))
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()) + ", +" + format(this.effect2()); return a; },
            cost: new ExpantaNum("10^^^ee2.2212221e7"),
            unlocked() { return hasUpgrade('e', 33) },
        },
        35: {
            title: "E17",
            description: "无限维度x6365",
            cost: new ExpantaNum("10^^^ee7e7"),
            unlocked() { return hasUpgrade('e', 34) },
        },
        36: {
            title: "E18",
            description: "转生点也增幅无限维度",
            cost: new ExpantaNum("10^^^ee2e8"),
            unlocked() { return hasUpgrade('e', 35) },
        },
        41: {
            title: "E19",
            description: "转生质量增加自身获取",
            cost: new ExpantaNum("10^^^ee2.5e9"),
            unlocked() { return hasUpgrade('e', 36)&&hasMilestone('re',3) },
        },
        42: {
            title: "E20",
            description: "无限之力增加转生质量获取",
            cost: new ExpantaNum("10^^^ee3e9"),
            unlocked() { return hasUpgrade('e', 41) },
        },
        43: {
            title: "E21",
            description: "增加E19效果",
            cost: new ExpantaNum("10^^^ee1e10"),
            unlocked() { return hasUpgrade('e', 42) },
        },
        44: {
            title: "E22",
            description: "转生质量增幅无限之力，上限1e25",
            cost: new ExpantaNum("10^^^ee2e10"),
            unlocked() { return hasUpgrade('e', 43) },
        },
        45: {
            title: "E23",
            description: "转生质量增加E16效果2",
            cost: new ExpantaNum("10^^^ee3.5e10"),
            unlocked() { return hasUpgrade('e', 44) },
        },
        46: {
            title: "E24",
            description: "物质增加转生质量获取",
            cost: new ExpantaNum("10^^^ee6e10"),
            unlocked() { return hasUpgrade('e', 45) },
        },
        51: {
            title: "E25",
            description: "超过1e22500的物质增加转生质量获取",
            cost: new ExpantaNum("10^^^ee1e12"),
            unlocked() { return hasUpgrade('e', 46) },
        },
        52: {
            title: "E26",
            description: "E22 ^3",
            cost: new ExpantaNum("10^^^ee1e19"),
            unlocked() { return hasUpgrade('e', 51)&&hasMilestone('re',4) },
        },
        53: {
            title: "E27",
            description: "E25 ^2",
            cost: new ExpantaNum("10^^^ee1e20"),
            unlocked() { return hasUpgrade('e', 52) },
        },
        54: {
            title: "E28",
            description: "增加E19效果",
            cost: new ExpantaNum("10^^^ee1e40"),
            unlocked() { return hasUpgrade('e', 53) },
        },
        55: {
            title: "E29",
            description: "转生质量效果^2",
            cost: new ExpantaNum("10^^^ee1e125"),
            unlocked() { return hasUpgrade('e', 54) },
        },
        56: {
            title: "E30",
            description: "无限之力对数增加自身，超过1.8e308的无限之力削弱转生质量效果第一重软上限",
            cost: new ExpantaNum("10^^^ee1e469"),
            unlocked() { return hasUpgrade('e', 55) },
        },
        61: {
            title: "E31",
            description: "无限之力x1e20，转生质量x10",
            cost: new ExpantaNum("10^^^ee1e560"),
            unlocked() { return hasUpgrade('e', 56) },
        },
        62: {
            title: "E32",
            description: "购买维度不消耗物质、无限之力，削弱物质软上限",
            cost: new ExpantaNum("10^^^ee1e640"),
            unlocked() { return hasUpgrade('e', 61) && hasMilestone('re', 5) },
        },
        63: {
            title: "E33",
            description: "物质效果对转生质量生效，但是极度削弱",
            cost: new ExpantaNum("10^^^ee1e660"),
            unlocked() { return hasUpgrade('e', 62) },
        },
        64: {
            title: "E34",
            description: "增加E19效果",
            cost: new ExpantaNum("10^^^ee1e736"),
            unlocked() { return hasUpgrade('e', 63) },
        },
        65: {
            title: "E35",
            description: "增加E24效果",
            cost: new ExpantaNum("10^^^ee1e1000"),
            unlocked() { return hasUpgrade('e', 64) },
        },
        66: {
            title: "E36",
            description: "物质基础效果更好",
            cost: new ExpantaNum("10^^^ee1e1150"),
            unlocked() { return hasUpgrade('e', 65) },
        },
        71: {
            title: "E37",
            description: "转生质量增加物质基础效果",
            cost: new ExpantaNum("10^^^ee1e1390"),
            unlocked() { return hasUpgrade('e', 66) },
        },
        72: {
            title: "E38",
            description: "增加E19效果",
            cost: new ExpantaNum("10^^^ee1e2172"),
            unlocked() { return hasUpgrade('e', 71) },
        },
        73: {
            title: "E39",
            description: "E29 ^2->^3",
            cost: new ExpantaNum("10^^^ee1e3072"),
            unlocked() { return hasUpgrade('e', 72) },
        },
        74: {
            title: "E40",
            description: "E30对转生质量效果第二重软上限生效",
            cost: new ExpantaNum("10^^^ee1e8030"),
            unlocked() { return hasUpgrade('e', 73) },
        },
        75: {
            title: "E41",
            description: "转生质量对数增加自身获取",
            cost: new ExpantaNum("10^^^ee1e8181"),
            unlocked() { return hasUpgrade('e', 74) },
        },
        76: {
            title: "E42",
            description: "E29 ^3->^3.6",
            cost: new ExpantaNum("10^^^ee1e8350"),
            unlocked() { return hasUpgrade('e', 75) },
        },
        81: {
            title: "E43",
            description: "增加E19效果，解锁一排升级",
            cost: new ExpantaNum("10^^^ee1e8819"),
            unlocked() { return hasUpgrade('e', 76) },
        },
        82: {
            title: "E44",
            description: "削弱无限之力软上限",
            cost: new ExpantaNum("10^^^ee1e9191"),
            unlocked() { return hasUpgrade('e', 81) },
        },
        83: {
            title: "E45",
            description: "增加转生质量基础获取",
            cost: new ExpantaNum("10^^^ee1e11000"),
            unlocked() { return hasUpgrade('e', 81) },
        },
        84: {
            title: "E46",
            description: "增加转生质量基础获取",
            cost: new ExpantaNum("10^^^ee1e12345"),
            unlocked() { return hasUpgrade('e', 81) },
        },
        85: {
            title: "E47",
            description: "增加转生点效果",
            cost: new ExpantaNum("10^^^ee1e13700"),
            unlocked() { return hasUpgrade('e', 81) },
        },
        86: {
            title: "E48",
            description: "E41 ^3",
            cost: new ExpantaNum("10^^^ee1e16000"),
            unlocked() { return hasUpgrade('e', 81) },
        },
        91: {
            title: "E49",
            description: "E41 ^3->^4.5",
            cost: new ExpantaNum("10^^^ee1e22500"),
            unlocked() { return hasUpgrade('e', 86)&&hasMilestone('re',6) },
        },
        92: {
            title: "E50",
            description: "提升转生质量效果，E41 ^4.5->^5",
            cost: new ExpantaNum("10^^^ee1e28000"),
            unlocked() { return hasUpgrade('e', 91) },
        },
        93: {
            title: "E51",
            description: "解锁转生黑洞质量",
            cost: new ExpantaNum("10^^^eee1.4e5"),
            unlocked() { return hasUpgrade('e', 92) },
        },
        94: {
            title: "E52",
            description: "提升黑洞质量效果公式",
            cost: new ExpantaNum("10^^^eee3.2e5"),
            unlocked() { return hasUpgrade('e', 93) },
        },
        95: {
            title: "E53",
            description: "转生质量增加黑洞质量获取",
            cost: new ExpantaNum("10^^^eee4e5"),
            unlocked() { return hasUpgrade('e', 94) },
        },
        96: {
            title: "E54",
            description() { return hasUpgrade('e', 96) ? "转生质量基础获取^2" : "404 Not Found" },
            cost: new ExpantaNum("10^^^eee5e5"),
            unlocked() { return hasUpgrade('e', 95) && hasMilestone('re', 8) },
        },
        101: {
            title: "E55",
            description: "削弱一个软上限",
            cost: new ExpantaNum("10^^^eee1.2e6"),
            unlocked() { return hasUpgrade('e', 96) },
        },
        102: {
            title: "E56",
            description: "E41 ^5->^7",
            cost: new ExpantaNum("10^^^eee1.3e7"),
            unlocked() { return hasUpgrade('e', 101) },
        },
        103: {
            title: "E57",
            description: "削弱一个软上限，增加黑洞质量获取",
            cost: new ExpantaNum("10^^^eee3e7"),
            unlocked() { return hasUpgrade('e', 102) },
        },
        104: {
            title: "E58",
            description: "增加E19效果",
            cost: new ExpantaNum("10^^^eee5e7"),
            unlocked() { return hasUpgrade('e', 103) },
        },
        105: {
            title: "E59",
            description: "提升黑洞质量效果公式",
            cost: new ExpantaNum("10^^^eee1.5e8"),
            unlocked() { return hasUpgrade('e', 104) },
        },
        106: {
            title: "E60",
            description: "削弱一个软上限",
            cost: new ExpantaNum("10^^^eee3e8"),
            unlocked() { return hasUpgrade('e', 105) },
        },
    },
    layerShown() { return hasUpgrade('i', 13) || player.e.unlocked }
})

addLayer("r", {
    name: "现实", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new ExpantaNum(0),
        }
    },
    color: "#FFFFFF",

    requires: function () {
        let a = new ExpantaNum(3.25)
        return a
    }, // Can be a function that takes requirement increases into account
    resource: "现实点数", // Name of prestige currency
    baseResource: function () { return "slog(永恒点)" }, // Name of resource prestige is based on
    baseAmount() { return player.e.points.max(1).slog() }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasMilestone('re', 4)) mult = mult.mul("10^^^1e5")
        if (hasMilestone('re', 5)) mult = mult.mul("10^^^3e5")
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let a = n(1)
        if (hasUpgrade('r', 13)) a = n(1e9)
        if (hasMilestone('re', 0)) a = a.mul(1.02)
        if (hasMilestone('re', 1)) a = a.mul(3000)
        return a
    },
    passiveGeneration() {
        mult = n(0)
        if (hasUpgrade('r', 11)) mult = n(0.025)
        return mult
    },
    effectDescription() {
        return "使先前的所有点数获取^" + format(layers.r.rel())
    },
    rel() {
        if (hasUpgrade('r', 25)) return n(10).tetr(player.r.total.pow("1e150").tetr(player.r.total.max(10).slog().pow("1e150").tetr(player.r.total.max(10).slog().slog().pow(player.r.total.max(10).slog().slog()).tetr(player.r.total.max(10).slog().slog().slog().pow(player.r.total.max(10).slog().slog().log10().pow(4))))).mul("e1e1500").add(1)).mul(layers.re.reinc())
        if (hasUpgrade('r', 24)) return n(10).tetr(player.r.total.pow("1e150").tetr(player.r.total.max(10).slog().pow("1e150").tetr(player.r.total.max(10).slog().slog().pow(player.r.total.max(10).slog().slog()))).mul("e1e1500").add(1)).mul(layers.re.reinc())
        if (hasUpgrade('r', 23)) return n(10).tetr(player.r.total.pow("1e150").tetr(player.r.total.max(10).slog().pow("1e150").tetr(player.r.total.max(10).slog().slog())).mul("e1e1500").add(1)).mul(layers.re.reinc())
        if (hasUpgrade('r', 22)) return n(10).tetr(player.r.total.pow("1e150").tetr(player.r.total.max(10).slog().pow("1e150").tetr(1.05)).mul("e1e1500").add(1)).mul(layers.re.reinc())
        if (hasUpgrade('r', 21)) return n(10).tetr(player.r.total.pow("1e150").tetr(player.r.total.max(10).slog().pow("1e150")).mul("e1e1500").add(1)).mul(layers.re.reinc())
        if (hasUpgrade('r', 16)) return n(10).tetr(player.r.total.pow("1e150").tetr(player.r.total.max(10).slog()).mul("e1e1500").add(1)).mul(layers.re.reinc())
        if (hasUpgrade('r', 15)) return n(10).tetr(player.r.total.pow("1e150").tetr(2).mul("e1e1500").add(1)).mul(layers.re.reinc())
        if (hasUpgrade('r', 14)) return n(10).tetr(player.r.total.pow("1e150").mul("e1e1500").add(1)).mul(layers.re.reinc())
        if (hasUpgrade('r', 12)) return n(10).tetr(player.r.total.pow(10).mul(1e15).add(1)).mul(layers.re.reinc())
        if (hasMilestone('r', 2)) return n(10).tetr(player.r.total.pow(2).add(1)).mul(layers.re.reinc())
        return n(10).tetr(player.r.points).mul(layers.re.reinc())
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "r", description: "R：获得现实点", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    milestones: {
        0: {
            requirementDescription: "获得1个现实点",
            effectDescription: "获得1.25倍的点数、声望点",
            done() { return player.r.points.gte(1) }
        },
        1: {
            requirementDescription: "获得10个现实点",
            effectDescription: "获得10倍的点数、无限点",
            done() { return player.r.points.gte(10) }
        },
        2: {
            requirementDescription: "获得15个现实点",
            effectDescription: "更改现实点的效果公式",
            done() { return player.r.points.gte(15) }
        },
    },
    upgrades: {
        11: {
            title: "R1",
            description: "每秒获得100%的永恒点和2.5%的现实点",
            effect() {
                let eff = n(1)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect().mul(100)) + "%"; return a; },
            cost: new ExpantaNum(5),
            unlocked() { return true },
        },
        12: {
            title: "R2",
            description: "再次更改现实点的效果公式",
            cost: new ExpantaNum("e1e10"),
            unlocked() { return hasUpgrade('r', 11) },
        },
        13: {
            title: "R3",
            description: "现实点^1e9",
            cost: new ExpantaNum("e1.7977e308"),
            unlocked() { return hasUpgrade('r', 12) },
        },
        14: {
            title: "R4",
            description: "再再次更改现实点的效果公式",
            cost: new ExpantaNum("e1e5000"),
            unlocked() { return hasUpgrade('r', 13) },
        },
        15: {
            title: "R5",
            description: "再再再次更改现实点的效果公式",
            cost: new ExpantaNum("ee1e5"),
            unlocked() { return hasUpgrade('r', 14) },
        },
        16: {
            title: "R6",
            description: "再再再再次更改现实点的效果公式",
            cost: new ExpantaNum("(10^)^307 62.7724"),
            unlocked() { return hasUpgrade('r', 15) },
        },
        21: {
            title: "R7",
            description: "G正在离我们越来越近......",
            cost: new ExpantaNum("10^^1.7977e308"),
            unlocked() { return hasUpgrade('r', 16) },
        },
        22: {
            title: "R8",
            description: "最后一步......",
            cost: new ExpantaNum("10^^ee1e5"),
            unlocked() { return hasUpgrade('r', 21) },
        },
        23: {
            title: "R9",
            description: "还没有结束？",
            cost: new ExpantaNum("10^^(10^)^500 10"),
            unlocked() { return hasMilestone('re', 0) && hasUpgrade('r', 22) },
        },
        24: {
            title: "R10",
            description: "是不是该结束了？",
            cost: new ExpantaNum("10^^10^^1.7977e308"),
            unlocked() { return hasUpgrade('r', 23) },
        },
        25: {
            title: "R11",
            description: "真的该结束了...",
            cost: new ExpantaNum("10^^10^^(10^)^307 62.7724"),
            unlocked() { return hasUpgrade('r', 24) },
        },
        26: {
            title: "R12",
            description: "点数获取^^^100",
            cost: new ExpantaNum("(10^^)^307 1.89e6"),
            unlocked() { return hasUpgrade('r', 25) },
        },
    },
    layerShown() { return hasUpgrade('e', 14) || player.r.unlocked }
})

addLayer("re", {
    name: "转生", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Re", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new ExpantaNum(0),
            mass: new ExpantaNum(0),
            bh: new ExpantaNum(0),
        }
    },
    color: "#FFFFFF",

    requires: function () {
        if (player.re.points.lt(1)) return n("(10^^)^4 1455")
        if (player.re.points.lt(2)) return n("10^^^114514")
        if (player.re.points.lt(3)) return n("10^^^ee3e8")
        if (player.re.points.lt(4)) return n("10^^^ee1e19")
        if (player.re.points.lt(5)) return n("10^^^ee1e616")
        if (player.re.points.lt(6)) return n("10^^^ee1e20000")
        if (player.re.points.lt(7)) return n("10^^^eee5e5")
        return n(1e309)
    }, // Can be a function that takes requirement increases into account
    resource: "转生点数", // Name of prestige currency
    baseResource: function () { return "点数" }, // Name of resource prestige is based on
    baseAmount() { return player.points }, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.00001, // Prestige currency exponent
    base:1.00000001,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let a = n(1)
        return a
    },
    passiveGeneration() {
        mult = n(0)
        return mult
    },
    effectDescription() {
        return "x" + format(layers.re.reinc()) + "到现实点效果" + (hasUpgrade('e', 23) ? "和物质" + ((hasUpgrade('e', 36) ? "、无限": ""))+"维度产量":"")
    },
    reinc() {
        if (hasUpgrade('e', 85)) return player.re.points.pow(10).add(1e6)
        return player.re.points.pow(4).add(1)
    },
    mfsc1() {
        let ef = n(0.02)
        if (hasUpgrade('e', 56))ef=ef.add(player.id.points.max(1).log10().div(308.254716).sub(1).max(0).pow(0.4).div(3))
        ef=ef.min(0.9)
        return ef
    },
    mfsc2() {
        let ef = n(0.005)
        if (hasUpgrade('e', 74)) ef = ef.add(player.id.points.max(1).log10().div(308.254716).sub(1).max(0).pow(0.4).div(4))
        if (hasUpgrade('e', 101)) ef = ef.root(1.2)
        if (hasUpgrade('e', 106)) ef = ef.root(1.18)
        ef=ef.min(0.9)
        return ef
    },
    mfsc3() {
        let ef = n(0.2)
        return ef
    },
    matterform() {
        if(!hasMilestone('re',3))return n(0)
        let eff = player.re.mass.pow(0.15).min(player.re.mass).div(20)
        if (hasUpgrade('e', 92)) eff = player.re.mass.pow(0.25).min(player.re.mass)
        if (hasUpgrade('e', 76) && eff.gte(1)) eff = eff.pow(3.6)
        else if (hasUpgrade('e', 73) && eff.gte(1)) eff = eff.pow(3)
        else if(hasUpgrade('e',55)&&eff.gte(1))eff=eff.pow(2)
        if (eff.gte(100)) eff = eff.div(100).pow(tmp.re.mfsc1).mul(100)
        if (eff.gte(1000)) eff = eff.div(1000).pow(tmp.re.mfsc2).mul(1000)
        if (eff.gte(1e9)) eff = eff.div(1e9).pow(tmp.re.mfsc3).mul(1e9)
        return eff
    },
    bhform() {
        if (!hasMilestone('re', 7)) return n(1)
        let eff = player.re.bh.add(1).log10().pow(10)
        if (hasUpgrade('e', 105)) eff = eff.mul(player.re.bh.add(1).pow(0.25))
        if(hasUpgrade('e',94))eff=eff.mul(player.re.bh.add(1).pow(0.15))
        return eff
    },
    massgen() {
        if (!hasMilestone('re', 3)) return n(0)
        let gain = player.re.points.pow(2)
        if (hasUpgrade('e', 83)) gain = player.re.points.pow(n(4).add(player.re.points.max(1).log10()))
        if (hasUpgrade('e', 84)) gain = player.re.points.pow(n(6).add(player.re.points.max(1).log10().mul(2)))
        if (hasUpgrade('e', 96)) gain = gain.pow(2)
        if (hasUpgrade('e', 102)) gain = gain.mul(player.re.mass.max(10).log10().pow(7))
        else if (hasUpgrade('e', 92)) gain = gain.mul(player.re.mass.max(10).log10().pow(5))
        else if (hasUpgrade('e', 91)) gain = gain.mul(player.re.mass.max(10).log10().pow(4.5))
        else if (hasUpgrade('e', 86)) gain = gain.mul(player.re.mass.max(10).log10().pow(3))
        else if (hasUpgrade('e', 75)) gain = gain.mul(player.re.mass.max(10).log10())
        if (hasUpgrade('e', 63)) gain = gain.mul(tmp.ma.matter.max(10).log10().max(10).log10().max(10).log10().pow(0.5).min(1e8))
        if (hasUpgrade('e', 61)) gain = gain.mul(10)
        if (hasUpgrade('e', 104)) gain = gain.mul(player.re.mass.max(1).pow(0.66))
        else if (hasUpgrade('e', 81)) gain = gain.mul(player.re.mass.max(1).pow(0.625))
        else if (hasUpgrade('e', 72)) gain = gain.mul(player.re.mass.max(1).pow(0.58))
        else if (hasUpgrade('e', 64)) gain = gain.mul(player.re.mass.max(1).pow(0.5))
        else if(hasUpgrade('e', 54)) gain = gain.mul(player.re.mass.max(1).pow(0.4))
        else if (hasUpgrade('e', 43)) gain = gain.mul(player.re.mass.max(1).pow(0.25))
        else if (hasUpgrade('e', 41)) gain = gain.mul(player.re.mass.max(1).pow(0.1))
        if (hasUpgrade('e', 42)) gain = gain.mul(player.id.points.max(10).log10().pow(0.5))
        if (hasUpgrade('e', 65)) gain = gain.mul(player.ma.points.max(10).log10().pow(0.5))
        else if (hasUpgrade('e', 46)) gain = gain.mul(player.ma.points.max(10).log10().pow(0.33))
        if (hasUpgrade('e', 53)) gain = gain.mul(player.ma.points.max(10).log10().sub(22499).pow(2).max(1))
        else if (hasUpgrade('e', 51)) gain = gain.mul(player.ma.points.max(10).log10().sub(22499).max(1))
        gain=gain.mul(tmp.re.bhform)
        return gain
    },
    bhmassgen() {
        if (!hasMilestone('re', 7)) return n(0)
        let gain = player.re.points.pow(2).mul(player.re.bh.add(1).pow(0.33))
        if (hasUpgrade('e', 95)) gain = gain.mul(player.re.mass.add(10).log10())
        if (hasUpgrade('e', 103)) gain = gain.mul(player.ma.points.max(10).log10().pow(0.5))
        return gain
    },
    update(diff) {
        if (hasMilestone('re', 3)) {
            player.re.mass=player.re.mass.add(tmp.re.massgen.mul(diff))
        }
        if (hasMilestone('re', 7)) {
            player.re.bh = player.re.bh.add(tmp.re.bhmassgen.mul(diff))
        }
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: ",", description: ",：进行转生", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    milestones: {
        0: {
            requirementDescription: "获得1个转生点",
            effectDescription: "解锁更多现实点升级，现实点^1.02",
            done() { return player.re.points.gte(1) }
        },
        1: {
            requirementDescription: "获得2个转生点",
            effectDescription: "达到条件可解锁物质维度，物质加成点数获取，解锁更多永恒点升级，现实点^3000",
            done() { return player.re.points.gte(2) }
        },
        2: {
            requirementDescription: "获得3个转生点",
            effectDescription: "P1 ^1e9，永恒点 ^1e69",
            done() { return player.re.points.gte(3) }
        },
        3: {
            requirementDescription: "解锁转生质量",
            effectDescription:function() { return "你当前有"+formatMass(player.re.mass)+"（获取基于转生点数，+"+formatMass(tmp.re.massgen)+" 每秒），物质效果的公式+"+format(tmp.re.matterform) },
            done() { return hasUpgrade('i', 14) },
            unlocked() { return hasUpgrade('i', 14)||hasMilestone('re',3) }
        },
        4: {
            requirementDescription: "获得4个转生点",
            effectDescription: "现实点xG1e5",
            done() { return player.re.points.gte(4) }
        },
        5: {
            requirementDescription: "获得5个转生点",
            effectDescription: "现实点xG3e5，物质x1e10",
            done() { return player.re.points.gte(5) }
        },
        6: {
            requirementDescription: "获得6个转生点",
            effectDescription: "无限之力x1e8",
            done() { return player.re.points.gte(6) }
        },
        7: {
            requirementDescription: "解锁转生黑洞质量",
            effectDescription: function () { return "你当前有" + formatMass(player.re.bh) + "（获取基于转生点数和自身，+" + formatMass(tmp.re.bhmassgen) + " 每秒），转生质量获取x" + format(tmp.re.bhform) },
            done() { return hasUpgrade('e', 93) },
            unlocked() { return hasUpgrade('e', 93) || hasMilestone('re', 7) }
        },
        8: {
            requirementDescription: "获得7个转生点",
            effectDescription: "物质x1e1000，同时在软上限后x1e10",
            done() { return player.re.points.gte(7) }
        },
    },
    upgrades: {
    },
    layerShown() { return hasUpgrade('r', 22) || player.re.unlocked }
})
addLayer("ma", {
    name: "物质维度", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "MD", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new ExpantaNum(10),
            gained1: n(0),
            gained2: n(0),
            gained3: n(0),
            gained4: n(0),
            gained5: n(0),
            gained6: n(0),
            gained7: n(0),
        }
    },
    color: "#CD12EF",
 // Can be a function that takes requirement increases into account
    resource: "物质", // Name of prestige currency
    effectDescription() {
        return "使点数获取^^^" + format(layers.ma.matter())
    },
    matter() {
        if (!hasUpgrade('e', 15)) return n(1)
        if (hasUpgrade('e', 71)) return n(10).pow(n(10).pow(player.ma.points.max(1).log10().max(1).mul(player.ma.points.max(1).log10().max(1).log10().max(1)).mul(tmp.re.matterform).pow(n(2).add(tmp.re.matterform)))).add(1).floor()
        if (hasUpgrade('e', 66)) return n(10).pow(n(10).pow(player.ma.points.max(1).log10().max(1).mul(player.ma.points.max(1).log10().max(1).log10().max(1)).pow(n(2).add(tmp.re.matterform)))).add(1).floor()
        if (hasUpgrade('e', 32)) return n(10).pow(n(10).pow(player.ma.points.max(1).log10().max(1).pow(n(2).add(tmp.re.matterform)))).add(1).floor()
        if (hasUpgrade('e', 24)) return n(10).pow(player.ma.points.max(1).log10().max(1).pow(n(2).add(tmp.re.matterform))).add(1).floor()
        return player.ma.points.add(1).floor()
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
    update(diff) {
        player.ma.points = player.ma.points.add(buyableEffect('ma', 11).mul(diff))
        player.ma.gained1 = player.ma.gained1.add(buyableEffect('ma', 12).mul(diff))
        player.ma.gained2 = player.ma.gained2.add(buyableEffect('ma', 21).mul(diff))
        player.ma.gained3 = player.ma.gained3.add(buyableEffect('ma', 22).mul(diff))
        player.ma.gained4 = player.ma.gained4.add(buyableEffect('ma', 31).mul(diff))
        player.ma.gained5 = player.ma.gained5.add(buyableEffect('ma', 32).mul(diff))
        player.ma.gained6 = player.ma.gained6.add(buyableEffect('ma', 41).mul(diff))
        player.ma.gained7 = player.ma.gained7.add(buyableEffect('ma', 42).mul(diff))
        if (hasUpgrade('e', 16)) {
            if (layers.ma.buyables[42].canAfford()) layers.ma.buyables[42].buy()
            if (layers.ma.buyables[41].canAfford()) layers.ma.buyables[41].buy()
            if (layers.ma.buyables[32].canAfford()) layers.ma.buyables[32].buy()
            if (layers.ma.buyables[31].canAfford()) layers.ma.buyables[31].buy()
            if (layers.ma.buyables[22].canAfford()) layers.ma.buyables[22].buy()
            if (layers.ma.buyables[21].canAfford()) layers.ma.buyables[21].buy()
            if (layers.ma.buyables[12].canAfford()) layers.ma.buyables[12].buy()
            if (layers.ma.buyables[11].canAfford()) layers.ma.buyables[11].buy()
        }
    },
    milestones: {
    },
    upgrades: {
    },
    buyables: {

        11: {
            title: "第一物质维度",
            cost(x) {
                let a = n(10)
                a = a.mul(n(1000).pow(x.div(10).floor()))
                if (a.gte("1.7977e308")) a = a.div("1.7977e308").pow(a.log(10).div(308.25)).mul("1.7977e308")
                if(hasUpgrade('e',22))a=a.pow(0.25)
                return a
            },
            display() {
                return "每秒生产" + format(this.effect()) + "物质<br>价格: " + format(this.cost()) + "物质<br>已拥有: " + format(player.ma.gained1.add(getBuyableAmount(this.layer, this.id))) + "<br>已购买: " + format(getBuyableAmount(this.layer, this.id)) + "/" + format(this.purchaseLimit())
            },
            canAfford() { return player.ma.points.gte(this.cost()) },
            buy() {
                if(!hasUpgrade('e',62))player.ma.points = player.ma.points.sub(this.cost())
                if (hasUpgrade('e',16)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).div(10).floor().mul(10).add(10).max(getBuyableAmount(this.layer, this.id).add(1)))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = player.ma.gained1.add(x)
                if (hasUpgrade('e', 25)) eff = eff.mul(n(6.5).pow(x.div(10).floor()))
                else eff = eff.mul(n(2).pow(x.div(10).floor()))
                if (hasUpgrade('e', 21)) eff = eff.mul(1e20)
                if (hasUpgrade('e', 23)) eff = eff.mul(layers.re.reinc())
                eff = eff.mul(layers.id.inf())
                if (hasMilestone('re', 5)) eff = eff.mul(1e10)
                if (hasMilestone('re', 8)) eff = eff.mul('1e1000')
                if (eff.gte("1e22500") && !hasUpgrade('e', 62)) eff = eff.div("1e22500").pow(0.03).mul("1e22500")
                else if (eff.gte("1e22500") && !hasUpgrade('e', 103)) eff = eff.div("1e22500").pow(0.04).mul("1e22500")
                else if (eff.gte("1e25000")) eff = eff.div("1e25000").pow(0.06).mul("1e25000")
                if (hasMilestone('re', 8)) eff = eff.mul(1e10)
                return eff
            },
            purchaseLimit() {
                let max = n(1e309)
                return max
            },
            unlocked() { return hasUpgrade('e', 15) },
        },
        12: {
            title: "第二物质维度",
            cost(x) {
                let a = n(100)
                a = a.mul(n(1e4).pow(x.div(10).floor()))
                if (a.gte("1.7977e308")) a = a.div("1.7977e308").pow(a.log(10).div(308.25)).mul("1.7977e308")
                if (hasUpgrade('e', 22)) a = a.pow(0.25)
                return a
            },
            display() {
                return "每秒生产" + format(this.effect()) + "第一维度<br>价格: " + format(this.cost()) + "物质<br>已拥有: " + format(player.ma.gained2.add(getBuyableAmount(this.layer, this.id))) + "<br>已购买: " + format(getBuyableAmount(this.layer, this.id)) + "/" + format(this.purchaseLimit())
            },
            canAfford() { return player.ma.points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('e', 62)) player.ma.points = player.ma.points.sub(this.cost())
                if (hasUpgrade('e', 16)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).div(10).floor().mul(10).add(10).max(getBuyableAmount(this.layer, this.id).add(1)))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = player.ma.gained2.add(x)
                if (hasUpgrade('e', 25)) eff = eff.mul(n(6.5).pow(x.div(10).floor()))
                else eff = eff.mul(n(2).pow(x.div(10).floor()))
                if (hasUpgrade('e', 23)) eff = eff.mul(layers.re.reinc())
                eff = eff.mul(layers.id.inf())
                return eff
            },
            purchaseLimit() {
                let max = n(1e309)
                return max
            },
            unlocked() { return hasUpgrade('e', 15) },
        },
        21: {
            title: "第三物质维度",
            cost(x) {
                let a = n(1e3)
                a = a.mul(n(1e5).pow(x.div(10).floor()))
                if (a.gte("1.7977e308")) a = a.div("1.7977e308").pow(a.log(10).div(308.25)).mul("1.7977e308")
                if (hasUpgrade('e', 22)) a = a.pow(0.25)
                return a
            },
            display() {
                return "每秒生产" + format(this.effect()) + "第二维度<br>价格: " + format(this.cost()) + "物质<br>已拥有: " + format(player.ma.gained3.add(getBuyableAmount(this.layer, this.id))) + "<br>已购买: " + format(getBuyableAmount(this.layer, this.id)) + "/" + format(this.purchaseLimit())
            },
            canAfford() { return player.ma.points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('e', 62)) player.ma.points = player.ma.points.sub(this.cost())
                if (hasUpgrade('e', 16)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).div(10).floor().mul(10).add(10).max(getBuyableAmount(this.layer, this.id).add(1)))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = player.ma.gained3.add(x)
                if (hasUpgrade('e', 25)) eff = eff.mul(n(6.5).pow(x.div(10).floor()))
                else eff = eff.mul(n(2).pow(x.div(10).floor()))
                if (hasUpgrade('e', 23)) eff = eff.mul(layers.re.reinc())
                eff = eff.mul(layers.id.inf())
                return eff
            },
            purchaseLimit() {
                let max = n(1e309)
                return max
            },
            unlocked() { return hasUpgrade('e', 15) },
        },
        22: {
            title: "第四物质维度",
            cost(x) {
                let a = n(1e4)
                a = a.mul(n(1e6).pow(x.div(10).floor()))
                if (a.gte("1.7977e308")) a = a.div("1.7977e308").pow(a.log(10).div(308.25)).mul("1.7977e308")
                if (hasUpgrade('e', 22)) a = a.pow(0.25)
                return a
            },
            display() {
                return "每秒生产" + format(this.effect()) + "第三维度<br>价格: " + format(this.cost()) + "物质<br>已拥有: " + format(player.ma.gained4.add(getBuyableAmount(this.layer, this.id))) + "<br>已购买: " + format(getBuyableAmount(this.layer, this.id)) + "/" + format(this.purchaseLimit())
            },
            canAfford() { return player.ma.points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('e', 62)) player.ma.points = player.ma.points.sub(this.cost())

                if (hasUpgrade('e', 16)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).div(10).floor().mul(10).add(10).max(getBuyableAmount(this.layer, this.id).add(1)))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = player.ma.gained4.add(x)
                if (hasUpgrade('e', 25)) eff = eff.mul(n(6.5).pow(x.div(10).floor()))
                else eff = eff.mul(n(2).pow(x.div(10).floor()))
                if (hasUpgrade('e', 23)) eff = eff.mul(layers.re.reinc())
                eff = eff.mul(layers.id.inf())
                return eff
            },
            purchaseLimit() {
                let max = n(1e309)
                return max
            },
            unlocked() { return hasUpgrade('e', 15) },
        },
        31: {
            title: "第五物质维度",
            cost(x) {
                let a = n(1e5)
                a = a.mul(n(1e7).pow(x.div(10).floor()))
                if (a.gte("1.7977e308")) a = a.div("1.7977e308").pow(a.log(10).div(308.25)).mul("1.7977e308")
                if (hasUpgrade('e', 22)) a = a.pow(0.25)
                return a
            },
            display() {
                return "每秒生产" + format(this.effect()) + "第四维度<br>价格: " + format(this.cost()) + "物质<br>已拥有: " + format(player.ma.gained5.add(getBuyableAmount(this.layer, this.id))) + "<br>已购买: " + format(getBuyableAmount(this.layer, this.id)) + "/" + format(this.purchaseLimit())
            },
            canAfford() { return player.ma.points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('e', 62)) player.ma.points = player.ma.points.sub(this.cost())

                if (hasUpgrade('e', 16)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).div(10).floor().mul(10).add(10).max(getBuyableAmount(this.layer, this.id).add(1)))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = player.ma.gained5.add(x)
                if (hasUpgrade('e', 25)) eff = eff.mul(n(6.5).pow(x.div(10).floor()))
                else eff = eff.mul(n(2).pow(x.div(10).floor()))
                if (hasUpgrade('e', 23)) eff = eff.mul(layers.re.reinc())
                eff = eff.mul(layers.id.inf())
                return eff
            },
            purchaseLimit() {
                let max = n(1e309)
                return max
            },
            unlocked() { return hasUpgrade('e', 15) },
        },
        32: {
            title: "第六物质维度",
            cost(x) {
                let a = n(1e6)
                a = a.mul(n(1e8).pow(x.div(10).floor()))
                if (a.gte("1.7977e308")) a = a.div("1.7977e308").pow(a.log(10).div(308.25)).mul("1.7977e308")
                if (hasUpgrade('e', 22)) a = a.pow(0.25)
                return a
            },
            display() {
                return "每秒生产" + format(this.effect()) + "第五维度<br>价格: " + format(this.cost()) + "物质<br>已拥有: " + format(player.ma.gained6.add(getBuyableAmount(this.layer, this.id))) + "<br>已购买: " + format(getBuyableAmount(this.layer, this.id)) + "/" + format(this.purchaseLimit())
            },
            canAfford() { return player.ma.points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('e', 62)) player.ma.points = player.ma.points.sub(this.cost())

                if (hasUpgrade('e', 16)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).div(10).floor().mul(10).add(10).max(getBuyableAmount(this.layer, this.id).add(1)))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = player.ma.gained6.add(x)
                if (hasUpgrade('e', 25)) eff = eff.mul(n(6.5).pow(x.div(10).floor()))
                else eff = eff.mul(n(2).pow(x.div(10).floor()))
                if (hasUpgrade('e', 23)) eff = eff.mul(layers.re.reinc())
                eff = eff.mul(layers.id.inf())
                return eff
            },
            purchaseLimit() {
                let max = n(1e309)
                return max
            },
            unlocked() { return hasUpgrade('e', 15) },
        },
        41: {
            title: "第七物质维度",
            cost(x) {
                let a = n(1e7)
                a = a.mul(n(1e9).pow(x.div(10).floor()))
                if (a.gte("1.7977e308")) a = a.div("1.7977e308").pow(a.log(10).div(308.25)).mul("1.7977e308")
                if (hasUpgrade('e', 22)) a = a.pow(0.25)
                return a
            },
            display() {
                return "每秒生产" + format(this.effect()) + "第六维度<br>价格: " + format(this.cost()) + "物质<br>已拥有: " + format(player.ma.gained7.add(getBuyableAmount(this.layer, this.id))) + "<br>已购买: " + format(getBuyableAmount(this.layer, this.id)) + "/" + format(this.purchaseLimit())
            },
            canAfford() { return player.ma.points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('e', 62)) player.ma.points = player.ma.points.sub(this.cost())

                if (hasUpgrade('e', 16)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).div(10).floor().mul(10).add(10).max(getBuyableAmount(this.layer, this.id).add(1)))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = player.ma.gained7.add(x)
                if (hasUpgrade('e', 25)) eff = eff.mul(n(6.5).pow(x.div(10).floor()))
                else eff = eff.mul(n(2).pow(x.div(10).floor()))
                if (hasUpgrade('e', 23)) eff = eff.mul(layers.re.reinc())
                eff = eff.mul(layers.id.inf())
                return eff
            },
            purchaseLimit() {
                let max = n(1e309)
                return max
            },
            unlocked() { return hasUpgrade('e', 15) },
        },
        42: {
            title: "第八物质维度",
            cost(x) {
                let a = n(1e8)
                a = a.mul(n(1e10).pow(x.div(10).floor()))
                if (a.gte("1.7977e308")) a = a.div("1.7977e308").pow(a.log(10).div(308.25)).mul("1.7977e308")
                if (hasUpgrade('e', 22)) a = a.pow(0.25)
                return a
            },
            display() {
                return "每秒生产" + format(this.effect()) + "第七维度<br>价格: " + format(this.cost()) + "物质<br>已拥有: " + format(getBuyableAmount(this.layer, this.id)) + "<br>已购买: " + format(getBuyableAmount(this.layer, this.id)) + "/" + format(this.purchaseLimit())
            },
            canAfford() { return player.ma.points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('e', 62)) player.ma.points = player.ma.points.sub(this.cost())

                if (hasUpgrade('e', 16)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).div(10).floor().mul(10).add(10).max(getBuyableAmount(this.layer, this.id).add(1)))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = x
                if (hasUpgrade('e', 25)) eff = eff.mul(n(6.5).pow(x.div(10).floor()))
                else eff = eff.mul(n(2).pow(x.div(10).floor()))
                if (hasUpgrade('e', 23)) eff = eff.mul(layers.re.reinc())
                eff = eff.mul(layers.id.inf())
                return eff
            },
            purchaseLimit() {
                let max = n(1e309)
                return max
            },
            unlocked() { return hasUpgrade('e', 15) },
        },
    },
    layerShown() { return hasUpgrade('e', 15) }
})
addLayer("id", {
    name: "无限维度", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ID", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new ExpantaNum(10),
            gained1: n(0),
            gained2: n(0),
            gained3: n(0),
            gained4: n(0),
            gained5: n(0),
            gained6: n(0),
            gained7: n(0),
        }
    },
    color: "#32ED10",
    // Can be a function that takes requirement increases into account
    resource: "无限之力", // Name of prestige currency
    effectDescription() {
        return "使物质维度产量x" + format(layers.id.inf())
    },
    inf() {
        if (!hasUpgrade('e', 26)) return n(1)
        if (hasUpgrade('e', 34)) return player.id.points.pow(n(7).add(layers.e.upgrades[34].effect2())).add(1).floor()
        return player.id.points.pow(7).add(1).floor()
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
    update(diff) {
        player.id.points = player.id.points.add(buyableEffect('id', 11).mul(diff))
        player.id.gained1 = player.id.gained1.add(buyableEffect('id', 12).mul(diff))
        player.id.gained2 = player.id.gained2.add(buyableEffect('id', 21).mul(diff))
        player.id.gained3 = player.id.gained3.add(buyableEffect('id', 22).mul(diff))
        player.id.gained4 = player.id.gained4.add(buyableEffect('id', 31).mul(diff))
        player.id.gained5 = player.id.gained5.add(buyableEffect('id', 32).mul(diff))
        player.id.gained6 = player.id.gained6.add(buyableEffect('id', 41).mul(diff))
        player.id.gained7 = player.id.gained7.add(buyableEffect('id', 42).mul(diff))
        if (hasUpgrade('e', 31)) {
            if (layers.id.buyables[42].canAfford()) layers.id.buyables[42].buy()
            if (layers.id.buyables[41].canAfford()) layers.id.buyables[41].buy()
            if (layers.id.buyables[32].canAfford()) layers.id.buyables[32].buy()
            if (layers.id.buyables[31].canAfford()) layers.id.buyables[31].buy()
            if (layers.id.buyables[22].canAfford()) layers.id.buyables[22].buy()
            if (layers.id.buyables[21].canAfford()) layers.id.buyables[21].buy()
            if (layers.id.buyables[12].canAfford()) layers.id.buyables[12].buy()
            if (layers.id.buyables[11].canAfford()) layers.id.buyables[11].buy()
        }
    },
    milestones: {
    },
    upgrades: {
    },
    buyables: {

        11: {
            title: "第一无限维度",
            cost(x) {
                let a = n(10)
                a = a.mul(n(1000).pow(x.div(10).floor()))
                if (a.gte("1.7977e308")) a = a.div("1.7977e308").pow(a.log(10).div(308.25)).mul("1.7977e308")
                return a
            },
            display() {
                return "每秒生产" + format(this.effect()) + "无限之力<br>价格: " + format(this.cost()) + "无限之力<br>已拥有: " + format(player.id.gained1.add(getBuyableAmount(this.layer, this.id))) + "<br>已购买: " + format(getBuyableAmount(this.layer, this.id)) + "/" + format(this.purchaseLimit())
            },
            canAfford() { return player.id.points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('e', 62)) player.id.points = player.id.points.sub(this.cost())
                if (hasUpgrade('e', 16)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).div(10).floor().mul(10).add(10).max(getBuyableAmount(this.layer, this.id).add(1)))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = player.id.gained1.add(x)
                eff = eff.mul(n(2).pow(x.div(10).floor()))
                if (hasUpgrade('e', 33)) eff = eff.mul(upgradeEffect('e', 33))
                if (hasUpgrade('e', 34)) eff = eff.mul(upgradeEffect('e', 34))
                if (hasUpgrade('e', 35)) eff = eff.mul(6365)
                if (hasUpgrade('e', 36)) eff = eff.mul(layers.re.reinc())
                if (hasUpgrade('e', 52)) eff = eff.mul(player.re.mass.max(1).pow(1.5).min(1e75))
                if (hasUpgrade('e', 56)) eff = eff.mul(player.id.points.max(10).log10())
                if (hasUpgrade('e', 61)) eff = eff.mul(1e20)
                else if (hasUpgrade('e', 44)) eff = eff.mul(player.re.mass.max(1).pow(0.5).min(1e25))
                if (hasMilestone('re', 6)) eff = eff.mul(1e8)
                if (eff.gte("1.7977e308") && !hasUpgrade('e', 82)) eff = eff.div("1.7977e308").pow(0.1).mul("1.7977e308")
                else if (eff.gte("1.7977e308")) eff = eff.div("1.7977e308").pow(0.25).mul("1.7977e308")
                return eff
            },
            purchaseLimit() {
                let max = n(1e309)
                return max
            },
            unlocked() { return hasUpgrade('e', 26) },
        },
        12: {
            title: "第二无限维度",
            cost(x) {
                let a = n(100)
                a = a.mul(n(1e4).pow(x.div(10).floor()))
                if (a.gte("1.7977e308")) a = a.div("1.7977e308").pow(a.log(10).div(308.25)).mul("1.7977e308")
                return a
            },
            display() {
                return "每秒生产" + format(this.effect()) + "第一维度<br>价格: " + format(this.cost()) + "无限之力<br>已拥有: " + format(player.id.gained2.add(getBuyableAmount(this.layer, this.id))) + "<br>已购买: " + format(getBuyableAmount(this.layer, this.id)) + "/" + format(this.purchaseLimit())
            },
            canAfford() { return player.id.points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('e', 62)) player.id.points = player.id.points.sub(this.cost())
                if (hasUpgrade('e', 16)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).div(10).floor().mul(10).add(10).max(getBuyableAmount(this.layer, this.id).add(1)))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = player.id.gained2.add(x)
                eff = eff.mul(n(2).pow(x.div(10).floor()))
                if (hasUpgrade('e', 33)) eff = eff.mul(upgradeEffect('e', 33))
                if (hasUpgrade('e', 34)) eff = eff.mul(upgradeEffect('e', 34))
                if (hasUpgrade('e', 35)) eff = eff.mul(6365)
                if (hasUpgrade('e', 36)) eff = eff.mul(layers.re.reinc())
                return eff
            },
            purchaseLimit() {
                let max = n(1e309)
                return max
            },
            unlocked() { return hasUpgrade('e', 26) },
        },
        21: {
            title: "第三无限维度",
            cost(x) {
                let a = n(1e3)
                a = a.mul(n(1e5).pow(x.div(10).floor()))
                if (a.gte("1.7977e308")) a = a.div("1.7977e308").pow(a.log(10).div(308.25)).mul("1.7977e308")
                return a
            },
            display() {
                return "每秒生产" + format(this.effect()) + "第二维度<br>价格: " + format(this.cost()) + "无限之力<br>已拥有: " + format(player.id.gained3.add(getBuyableAmount(this.layer, this.id))) + "<br>已购买: " + format(getBuyableAmount(this.layer, this.id)) + "/" + format(this.purchaseLimit())
            },
            canAfford() { return player.id.points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('e', 62)) player.id.points = player.id.points.sub(this.cost())
                if (hasUpgrade('e', 16)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).div(10).floor().mul(10).add(10).max(getBuyableAmount(this.layer, this.id).add(1)))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = player.id.gained3.add(x)
                eff = eff.mul(n(2).pow(x.div(10).floor()))
                if (hasUpgrade('e', 33)) eff = eff.mul(upgradeEffect('e', 33))
                if (hasUpgrade('e', 34)) eff = eff.mul(upgradeEffect('e', 34))
                if (hasUpgrade('e', 35)) eff = eff.mul(6365)
                if (hasUpgrade('e', 36)) eff = eff.mul(layers.re.reinc())
                return eff
            },
            purchaseLimit() {
                let max = n(1e309)
                return max
            },
            unlocked() { return hasUpgrade('e', 26) },
        },
        22: {
            title: "第四无限维度",
            cost(x) {
                let a = n(1e4)
                a = a.mul(n(1e6).pow(x.div(10).floor()))
                if (a.gte("1.7977e308")) a = a.div("1.7977e308").pow(a.log(10).div(308.25)).mul("1.7977e308")
                return a
            },
            display() {
                return "每秒生产" + format(this.effect()) + "第三维度<br>价格: " + format(this.cost()) + "无限之力<br>已拥有: " + format(player.id.gained4.add(getBuyableAmount(this.layer, this.id))) + "<br>已购买: " + format(getBuyableAmount(this.layer, this.id)) + "/" + format(this.purchaseLimit())
            },
            canAfford() { return player.id.points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('e', 62)) player.id.points = player.id.points.sub(this.cost())

                if (hasUpgrade('e', 16)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).div(10).floor().mul(10).add(10).max(getBuyableAmount(this.layer, this.id).add(1)))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = player.id.gained4.add(x)
                eff = eff.mul(n(2).pow(x.div(10).floor()))
                if (hasUpgrade('e', 33)) eff = eff.mul(upgradeEffect('e', 33))
                if (hasUpgrade('e', 34)) eff = eff.mul(upgradeEffect('e', 34))
                if (hasUpgrade('e', 35)) eff = eff.mul(6365)
                if (hasUpgrade('e', 36)) eff = eff.mul(layers.re.reinc())
                return eff
            },
            purchaseLimit() {
                let max = n(1e309)
                return max
            },
            unlocked() { return hasUpgrade('e', 26) },
        },
        31: {
            title: "第五无限维度",
            cost(x) {
                let a = n(1e5)
                a = a.mul(n(1e7).pow(x.div(10).floor()))
                if (a.gte("1.7977e308")) a = a.div("1.7977e308").pow(a.log(10).div(308.25)).mul("1.7977e308")
                return a
            },
            display() {
                return "每秒生产" + format(this.effect()) + "第四维度<br>价格: " + format(this.cost()) + "无限之力<br>已拥有: " + format(player.id.gained5.add(getBuyableAmount(this.layer, this.id))) + "<br>已购买: " + format(getBuyableAmount(this.layer, this.id)) + "/" + format(this.purchaseLimit())
            },
            canAfford() { return player.id.points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('e', 62)) player.id.points = player.id.points.sub(this.cost())

                if (hasUpgrade('e', 16)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).div(10).floor().mul(10).add(10).max(getBuyableAmount(this.layer, this.id).add(1)))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = player.id.gained5.add(x)
                eff = eff.mul(n(2).pow(x.div(10).floor()))
                if (hasUpgrade('e', 33)) eff = eff.mul(upgradeEffect('e', 33))
                if (hasUpgrade('e', 34)) eff = eff.mul(upgradeEffect('e', 34))
                if (hasUpgrade('e', 35)) eff = eff.mul(6365)
                if (hasUpgrade('e', 36)) eff = eff.mul(layers.re.reinc())
                return eff
            },
            purchaseLimit() {
                let max = n(1e309)
                return max
            },
            unlocked() { return hasUpgrade('e', 26) },
        },
        32: {
            title: "第六无限维度",
            cost(x) {
                let a = n(1e6)
                a = a.mul(n(1e8).pow(x.div(10).floor()))
                if (a.gte("1.7977e308")) a = a.div("1.7977e308").pow(a.log(10).div(308.25)).mul("1.7977e308")
                return a
            },
            display() {
                return "每秒生产" + format(this.effect()) + "第五维度<br>价格: " + format(this.cost()) + "无限之力<br>已拥有: " + format(player.id.gained6.add(getBuyableAmount(this.layer, this.id))) + "<br>已购买: " + format(getBuyableAmount(this.layer, this.id)) + "/" + format(this.purchaseLimit())
            },
            canAfford() { return player.id.points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('e', 62)) player.id.points = player.id.points.sub(this.cost())

                if (hasUpgrade('e', 16)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).div(10).floor().mul(10).add(10).max(getBuyableAmount(this.layer, this.id).add(1)))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = player.id.gained6.add(x)
                eff = eff.mul(n(2).pow(x.div(10).floor()))
                if (hasUpgrade('e', 33)) eff = eff.mul(upgradeEffect('e', 33))
                if (hasUpgrade('e', 34)) eff = eff.mul(upgradeEffect('e', 34))
                if (hasUpgrade('e', 35)) eff = eff.mul(6365)
                if (hasUpgrade('e', 36)) eff = eff.mul(layers.re.reinc())
                return eff
            },
            purchaseLimit() {
                let max = n(1e309)
                return max
            },
            unlocked() { return hasUpgrade('e', 26) },
        },
        41: {
            title: "第七无限维度",
            cost(x) {
                let a = n(1e7)
                a = a.mul(n(1e9).pow(x.div(10).floor()))
                if (a.gte("1.7977e308")) a = a.div("1.7977e308").pow(a.log(10).div(308.25)).mul("1.7977e308")
                return a
            },
            display() {
                return "每秒生产" + format(this.effect()) + "第六维度<br>价格: " + format(this.cost()) + "无限之力<br>已拥有: " + format(player.id.gained7.add(getBuyableAmount(this.layer, this.id))) + "<br>已购买: " + format(getBuyableAmount(this.layer, this.id)) + "/" + format(this.purchaseLimit())
            },
            canAfford() { return player.id.points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('e', 62)) player.id.points = player.id.points.sub(this.cost())

                if (hasUpgrade('e', 16)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).div(10).floor().mul(10).add(10).max(getBuyableAmount(this.layer, this.id).add(1)))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = player.id.gained7.add(x)
                eff = eff.mul(n(2).pow(x.div(10).floor()))
                if (hasUpgrade('e', 33)) eff = eff.mul(upgradeEffect('e', 33))
                if (hasUpgrade('e', 34)) eff = eff.mul(upgradeEffect('e', 34))
                if (hasUpgrade('e', 35)) eff = eff.mul(6365)
                if (hasUpgrade('e', 36)) eff = eff.mul(layers.re.reinc())
                return eff
            },
            purchaseLimit() {
                let max = n(1e309)
                return max
            },
            unlocked() { return hasUpgrade('e', 26) },
        },
        42: {
            title: "第八无限维度",
            cost(x) {
                let a = n(1e8)
                a = a.mul(n(1e10).pow(x.div(10).floor()))
                if (a.gte("1.7977e308")) a = a.div("1.7977e308").pow(a.log(10).div(308.25)).mul("1.7977e308")
                return a
            },
            display() {
                return "每秒生产" + format(this.effect()) + "第七维度<br>价格: " + format(this.cost()) + "无限之力<br>已拥有: " + format(getBuyableAmount(this.layer, this.id)) + "<br>已购买: " + format(getBuyableAmount(this.layer, this.id)) + "/" + format(this.purchaseLimit())
            },
            canAfford() { return player.id.points.gte(this.cost()) },
            buy() {
                if (!hasUpgrade('e', 62)) player.id.points = player.id.points.sub(this.cost())

                if (hasUpgrade('e', 16)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).div(10).floor().mul(10).add(10).max(getBuyableAmount(this.layer, this.id).add(1)))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = x
                eff = eff.mul(n(2).pow(x.div(10).floor()))
                if (hasUpgrade('e', 33)) eff = eff.mul(upgradeEffect('e', 33))
                if (hasUpgrade('e', 34)) eff = eff.mul(upgradeEffect('e', 34))
                if (hasUpgrade('e', 35)) eff = eff.mul(6365)
                if (hasUpgrade('e', 36)) eff = eff.mul(layers.re.reinc())
                return eff
            },
            purchaseLimit() {
                let max = n(1e309)
                return max
            },
            unlocked() { return hasUpgrade('e', 26) },
        },
    },
    layerShown() { return hasUpgrade('e', 26) }
})