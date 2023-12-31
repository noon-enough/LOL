import {heroDetail} from "../../utils/util";
import boolean from "../../miniprogram_npm/lin-ui/common/async-validator/validator/boolean";

Component({
  /**
   * 外部样式类
   */
  externalClasses: ['header-row-class-name', 'row-class-name', 'cell-class-name'],

  /**
   * 组件样式隔离
   */
  options: {
    styleIsolation: "isolated",
    multipleSlots: true, // 支持多个slot
  },

  /**
   * 组件的属性列表
   */
  properties: {
    isShowNickname: {
      type: boolean,
      value: false,
    },
    data: {
      type: Array,
      value: []
    },
    headers: {
      type: Array,
      value: []
    },
    // table的高度, 溢出可滚动
    height: {
      type: String,
      value: 'auto'
    },
    width: {
      type: Number || String,
      value: '100%'
    },
    // 单元格的宽度
    tdWidth: {
      type: Number,
      value: 35
    },
    // 固定表头 thead达到Header的位置时就应该被fixed了
    offsetTop: {
      type: Number,
      value: 150
    },
    // 是否带有纵向边框
    stripe: {
      type: Boolean,
      value: false
    },
    // 是否带有纵向边框
    border: {
      type: Boolean,
      value: false
    },
    msg: {
      type: String,
      value: '暂无数据~'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrolWidth: '100%'
  },

  /**
   * 组件的监听属性
   */
  observers: {
    // 在 numberA 或者 numberB 被设置时，执行这个函数
    'headers': function (headers) {
      const reducer = (accumulator, currentValue) => {
        return accumulator + Number(currentValue.width)
      };
      const scrolWidth = headers.reduce(reducer, 0)

      this.setData({
        scrolWidth: scrolWidth
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onRowClick(e) {
      this.triggerEvent('rowClick', e, e.currentTarget.dataset.it)
    },
    detail(e) {
      let id = e.currentTarget.dataset.heroId
      heroDetail(id)
    },
    onMore(e) {
      this.triggerEvent('moreEvent', e, e.currentTarget.dataset.heroId)
    }
  }
})
