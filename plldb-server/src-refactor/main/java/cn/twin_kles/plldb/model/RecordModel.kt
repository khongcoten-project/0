package cn.twin_kles.plldb.model

import org.bson.types.ObjectId
import java.util.Date

class RecordModel(
    id: ObjectId?,
    submitter: ObjectId,
    submitterName: String,
    description: String?,
    date: Date,
    name: String,
    author: String?,
    sexual: Int,
    source: String?,
    determination: Int?,
    reason: MutableList<Comment>,
    introduction: MutableList<Comment>,
    correct: MutableList<CommentWithInfo>,
    comment: MutableList<CommentWithInfo>,
    check: MutableList<CheckInfo>
) {
    var id: ObjectId?
    var submitter: ObjectId
    var submitterName: String
    var description: String?
    var date: Date
    var name: String
    var author: String?
    var sexual: Int
    var source: String?
    var determination: Int?
    var reason: MutableList<Comment>
    var introduction: MutableList<Comment>
    var correct: MutableList<CommentWithInfo>
    var comment: MutableList<CommentWithInfo>
    var check: MutableList<CheckInfo>

    init {
        this.id = id
        this.submitter = submitter
        this.submitterName = submitterName
        this.description = description
        this.date = date
        this.name = name
        this.author = author
        this.sexual = sexual
        this.source = source
        this.determination = determination
        this.reason = reason
        this.introduction = introduction
        this.correct = correct
        this.comment = comment
        this.check = check
    }

    class Comment(message: String, disgustful: Boolean) {
        var message: String
        var disgustful: Boolean

        init {
            this.message = message
            this.disgustful = disgustful
        }
    }

    class CommentWithInfo(
        message: String,
        disgustful: Boolean,
        commenter: ObjectId,
        commenterName: String,
        date: Date
    ) {
        var message: String
        var disgustful: Boolean
        var commenter: ObjectId
        var commenterName: String
        var date: Date

        init {
            this.message = message
            this.disgustful = disgustful
            this.commenter = commenter
            this.commenterName = commenterName
            this.date = date
        }
    }

    class CheckInfo(checker: ObjectId, checkerName: String, date: Date, determination: Int, message: String) {
        var checker: ObjectId
        var checkerName: String
        var date: Date
        var determination: Int
        var message: String

        init {
            this.checker = checker
            this.checkerName = checkerName
            this.date = date
            this.determination = determination
            this.message = message
        }
    }

}