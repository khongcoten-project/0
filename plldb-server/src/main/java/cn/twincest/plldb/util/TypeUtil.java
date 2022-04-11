package cn.twincest.plldb.util;

import cn.twincest.plldb.dao.UserDao;
import cn.twincest.plldb.domain.Record;
import cn.twincest.plldb.domain.User;
import cn.twincest.plldb.model.RecordModel;
import org.bson.types.ObjectId;
import com.mongodb.lang.Nullable;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.codec.Hex;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.ArrayList;
import java.util.List;

public class TypeUtil {

	@Nullable
	public static Boolean toBoolean(@Nullable String s) {
		return s == null ? null : Boolean.valueOf(s);
	}

	@Nullable
	public static Integer toInteger(@Nullable String s) {
		return s == null ? null : Integer.valueOf(s);
	}

	@Nullable
	public static List<Integer> toInteger(@Nullable String[] s) {
		if (s == null) {
			return null;
		}
		List<Integer> dest = new ArrayList<>();
		for (String e : s) {
			dest.add(toInteger(e));
		}
		return dest;
	}

	@Nullable
	public static List<Integer> toInteger(@Nullable List<String> s) {
		if (s == null) {
			return null;
		}
		return toInteger(s.toArray(String[]::new));
	}

	@Nullable
	public static ObjectId toObjectId(@Nullable String s) {
		return s == null ? null : new ObjectId(s);
	}

	public static String encryptPassword(String rawPassword) {
		return new Argon2PasswordEncoder().encode(rawPassword);
	}

	public static boolean checkPassword(String rawPassword, String encodedPassword) {
		return new Argon2PasswordEncoder().matches(rawPassword, encodedPassword);
	}

	public static String encryptByAES(String plainText, String key) {
		Key secretKey = new SecretKeySpec(Hex.decode(key), "AES");
		try {
			Cipher cipher = Cipher.getInstance("AES");
			cipher.init(Cipher.ENCRYPT_MODE, secretKey);
			byte[] plainByte = plainText.getBytes(StandardCharsets.UTF_8);
			byte[] result = cipher.doFinal(plainByte);
			return new String(Hex.encode(result));
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public static String decryptByAES(String cipherText, String key) {
		Key secretKey = new SecretKeySpec(Hex.decode(key), "AES");
		try {
			Cipher cipher = Cipher.getInstance("AES");
			cipher.init(Cipher.DECRYPT_MODE, secretKey);
			byte[] cipherByte = Hex.decode(cipherText);
			byte[] result = cipher.doFinal(cipherByte);
			return new String(result);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public static boolean isValidRecordDetermination(Integer value) {
		return value >= 1 && value <= 6;
	}

	public static boolean isValidRecordSexual(Integer value) {
		return value >= 1 && value <= 4;
	}

	public static boolean isValidRecordSexual(List<Integer> value) {
		for (Integer e : value) {
			if (!isValidRecordSexual(e)) {
				return false;
			}
		}
		return true;
	}

	public static boolean isValidRecordFindScope(Integer value) {
		return value >= 1 && value <= 3;
	}

	public static boolean isValidPassword(String password) {
		return password.length() >= 6;
	}

	@Nullable
	public static User cloneUserWithoutPassword(
			@Nullable User user
	) {
		return user == null ? null :
				new User(user.getId(),
						user.getName(), null, user.getEmail(),
						user.getEditor(), user.getChecker(), user.getLocked(),
						user.getRegisterDate(), user.getLoginDate());
	}

	public static RecordModel makeRecordModel(Record record) {
		User submitter = UserDao.findById(record.getSubmitter());
		String submitterName = submitter == null ? "用户不存在" : submitter.getName();
		RecordModel model = new RecordModel(
				record.getId(),
				record.getSubmitter(),
				submitterName,
				record.getDescription(),
				record.getDate(),
				record.getName(),
				record.getAuthor(),
				record.getSexual(),
				record.getSource(),
				record.getDetermination(),
				new ArrayList<>(), new ArrayList<>(),
				new ArrayList<>(), new ArrayList<>(), new ArrayList<>()
		);
		for (Record.Comment comment : record.getReason()) {
			model.getReason().add(new RecordModel.Comment(comment.getMessage(), comment.getDisgustful()));
		}
		for (Record.Comment comment : record.getIntroduction()) {
			model.getIntroduction().add(new RecordModel.Comment(comment.getMessage(), comment.getDisgustful()));
		}
		for (Record.CommentWithInfo comment : record.getCorrect()) {
			User commenter = UserDao.findById(comment.getCommenter());
			String commenterName = commenter == null ? "用户不存在" : commenter.getName();
			model.getCorrect().add(new RecordModel.CommentWithInfo(comment.getMessage(), comment.getDisgustful(), comment.getCommenter(), commenterName, comment.getDate()));
		}
		for (Record.CommentWithInfo comment : record.getComment()) {
			User commenter = UserDao.findById(comment.getCommenter());
			String commenterName = commenter == null ? "用户不存在" : commenter.getName();
			model.getComment().add(new RecordModel.CommentWithInfo(comment.getMessage(), comment.getDisgustful(), comment.getCommenter(), commenterName, comment.getDate()));
		}
		for (Record.CheckInfo check : record.getCheck()) {
			User checker = UserDao.findById(check.getChecker());
			String checkerName = checker == null ? "用户不存在" : checker.getName();
			model.getCheck().add(new RecordModel.CheckInfo(check.getChecker(), checkerName, check.getDate(), check.getDetermination(), check.getMessage()));
		}
		return model;
	}

}
