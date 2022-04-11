package cn.twincest.plldb.util;

import lombok.Getter;
import lombok.Setter;
import com.mongodb.lang.Nullable;
import com.mongodb.lang.NonNull;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Random;

public class VerifyCodeUtil {

	@Getter
	@Setter
	public static class VerifyCode {

		private int width;

		private int height;

		private String code;

		private byte[] data;

	}

	// without 1 I i l
	private static final char[] CHARACTER_SET = "023456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz".toCharArray();

	@Nullable
	public static VerifyCode make(int width, int height, int characterCount) {
		try {
			var result = new VerifyCode();
			// draw picture
			var random = new Random();
			var image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
			var g = image.getGraphics();
			var themeColor = new Color(31, 31, 31);
			g.setColor(themeColor);
			g.fillRect(0, 0, width, height);
			var resultCode = new StringBuilder();
			g.setFont(new Font("Microsoft Yahei", Font.BOLD & Font.ITALIC, 24));
			for (int i = 0; i < characterCount; i++) {
				g.setColor(new Color(random.nextInt(255), random.nextInt(255), random.nextInt(255)));
				var character = CHARACTER_SET[random.nextInt(CHARACTER_SET.length)];
				resultCode.append(character);
				g.drawString(String.valueOf(character), (width / (characterCount + 1)) * (i + 1), height / 3 * 2);
			}
			for (int j = 0, n = random.nextInt(100); j < n; j++) {
				g.setColor(Color.RED);
				g.fillRect(random.nextInt(width), random.nextInt(height), 1, 1);
			}
			var os = new ByteArrayOutputStream();
			ImageIO.write(image, "jpg", os);
			result.setWidth(width);
			result.setHeight(height);
			result.setCode(resultCode.toString());
			result.setData(os.toByteArray());
			return result;
		} catch (IOException e) {
			return null;
		}
	}

	@Nullable
	public static String verify(HttpServletRequest request, @NonNull String code) {
		// get verifyCode from session
		var codeInSession = (String) request.getSession().getAttribute("verifyCode");
		if (codeInSession == null) {
			return "验证码不存在，请刷新并重新输入";
		}
		request.getSession().removeAttribute("verifyCode");
		// compare verifyCode
		if (!codeInSession.equalsIgnoreCase(code)) {
			return "验证码错误";
		}
		return null;
	}

}
