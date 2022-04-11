package cn.twincest.plldb.model;

import lombok.*;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RecordModel {

	@Getter
	@Setter
	@ToString
	@NoArgsConstructor
	@AllArgsConstructor
	public static class Comment {

		private String message;

		private Boolean disgustful;

	}

	@Getter
	@Setter
	@ToString
	@NoArgsConstructor
	@AllArgsConstructor
	public static class CommentWithInfo {

		private String message;

		private Boolean disgustful;

		private ObjectId commenter;

		private String commenterName;

		private Date date;

	}

	@Getter
	@Setter
	@ToString
	@NoArgsConstructor
	@AllArgsConstructor
	public static class CheckInfo {

		private ObjectId checker;

		private String checkerName;

		private Date date;

		private Integer determination;

		private String message;

	}

	private ObjectId id;

	private ObjectId submitter;

	private String submitterName;

	private String description;

	private Date date;

	private String name;

	private String author;

	private Integer sexual;

	private String source;

	private Integer determination;

	private List<Comment> reason;

	private List<Comment> introduction;

	private List<CommentWithInfo> correct;

	private List<CommentWithInfo> comment;

	private List<CheckInfo> check;

}
