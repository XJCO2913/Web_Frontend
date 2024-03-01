// 封装和token 相关的 存 取 删

const TOKEN = 'token'

function setToken(token) {
    return localStorage.setItem(TOKEN, token)
}

function getToken() {
    return localStorage.getItem(TOKEN)
}

function removeToken() {
    return localStorage.removeItem(TOKEN)
}

export {
    setToken,
    getToken,
    removeToken
}