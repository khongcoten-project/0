package cn.twin_kles.plldb.dao;

import cn.twin_kles.plldb.domain.RawRecord;
import cn.twin_kles.plldb.domain.Record;
import cn.twin_kles.plldb.util.DatabaseUtil;
import cn.twin_kles.plldb.util.FindResultWithCount;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.model.Updates;
import com.mongodb.lang.Nullable;
import com.mongodb.lang.NonNull;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class RecordDao {

	private static final MongoCollection<Record> COLLECTION = DatabaseUtil.getRecordCollection();

	@NonNull
	public static List<Record> findAll() {
		return DatabaseUtil.convertIterableToList(COLLECTION.find());
	}

	@Nullable
	public static Record findById(ObjectId id) {
		return COLLECTION.find(Filters.eq("_id", id)).first();
	}

	@NonNull
	public static FindResultWithCount<Record> findByRule(
			@Nullable ObjectId submitter,
			@NonNull List<Integer> sexual,
			@NonNull String target,
			@NonNull String keyword,
			boolean fromUnchecked, boolean fromChecked,
			int skip, int limit
	) {
		// make rule
		var filterList = new ArrayList<Bson>();
		// submitter
		if (submitter != null) {
			filterList.add(Filters.eq("submitter", submitter));
		}
		// sexual
		filterList.add(Filters.in("sexual", sexual));
		// target keyword
		filterList.add(switch (target) {
			default -> throw new IllegalStateException("Unexpected value: " + target);
			case "name", "author" -> Filters.regex(target, keyword, "i");
			case "message" -> Filters.or(
					Filters.regex("description", keyword, "i"),
					Filters.regex("name", keyword, "i"),
					Filters.regex("reason.message", keyword, "i"),
					Filters.regex("introduction.message", keyword, "i"),
					Filters.regex("correct.message", keyword, "i"),
					Filters.regex("comment.message", keyword, "i")
			);
		});
		// status
		if (fromUnchecked ^ fromChecked) {
			if (fromUnchecked) {
				filterList.add(Filters.where("this.check.length == 0 || this.date >= this.check[this.check.length - 1].date"));
			}
			if (fromChecked) {
				filterList.add(Filters.where("this.check.length != 0 && this.date < this.check[this.check.length - 1].date"));
			}
		}
		// 'and' all filter
		var filter = Filters.and(filterList);
		// find
		var document = COLLECTION.find(filter).sort(Sorts.descending("date"));
		// count
		var resultCount = 0;
		for (var e : document) {
			++resultCount;
		}
		// skip limit
		document.skip(skip).limit(limit);
		// result
		var resultList = DatabaseUtil.convertIterableToList(document);
		return new FindResultWithCount<>(resultCount, resultList);
	}

	@Nullable
	public static Record insert(
			@NonNull ObjectId submitter,
			@NonNull RawRecord data
	) {
		// make data
		var date = new Date();
		var record = new Record(
				null,
				submitter,
				data.getDescription(),
				date,
				data.getName(),
				data.getAuthor(),
				data.getSexual(),
				data.getSource(),
				data.getDetermination(),
				data.getReason(),
				data.getIntroduction(),
				new ArrayList<>(),
				new ArrayList<>(),
				new ArrayList<>()
		);
		// insert
		var insertOneResult = COLLECTION.insertOne(record);
		// find insert result
		var result = COLLECTION.find(Filters.eq("_id", insertOneResult.getInsertedId().asObjectId())).first();
		return result;
	}

	@Nullable
	public static Record update(
			@NonNull ObjectId id,
			@NonNull RawRecord data
	) {
		// make data
		var date = new Date();
		// make rule
		var filter = Filters.eq("_id", id);
		var update = Updates.combine(
				Updates.set("description", data.getDescription()),
				Updates.set("date", date),
				Updates.set("name", data.getName()),
				Updates.set("author", data.getAuthor()),
				Updates.set("sexual", data.getSexual()),
				Updates.set("source", data.getSource()),
				Updates.set("determination", data.getDetermination()),
				Updates.set("reason", data.getReason()),
				Updates.set("introduction", data.getIntroduction())
		);
		// update
		var result = COLLECTION.findOneAndUpdate(filter, update, DatabaseUtil.DEFAULT_FIND_ONE_AND_UPDATE_OPTIONS);
		return result;
	}

	@Nullable
	public static Record appendMessage(
			@NonNull ObjectId id,
			@NonNull String message,
			@NonNull Boolean disgustful,
			@NonNull ObjectId commenter,
			@NonNull String messageType
	) {
		// make data
		var date = new Date();
		var comment = new Record.CommentWithInfo(message, disgustful, commenter, date);
		// make rule
		var filter = Filters.eq("_id", id);
		var update = Updates.push(messageType, comment);
		// update
		var result = COLLECTION.findOneAndUpdate(filter, update, DatabaseUtil.DEFAULT_FIND_ONE_AND_UPDATE_OPTIONS);
		return result;
	}

	@Nullable
	public static Record appendCheck(
			@NonNull ObjectId id,
			@NonNull ObjectId checker,
			@Nullable Integer determination,
			@NonNull String message
	) {
		// make data
		var date = new Date();
		var comment = new Record.CheckInfo(checker, date, determination, message);
		// make rule
		var filter = Filters.eq("_id", id);
		var update = Updates.push("check", comment);
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
