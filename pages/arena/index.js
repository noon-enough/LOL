import {LOL_CONFIG} from "../../utils/config";
import {getArena} from "../../utils/api";
import {getJobs, showToast} from "../../utils/util";

const app= getApp()
Page({
    data: {
        isRefresh: false,
        loadingProps: {
            size: '50rpx',
        },
        jobs: LOL_CONFIG.hero_job,
        list: app.globalData.tabbar,
        curJob: "all",
        arena: [],
        tableHeader: [
            {
                prop: 'ranking',
                width: 100,
                label: '排名',
                color: '#fcf0f4'
            },
            {
                prop: 'hero',
                width: 300,
                label: '英雄',
            },
            {
                prop: 'douwinrate',
                width: 120,
                label: '双排胜率',
                color: '#fcf0f4'
            },
            {
                prop: 'iratepct',
                width: 100,
                label: '登场率',
                color: '#fcf0f4'
            },
            {
                prop: 'banrate',
                width: 100,
                label: '禁用率',
                color: '#fcf0f4'
            },
        ],
        stripe: false,
        border: false,
        outBorder: false,
        msg: '暂无数据'
    },
    onLoad: function (options) {
        let that = this
        wx.showLoading()
        that.getArena()
    },
    getArena() {
        let that = this,
            job = that.data.curJob

        getArena(job).then(res => {
            console.log('getArena', res)
            let code = res.code ?? 200,
                data = res.data,
                message = data.message ?? "非法操作"

            if (code !== 200) {
                showToast(message, {icon: "error"})
                return
            }

            data = data.map((item, idx) => {
                item.douwinrate = (item.douwinrate * 100).toFixed(1) + "%"
                item.iratepct = (item.iratepct * 100).toFixed(1) + "%"
                item.banrate1 = (item.banrate1 * 100).toFixed(1) + "%"
                item.banrate2 = (item.banrate2 * 100).toFixed(1) + "%"
                item.hero1.roles = getJobs(item.hero1.roles)
                item.hero2.roles = getJobs(item.hero2.roles)
                return item
            })
            that.setData({
                arena: data,
                isRefresh: false,
            })
        })
        wx.hideLoading()
    },
    onPullDownRefresh() {
        let that = this
        that.setData({
            isDone: false,
            isRefresh: true,
        })
        that.getArena()
    },
    onScroll(e) {},
    onSelect(e) {
        let that = this,
            type = e.currentTarget.dataset.type ?? 'mid'

        that.setData({
            curJob: type,
        })

        that.getArena()
    },
    onShareAppMessage(options) {
        let that = this
        return {
            title: `【斗魂竞技场英雄排行】英雄联盟LOL开黑上分助手，国服玩家都在用的上分小程序`,
            path: `/pages/arena/index`,
        }
    },
});
