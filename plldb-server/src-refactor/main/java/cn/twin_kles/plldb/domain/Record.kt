package cn.twin_kles.plldb.domain

import org.bson.types.ObjectId
import java.util.Date

class Record(
    id: ObjectId?,
    submitter: ObjectId,
    description: String?,
    date: Date,
    name: String,
    author: String?,
    sexual: Int,
    source: String?,
    determination: Int?,
    reason: List<Comment>,
    introduction: List<Comment>,
    correct: List<CommentWithInfo>,
    comment: List<CommentWithInfo>,
    check: List<CheckInfo>
) {
    var id: ObjectId?
    var submitter: ObjectId
    var description: String?
    var date: Date
    var name: String
    var author: String?
    var sexual: Int
    var source: String?
    var determination: Int?
    var reason: List<Comment>
    var introduction: List<Comment>
    var correct: List<CommentWithInfo>
    var comment: List<CommentWithInfo>
    var check: List<CheckInfo>

    init {
        this.id = id
        this.submitter = submitter
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

    class CommentWithInfo(message: String, disgustful: Boolean, commenter: ObjectId, date: Date) {
        var message: String
        var disgustful: Boolean
        var commenter: ObjectId
        var date: Date

        init {
            this.message = message
            this.disgustful = disgustful
            this.commenter = commenter
            this.date = date
        }
    }

    class CheckInfo(checker: ObjectId, date: Date, determination: Int, message: String) {
        var checker: ObjectId
        var date: Date
        var determination: Int
        var message: String

        init {
            this.checker = checker
            this.date = date
            this.determination = determination
            this.message = message
        }
    }

}