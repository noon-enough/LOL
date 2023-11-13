import {getRanking} from "../../utils/api";
import {getIsShowNickname, getPositions, showToast} from "../../utils/util";
import {LOL_CONFIG, NICKNAME} from "../../utils/config";

const app= getApp()
Page({
    data: {
        isRefresh: false,
        loadingProps: {
            size: '50rpx',
        },
        positions: LOL_CONFIG.hero_pos,
        page : 1,
        totalPage: 1,
        size : 30,
        lane: "all",
        highlight: 0,
        list: app.globalData.tabbar,
        ranking: [],
        isDone: false,
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
                width: 300,
                label: '英雄',
            },
            {
                prop: 'win',
                width: 120,
                label: '胜率',
                color: '#fcf0f4',
                orderby: true,
            },
            {
                prop: 'show',
                width: 120,
                label: '登场率',
                color: '#fcf0f4',
                orderby: true,
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
        msg: '暂无数据',
        is_show_nickname: false,
    },
    onShow: function(options) {
        let that = this,
            selectPos = app.globalData.index.lane,
            lane = that.data.lane,
            currHighlight = that.data.highlight,
            highlight = app.globalData.index.highlight

        if (lane !== selectPos) {
            console.log('onShow', app.globalData, highlight)
            that.setData({
                lane: selectPos,
                highlight: highlight
            })
            that.getRanking()
        }

        let is_show_nickname = getIsShowNickname()
        console.log('onshow', 'is_show_nickname', is_show_nickname)
        that.setData({
            is_show_nickname: is_show_nickname,
        })
    },
    onLoad: function (options) {
        let that = this
        wx.showLoading()
        that.setData({
            page: 1,
            lane: app.globalData.index.lane,
            highlight: app.globalData.index.highlight
        })
        that.getRanking()
    },
    getRanking() {
        let that = this,
            lane = that.data.lane,
            page = that.data.page,
            isDone = that.data.isDone,
            size = that.data.size

        if (isDone === true) {
            wx.hideLoading()
            return
        }

        getRanking(lane, page, size).then(res => {
            console.log('getranking', res)
            let code = res.code ?? 200,
                data = res.data,
                message = data.message ?? "非法操作"

            if (code !== 200) {
                showToast(message, {icon: "error"})
                return
            }

            data = data.map((item) => {
                item.win = (item.win * 100).toFixed(1) + "%"
                item.ban = (item.ban * 100).toFixed(1) + "%"
                item.show = (item.show * 100).toFixed(1) + "%"
                item.orderAbs = Math.abs(item.order)
                item.hero.positions = getPositions(item.hero.positions)
                return item
            })

            if (page > 1) {
                data = that.data.ranking.concat(data)
            }

            const uniqueData = [];
            const heroIdSet = new Set();

            data.forEach(item => {
                if (!heroIdSet.has(item.hero_id)) {
                    heroIdSet.add(item.hero_id);
                    uniqueData.push(item);
                }
            });

            that.setData({
                ranking: uniqueData,
                backupData: uniqueData,
                isRefresh: false,
                totalPage: res.extra.totalPage ?? 1,
            })
            wx.hideLoading()
        })
    },
    onPullDownRefresh() {
        let that = this
        that.setData({
            page: 1,
            isDone: false,
            isRefresh: true,
            highlight: 0,
        })
        that.getRanking()
    },
    onScroll(e) {},
    onSelect(e) {
        let that = this,
            type = e.currentTarget.dataset.type ?? 'mid'

        that.setData({
            lane: type,
            highlight: 0,
            page: 1,
            isDone: false,
        })
        wx.showLoading()
        that.getRanking()
    },
    onShareAppMessage(options) {
        let that = this
        return {
            title: `英雄联盟LOL开黑上分助手，国服玩家都在用的上分小程序`,
            path: `/pages/index/index`,
        }
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
            ranking: that.data.backupData,
        })
    },
    searchChange(e){
        let q = e.detail.value ?? "",
            that = this
        q = q.trim()
        if (q === "") {
            that.setData({
                ranking: that.data.backupData
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
            ranking: data,
        })
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
            wx.hideLoading()
            return
        }
        that.setData({
            isDone: false,
            page: nextPage,
        })
        that.getRanking()
    },
});
