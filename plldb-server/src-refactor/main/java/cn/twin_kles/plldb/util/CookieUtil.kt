package cn.twin_kles.plldb.util

import javax.servlet.http.Cookie
import javax.servlet.http.HttpServletRequest

object CookieUtil {

    // "TwinKleS-plldb" * MD5
    private const val COOKIE_CRYPT_KEY = "5ba8814567eed8c620d5a55443f19878"

    fun get(request: HttpServletRequest, name: String): Cookie? {
        val cookieList = request.cookies
        if (cookieList != null) {
            for (cookie in cookieList) {
                if (cookie.name == name) {
                    return cookie
                }
            }
        }
        return null
    }

    fun make(name: String, value: String, encrypt: Boolean, maxAge: Int): Cookie {
        val cookie = Cookie(name, if (!encrypt) value else TypeUtil.encryptByAES(value, COOKIE_CRYPT_KEY))
        cookie.maxAge = maxAge
        return cookie
    }

    fun decrypt(value: String): String {
        return TypeUtil.decryptByAES(value, COOKIE_CRYPT_KEY)
    }

}