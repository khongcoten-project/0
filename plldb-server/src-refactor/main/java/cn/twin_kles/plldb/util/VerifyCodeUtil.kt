package cn.twin_kles.plldb.util

import java.awt.image.BufferedImage
import java.awt.Color
import java.lang.StringBuilder
import java.awt.Font
import java.io.ByteArrayOutputStream
import javax.imageio.ImageIO
import java.io.IOException
import java.util.*
import javax.servlet.http.HttpServletRequest

object VerifyCodeUtil {

    class VerifyCode(width: Int, height: Int, code: String, data: ByteArray) {

        var width: Int
        var height: Int
        var code: String
        var data: ByteArray

        init {
            this.width = width
            this.height = height
            this.code = code
            this.data = data
        }

    }

    // without 1 I i l
    private val CHARACTER_SET = "023456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz".toCharArray()

    fun make(width: Int, height: Int, characterCount: Int): VerifyCode {
        try {
            // draw picture
            val random = Random()
            val image = BufferedImage(width, height, BufferedImage.TYPE_INT_RGB)
            val graphics = image.graphics
            val themeColor = Color(31, 31, 31)
            graphics.color = themeColor
            graphics.fillRect(0, 0, width, height)
            val resultCode = StringBuilder()
            graphics.font = Font("Microsoft Yahei", Font.BOLD and Font.ITALIC, 24)
            for (i in 0 until characterCount) {
                graphics.color = Color(random.nextInt(255), random.nextInt(255), random.nextInt(255))
                val character = CHARACTER_SET[random.nextInt(CHARACTER_SET.size)]
                resultCode.append(character)
                graphics.drawString(character.toString(), width / (characterCount + 1) * (i + 1), height / 3 * 2)
            }
            var j = 0
            val n = random.nextInt(100)
            while (j < n) {
                graphics.color = Color.RED
                graphics.fillRect(random.nextInt(width), random.nextInt(height), 1, 1)
                j++
            }
            val os = ByteArrayOutputStream()
            ImageIO.write(image, "jpg", os)
            return VerifyCode(width, height, resultCode.toString(), os.toByteArray())
        } catch (e: IOException) {
            throw e
        }
    }

    fun verify(request: HttpServletRequest, code: String): String? {
        // get verifyCode from session
        val codeInSession = request.session.getAttribute("verifyCode") as String
            ?: return "验证码不存在，请刷新并重新输入"
        request.session.removeAttribute("verifyCode")
        // compare verifyCode
        return if (!codeInSession.equals(code, true)) {
            "验证码错误"
        } else null
    }

}