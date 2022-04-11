package cn.twincest.plldb.util;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.mongodb.lang.Nullable;
import com.mongodb.lang.NonNull;

import java.util.List;

public class Parameter {

	// field

	public String method;

	public JsonObject data;

	// has

	public boolean has(String key) {
		return this.data.has(key);
	}

	public boolean has(List<String> keyList) {
		for (var key : keyList) {
			if (!this.has(key)) {
				return false;
			}
		}
		return true;
	}

	// get // not undefined

	@NonNull
	public JsonElement get(String key) throws ValueUndefinedException {
		var value = this.data.get(key);
		if (value == null) {
			throw new ValueUndefinedException(key);
		}
		return value;
	}

	@Nullable
	public Boolean getBoolean(String key) throws ValueUndefinedException {
		var value = this.get(key);
		return value.isJsonNull() ? null : value.getAsBoolean();
	}

	@Nullable
	public Integer getInteger(String key) throws ValueUndefinedException {
		var value = this.get(key);
		return value.isJsonNull() ? null : value.getAsInt();
	}

	@Nullable
	public String getString(String key) throws ValueUndefinedException {
		var value = this.get(key);
		return value.isJsonNull() ? null : value.getAsString();
	}

	@Nullable
	public JsonArray getArray(String key) throws ValueUndefinedException {
		var value = this.get(key);
		return value.isJsonNull() ? null : value.getAsJsonArray();
	}

	@Nullable
	public JsonObject getObject(String key) throws ValueUndefinedException {
		var value = this.get(key);
		return value.isJsonNull() ? null : value.getAsJsonObject();
	}

	// get required // not undefined or null

	@NonNull
	public JsonElement getRequired(String key) throws ValueUndefinedException, ValueNullException {
		var value = this.data.get(key);
		if (value == null) {
			throw new ValueUndefinedException(key);
		}
		if (value.isJsonNull()) {
			throw new ValueNullException(key);
		}
		return value;
	}

	@NonNull
	public Boolean getBooleanRequired(String key) throws ValueUndefinedException, ValueNullException {
		var value = this.getRequired(key);
		return value.getAsBoolean();
	}

	@NonNull
	public Integer getIntegerRequired(String key) throws ValueUndefinedException, ValueNullException {
		var value = this.getRequired(key);
		return value.getAsInt();
	}

	@NonNull
	public String getStringRequired(String key) throws ValueUndefinedException, ValueNullException {
		var value = this.getRequired(key);
		return value.getAsString();
	}

	@NonNull
	public JsonArray getArrayRequired(String key) throws ValueUndefinedException, ValueNullException {
		var value = this.getRequired(key);
		return value.getAsJsonArray();
	}

	@NonNull
	public JsonObject getObjectRequired(String key) throws ValueUndefinedException, ValueNullException {
		var value = this.getRequired(key);
		return value.getAsJsonObject();
	}

	// exception

	public static class ValueUndefinedException extends Exception {
		public ValueUndefinedException(String key) {
			super(String.format("parameter data `%s` is undefined", key));
		}
	}

	public static class ValueNullException extends Exception {
		public ValueNullException(String key) {
			super(String.format("parameter data `%s` is null", key));
		}
	}

}
