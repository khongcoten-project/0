package cn.twincest.plldb.servlet;

import cn.twincest.plldb.dao.RecordDao;
import cn.twincest.plldb.dao.UserDao;
import cn.twincest.plldb.util.ContextUtil;
import cn.twincest.plldb.util.Parameter;
import cn.twincest.plldb.util.Result;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

@WebServlet("/servlet/Administration")
public class AdministrationServlet extends HttpServlet {
	protected void doPost(HttpServletRequest request, HttpServletResponse response) {
		var parameter = (Parameter) request.getAttribute("parameter");
		var result = (Result) request.getAttribute("result");
		// current user
		var currentUser = ContextUtil.reLogin(request);
		// check user
		if (currentUser == null) {
			result.status = "未登入";
			return;
		}
		// process
		result.status = switch (parameter.method) {
			default -> "未知方法";
			case "downloadDatabase" -> {
				// must be editor or checker
				if (!currentUser.getEditor() && !currentUser.getChecker()) {
					yield "非编辑员或审核员";
				}
				// empty data
				// find
				var userCollection = UserDao.findAll();
				var recordCollection = RecordDao.findAll();
				// success
				result.append("date", new Date());
				result.append("user", userCollection);
				result.append("record", recordCollection);
				yield null;
			}
			case "formatDatabase" -> {
				// must be editor
				if (!currentUser.getEditor()) {
					yield "非编辑员";
				}
				// empty data
				// format
				var userCollectionFormatResult = UserDao.format();
				var recordCollectionFormatResult = RecordDao.format();
				// success
				result.append("user", userCollectionFormatResult);
				result.append("record", recordCollectionFormatResult);
				yield null;
			}
		};
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}
}
