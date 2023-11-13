import {LOL_CONFIG, NICKNAME} from "../../utils/config";
import {getFight} from "../../utils/api";
import {getIsShowNickname, getJobs, getPositions, showToast} from "../../utils/util";

const app= getApp()
Page({
    data: {
        is_show_nickname: false,
        isRefresh: false,
        loadingProps: {
            size: '50rpx',
        },
        isDone: false,
        size: 30,
        page: 1,
        jobs: LOL_CONFIG.hero_job,
        list: app.globalData.tabbar,
        curJob: 'all',
        fight: [],
        totalPage: 1,
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
    onShow() {
        let that = this,
            is_show_nickname = getIsShowNickname()
        console.log('onshow', 'is_show_nickname', is_show_nickname)
        that.setData({
            is_show_nickname: is_show_nickname,
        })
    },
    onLoad: function (options) {
        let that = this
        wx.showLoading()
        that.getFight()
    },
    getFight() {
        let that = this,
            job = that.data.curJob,
            page = that.data.page,
            size = that.data.size,
            isDone = that.data.isDone

        if (isDone === true) {
            wx.hideLoading()
            return
        }

        getFight(job, page, size).then(res => {
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

            if (page > 1) {
                data = that.data.fight.concat(data)
            }

            that.setData({
                fight: data,
                backupData: data,
                isRefresh: false,
                totalPage: res.extra.totalPage ?? 1,
            })
            wx.hideLoading()
        })
    },
    onPullDownRefresh() {
        let that = this
        that.setData({
            isDone: false,
            isRefresh: true,
        })
        wx.showLoading()
        that.getFight()
    },
    onScroll(e) {},
    onSelect(e) {
        let that = this,
            type = e.currentTarget.dataset.type ?? 'mid'

        that.setData({
            curJob: type,
            page: 1,
            isDone: false,
        })

        wx.showLoading()
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
    onScrollToBottom(e) {
        let that = this
        wx.showLoading()
        that.onReachBottom()
    },
    onReachBottom() {
        const
            that = this,
            totalPage = that.data.totalPage,
            page = that.data.page,
            isDone = that.data.isDone

        const nextPage = page + 1
        console.log('onReachBottom', nextPage, 'isDone', isDone)
        if (nextPage > totalPage) {
            that.setData({
                isDone: true,
            })
            wx.hideLoading()
            return
        }
        that.setData({
            isDone: false,
            page: nextPage,
        })
        that.getFight()
    },
});
