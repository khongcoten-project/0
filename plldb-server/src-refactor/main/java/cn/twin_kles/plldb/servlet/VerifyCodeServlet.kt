package cn.twin_kles.plldb.servlet

import cn.twin_kles.plldb.util.Parameter
import cn.twin_kles.plldb.util.Result
import cn.twin_kles.plldb.util.VerifyCodeUtil
import cn.twin_kles.plldb.util.VerifyCodeUtil.VerifyCode
import java.util.*
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@WebServlet("/servlet/VerifyCode")
class VerifyCodeServlet : HttpServlet() {

    override fun doGet(req: HttpServletRequest?, resp: HttpServletResponse?) {
        doPost(req, resp)
    }

    override fun doPost(req: HttpServletRequest?, resp: HttpServletResponse?) {
        req!!; resp!!
        val parameter = req.getAttribute("parameter") as Parameter
        val result = req.getAttribute("result") as Result
        result.status = when (parameter.method) {
            "generate" -> {
                // data
                val data = object {
                    val width = parameter.getIntegerRequired("width")
                    val height = parameter.getIntegerRequired("height")
                }
                // check data
                if (data.width > 128 || data.height > 128) {
                    "图像尺寸超出限制"
                } else {
                    // generate
                    val verifyCode = VerifyCodeUtil.make(data.width, data.height, 4)
                    // success
                    result.append("data", Base64.getEncoder().encodeToString(verifyCode.data))
                    req.session.setAttribute("verifyCode", verifyCode.code)
                    null
                }
            }
            else -> "未知方法"
        }
    }

}