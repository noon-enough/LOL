
const app= getApp()
Page({
    data: {
        list: app.globalData.tabbar
    },
    onLoad: function (options) {
        console.log('list', this.data.list)
    }
});
