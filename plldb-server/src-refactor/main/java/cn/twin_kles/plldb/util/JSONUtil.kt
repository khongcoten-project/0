package cn.twin_kles.plldb.util

import org.bson.types.ObjectId
import cn.twin_kles.plldb.util.JSONUtil.ObjectIdTypeAdapter
import cn.twin_kles.plldb.util.JSONUtil
import com.google.gson.*
import kotlin.Throws
import java.lang.reflect.Type

object JSONUtil {

    private val GSON = GsonBuilder()
            .disableHtmlEscaping()
            .serializeNulls()
            .setDateFormat("yyyy-MM-dd HH:mm:ss")
            .registerTypeAdapter(ObjectId::class.java, ObjectIdTypeAdapter())
            .create()

    fun toTree(o: Any?): JsonElement {
        return GSON.toJsonTree(o)
    }

    @JvmStatic
	fun <T> fromTree(e: JsonElement, type: Type?): T {
        return GSON.fromJson(e, type)
    }

    @JvmStatic
	fun <T> fromString(s: String, type: Type?): T {
        return GSON.fromJson(s, type)
    }

    private class ObjectIdTypeAdapter : JsonSerializer<ObjectId>, JsonDeserializer<ObjectId> {
        override fun serialize(objectId: ObjectId, type: Type, jsonSerializationContext: JsonSerializationContext): JsonElement {
            return JsonPrimitive(objectId.toHexString())
        }

        @Throws(JsonParseException::class)
        override fun deserialize(jsonElement: JsonElement, type: Type, jsonDeserializationContext: JsonDeserializationContext): ObjectId {
            return ObjectId(jsonElement.asString)
        }
    }
}