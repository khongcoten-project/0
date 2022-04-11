package cn.twincest.plldb.util;

import com.google.gson.JsonObject;

public class Result {

	public String status;

	public JsonObject data;

	public Result() {
		this.status = null;
		this.data = new JsonObject();
	}

	public <T> void append(String key, T value) {
		this.data.add(key, JSONUtil.toTree(value));
	}

	public JsonObject generate() {
		JsonObject result = new JsonObject();
		if (this.status != null) {
			result.addProperty("status", this.status);
		} else {
			result.add("data", JSONUtil.toTree(data));
		}
		return result;
	}

}
