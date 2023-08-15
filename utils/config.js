const NICKNAME = "__LOL_NICKNAME__"
const TFT = "__LOL_TFT__"
const API_DOMAIN = "https://tft.qizue.com"
const LOL_CONFIG = {
    hero_job:[
        {type:'fighter',name:'战士'},
        {type:'mage',name:'法师'},
        {type:'assassin',name:'刺客'},
        {type:'tank',name:'坦克'},
        {type:'marksman',name:'射手'},
        {type:'support',name:'辅助'}
    ],
    hero_pos:[
        {type:'top',name:'上单',icon:'icon-pos-top'},
        {type:'jungle',name:'打野',icon:'icon-pos-jungle'},
        {type:'mid',name:'中路',icon:'icon-pos-mid'},
        {type:'bottom',name:'下路',icon:'icon-pos-bot'},
        {type:'support',name:'辅助',icon:'icon-pos-sup'},
    ],
    equip_class:[
        {type:'ordinary',name:'普通'},
        {type:'epic',name:'史诗'},
        {type:'legend',name:'传说'},
        {type:'myth',name:'神话'}
    ],
    mode_list: ['召唤师峡谷', '斗魂竞技场'],
}
module.exports = {API_DOMAIN, LOL_CONFIG, NICKNAME, TFT}
