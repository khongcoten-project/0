package cn.twincest.plldb.util;

import cn.twincest.plldb.domain.Record;
import cn.twincest.plldb.domain.User;
import com.mongodb.MongoClientSettings;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.client.*;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import com.mongodb.client.model.ReturnDocument;
import org.bson.codecs.configuration.CodecProvider;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.mongodb.MongoClientSettings.getDefaultCodecRegistry;
import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

public class DatabaseUtil {

    // client, database, collection

    private static final MongoClient CLIENT;

    private static final MongoDatabase PLL_DATABASE;

    private static final MongoCollection<User> USER_COLLECTION;
    private static final MongoCollection<Record> RECORD_COLLECTION;

    public static class NullableSerialization implements PropertySerialization<Object> {
        @Override
        public boolean shouldSerialize(Object value) {
            return true;
        }
    }

    private static ClassModel<?> makeNullableClassModel(Class<?> clazz) {
        var nullableSerialization = new NullableSerialization();
        var model = ClassModel.builder(clazz);
        for (var propertyModelBuilder : model.getPropertyModelBuilders()) {
            ((PropertyModelBuilder<Object>) propertyModelBuilder).propertySerialization(nullableSerialization);
        }
        return model.build();
    }

    static {
        // CodecProvider
        CodecProvider pojoCodecProvider = PojoCodecProvider.builder()
                .automatic(true)
                .register(makeNullableClassModel(User.class))
                .register(makeNullableClassModel(Record.class))
                .register(makeNullableClassModel(Record.Comment.class))
                .register(makeNullableClassModel(Record.CommentWithInfo.class))
                .register(makeNullableClassModel(Record.CheckInfo.class))
                .build();
        CodecRegistry pojoCodecRegistry = fromRegistries(getDefaultCodecRegistry(), fromProviders(pojoCodecProvider));
        // client
        CLIENT =  MongoClients.create(
                MongoClientSettings.builder()
                        .applyToClusterSettings(builder ->
                                builder.hosts(Collections.singletonList(new ServerAddress("localhost", 27017))))
                        .credential(MongoCredential.createScramSha1Credential(/* set your credential */))
                        .build());
        // database
        PLL_DATABASE = CLIENT.getDatabase("pll").withCodecRegistry(pojoCodecRegistry);
        // collection
        USER_COLLECTION = PLL_DATABASE.getCollection("user", User.class);
        RECORD_COLLECTION = PLL_DATABASE.getCollection("record", Record.class);
    }

    // get collection

    public static MongoCollection<User> getUserCollection() {
        return USER_COLLECTION;
    }

    public static MongoCollection<Record> getRecordCollection() {
        return RECORD_COLLECTION;
    }

    // default FindOneAndUpdateOptions

    public static final FindOneAndUpdateOptions DEFAULT_FIND_ONE_AND_UPDATE_OPTIONS = new FindOneAndUpdateOptions().returnDocument(ReturnDocument.AFTER);

    // other

    public static <T> List<T> convertIterableToList(FindIterable<T> iterable) {
        List<T> list = new ArrayList<>();
        for (T e : iterable) {
            list.add(e);
        }
        return list;
    }

}
