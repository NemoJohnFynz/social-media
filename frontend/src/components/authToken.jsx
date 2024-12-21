import cookieModule from "./cookie.module";

function getToken() {
    return cookieModule().getCookie("Token");
}
function setToken(value) {
    if (getToken()) {
        deleteToken();
        return cookieModule().setCookie("Token", value, 24)
    } else {
        return cookieModule().setCookie("Token", value, 24)
    }
}
function deleteToken() {
    return cookieModule().deleteCookie("Token")
}
export default { getToken, setToken, deleteToken };