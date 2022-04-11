package cn.twincest.plldb.util;

import com.google.gson.*;
import org.bson.types.ObjectId;

import java.lang.reflect.Type;

public class JSONUtil {

	private static class ObjectIdTypeAdapter implements JsonSerializer<ObjectId>, JsonDeserializer<ObjectId> {
		@Override
		public JsonElement serialize(ObjectId objectId, Type type, JsonSerializationContext jsonSerializationContext) {
			return new JsonPrimitive(objectId.toHexString());
		}

		@Override
		public ObjectId deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
			return new ObjectId(jsonElement.getAsString());
		}
	}

	private static final Gson GSON = new GsonBuilder()
			.disableHtmlEscaping()
			.serializeNulls()
			.setDateFormat("yyyy-MM-dd HH:mm:ss")
			.registerTypeAdapter(ObjectId.class, new ObjectIdTypeAdapter())
			.create();

	public static JsonElement toTree(Object o) {
		return GSON.toJsonTree(o);
	}

	public static <T> T fromTree(JsonElement e, Type type) {
		return GSON.fromJson(e, type);
	}

	public static <T> T fromString(String s, Type type) {
		return GSON.fromJson(s, type);
	}

}
