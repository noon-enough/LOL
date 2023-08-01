import {getRanking} from "../../utils/api";
import {getPositions, showToast} from "../../utils/util";
import {LOL_CONFIG} from "../../utils/config";

const app= getApp()
Page({
    data: {
        isRefresh: false,
        loadingProps: {
            size: '50rpx',
        },
        positions: LOL_CONFIG.hero_pos,
        page : 1,
        size : 30,
        lane: "mid",
        list: app.globalData.tabbar,
        ranking: [],
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
        console.log('list', this.data.list)

        let that = this
        that.setData({
            page: 1,
        })
        that.getRanking()
    },
    getRanking() {
        let that = this

        getRanking(that.data.lane, that.data.page, that.data.size).then(res => {
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
            that.setData({
                ranking: data,
                isRefresh: false,
            })
        })
    },
    onPullDownRefresh() {
        let that = this
        that.setData({
            page: 1,
            isDone: false,
            isRefresh: true,
        })
        that.getRanking()
    },
    onScroll(e) {},
    onSelect(e) {
        let that = this,
            type = e.currentTarget.dataset.type ?? 'mid'

        that.setData({
            lane: type,
        })

        that.getRanking()
    },
});
