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

function getFight(job = "all") {
    return get(`/lol/fight?job=${job}`)
}

module.exports = {getRanking, getHero, getHeroDetail, getFight}
