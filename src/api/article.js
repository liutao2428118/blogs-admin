import request from '@/utils/request'


export function addArticle(data) {
    return request({
        url: '/article/add-article',
        method: 'post',
        data
    })
}

export function getArticleList(params) {
    return request.get('/article/article-list', { params })
}

export function getArticleOne(data) {
    return request({
        url: '/article/article-one',
        method: 'post',
        data
    })
}

export function amendArticleOne(data) {
    return request({
        url: '/article/amend-article',
        method: 'put',
        data
    })
}

export function setIsShowArticle(data) {
    return request({
        url: '/article/is-show-article',
        method: 'put',
        data
    })
}

export function getBrowseList() {
    return request({
        url: '/article/get-browse-list',
        method: 'get'
    })
}

