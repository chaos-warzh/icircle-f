import { axios } from '../utils/request'
import { CIRCLE_MODULE } from './_prefix'

type CircleInfo = {
    name: string,
    logoUrl: string
}

// 创建circle
export const createCircle = (circleInfo: CircleInfo) => {
    return axios.post(`${CIRCLE_MODULE}/`, circleInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

// 获取全部circles
export const getAllCircle = () => {
    return axios.get(`${CIRCLE_MODULE}/all`,)
        .then(res => {
            return res
        })
}

// 根据Id获取指定circle
export const getCircleById = (circleId: number) => {
    return axios.get(`${CIRCLE_MODULE}/${circleId}`)
        .then(res => {
            return res
        })
}

// 获取活跃人数
export const getCircleActiveNum = (circleId: number) => {
    return axios.get(`${CIRCLE_MODULE}/${circleId}/activeUserCount`)
        .then(res => {
            return res
        })
}

// 获取circle评价数
export const getCommentCount = (circleId: number) => {
    return axios.get(`${CIRCLE_MODULE}/${circleId}/commentCount`)
        .then(res => {
            return res
        })
}

