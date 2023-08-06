import {get} from './http'

/**
 *
 * @param lane
 * @param page
 * @param size
 * @returns {Promise<SuccessParam<wx.RequestOption>>}
 */
function getRanking(lane, page = 1, size = 30) {
    return get(`/lol/ranking?lane=${lane}&page=${page}&size=${size}`)
}

function getHero(pos = "all", job = "all") {
    return get(`/lol/champions?pos=${pos}&job=${job}`)
}

function getHeroDetail(id = 0) {
    return get(`/lol/champions/${id}`)
}

function getHeroOverview(id = 0) {
    return get(`/lol/champions/${id}/detail`)
}

function getFight(job = "all") {
    return get(`/lol/fight?job=${job}`)
}

function getArena(job = "all") {
    return get(`/lol/arena?job=${job}`)
}

function getHeroSkill(id = 0) {
    return get(`/lol/champions/${id}/skill`)
}

function getEquipment(map = 0, classify = "all") {
    return get(`/lol/equipment?map=${map}&class=${classify}`)
}

function get1V1(uid = 0, target = 0, lane = "mid") {
    return get(`/lol/champions/${uid}/vs/${target}?lane=${lane}`)
}
module.exports = {getRanking, getHero, getHeroDetail, getFight, getArena,
    getEquipment, getHeroSkill, getHeroOverview, get1V1}
