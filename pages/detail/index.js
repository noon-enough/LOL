import {getHeroDetail, getHeroSkill} from "../../utils/api";
import {getNameByType, getPositions, historyBack, showToast} from "../../utils/util";
import {LOL_CONFIG} from "../../utils/config";

const app = getApp()
Page({
    data: {
        bgColor: "transparent",
        id: 0,
        info: {},
        currLane: "mid",
        activeKey: 'overview',
        skill: [],
        defaultSkill: ["P", "Q", "W", "E", "R"],
        selectKey: "P",
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
        that.getHeroSkill()
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

            that.setData({
                skill: data,
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
            data.difficultyL = parseInt(data.difficultyL)
            that.setData({
                info: data,
                currLane: currLane,
            })
            wx.hideLoading()
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
    },
    onChangeSkill(e) {
        let that = this,
            type = e.currentTarget.dataset.key ?? 'P'

        that.setData({
            selectKey: type,
        })
    },
});
