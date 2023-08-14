import {LOL_CONFIG} from "../../utils/config";
import {getEquipment} from "../../utils/api";
import {showToast} from "../../utils/util";

const app = getApp()
Page({
    data: {
        isRefresh: false,
        loadingProps: {
            size: '50rpx',
        },
        selectModel: 0,
        selectClassify: "all",
        models: LOL_CONFIG.mode_list,
        classify: LOL_CONFIG.equip_class,
        list: app.globalData.tabbar,
        data: [],
        equipment: {},
        show_equipment_dialog: false,
        is_show_equipment_mask: false,
        backupData: [],
    },
    onLoad: function (options) {
        let that = this
        wx.showLoading()
        that.getEquipment()
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
                data: data,
                backupData: data,
                isRefresh: false,
            })
            wx.hideLoading()
        })
    },
    onSelect(e) {
        let that = this,
            type = e.currentTarget.dataset.type ?? 'all',
            action = e.currentTarget.dataset.action ?? 'classify',
            data = {}

        if (action === "classify") {
            data = {
                selectClassify: type,
            }
        } else {
            data = {
                selectModel: type,
            }
        }
        wx.showLoading()
        that.setData(data)
        that.getEquipment()
    },
    onPullDownRefresh() {
        let that = this
        that.setData({
            isDone: false,
            isRefresh: true,
        })
        wx.showLoading()
        that.getEquipment()
    },
    onScroll(e) {},
    showDialog(e) {
        let that = this,
            id = e.currentTarget.dataset.id

        // 查询了
        let equipment = {}
        that.data.data.forEach((item) => {
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
        let that = this
        that.setData({
            data: that.data.backupData,
        })
    },
    searchChange(e){
        let q = e.detail.value ?? "",
            that = this
        if (q === "") {
            that.setData({
                data: that.data.backupData
            })
            return
        }
        that.searchBackupData(q)
    },
    searchBackupData(q = "") {
        let that = this,
            data = []
        that.data.backupData.forEach((item) => {
            let keywords = item.keywords.split(",")
            if (keywords.includes(q)) {
                data.push(item)
            }
        })

        console.log('data', data)
        that.setData({
            data: data,
        })
    },
    onShareAppMessage(options) {
        let that = this
        return {
            title: `【全装备数据资料库】英雄联盟LOL开黑上分助手，国服玩家都在用的上分小程序`,
            path: `/pages/equipment/index`,
        }
    },
});
