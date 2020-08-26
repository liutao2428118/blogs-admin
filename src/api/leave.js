import request from '@/utils/request'

export function getLeaveList(params) {
    return request.get('/leave/leave-list', { params })
}

export function deleteLeave(params) {
    return request.get('/leave/delete-leave', { params })
}


export function getIsReadLeaveAll(params) {
    return request.get('/leave/get-isReadLeave', { params })
}

export function setLeaveRead(data) {
    return request.put('/leave/set-leave-read', data)
}
