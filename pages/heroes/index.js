import {LOL_CONFIG} from "../../utils/config";
import {getHero} from "../../utils/api";
import {heroDetail, showToast} from "../../utils/util";

const app = getApp()
Page({
    data: {
        list: app.globalData.tabbar,
        positions: LOL_CONFIG.hero_pos,
        jobs: LOL_CONFIG.hero_job,
        selectPos: 'all',
        selectJob: 'all',
        heroes: [],
    },
    onLoad: function (options) {
        let that = this
        wx.showLoading()
        that.getHero()
    },
    getHero() {
        let that = this,
            pos = that.data.selectPos,
            job = that.data.selectJob

        getHero(pos, job).then(res => {
            console.log('data', res)
            let code = res.code ?? 200,
                data = res.data ?? [],
                message =  res.message ?? "非法操作"
            if (code !== 200) {
                showToast(message, {icon: "error"})
                return
            }

            that.setData({
                heroes: data,
            })
            wx.hideLoading()
        })
    },
    onSelect(e) {
        let that = this,
            type = e.currentTarget.dataset.type ?? 'all',
            action = e.currentTarget.dataset.action ?? 'position',
            data = {}

        if (action === 'position') {
            data = {
                selectPos: type,
            }
        } else {
            data = {
                selectJob: type,
            }
        }
        that.setData(data)
        // 每次我都需要重新获取数据？
        that.getHero()
    },
    detail(e) {
        let that = this,
            id = e.currentTarget.dataset.heroId

        heroDetail(id)
    },
});
