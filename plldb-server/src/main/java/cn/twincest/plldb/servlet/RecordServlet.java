package cn.twincest.plldb.servlet;

import cn.twincest.plldb.dao.RecordDao;
import cn.twincest.plldb.dao.UserDao;
import cn.twincest.plldb.domain.RawRecord;
import cn.twincest.plldb.domain.Record;
import cn.twincest.plldb.model.RecordModel;
import cn.twincest.plldb.util.*;
import com.google.gson.reflect.TypeToken;
import lombok.SneakyThrows;
import org.bson.types.ObjectId;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/servlet/Record")
public class RecordServlet extends HttpServlet {
	@SneakyThrows
	protected void doPost(HttpServletRequest request, HttpServletResponse response) {
		var parameter = (Parameter) request.getAttribute("parameter");
		var result = (Result) request.getAttribute("result");
		// current user
		var currentUser = ContextUtil.reLogin(request);
		// process
		result.status = switch (parameter.method) {
			default -> "未知方法";
			case "findByRule" -> {
				// data
				var data = new Object() {
					final String submitterName = parameter.getString("submitterName");
					final Boolean fromUnchecked = parameter.getBooleanRequired("fromUnchecked");
					final Boolean fromChecked = parameter.getBooleanRequired("fromChecked");
					final List<Integer> sexual = JSONUtil.fromTree(parameter.getArrayRequired("sexual"), new TypeToken<List<Integer>>() {}.getType());
					final String target = parameter.getStringRequired("target");
					final String keyword = parameter.getStringRequired("keyword");
					final Integer skip = parameter.getIntegerRequired("skip");
					final Integer limit = parameter.getIntegerRequired("limit");
				};
				// check data
				if (!TypeUtil.isValidRecordSexual(data.sexual)) {
					yield "sexual 无效";
				}
				if (!data.target.equals("name") && !data.target.equals("author") && !data.target.equals("message")) {
					yield "target 无效";
				}
				if (data.limit > 25) {
					yield "limit 过大";
				}
				//
				var submitterId = (ObjectId) null;
				if (data.submitterName != null) {
					var submitter = UserDao.findByName(data.submitterName);
					if (submitter == null) {
						yield "用户不存在";
					}
					submitterId = submitter.getId();
				}
				// find
				var findResult = RecordDao.findByRule(submitterId, data.sexual, data.target, data.keyword, data.fromUnchecked, data.fromChecked, data.skip, data.limit);
				// cast to model
				var recordModelList = new ArrayList<RecordModel>();
				for (var record : findResult.getResult()) {
					recordModelList.add(TypeUtil.makeRecordModel(record));
				}
				// success
				result.append("count", findResult.getCount());
				result.append("record", recordModelList);
				yield null;
			}
			case "appendMessage" -> {
				// check user
				if (currentUser == null) {
					yield "未登入";
				}
				// data
				var data = new Object() {
					final ObjectId id = TypeUtil.toObjectId(parameter.getStringRequired("id"));
					final String message = parameter.getStringRequired("message");
					final Boolean disgustful = parameter.getBooleanRequired("disgustful");
					final String type = parameter.getStringRequired("type");
				};
				// check data
				if (data.message.length() <= 0) {
					yield "信息 不可为空";
				}
				if (!data.type.equals("correct") && !data.type.equals("comment")) {
					yield "type 无效";
				}
				if (data.type.equals("correct") && !currentUser.getChecker()) {
					yield "非审核员";
				}
				// comment
				var record = RecordDao.appendMessage(data.id, data.message, data.disgustful, currentUser.getId(), data.type);
				if (record == null) {
					yield "添加信息失败";
				}
				// success
				result.append("record", TypeUtil.makeRecordModel(record));
				// send email
				var submitter = UserDao.findById(record.getSubmitter());
				if (submitter != null && submitter.getEmail() != null) {
					MailUtil.sendAsync(
							"PLLDB —— 消息通知",
							String.format("<p>用户 <b>%s</b> 你好，你的记录 <b>%s by %s</b> 收到了新的%s</p>",
									submitter.getName(),
									record.getName(),
									record.getAuthor(),
									data.type.equals("comment") ? "评论" : "修正"
							), submitter.getEmail());
				}
				yield null;
			}
			case "appendCheck" -> {
				// check user
				if (currentUser == null) {
					yield "未登入";
				}
				if (!currentUser.getChecker()) {
					yield "非审核员";
				}
				// data
				var data = new Object() {
					final ObjectId id = TypeUtil.toObjectId(parameter.getStringRequired("id"));
					final Integer determination = parameter.getInteger("determination");
					final String message = parameter.getStringRequired("message");
				};
				// check data
				if (data.determination != null && !TypeUtil.isValidRecordDetermination(data.determination)) {
					yield "判定 无效";
				}
				if (data.message.length() <= 0) {
					yield "理由 不可为空";
				}
				// comment
				var record = RecordDao.appendCheck(data.id, currentUser.getId(), data.determination, data.message);
				if (record == null) {
					yield "添加信息失败";
				}
				// success
				result.append("record", TypeUtil.makeRecordModel(record));
				// send email
				var submitter = UserDao.findById(record.getSubmitter());
				if (submitter != null && submitter.getEmail() != null) {
					MailUtil.sendAsync(
							"PLLDB —— 消息通知",
							String.format("<p>用户 <b>%s</b> 你好，你的记录 <b>%s by %s</b> 收到了新的审核</p>",
									submitter.getName(),
									record.getName(),
									record.getAuthor()
							), submitter.getEmail());
				}
				yield null;
			}
			case "update" -> {
				// check user
				if (currentUser == null) {
					yield "未登入";
				}
				// data
				var data = new Object() {
					final ObjectId id = TypeUtil.toObjectId(parameter.getString("id"));
					final RawRecord data = JSONUtil.fromTree(parameter.getObjectRequired("data"), RawRecord.class);
				};
				// check data
				if (data.data.getDescription() != null && data.data.getDescription().length() <= 0) {
					yield "记录备注 不可为空字符串";
				}
				if (data.data.getName() == null || data.data.getName().length() <= 0) {
					yield "作品名 不可为空或空字符串";
				}
				if (data.data.getAuthor() != null && data.data.getAuthor().length() <= 0) {
					yield "作者 不可为空字符串";
				}
				if (data.data.getSexual() == null || !TypeUtil.isValidRecordSexual(data.data.getSexual())) {
					yield "性向 不可为空或类别无效";
				}
				if (data.data.getSource() != null && data.data.getSource().length() <= 0) {
					yield "出版站点 不可为空字符串";
				}
				if (data.data.getDetermination() != null && !TypeUtil.isValidRecordDetermination(data.data.getDetermination())) {
					yield "判定 类别无效";
				}
				if (data.data.getReason() == null) {
					yield "依据 不可为空";
				}
				if (data.data.getIntroduction() == null) {
					yield "介绍 不可为空";
				}
				for (var comment : data.data.getReason()) {
					if (comment.getDisgustful() == null) {
						yield "依据项的disgustful 不可为空";
					}
					if (comment.getMessage() == null || comment.getMessage().length() <= 0) {
						yield "依据项的内容 不可为空或空字符串";
					}
				}
				for (var comment : data.data.getIntroduction()) {
					if (comment.getDisgustful() == null) {
						yield "介绍项的disgustful 不可为空";
					}
					if (comment.getMessage() == null || comment.getMessage().length() <= 0) {
						yield "介绍项的内容 不可为空或空字符串";
					}
				}
				// update
				var record = (Record) null;
				if (data.id == null) {
					// insert
					record = RecordDao.insert(currentUser.getId(), data.data);
				} else {
					// check submitter
					var oldRecord = RecordDao.findById(data.id);
					if (oldRecord == null) {
						yield "目标记录不存在";
					}
					if (!oldRecord.getSubmitter().equals(currentUser.getId()) && !currentUser.getEditor()) {
						yield "非提交者或编辑员，无法修改记录";
					}
					// update
					record = RecordDao.update(data.id, data.data);
				}
				if (record == null) {
					yield "更新失败";
				}
				// success
				result.append("record", TypeUtil.makeRecordModel(record));
				yield null;
			}
		};
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) {
		this.doPost(request, response);
	}
}
