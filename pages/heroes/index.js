import {LOL_CONFIG} from "../../utils/config";
import {getHero} from "../../utils/api";
import {heroDetail, showToast} from "../../utils/util";

const app = getApp()
Page({
    data: {
        isRefresh: false,
        loadingProps: {
            size: '50rpx',
        },
        list: app.globalData.tabbar,
        positions: LOL_CONFIG.hero_pos,
        jobs: LOL_CONFIG.hero_job,
        selectPos: "",
        selectJob: "",
        heroes: [],
        totalPage: 1,
        isDone: false,
        page: 1,
        size: 30,
    },
    onShow: function(options) {
        let that = this,
            selectPos = app.globalData.heroes.pos,
            selectJob = app.globalData.heroes.job,
            currPos = that.data.selectPos,
            currJob = that.data.curJob
        if (currJob !== selectJob || currPos !== selectPos) {
            console.log('onShow', selectPos, selectJob)
            that.setData({
                selectPos: selectPos,
                selectJob: selectJob
            })
            that.getHero()
        }
    },
    onLoad: function (options) {
        let that = this,
            selectPos = app.globalData.heroes.pos,
            selectJob = app.globalData.heroes.job
        wx.showLoading()
        that.setData({
            selectPos: selectPos,
            selectJob: selectJob
        })
        that.getHero()
    },
    getHero() {
        let that = this,
            pos = that.data.selectPos,
            job = that.data.selectJob,
            page = that.data.page,
            size = that.data.size,
            isDone = that.data.isDone

        if (isDone === true) {
            return
        }

        getHero(pos, job, page, size).then(res => {
            console.log('data', res)
            let code = res.code ?? 200,
                data = res.data ?? [],
                message =  res.message ?? "非法操作"
            if (code !== 200) {
                showToast(message, {icon: "error"})
                return
            }

            data = data.map((item) => {
                item.positions = item.positions.map((p) => {
                    let icon = ""
                    if (p === "top") {
                        icon = "icon-pos-top"
                    } else if (p === "mid") {
                        icon = "icon-pos-mid"
                    } else if (p === "jungle") {
                        icon = "icon-pos-jungle"
                    } else if (p === "bottom") {
                        icon = "icon-pos-bot"
                    } else if (p === "support") {
                        icon = "icon-pos-sup"
                    }

                    return {
                        name: p,
                        icon: icon,
                    }
                })
                return item
            })

            if (page > 1) {
                data = that.data.heroes.concat(data)
            }

            that.setData({
                heroes: data,
                isRefresh: false,
                backupData: data,
                totalPage: res.extra.totalPage ?? 1,
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
        wx.showLoading()
        that.setData(data)
        // 每次我都需要重新获取数据？
        that.getHero()
    },
    detail(e) {
        let that = this,
            id = e.currentTarget.dataset.heroId

        heroDetail(id)
    },

    onPullDownRefresh() {
        let that = this
        that.setData({
            isDone: false,
            isRefresh: true,
        })
        wx.showLoading()
        that.getHero()
    },
    onScroll(e) {},
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
            heroes: that.data.backupData,
        })
    },
    searchChange(e){
        let q = e.detail.value ?? "",
            that = this
        q = q.trim()
        if (q === "") {
            that.setData({
                heroes: that.data.backupData
            })
            return
        }
        that.searchBackupData(q)
    },
    searchBackupData(q = "") {
        let that = this,
            data = []
        that.data.backupData.forEach((item) => {
            if (item.name.search(q) !== -1 ||
                item.nickname.search(q) !== -1 ||
                item.title.search(q) !== -1 ||
                item.alias.search(q) !== -1
            ) {
                data.push(item)
            }
        })
        that.setData({
            heroes: data,
        })
    },
    onShareAppMessage(options) {
        let that = this
        return {
            title: `【国服英雄资料库】英雄联盟LOL开黑上分助手，国服玩家都在用的上分小程序`,
            path: `/pages/heroes/index`,
        }
    },
    onScrollToBottom(e) {
        let that = this
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
            return
        }
        that.setData({
            isDone: false,
            page: nextPage,
        })
        that.getHero()
    },
});
