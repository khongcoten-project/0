package cn.twin_kles.plldb.util

import org.bson.types.ObjectId
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder
import javax.crypto.spec.SecretKeySpec
import javax.crypto.Cipher
import java.lang.RuntimeException
import cn.twin_kles.plldb.model.RecordModel
import cn.twin_kles.plldb.dao.UserDao
import cn.twin_kles.plldb.domain.Record
import cn.twin_kles.plldb.domain.User
import org.springframework.security.crypto.codec.Hex
import java.lang.Exception
import java.nio.charset.StandardCharsets
import java.security.Key
import java.util.ArrayList

object TypeUtil {

    // cast Boolean

    fun toBoolean(string: String): Boolean {
        return string.toBoolean()
    }

    // cast Integer

    fun toInteger(string: String): Int {
        return string.toInt()
    }

    fun toInteger(stringList: List<String>): List<Int> {
        val valueList: MutableList<Int> = ArrayList(stringList.size)
        for (string in stringList) {
            valueList.add(toInteger(string))
        }
        return valueList
    }

    // cast ObjectId

    fun toObjectId(string: String): ObjectId {
        return ObjectId(string)
    }

    // password

    fun encryptPassword(rawPassword: String): String {
        return Argon2PasswordEncoder().encode(rawPassword)
    }

    fun checkPassword(rawPassword: String, encodedPassword: String): Boolean {
        return Argon2PasswordEncoder().matches(rawPassword, encodedPassword)
    }

    // AES codec

    fun encryptByAES(plainText: String, key: String): String {
        val secretKey: Key = SecretKeySpec(Hex.decode(key), "AES")
        try {
            val cipher = Cipher.getInstance("AES")
            cipher.init(Cipher.ENCRYPT_MODE, secretKey)
            val plainByte = plainText.toByteArray(StandardCharsets.UTF_8)
            val result = cipher.doFinal(plainByte)
            return String(Hex.encode(result))
        } catch (e: Exception) {
            throw RuntimeException(e)
        }
    }

    fun decryptByAES(cipherText: String?, key: String?): String {
        val secretKey: Key = SecretKeySpec(Hex.decode(key), "AES")
        return try {
            val cipher = Cipher.getInstance("AES")
            cipher.init(Cipher.DECRYPT_MODE, secretKey)
            val cipherByte = Hex.decode(cipherText)
            val result = cipher.doFinal(cipherByte)
            String(result)
        } catch (e: Exception) {
            throw RuntimeException(e)
        }
    }

    // record

    fun isValidRecordDetermination(value: Int): Boolean {
        return value in 1..6
    }

    fun isValidRecordSexual(value: Int): Boolean {
        return value in 1..4
    }

    fun isValidRecordSexual(valueList: List<Int>): Boolean {
        return valueList.all { isValidRecordSexual(it) }
    }

    fun isValidRecordFindScope(value: Int): Boolean {
        return value in 1..3
    }

    fun isValidPassword(password: String): Boolean {
        return password.length >= 6
    }

    fun cloneUserWithoutPassword(user: User): User {
        return User(
            user.id,
            user.name, null, user.email,
            user.editor, user.checker, user.locked,
            user.registerDate, user.loginDate
        )
    }

    fun makeRecordModel(record: Record): RecordModel {
        val submitter = UserDao.findById(record.submitter)
        val submitterName = submitter?.name ?: "用户不存在"
        val model = RecordModel(
            record.id,
            record.submitter,
            submitterName,
            record.description,
            record.date,
            record.name,
            record.author,
            record.sexual,
            record.source,
            record.determination,
            ArrayList(), ArrayList(),
            ArrayList(), ArrayList(), ArrayList()
        )
        for (comment in record.reason) {
            model.reason.add(RecordModel.Comment(comment.message, comment.disgustful))
        }
        for (comment in record.introduction) {
            model.introduction.add(RecordModel.Comment(comment.message, comment.disgustful))
        }
        for (comment in record.correct) {
            val commenter = UserDao.findById(comment.commenter)
            val commenterName = commenter?.name ?: "用户不存在"
            model.correct.add(
                RecordModel.CommentWithInfo(
                    comment.message,
                    comment.disgustful,
                    comment.commenter,
                    commenterName,
                    comment.date
                )
            )
        }
        for (comment in record.comment) {
            val commenter = UserDao.findById(comment.commenter)
            val commenterName = commenter?.name ?: "用户不存在"
            model.comment.add(
                RecordModel.CommentWithInfo(
                    comment.message,
                    comment.disgustful,
                    comment.commenter,
                    commenterName,
                    comment.date
                )
            )
        }
        for (check in record.check) {
            val checker = UserDao.findById(check.checker)
            val checkerName = checker?.name ?: "用户不存在"
            model.check.add(
                RecordModel.CheckInfo(
                    check.checker,
                    checkerName,
                    check.date,
                    check.determination,
                    check.message
                )
            )
        }
        return model
    }

}