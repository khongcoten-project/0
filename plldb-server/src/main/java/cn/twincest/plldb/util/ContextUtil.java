package cn.twincest.plldb.util;

import cn.twincest.plldb.dao.UserDao;
import cn.twincest.plldb.domain.User;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ContextUtil {

	// session attribute setter and getter

	private static void set(HttpServletRequest request, User user, String rawPassword) {
		request.getSession().setAttribute("user", user);
		request.getSession().setAttribute("rawPassword", rawPassword);
	}

	private static User getUser(HttpServletRequest request) {
		return (User) request.getSession().getAttribute("user");
	}

	private static String getRawPassword(HttpServletRequest request) {
		return (String) request.getSession().getAttribute("rawPassword");
	}

	// login

	public static User login(HttpServletRequest request, String name, String rawPassword) {
		var user = UserDao.login(name, rawPassword);
		if (user == null) {
			set(request, null, null);
		} else {
			set(request, user, rawPassword);
		}
		return user;
	}

	public static User reLogin(HttpServletRequest request) {
		var user = getUser(request);
		var rawPassword = getRawPassword(request);
		if (user != null) {
			return login(request, user.getName(), rawPassword);
		}
		return null;
	}

	public static void logout(HttpServletRequest request) {
		set(request, null, null);
	}

	// store user to cookie

	private static final int COOKIE_MAX_AGE = 60 * 60 * 24 * 15;

	public static void appendCookie(HttpServletResponse response, String loginName, String loginPassword) {
		var loginNameCookie = CookieUtil.make("loginName", loginName, true, COOKIE_MAX_AGE);
		var loginPasswordCookie = CookieUtil.make("loginPassword", loginPassword, true, COOKIE_MAX_AGE);
		response.addCookie(loginNameCookie);
		response.addCookie(loginPasswordCookie);
	}

	public static void removeCookie(HttpServletResponse response) {
		var loginNameCookie = CookieUtil.make("loginName", "", true, 0);
		var loginPasswordCookie = CookieUtil.make("loginPassword", "", true, 0);
		response.addCookie(loginNameCookie);
		response.addCookie(loginPasswordCookie);
	}

	public static User loginByCookieIfExist(HttpServletRequest request) {
		var user = (User) null;
		var name = CookieUtil.get(request, "loginName");
		var password = CookieUtil.get(request, "loginPassword");
		if (name != null && name.getValue() != null &&
				password != null && password.getValue() != null) {
			user = ContextUtil.login(request, CookieUtil.decrypt(name.getValue()), CookieUtil.decrypt(password.getValue()));
		}
		return user;
	}

}
