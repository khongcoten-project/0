1. plldb
前端界面，使用react+mui
注意：进入src/util/Util.ts，将axios调用中的baseURL参数改为指向你服务器中plldb-server项目的URL
测试与构建：yarn start和yarn build
开发这个项目时还是初学react，因此代码质量比较差

2. plldb-server
后端服务，使用tomcat9+mongodb
注意：进入src/main/java/cn/twincest/plldb/util/DatabaseUtil.java，设置MongoCredential.createScramSha1Credential调用的参数
可用IDEA打开项目
src-refactor是部分使用kotlin重构的代码，但还没构建完成就关闭网站了，所以其中java和kotlin混杂，不知道有没有其他bug

