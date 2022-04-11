package cn.twincest.plldb.domain;

import com.mongodb.client.model.Updates;
import lombok.*;
import com.mongodb.lang.Nullable;
import com.mongodb.lang.NonNull;

import org.bson.BSONObject;
import org.bson.BsonBoolean;
import org.bson.BsonDocument;
import org.bson.BsonValue;
import org.bson.codecs.configuration.CodecProvider;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;

import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class User {

	//@NonNull
	private ObjectId id;

	@NonNull
	private String name;

	//@NonNull
	private String password;

	@Nullable
	private String email;

	@NonNull
	private Boolean editor;

	@NonNull
	private Boolean checker;

	@NonNull
	private Boolean locked;

	@NonNull
	private Date registerDate;

	@NonNull
	private Date loginDate;

}
