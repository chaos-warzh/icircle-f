import { axios } from '../utils/request'
import { POST_MODULE } from './_prefix'

type PostInfo = {
    circleId: number,
    name: string,
    photoUrlList: string[]
}


// 创建post
export const createPost = (postInfo: PostInfo) => {
    return axios.post(`${POST_MODULE}/`, postInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

// 获取circle下所有posts
export const getPostsByCircleId = (circleId: number) => {
    return axios.get(`${POST_MODULE}/?circleId=${circleId}`)
        .then(res => {
            return res
        })
}

// 根据post Id获取post信息
export const getPostById = (postId: number) => {
    return axios.get(`${POST_MODULE}/${postId}`)
        .then(res => {
            return res
        })
}



// 获取comment under post
// 参数: post ID
// 返回：[ Comment1, Comment2, ... ] Comment结构如上
export const getPostComment = (postId: number) => {
    return axios.get(`${POST_MODULE}/${postId}/comments`)
        .then(res => {
            return res
        })
}

export const getSearchedPosts = (name?: string) => {
    let url = `${POST_MODULE}/search`;
    if (name !== undefined) {
        url += `?name=${name}`;
    }
    return axios.get(url)
        .then(res => {
            console.log(res)
            return res;
        });
}
