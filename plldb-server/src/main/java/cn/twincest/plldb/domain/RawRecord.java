package cn.twincest.plldb.domain;

import com.mongodb.lang.NonNull;
import com.mongodb.lang.Nullable;
import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RawRecord {

	@Nullable
	private String description;

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
	private List<Record.Comment> reason;

	@NonNull
	private List<Record.Comment> introduction;

}
