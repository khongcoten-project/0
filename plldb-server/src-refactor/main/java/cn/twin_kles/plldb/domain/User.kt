package cn.twin_kles.plldb.domain

import org.bson.types.ObjectId
import java.util.Date

class User(
    id: ObjectId?,
    name: String,
    password: String?,
    email: String?,
    editor: Boolean,
    checker: Boolean,
    locked: Boolean,
    registerDate: Date,
    loginDate: Date
) {
    var id: ObjectId?
    var name: String
    var password: String?
    var email: String?
    var editor: Boolean
    var checker: Boolean
    var locked: Boolean
    var registerDate: Date
    var loginDate: Date

    init {
        this.id = id
        this.name = name
        this.password = password
        this.email = email
        this.editor = editor
        this.checker = checker
        this.locked = locked
        this.registerDate = registerDate
        this.loginDate = loginDate
    }
}