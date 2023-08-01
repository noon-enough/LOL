import {LOL_CONFIG} from "../../utils/config";
import {getFight} from "../../utils/api";
import {getJobs, getPositions, showToast} from "../../utils/util";

const app= getApp()
Page({
    data: {
        isRefresh: false,
        loadingProps: {
            size: '50rpx',
        },
        jobs: LOL_CONFIG.hero_job,
        list: app.globalData.tabbar,
        curJob: 'all',
        fight: [],
        tableHeader: [
            {
                prop: 'ranking',
                width: 100,
                label: '排名',
                color: '#fcf0f4'
            },
            {
                prop: 'hero',
                width: 348,
                label: '英雄',
            },
            {
                prop: 'win',
                width: 100,
                label: '胜率',
                color: '#fcf0f4'
            },
            {
                prop: 'show',
                width: 100,
                label: '登场率',
                color: '#fcf0f4'
            },
            {
                prop: 'more',
                width: 100,
                label: '...',
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
        that.getFight()
    },
    getFight() {
        let that = this,
            job = that.data.curJob

        getFight(job).then(res => {
            console.log('getFight', res)
            let code = res.code ?? 200,
                data = res.data,
                message = data.message ?? "非法操作"

            if (code !== 200) {
                showToast(message, {icon: "error"})
                return
            }

            data = data.map((item) => {
                item.win = (item.win * 100).toFixed(1) + "%"
                item.show = (item.show * 100).toFixed(1) + "%"
                item.orderAbs = Math.abs(item.order)
                item.hero.roles = getJobs(item.hero.roles)
                return item
            })
            that.setData({
                fight: data,
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
        that.getFight()
    },
    onScroll(e) {},
    onSelect(e) {
        let that = this,
            type = e.currentTarget.dataset.type ?? 'mid'

        that.setData({
            curJob: type,
        })

        that.getFight()
    },
});
