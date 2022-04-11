package cn.twincest.plldb.dao;

import cn.twincest.plldb.domain.User;
import cn.twincest.plldb.util.DatabaseUtil;
import cn.twincest.plldb.util.TypeUtil;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import com.mongodb.lang.Nullable;
import com.mongodb.lang.NonNull;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;

public class UserDao {

	private static final MongoCollection<User> COLLECTION = DatabaseUtil.getUserCollection();

	@NonNull
	public static List<User> findAll() {
		return DatabaseUtil.convertIterableToList(COLLECTION.find());
	}

	@Nullable
	public static User findById(
			@NonNull ObjectId id
	) {
		return COLLECTION.find(Filters.eq("_id", id)).first();
	}

	@Nullable
	public static User findByName(
			@NonNull String name
	) {
		return COLLECTION.find(Filters.eq("name", name)).first();
	}

	public static boolean hasName(
			@NonNull String name
	) {
		return findByName(name) != null;
	}

	@Nullable
	public static User register(
			@NonNull String name,
			@NonNull String rawPassword,
			@Nullable String email
	) {
		// make data
		var registerDate = new Date();
		var user = new User(null, name, TypeUtil.encryptPassword(rawPassword), email, false, false, false, registerDate, registerDate);
		// insert
		var insertOneResult = COLLECTION.insertOne(user);
		// find insert result
		var result = COLLECTION.find(Filters.eq("_id", insertOneResult.getInsertedId().asObjectId())).first();
		return result;
	}

	@Nullable
	public static User login(
			@NonNull String name,
			@NonNull String rawPassword
	) {
		// check name and password
		var filter = Filters.eq("name", name);
		var user = COLLECTION.find(filter).first();
		if (user == null) {
			return null;
		}
		if (!TypeUtil.checkPassword(rawPassword, user.getPassword())) {
			return null;
		}
		// update loginDate
		var loginDate = new Date();
		var update = Updates.set("loginDate", loginDate);
		// update
		var result = COLLECTION.findOneAndUpdate(filter, update, DatabaseUtil.DEFAULT_FIND_ONE_AND_UPDATE_OPTIONS);
		return result;
	}

	@Nullable
	public static User updatePassword(
			@NonNull ObjectId id,
			@NonNull String rawPassword
	) {
		// make rule
		var filter = Filters.eq("_id", id);
		var update = Updates.set("password", TypeUtil.encryptPassword(rawPassword));
		// update
		var result = COLLECTION.findOneAndUpdate(filter, update, DatabaseUtil.DEFAULT_FIND_ONE_AND_UPDATE_OPTIONS);
		return result;
	}

	@Nullable
	public static User updateEmail(
			@NonNull ObjectId id,
			@Nullable String email
	) {
		// make rule
		var filter = Filters.eq("_id", id);
		var update = Updates.set("email", email);
		// update
		var result = COLLECTION.findOneAndUpdate(filter, update, DatabaseUtil.DEFAULT_FIND_ONE_AND_UPDATE_OPTIONS);
		return result;
	}

	public static boolean format() {
		var all = findAll();
		var deleteResult = COLLECTION.deleteMany(Filters.empty());
		var deleteCount = deleteResult.getDeletedCount();
		System.out.println("delete count : " + deleteCount);
		var insertResult = COLLECTION.insertMany(all);
		var insertCount = insertResult.getInsertedIds().size();
		System.out.println("insert count : " + insertCount);
		return deleteCount == insertCount;
	}

}
