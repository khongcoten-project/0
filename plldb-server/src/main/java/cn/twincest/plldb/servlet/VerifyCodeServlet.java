package cn.twincest.plldb.servlet;

import cn.twincest.plldb.util.Parameter;
import cn.twincest.plldb.util.Result;
import cn.twincest.plldb.util.VerifyCodeUtil;
import lombok.SneakyThrows;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Base64;

@WebServlet("/servlet/VerifyCode")
public class VerifyCodeServlet extends HttpServlet {
	@SneakyThrows
	protected void doPost(HttpServletRequest request, HttpServletResponse response) {
		var parameter = (Parameter) request.getAttribute("parameter");
		var result = (Result) request.getAttribute("result");
		result.status = switch (parameter.method) {
			default -> "未知方法";
			case "generate" -> {
				// data
				var data = new Object() {
					final Integer width = parameter.getIntegerRequired("width");
					final Integer height = parameter.getIntegerRequired("height");
				};
				// check data
				if (data.width > 128 || data.height > 128) {
					yield "图像尺寸超出限制";
				}
				// generate
				VerifyCodeUtil.VerifyCode verifyCode = VerifyCodeUtil.make(data.width, data.height, 4);
				// success
				result.append("data", Base64.getEncoder().encodeToString(verifyCode.getData()));
				request.getSession().setAttribute("verifyCode", verifyCode.getCode());
				yield null;
			}
		};
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) {
		this.doPost(request, response);
	}
}
