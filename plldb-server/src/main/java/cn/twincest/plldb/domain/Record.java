package cn.twincest.plldb.domain;

import lombok.*;
import com.mongodb.lang.Nullable;
import com.mongodb.lang.NonNull;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Record {

	@Getter
	@Setter
	@ToString
	@NoArgsConstructor
	@AllArgsConstructor
	public static class Comment {

		@NonNull
		private String message;

		@NonNull
		private Boolean disgustful;

	}

	@Getter
	@Setter
	@ToString
	@NoArgsConstructor
	@AllArgsConstructor
	public static class CommentWithInfo {

		@NonNull
		private String message;

		@NonNull
		private Boolean disgustful;

		@NonNull
		private ObjectId commenter;

		@NonNull
		private Date date;

	}

	@Getter
	@Setter
	@ToString
	@NoArgsConstructor
	@AllArgsConstructor
	public static class CheckInfo {

		@NonNull
		private ObjectId checker;

		@NonNull
		private Date date;

		@Nullable
		private Integer determination;

		@NonNull
		private String message;

	}

	//@NonNull
	private ObjectId id;

	@NonNull
	private ObjectId submitter;

	@Nullable
	private String description;

	@NonNull
	private Date date;

	@NonNull
	private String name;

	@Nullable
	private String author;

	@NonNull
	private Integer sexual;

	@Nullable
	private String source;

	@Nullable
	private Integer determination;

	@NonNull
	private List<Comment> reason;

	@NonNull
	private List<Comment> introduction;

	@NonNull
	private List<CommentWithInfo> correct;

	@NonNull
	private List<CommentWithInfo> comment;

	@NonNull
	private List<CheckInfo> check;

}
