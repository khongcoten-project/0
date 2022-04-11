package cn.twin_kles.plldb.util

import cn.twin_kles.plldb.dao.UserDao
import cn.twin_kles.plldb.domain.User
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

object ContextUtil {

    // session attribute setter and getter

    fun set(request: HttpServletRequest, user: User?, rawPassword: String?) {
        request.session.setAttribute("user", user)
        request.session.setAttribute("rawPassword", rawPassword)
    }

    fun getUser(request: HttpServletRequest): User? {
        return request.session.getAttribute("user") as User?
    }

    fun getRawPassword(request: HttpServletRequest): String? {
        return request.session.getAttribute("rawPassword") as String?
    }

    // login

	fun login(request: HttpServletRequest, name: String, rawPassword: String): User? {
        val user = UserDao.login(name, rawPassword)
        set(request, user, if (user == null) null else rawPassword)
        return user
    }

	fun reLogin(request: HttpServletRequest): User? {
        val user = getUser(request)
        val rawPassword = getRawPassword(request)
        return if (user != null) {
            login(request, user.name, rawPassword!!)
        } else null
    }

	fun logout(request: HttpServletRequest) {
        set(request, null, null)
    }

    // store user to cookie

    private const val COOKIE_MAX_AGE = 60 * 60 * 24 * 15

	fun appendCookie(response: HttpServletResponse, loginName: String, loginPassword: String) {
        val loginNameCookie = CookieUtil.make("loginName", loginName, true, COOKIE_MAX_AGE)
        val loginPasswordCookie = CookieUtil.make("loginPassword", loginPassword, true, COOKIE_MAX_AGE)
        response.addCookie(loginNameCookie)
        response.addCookie(loginPasswordCookie)
    }

	fun removeCookie(response: HttpServletResponse) {
        val loginNameCookie = CookieUtil.make("loginName", "", true, 0)
        val loginPasswordCookie = CookieUtil.make("loginPassword", "", true, 0)
        response.addCookie(loginNameCookie)
        response.addCookie(loginPasswordCookie)
    }

	fun loginByCookieIfExist(request: HttpServletRequest): User? {
        var user = null as User?
        val name = CookieUtil.get(request, "loginName")
        val password = CookieUtil.get(request, "loginPassword")
        if (name != null && name.value != null && password != null && password.value != null) {
            user = login(request, CookieUtil.decrypt(name.value), CookieUtil.decrypt(password.value))
        }
        return user
    }

}