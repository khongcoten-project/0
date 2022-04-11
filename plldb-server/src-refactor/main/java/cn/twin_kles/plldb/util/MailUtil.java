package cn.twin_kles.plldb.util;

import org.springframework.mail.javamail.JavaMailSenderImpl;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class MailUtil {

	private static final String REGEX_EMAIL = "^[a-z0-9A-Z]+[-|a-z0-9A-Z._]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$";

	public static boolean check(String email) {
		return email.matches(REGEX_EMAIL);
	}

	private static final String FROM = "smallpc@qq.com";

	private static final String USER_NAME = "smallpc@qq.com";
	private static final String PASSWORD = "vedewlqicwezdieg";

	private static final String HOST = "smtp.qq.com";
	private static final int PORT = 465;
	private static final String PORT_STRING = "465";
	private static final String SSL_FACTORY = "javax.net.ssl.SSLSocketFactory";

	public static boolean send(String title, String content, String email) {
		if (true) {
			return true;
		}
		try {
			JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();

			javaMailSender.setHost(HOST);
			javaMailSender.setPort(PORT);
			javaMailSender.setUsername(USER_NAME);
			javaMailSender.setPassword(PASSWORD);
			javaMailSender.setProtocol("smtps");

			Properties javaMailProperties = new Properties();
			javaMailProperties.put("mail.smtp.auth", "false");
			javaMailProperties.put("mail.smtp.starttls.enable", "true");
			javaMailProperties.put("mail.transport.protocol", "smtps");
			javaMailProperties.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
			javaMailProperties.put("mail.smtp.timeout", "10000");

			javaMailSender.setJavaMailProperties(javaMailProperties);
			javaMailSender.setDefaultEncoding("UTF-8");

			MimeMessage message = javaMailSender.createMimeMessage();
			message.setFrom(new InternetAddress(FROM));
			message.setRecipient(Message.RecipientType.TO, new InternetAddress(email));
			message.setSubject(title);
			message.setContent(content, "text/html;charset=UTF-8");
			message.saveChanges();

			javaMailSender.send(message);

			return true;
		} catch (MessagingException e) {
			e.printStackTrace();
			return false;
		}
	}

	public static void sendAsync(String title, String content, String email) {
//		Thread thread = new Thread(() -> send(title, content, email));
//		thread.start();
	}

}
