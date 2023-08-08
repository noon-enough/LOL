import {get1V1, getHeroDetail, getHeroOverview, getHeroSkill} from "../../utils/api";
import {getIconByType, getNameByType, heroDetail, historyBack, showToast} from "../../utils/util";
import {LOL_CONFIG} from "../../utils/config";

const app = getApp()
Page({
    data: {
        bgColor: "transparent",
        id: 0,
        info: {},
        currLane: "mid",
        currLaneIcon: "icon-pos-jungle",
        activeKey: 'overview',
        skill: [],
        defaultSkill: ["P", "Q", "W", "E", "R"],
        selectKey: "P",
        overview: {},
        fightSelectHeroId: 0,
        fightSelectHeroData: {},
        vs: {},
        level: {},
        levelDefault: 1,
        is_show_dialog_mask: false,
        dialogData: {},
        dialogType: "equipment",
        easy_order: [],
        hard_order: [],
        fight_tab: "easy_order",
    },
    onLoad: function (options) {
        let that = this,
            id = options.id,
            capsuleBarHeight = app.globalData.system.navigationBarHeight
        console.log("heroId", id, 'capsuleBarHeight', capsuleBarHeight)
        that.setData({
            id: id,
            capsuleBarHeight: capsuleBarHeight,
            navigationBarHeight: capsuleBarHeight + 300
        })

        wx.showLoading()
        that.getHeroDetail()
    },
    getHeroOverview() {
        let that = this,
            id = that.data.id,
            lane = that.data.currLane

        getHeroOverview(id).then(res => {
            console.log('getHeroOverview', res)
            let code = res.code ?? 200,
                data = res.data ?? [],
                message =  res.message ?? "非法操作"
            if (code !== 200) {
                showToast(message, {icon: "error"})
                return
            }

            // 获取第一个
            let h = data.fight[lane][0],
                fightSelectHeroId = h.championid2
            that.setData({
                overview: data,
                fightSelectHeroId: fightSelectHeroId,
                fightSelectHeroData: h,
            })

            that.getFightEasyHardOrder()
        })
    },
    getHeroSkill() {
        let that = this,
            id = that.data.id

        getHeroSkill(id).then(res => {
            console.log('getHeroSkill', res)
            let code = res.code ?? 200,
                data = res.data ?? [],
                message =  res.message ?? "非法操作"
            if (code !== 200) {
                showToast(message, {icon: "error"})
                return
            }

            let __ = {}
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const obj = data[key]
                    let description = obj.description; // 获取字段 x 的值
                    description = description.replace(/\\n/g,'\n')
                    __[key] = {...obj, description: description}
                }
            }

            that.setData({
                skill: __,
            })
        })
    },
    getHeroDetail() {
        let that = this,
            id = that.data.id

        getHeroDetail(id).then(res => {
            console.log('getHeroDetail', res)
            let code = res.code ?? 200,
                data = res.data ?? [],
                message =  res.message ?? "非法操作"
            if (code !== 200) {
                showToast(message, {icon: "error"})
                return
            }
            let currLane = data.positions[0] ?? 'mid'

            data.positions = data.positions.map((pos) => {
                let d = getNameByType(LOL_CONFIG.hero_pos, pos)
                return {
                    "type": pos,
                    "name": d,
                }
            })
            data.roles = data.roles.map((role) => {
                let d = getNameByType(LOL_CONFIG.hero_job, role)
                return {
                    "type": role,
                    "name": d,
                }
            })
            let currLaneIcon = getIconByType(currLane)
            data.difficultyL = parseInt(data.difficultyL)

            that.setData({
                info: data,
                currLane: currLane,
                currLaneIcon: currLaneIcon,
                levelDefault: 1,
            })
            wx.hideLoading()
        }).then(res => {
            that.getHeroSkill()
        }).then(res => {
            that.getHeroOverview()
        })
    },
    back(e) {
        historyBack()
    },
    onSelect(e) {
        let that = this,
            type = e.currentTarget.dataset.type ?? 'mid'

        that.setData({
            currLane: type,
        })
        // 需要重新拉取数据的？？
        that.getHeroOverview()
    },
    onChangeSkill(e) {
        let that = this,
            type = e.currentTarget.dataset.key ?? 'P'

        that.setData({
            selectKey: type,
        })
    },
    onSelect1v1Hero(e) {
        let that = this,
            heroId = e.currentTarget.dataset.heroId ?? 0
        that.setData({
            fightSelectHeroId: heroId,
        })
        wx.showLoading()
        that.get1V1()
    },
    onTabTabBar(e) {
        let that = this,
            key = e.detail.activeKey ?? 'overview'
        if (key === "1v1") {
            wx.showLoading()
            that.get1V1()
        } else if (key === "skill") {
            that.getLevelInfo()
        }
    },
    get1V1() {
        let that = this,
            id = that.data.id,
            target = that.data.fightSelectHeroId,
            lane = that.data.currLane

        get1V1(id, target, lane).then(res => {
            console.log('get1V1', res)
            let code = res.code ?? 200,
                data = res.data ?? [],
                message =  res.message ?? "非法操作"
            if (code !== 200) {
                showToast(message, {icon: "error"})
                return
            }

            data.hero1.mintime = that.transfTime(data.hero1.mintime)
            data.hero2.mintime = that.transfTime(data.hero2.mintime)
            that.setData({
                vs: data,
            })
            wx.hideLoading()
        })
    },
    transfTime(data) {
        let min = Math.floor(+data / 60);
        if (min.toString().length < 2) {
            min = '0' + min.toString();
        }
        let sec = +data % 60;
        if (sec.toString().length < 2) {
            sec = '0' + sec.toString();
        }
        return min + "'" + sec + "''"
    },
    getLevelInfo() {
        let that = this,
            levelDefault = that.data.levelDefault,
            info = that.data.info,
            level = {
                attackdamage: parseFloat(info.attackdamage),
                attackrange: parseFloat(info.attackrange),
                attackspeed: parseFloat(info.attackspeed),
                movespeed: parseFloat(info.movespeed),
                hp: parseFloat(info.hp),
                mp: parseFloat(info.mp),
                armor: parseFloat(info.armor),
                spellblock: parseFloat(info.spellblock),
            }

        if (levelDefault > 1) {
            level.attackdamage = level.attackdamage +  (parseFloat(info.attackdamageperlevel) * levelDefault)
            // level.attackrange = level.attackrange); 攻击距离没有成长。
            // level.movespeed = level.movespeed 移动速度也没有成长
            level.armor = level.armor + (parseFloat(info.armorperlevel) * levelDefault)
            level.spellblock = level.spellblock + (parseFloat(info.spellblockperlevel) * levelDefault)
            level.hp = level.hp + (parseFloat(info.hpperlevel) * levelDefault)
            level.mp = level.mp + (parseFloat(info.mpperlevel) * levelDefault)
            level.attackspeed = level.attackspeed + (parseFloat(info.attackspeedperlevel) * levelDefault)
        }

        // 处理 attackdamage 字段，转换为整数
        level.attackdamage = Math.round(level.attackdamage)
        level.attackrange = Math.round(level.attackrange)
        level.movespeed = Math.round(level.movespeed)
        level.armor = Math.round(level.armor)
        level.spellblock = Math.round(level.spellblock)
        level.hp = Math.round(level.hp)
        level.mp = Math.round(level.mp)

        level.attackspeed = level.attackspeed.toFixed(2);

        console.log('level', levelDefault, 'lv', level)
        that.setData({
            level: level,
        })
    },
    onLevelChange(e) {
        let that = this,
            level = e.detail.value ?? 1,
            levelDefault = that.data.levelDefault
        if (level !== levelDefault) {
            that.setData({
                levelDefault: level,
            })
            that.getLevelInfo()
        }
    },
    onPullDownRefresh() {
        let that = this ,
            id = that.data.id
        wx.startPullDownRefresh()
        that.getHeroDetail(id)
        wx.stopPullDownRefresh()
    },
    onShowDialog(e) {
        let that = this,
            type = e.currentTarget.dataset.type,
            info = e.currentTarget.dataset.info

        console.log('type', type, 'info', info)
        that.setData({
            is_show_dialog_mask: true,
            dialogData: info,
            dialogType: type,
        })
    },
    changeMask() {
        let that = this
        that.setData({
            is_show_dialog_mask: false,
            dialogData: {},
            dialogType: "",
        })
    },
    onShareAppMessage(options) {
        let that = this,
            info = that.data.info,
            title = `${info.name} - ${info.title}`,
            id = that.data.id
        return {
            title: `【${title} 排位上分数据大全】英雄联盟LOL开黑上分助手，国服玩家都在用的上分小程序`,
            path: `/pages/detail/index?id=${id}`,
        }
    },
    getFightEasyHardOrder() {
        let that = this,
            lane = that.data.currLane,
            overview = that.data.overview,
            payload = overview.fight[lane],
            easy_order = [],
            hard_order = []

        easy_order = payload.sort((a, b) => b.winrate - a.winrate).slice(0, 5)
        hard_order = payload.sort((a, b) => a.winrate - b.winrate).slice(0, 5)

        that.setData({
            hard_order: hard_order,
            easy_order: easy_order,
        })
    },
    onChangeFightTab(e) {
        let that = this,
            tab = e.currentTarget.dataset.tab

        console.log('onChangeFightTab', tab)
        that.setData({
            fight_tab: tab,
        })
    },
    onChange1V1(e) {
        let that = this,
            id = e.currentTarget.dataset.heroId

        that.setData({
            fightSelectHeroId: id,
            activeKey: '1v1'
        })
        that.get1V1()
    },
    onOpenTFTMiniProc(e) {
        let that = this,
            id = e.currentTarget.dataset.id,
            name = e.currentTarget.dataset.name,
            session = e.currentTarget.dataset.session

        console.log('onOpenTFTMiniProc', e.currentTarget.dataset)
        wx.navigateToMiniProgram({
            appId: 'wx3adcaf55195f1cfa',  //要打开的小程序appid
            path: `/pages/detail/index?session=${session}&id=${id}`,  //要打开另一个小程序的页面和传递的参数
            envVersion: 'release', //打开小程序的版本（体验版trial；开发版develop；正式版release）
            success(res) {}
        })
    },
    detail(e) {
        let id = e.currentTarget.dataset.heroId
        console.log('detail', e)
        heroDetail(id)
    },
    onHeroByType(e) {
        let that = this
        app.globalData.heroes.job = e.currentTarget.dataset.type
        console.log('onHeroByType', app.globalData.heroes)
        that.onGoToHeroes()
    },
    onGoToHeroes() {
        let that = this
        wx.switchTab({
            url: `/pages/heroes/index`
        })
    }
});
