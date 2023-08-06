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
        backupData: [],
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
                prop: 'output_rate',
                width: 100,
                label: '伤害比',
                color: '#fcf0f4'
            },
            {
                prop: 'level',
                width: 100,
                label: '梯队',
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
                item.output_rate = (item.output_rate * 100).toFixed(1) + "%"
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
                backupData: data,
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
    onRowClick(e) {
        console.log('onRowClick', e)
    },
    searchConfirm(e) {
        let q = e.detail.value ?? ""
        if (q === "") {
            return
        }
        this.searchBackupData(q)
    },
    searchClear(e) {
        let that = this
        that.setData({
            fight: that.data.backupData,
        })
    },
    searchChange(e){
        let q = e.detail.value ?? "",
            that = this
        q = q.trim()
        if (q === "") {
            that.setData({
                fight: that.data.backupData
            })
            return
        }
        that.searchBackupData(q)
    },
    searchBackupData(q = "") {
        let that = this,
            data = []
        that.data.backupData.forEach((item) => {
            if (item.hero.name.search(q) !== -1 ||
                item.hero.nickname.search(q) !== -1 ||
                item.hero.title.search(q) !== -1 ||
                item.hero.alias.search(q) !== -1
            ) {
                data.push(item)
            }
        })
        that.setData({
            fight: data,
        })
    },
    onShareAppMessage(options) {
        let that = this
        return {
            title: `【大乱斗国服英雄排行】英雄联盟LOL开黑上分助手，国服玩家都在用的上分小程序`,
            path: `/pages/fight/index`,
        }
    },
});
