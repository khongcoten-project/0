package cn.twin_kles.plldb.util

import com.google.gson.JsonObject

class Result {

	var status: String? = null
    var data: JsonObject = JsonObject()

    fun <T> append(key: String, value: T) {
        data.add(key, JSONUtil.toTree(value))
    }

    fun generate(): JsonObject {
        val result = JsonObject()
        if (status != null) {
            result.addProperty("status", status)
        } else {
            result.add("data", JSONUtil.toTree(data))
        }
        return result
    }

}