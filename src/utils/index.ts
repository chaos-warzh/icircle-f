export function parseRole(role: string | null) {
    if (role === 'MANAGER') {
        return "管理者"
    } else if (role === 'USER') {
        return "用户"
    } else if (role === 'STAFF') {
        return "员工"
    } else if (role === 'ADMINISTRATOR') {
        return "管理员"
    }
}

export function parseTime(time: string) {
    let times = time.split(/T|\./)
    return times[0] + " " + times[1]
}
