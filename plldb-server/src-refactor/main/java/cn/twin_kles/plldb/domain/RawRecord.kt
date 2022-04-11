package cn.twin_kles.plldb.domain

class RawRecord(
    description: String?,
    name: String,
    author: String?,
    sexual: Int,
    source: String?,
    determination: Int?,
    reason: List<Record.Comment>,
    introduction: List<Record.Comment>,
) {
    var description: String?
    var name: String
    var author: String?
    var sexual: Int
    var source: String?
    var determination: Int?
    var reason: List<Record.Comment>
    var introduction: List<Record.Comment>

    init {
        this.description = description
        this.name = name
        this.author = author
        this.sexual = sexual
        this.source = source
        this.determination = determination
        this.reason = reason
        this.introduction = introduction
    }
}