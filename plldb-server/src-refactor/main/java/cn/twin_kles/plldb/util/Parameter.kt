package cn.twin_kles.plldb.util

import kotlin.Throws
import com.google.gson.JsonElement
import com.google.gson.JsonArray
import com.google.gson.JsonObject
import java.lang.Exception

class Parameter {

    // field
    var method: String? = null
    var data: JsonObject? = null

    // has

    fun has(key: String): Boolean {
        return data!!.has(key)
    }

    fun has(keyList: List<String>): Boolean {
        for (key in keyList) {
            if (!has(key)) {
                return false
            }
        }
        return true
    }

    // get // not undefined
    @Throws(ValueUndefinedException::class)
    fun get(key: String): JsonElement {
        return data!![key] ?: throw ValueUndefinedException(key)
    }

    @Throws(ValueUndefinedException::class)
    fun getBoolean(key: String): Boolean? {
        val value = get(key)
        return if (value.isJsonNull) null else value.asBoolean
    }

    @Throws(ValueUndefinedException::class)
    fun getInteger(key: String): Int? {
        val value = get(key)
        return if (value.isJsonNull) null else value.asInt
    }

    @Throws(ValueUndefinedException::class)
    fun getString(key: String): String? {
        val value = get(key)
        return if (value.isJsonNull) null else value.asString
    }

    @Throws(ValueUndefinedException::class)
    fun getArray(key: String): JsonArray? {
        val value = get(key)
        return if (value.isJsonNull) null else value.asJsonArray
    }

    @Throws(ValueUndefinedException::class)
    fun getObject(key: String): JsonObject? {
        val value = get(key)
        return if (value.isJsonNull) null else value.asJsonObject
    }

    // get required // not undefined or null
    @Throws(ValueUndefinedException::class, ValueNullException::class)
    fun getRequired(key: String): JsonElement {
        val value = data!![key] ?: throw ValueUndefinedException(key)
        if (value.isJsonNull) {
            throw ValueNullException(key)
        }
        return value
    }

    @Throws(ValueUndefinedException::class, ValueNullException::class)
    fun getBooleanRequired(key: String): Boolean {
        val value = getRequired(key)
        return value.asBoolean
    }

    @Throws(ValueUndefinedException::class, ValueNullException::class)
    fun getIntegerRequired(key: String): Int {
        val value = getRequired(key)
        return value.asInt
    }

    @Throws(ValueUndefinedException::class, ValueNullException::class)
    fun getStringRequired(key: String): String {
        val value = getRequired(key)
        return value.asString
    }

    @Throws(ValueUndefinedException::class, ValueNullException::class)
    fun getArrayRequired(key: String): JsonArray {
        val value = getRequired(key)
        return value.asJsonArray
    }

    @Throws(ValueUndefinedException::class, ValueNullException::class)
    fun getObjectRequired(key: String): JsonObject {
        val value = getRequired(key)
        return value.asJsonObject
    }

    // exception
    class ValueUndefinedException(key: String) : Exception("parameter data `$key` is undefined")
    class ValueNullException(key: String) : Exception("parameter data `$key` is null")

}