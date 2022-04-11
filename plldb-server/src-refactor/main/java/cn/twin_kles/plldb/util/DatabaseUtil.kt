package cn.twin_kles.plldb.util

import cn.twin_kles.plldb.domain.Record
import cn.twin_kles.plldb.domain.User
import com.mongodb.client.MongoClient
import com.mongodb.client.MongoDatabase
import com.mongodb.client.MongoCollection
import org.bson.codecs.pojo.ClassModel
import cn.twin_kles.plldb.util.DatabaseUtil.NullableSerialization
import org.bson.codecs.pojo.ClassModelBuilder
import org.bson.codecs.pojo.PropertyModelBuilder
import cn.twin_kles.plldb.util.DatabaseUtil
import com.mongodb.client.model.FindOneAndUpdateOptions
import com.mongodb.client.model.ReturnDocument
import com.mongodb.client.FindIterable
import org.bson.codecs.pojo.PropertySerialization
import org.bson.codecs.configuration.CodecProvider
import org.bson.codecs.pojo.PojoCodecProvider
import org.bson.codecs.configuration.CodecRegistry
import org.bson.codecs.configuration.CodecRegistries
import com.mongodb.MongoClientSettings
import com.mongodb.client.MongoClients
import com.mongodb.connection.ClusterSettings
import com.mongodb.ServerAddress
import com.mongodb.MongoCredential
import java.util.ArrayList

object DatabaseUtil {

    // client, database, collection
    private val CLIENT: MongoClient
    private val PLL_DATABASE: MongoDatabase

    // get collection
    val userCollection: MongoCollection<User>
    val recordCollection: MongoCollection<Record>

    private fun makeNullableClassModel(clazz: Class<*>): ClassModel<*> {
        val nullableSerialization = NullableSerialization()
        val model = ClassModel.builder(clazz)
        for (propertyModelBuilder in model.propertyModelBuilders) {
            (propertyModelBuilder as PropertyModelBuilder<Any?>).propertySerialization(nullableSerialization)
        }
        return model.build()
    }

    // default FindOneAndUpdateOptions

    val DEFAULT_FIND_ONE_AND_UPDATE_OPTIONS = FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER)

    // other
    @JvmStatic
    fun <T> convertIterableToList(iterable: FindIterable<T>): List<T> {
        val list: MutableList<T> = ArrayList()
        for (e in iterable) {
            list.add(e)
        }
        return list
    }

    class NullableSerialization : PropertySerialization<Any?> {
        override fun shouldSerialize(value: Any?): Boolean {
            return true
        }
    }

    init {
        // CodecProvider
        val pojoCodecProvider: CodecProvider = PojoCodecProvider.builder()
            .automatic(true)
            .register(makeNullableClassModel(User::class.java))
            .register(makeNullableClassModel(Record::class.java))
            .register(makeNullableClassModel(Record.Comment::class.java))
            .register(makeNullableClassModel(Record.CommentWithInfo::class.java))
            .register(makeNullableClassModel(Record.CheckInfo::class.java))
            .build()
        val pojoCodecRegistry = CodecRegistries.fromRegistries(
            MongoClientSettings.getDefaultCodecRegistry(),
            CodecRegistries.fromProviders(pojoCodecProvider)
        )
        // client
        CLIENT = MongoClients.create(
            MongoClientSettings.builder()
                .applyToClusterSettings { builder: ClusterSettings.Builder ->
                    builder.hosts(
                        listOf(
                            ServerAddress(
                                "localhost",
                                27017
                            )
                        )
                    )
                }
                .credential(
                    MongoCredential.createScramSha1Credential(
                        /* set your credential */
                    )
                )
                .build())
        // database
        PLL_DATABASE = CLIENT.getDatabase("pll").withCodecRegistry(pojoCodecRegistry)
        // collection
        userCollection = PLL_DATABASE.getCollection("user", User::class.java)
        recordCollection = PLL_DATABASE.getCollection("record", Record::class.java)
    }
}