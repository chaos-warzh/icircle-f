import {COMMENTS_MODULE} from './_prefix.ts'
import {axios} from '../utils/request'

type Comment = {
    userName: string,
    content: string,
    postId: number,
    photoUrlList: string[],
}

export const commentPost = (postId: number, comment: Comment) => {
    return axios.post(`${COMMENTS_MODULE}/${postId}/comment`, comment, {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

// 点赞某条评论
// 参数：评论ID
// 返回：是否成功
export const likeComment = (commentId: number, userId: number) => {
    return axios.post(`${COMMENTS_MODULE}/like?commentId=${commentId}&userId=${userId}`)
        .then(res => {
            return res
        })
}
// 取消点赞某条评论
// 参数：评论ID
// 返回：是否成功
export const dislikeComment = (commentId: number, userId: number) => {
    return axios.post(`${COMMENTS_MODULE}/cancellike?commentId=${commentId}&userId=${userId}`)
        .then(res => {
            return res
        })
}

// 检查是否点赞过
// 参数：评论ID，用户ID
// 返回：是否点赞过
export const checkLiked = (commentId: number, userId: number) => {
    return axios.get(`${COMMENTS_MODULE}/checkhasliked?commentId=${commentId}&userId=${userId}`)
        .then(res => {
            return res
        })
}
