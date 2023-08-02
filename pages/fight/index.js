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
                width: 280,
                label: '英雄',
            },
            {
                prop: 'win',
                width: 80,
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
                prop: 'level',
                width: 100,
                label: '梯队',
                color: '#fcf0f4'
            },
            {
                prop: 'more',
                width: 80,
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

            data = data.map((item, idx) => {
                item.win = (item.win * 100).toFixed(1) + "%"
                item.show = (item.show * 100).toFixed(1) + "%"
                item.orderAbs = Math.abs(item.order)
                item.hero.roles = getJobs(item.hero.roles)

                item.grade_t = 4;
                if(idx <= data.length * 0.04){
                    item.grade_t = 0;
                }else if(idx <= data.length * 0.15){
                    item.grade_t = 1;
                }else if(idx <= data.length * 0.3){
                    item.grade_t = 2;
                }else if(idx <= data.length * 0.4){
                    item.grade_t = 3;
                }else{
                    item.grade_t = 4;
                }
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
