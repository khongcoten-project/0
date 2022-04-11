package cn.twin_kles.plldb.filter

import cn.twin_kles.plldb.util.JSONUtil.fromString
import javax.servlet.annotation.WebFilter
import cn.twin_kles.plldb.util.Parameter
import cn.twin_kles.plldb.util.Result
import java.lang.Exception
import javax.servlet.*
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@WebFilter(filterName = "CommonFilter", urlPatterns = ["/servlet/*"])
class CommonFilter : Filter {

    override fun init(config: FilterConfig) {}

    override fun doFilter(request: ServletRequest, response: ServletResponse, chain: FilterChain) {
        run {
            val servletRequest = request as HttpServletRequest
            val servletResponse = response as HttpServletResponse
            val originHeads = servletRequest.getHeader("Origin")
            servletResponse.setHeader("Access-Control-Allow-Origin", originHeads)
            servletResponse.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE,HEAD,PUT,PATCH")
            servletResponse.setHeader("Access-Control-Max-Age", "3600")
            servletResponse.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization,authorization")
            servletResponse.setHeader("Access-Control-Allow-Credentials", "true")
        }
        // config request and response
        request.characterEncoding = "utf-8"
        response.contentType = "application/json;charset=utf-8"
        // create parameter
        val parameterString = request.getParameter("parameter")
        val parameter = fromString<Any>(parameterString, Parameter::class.java)
        // create result
        val result = Result()
        // set as attribute
        request.setAttribute("parameter", parameter)
        request.setAttribute("result", result)
        // do servlet
        try {
            chain.doFilter(request, response)
        } catch (e: Exception) {
            e.printStackTrace()
            result.status = e.cause?.message ?: "unknown error"
        }
        // remove from attribute
        request.removeAttribute("parameter")
        request.removeAttribute("result")
        // write as response
        response.writer.print(result.generate())
    }

    override fun destroy() {}

}