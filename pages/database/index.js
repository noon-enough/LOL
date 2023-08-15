import {LOL_CONFIG, NICKNAME} from "../../utils/config";
import {getEquipment, getHero} from "../../utils/api";
import {getIsShowNickname, heroDetail, showToast} from "../../utils/util";

const app = getApp()
Page({
    data: {
        is_show_nickname: false,
        isRefresh: false,
        loadingProps: {
            size: '50rpx',
        },
        activeKey: "hero",
        selectModel: 0,
        selectClassify: "all",
        models: LOL_CONFIG.mode_list,
        classify: LOL_CONFIG.equip_class,
        list: app.globalData.tabbar,
        positions: LOL_CONFIG.hero_pos,
        jobs: LOL_CONFIG.hero_job,
        selectPos: "",
        selectJob: "",
        equipments: [],
        equipmentsBackup: [],
        heroes: [],
        heroesBackup: [],
        totalPage: 1,
        isDone: false,
        page: 1,
        size: 30,
        equipment: {},
        show_equipment_dialog: false,
        is_show_equipment_mask: false,
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
                selectJob: selectJob,
                activeKey: "hero",
            })
            that.getHero()
        }

        let is_show_nickname = getIsShowNickname()
        console.log('onshow', 'is_show_nickname', is_show_nickname)
        that.setData({
            is_show_nickname: is_show_nickname,
        })
    },
    onLoad: function (options) {
        let that = this,
            selectPos = app.globalData.heroes.pos,
            selectJob = app.globalData.heroes.job,
            activeKey = that.data.activeKey
        wx.showLoading()
        that.setData({
            selectPos: selectPos,
            selectJob: selectJob,
        })
        if (activeKey === "hero") {
            that.getHero()
        } else if (activeKey === "equipment") {
            that.getEquipment()
        }
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
                heroesBackup: data,
                totalPage: res.extra.totalPage ?? 1,
            })
            wx.hideLoading()
        })
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
    onSelect(e) {
        let that = this,
            type = e.currentTarget.dataset.type ?? 'all',
            action = e.currentTarget.dataset.action ?? 'position',
            activeKey = that.data.activeKey,
            data = {}

        wx.showLoading()
        // 每次我都需要重新获取数据？
        if (activeKey === "hero") {
            if (action === 'position') {
                data.selectPos = type
            } else {
                data.selectJob = type
            }
            that.setData(data)
            that.getHero()
        } else if(activeKey === "equipment") {
            if (action === "classify") {
                data.selectClassify = type
            } else {
                data.selectModel = type
            }
            that.setData(data)
            that.getEquipment()
        }
    },
    onScrollToBottom(e) {
        let that = this,
            activeKey = that.data.activeKey
        if (activeKey === "hero") {
            that.onReachBottom()
        }
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
    getEquipment() {
        let that = this,
            map = that.data.selectModel,
            classify = that.data.selectClassify
        getEquipment(map, classify).then(res => {
            console.log('getEquipment', res)
            let code = res.code ?? 200,
                data = res.data,
                message = data.message ?? "非法操作"

            if (code !== 200) {
                showToast(message, {icon: "error"})
                return
            }
            that.setData({
                equipments: data,
                equipmentsBackup: data,
                isRefresh: false,
            })
            wx.hideLoading()
        })
    },
    onTabTabBar(e) {
        let that = this,
            activeKey = e.detail.activeKey ?? "hero"
        that.setData({
            activeKey: activeKey,
        })

        if (activeKey === "hero") {
            that.getHero()
        } else if (activeKey === "equipment") {
            that.getEquipment()
        }
    },
    showDialog(e) {
        let that = this,
            id = e.currentTarget.dataset.id

        // 查询了
        let equipment = {}
        that.data.equipments.forEach((item) => {
            if (parseInt(item.itemId) === parseInt(id)) {
                equipment = item
            }
        })
        console.log('equipment', equipment)
        that.setData({
            is_show_equipment_mask: true,
            equipment: equipment,
        })
    },
    changeMask() {
        let that = this
        that.setData({
            is_show_equipment_mask: false,
            equipment: {},
        })
    },
    searchConfirm(e) {
        let q = e.detail.value ?? ""
        if (q === "") {
            return
        }
        this.searchBackupData(q)
    },
    searchClear(e) {
        let that = this,
            activeKey = that.data.activeKey,
            data = {}
        if (activeKey === "hero") {
            data.heroes = that.data.heroesBackup
        } else if (activeKey === "equipment") {
            data.equipments = that.data.equipmentsBackup
        }
        that.setData(data)
    },
    searchChange(e){
        let q = e.detail.value ?? "",
            that = this,
            activeKey = that.data.activeKey,
            data = {}
        q = q.trim()
        if (q === "") {
            if (activeKey === "hero") {
                data.heroes = that.data.heroesBackup
            } else if (activeKey === "equipment") {
                data.equipments = that.data.equipmentsBackup
            }
            that.setData(data)
            return
        }
        that.searchBackupData(q)
    },
    searchBackupData(q = "") {
        let that = this,
            data = [],
            activeKey = that.data.activeKey,
            setData = {}
        if (activeKey === "hero") {
            that.data.heroesBackup.forEach((item) => {
                if (item.name.search(q) !== -1 ||
                    item.nickname.search(q) !== -1 ||
                    item.title.search(q) !== -1 ||
                    item.alias.search(q) !== -1
                ) {
                    data.push(item)
                }
            })
            setData.heroes = data
        } else if (activeKey === "equipment") {
            that.data.equipmentsBackup.forEach((item) => {
                let keywords = item.keywords.split(",")
                if (keywords.includes(q)) {
                    data.push(item)
                }
            })
            setData.equipments = data
        }

        that.setData(setData)
    },
});
