package cn.twin_kles.plldb.dao

import cn.twin_kles.plldb.util.DatabaseUtil
import cn.twin_kles.plldb.domain.User
import org.bson.types.ObjectId
import com.mongodb.client.model.Filters
import cn.twin_kles.plldb.util.TypeUtil
import com.mongodb.client.model.Updates
import java.util.*

object UserDao {

    private val COLLECTION = DatabaseUtil.userCollection

    fun findAll(): List<User> {
        return DatabaseUtil.convertIterableToList(COLLECTION.find())
    }

    fun findById(id: ObjectId): User? {
        return COLLECTION.find(Filters.eq("_id", id)).first()
    }

    fun findByName(name: String): User? {
        return COLLECTION.find(Filters.eq("name", name)).first()
    }

    fun hasName(name: String): Boolean {
        return findByName(name) != null
    }

    fun register(name: String, rawPassword: String, email: String?): User? {
        // make data
        val registerDate = Date()
        val user = User(
            null,
            name, TypeUtil.encryptPassword(rawPassword),
            email,
            false, false, false,
            registerDate, registerDate
        )
        // insert
        val insertOneResult = COLLECTION.insertOne(user)
        // find insert result
        return COLLECTION.find(Filters.eq("_id", insertOneResult.insertedId.asObjectId())).first()
    }

    fun login(name: String, rawPassword: String): User? {
        // check name and password
        val filter = Filters.eq("name", name)
        val user = COLLECTION.find(filter).first() ?: return null
        if (!TypeUtil.checkPassword(rawPassword, user.password!!)) {
            return null
        }
        // update loginDate
        val loginDate = Date()
        val update = Updates.set("loginDate", loginDate)
        // update
        return COLLECTION.findOneAndUpdate(filter, update, DatabaseUtil.DEFAULT_FIND_ONE_AND_UPDATE_OPTIONS)
    }

    fun updatePassword(id: ObjectId, rawPassword: String): User? {
        // make rule
        val filter = Filters.eq("_id", id)
        val update = Updates.set("password", TypeUtil.encryptPassword(rawPassword))
        // update
        return COLLECTION.findOneAndUpdate(filter, update, DatabaseUtil.DEFAULT_FIND_ONE_AND_UPDATE_OPTIONS)
    }

    fun updateEmail(id: ObjectId, email: String?): User? {
        // make rule
        val filter = Filters.eq("_id", id)
        val update = Updates.set("email", email)
        // update
        return COLLECTION.findOneAndUpdate(filter, update, DatabaseUtil.DEFAULT_FIND_ONE_AND_UPDATE_OPTIONS)
    }

    fun format(): Boolean {
        val all = findAll()
        val deleteResult = COLLECTION.deleteMany(Filters.empty())
        val deleteCount = deleteResult.deletedCount
        println("delete count : $deleteCount")
        val insertResult = COLLECTION.insertMany(all)
        val insertCount = insertResult.insertedIds.size
        println("insert count : $insertCount")
        return deleteCount == insertCount.toLong()
    }
}