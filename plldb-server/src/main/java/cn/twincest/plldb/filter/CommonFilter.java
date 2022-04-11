package cn.twincest.plldb.filter;

import cn.twincest.plldb.util.JSONUtil;
import cn.twincest.plldb.util.Parameter;
import cn.twincest.plldb.util.Result;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter(filterName = "CommonFilter", urlPatterns = "/servlet/*")
public class CommonFilter implements Filter {
	public void destroy() {
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException {
		{
			var servletRequest = (HttpServletRequest) request;
			var servletResponse = (HttpServletResponse) response;
			var originHeads = servletRequest.getHeader("Origin");
			servletResponse.setHeader("Access-Control-Allow-Origin", originHeads);
			servletResponse.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,HEAD,PUT,PATCH");
			servletResponse.setHeader("Access-Control-Max-Age", "3600");
			servletResponse.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization,authorization");
			servletResponse.setHeader("Access-Control-Allow-Credentials", "true");
		}
		// config request and response
		request.setCharacterEncoding("utf-8");
		response.setContentType("application/json;charset=utf-8");
		// create parameter
		var parameterString = request.getParameter("parameter");
		var parameter = JSONUtil.fromString(parameterString, Parameter.class);
		// create result
		var result = new Result();
		// set as attribute
		request.setAttribute("parameter", parameter);
		request.setAttribute("result", result);
		// do servlet
		try {
			chain.doFilter(request, response);
		} catch (Exception e) {
			e.printStackTrace();
			result.status = e.getCause().getMessage();
		}
		// remove from attribute
		request.removeAttribute("parameter");
		request.removeAttribute("result");
		// write as response
		response.getWriter().print(result.generate());
	}

	public void init(FilterConfig config) {
	}
}
