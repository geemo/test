/* ---------- objectMode ---------- */
/* 在介绍Readable时，从例子中可以发现一个现象：
 * 生产数据时传给push的data是字符串或null，而消耗时拿到的却是Buffer类型。
 * 下面来探讨以下流中数据类型的问题。
 * 在创建流时，可指定objectMode选项为true。此时，称为一个objectMode流。否则，称其为一个非objectMode流。
 */
/** ---------- 对Readable的影响 ---------- **/
/* Readable({objectMode: true})
 * 这个选项将影响push(data)中data的类型，以及消耗时获得的数据类型:
 * * 1.在非objectMode时，data只能时String,Buffer,Null,Undefined。同事，消耗时获得的数据一定是Buffer类型。
 * * 2.在objectMode时，data可以是任意类型，null仍然有其特殊含义。
 * *   同时，消耗时获得的数据与push进来的一样。实际就是同一个引用。
 * 所谓"缓存"