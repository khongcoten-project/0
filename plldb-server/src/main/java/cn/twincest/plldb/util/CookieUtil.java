package cn.twincest.plldb.util;

import com.mongodb.lang.Nullable;
import com.mongodb.lang.NonNull;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public class CookieUtil {

	// "TwinKleS-plldb" * MD5
	private static final String COOKIE_CRYPT_KEY = "5ba8814567eed8c620d5a55443f19878";

	@Nullable
	public static Cookie get(@NonNull HttpServletRequest request, @NonNull String name) {
		var cookieList = request.getCookies();
		if (cookieList != null) {
			for (var cookie : cookieList) {
				if (cookie.getName().equals(name)) {
					return cookie;
				}
			}
		}
		return null;
	}

	@NonNull
	public static Cookie make(@NonNull String name, @NonNull String value, boolean encrypt, int maxAge) {
		var cookie = new Cookie(name, !encrypt ? value : TypeUtil.encryptByAES(value, COOKIE_CRYPT_KEY));
		cookie.setMaxAge(maxAge);
		return cookie;
	}

	@NonNull
	public static String decrypt(@NonNull String value) {
		return TypeUtil.decryptByAES(value, COOKIE_CRYPT_KEY);
	}

}
