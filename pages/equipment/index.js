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
                isRefresh: false,
            })
        })
        wx.hideLoading()
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
        that.setData(data)
        that.getEquipment()
    },
    onPullDownRefresh() {
        let that = this
        that.setData({
            isDone: false,
            isRefresh: true,
        })
        that.getEquipment()
    },
    onScroll(e) {},
});
