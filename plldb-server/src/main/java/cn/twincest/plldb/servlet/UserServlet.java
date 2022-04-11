package cn.twincest.plldb.servlet;

import cn.twincest.plldb.dao.UserDao;
import cn.twincest.plldb.util.*;
import lombok.SneakyThrows;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/servlet/User")
public class UserServlet extends HttpServlet {
	@SneakyThrows
	protected void doPost(HttpServletRequest request, HttpServletResponse response) {
		var parameter = (Parameter) request.getAttribute("parameter");
		var result = (Result) request.getAttribute("result");
		result.status = switch (parameter.method) {
			default -> "未知方法";
			case "register" -> {
				// verify
				String verifyResult = VerifyCodeUtil.verify(request, parameter.get("verifyCode").getAsString());
				if (verifyResult != null) {
					yield verifyResult;
				}
				// data
				var data = new Object() {
					final String name = parameter.getStringRequired("name");
					final String password = parameter.getStringRequired("password");
					final String email = parameter.getString("email");
				};
				// check data
				if (data.name.length() < 1) {
					yield "用户名无效，至少需要1位字符";
				}
				if (UserDao.hasName(data.name)) {
					yield "用户名已被占用";
				}
				if (!TypeUtil.isValidPassword(data.password)) {
					yield "密码无效，至少需要6位字符";
				}
				if (data.email != null && !MailUtil.check(data.email)) {
					yield "邮箱无效";
				}
				// register
				var newUser = UserDao.register(data.name, data.password, data.email);
				if (newUser == null) {
					yield "创建账号失败";
				}
				// login
				var currentUser = ContextUtil.login(request, data.name, data.password);
				if (currentUser == null) {
					yield "登入校验失败";
				}
				ContextUtil.appendCookie(response, data.name, data.password);
				// success
				result.append("user", TypeUtil.cloneUserWithoutPassword(currentUser));
				// send email
				if (data.email != null) {
					MailUtil.sendAsync("PLLDB —— 注册成功",
							String.format("<p>用户 <b>%s</b> 你好，你的账号已注册成功！</p>", data.name),
							data.email);
				}
				yield null;
			}
			case "login" -> {
				// data
				var data = new Object() {
					final String name = parameter.getStringRequired("name");
					final String password = parameter.getStringRequired("password");
				};
				// check data
				if (!UserDao.hasName(data.name)) {
					yield "用户名不存在";
				}
				// login
				var currentUser = ContextUtil.login(request, data.name, data.password);
				if (currentUser == null) {
					yield "登陆失败，请检查密码是否正确";
				}
				ContextUtil.appendCookie(response, data.name, data.password);
				// success
				result.append("user", TypeUtil.cloneUserWithoutPassword(currentUser));
				yield null;
			}
			case "logout" -> {
				// empty data
				// logout
				ContextUtil.logout(request);
				ContextUtil.removeCookie(response);
				// success
				yield null;
			}
			case "reLogin" -> {
				// empty data
				// re-login
				var currentUser = ContextUtil.reLogin(request);
				if (currentUser == null) {
					currentUser = ContextUtil.loginByCookieIfExist(request);
					if (currentUser == null) {
						ContextUtil.removeCookie(response);
					}
				}
				// success
				result.append("user", TypeUtil.cloneUserWithoutPassword(currentUser));
				yield null;
			}
			case "updatePassword" -> {
				// re-login
				var currentUser = ContextUtil.reLogin(request);
				if (currentUser == null) {
					yield "登入校验失败";
				}
				// data
				var data = new Object() {
					final String password = parameter.getStringRequired("password");
					final String newPassword = parameter.getStringRequired("newPassword");
				};
				// check data
				if (!TypeUtil.isValidPassword(data.newPassword)) {
					yield "新密码无效，至少需要六位字符";
				}
				if (!TypeUtil.checkPassword(data.password, currentUser.getPassword())) {
					yield "密码错误";
				}
				// update
				var updatedUser = UserDao.updatePassword(currentUser.getId(), data.newPassword);
				if (updatedUser == null) {
					yield "更新失败";
				}
				// update current user
				currentUser = ContextUtil.login(request, currentUser.getName(), data.newPassword);
				if (currentUser == null) {
					yield "登入校验失败";
				}
				ContextUtil.appendCookie(response, currentUser.getName(), data.newPassword);
				// success
				result.append("user", TypeUtil.cloneUserWithoutPassword(updatedUser));
				yield null;
			}
			case "updateEmail" -> {
				// re-login
				var currentUser = ContextUtil.reLogin(request);
				if (currentUser == null) {
					yield "登入校验失败";
				}
				// data
				var data = new Object() {
					final String email = parameter.getString("email");
				};
				// check data
				if (data.email != null && !MailUtil.check(data.email)) {
					yield "邮箱无效";
				}
				// update
				var updatedUser = UserDao.updateEmail(currentUser.getId(), data.email);
				if (updatedUser == null) {
					yield "更新失败";
				}
				// update current user
				currentUser = ContextUtil.reLogin(request);
				if (currentUser == null) {
					yield "登入校验失败";
				}
				// success
				result.append("user", TypeUtil.cloneUserWithoutPassword(updatedUser));
				yield null;
			}
		};
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) {
		this.doPost(request, response);
	}
}
