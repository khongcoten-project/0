package cn.twin_kles.plldb.util

class FindResultWithCount<T>(count: Long, result: List<T>) {

    val count: Long
    val result: List<T>

    init {
        this.count = count
        this.result = result
    }

}