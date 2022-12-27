# picgo-plugin-bilinyun

> 比邻云盘因业务调整，将于2022年12月30日停止运营，因此请不要再使用此插件

## 简介

[比邻云盘](https://www.bilnn.com/) 是国内云盘厂家之一，号称 “全球首家不限存储、不限流量、不限速、支持直链和API接口的免费网盘”，用户通过邮箱即可注册帐号。比邻云盘分为`免费版`和`VIP版`，免费版特点如下：

- 无限存储（起始1TB，用完后联系客服免费拓容）
- 无限流量、不限速
- 单文件最大200MB

本插件的图片存储、访问功能均依赖`比邻云盘`，作者不保证`比邻云盘`的稳定性，请您谨慎保管您的数据！

<br>

## 环境搭建

1. 前往[比邻云盘官网](https://www.bilnn.com/)注册账户

   ![image-20220213192644750](https://pan.bilnn.cn/api/v3/file/sourcejump/bmMZrEFY/ALtilhiuoBDs8og5MMhnZn89VEenj4sHmIJccO4syOg*)

   <br>

2. 点击`+`创建一个独立的文件夹来存储图片（中文等字符可能出现乱码，建议全英文，如：Image）

   ![image-20220213193219384](https://pan.bilnn.cn/api/v3/file/sourcejump/81rx2bhW/bjDJlv-Hj2cDkPC8u5_xU7KIfDytpl1egFOi5c3ksLU*)

   <br>

3.  `GUI`用户在`插件设置`中搜索`bilinyun`安装

   ![image-20220213200656868](https://pan.bilnn.cn/api/v3/file/sourcejump/MdrxoAuv/pTLNAa00YiytDm0LapKrhqFqbXD41Dny-XoZunRi16Q*)



4. 根据实际情况，在`图床设置`中修改相关设置

   ![image-20220213193026587](https://pan.bilnn.cn/api/v3/file/sourcejump/bmMZrXtY/tpRwNWgLI4G4Grm-5Ge_72TfnxqZNajR4PZDhWbbDKc*)

   - `比邻云帐号`

   - `比邻云密码`

   - `文件夹`：您刚才创建的文件夹名称（若您的文件夹存在嵌套，请填入相对路径，如：Image/myImage）

   - `cds`：用户存储空间凭证，初次安装插件会自动获取

   - `token`：用户令牌，初次安装插件会自动获取

     

5. 点击确定，设置完成！

<br>

## Q & A

### 1. 日志显示 “上传文件失败” 怎么办？

该错误的可能原因如下：

- 网络状态不佳
- 账号密码错误
- 账号状态异常
- ……

请您先依次检查上述问题，若均确认无误后仍无法上传，则可尝试清空设置中的`cds`和`token`并重启`picgo`。由于`比邻云盘`生成的`令牌`是有过期时间的（大约在每年年底12.20，具体过期策略未知），因此这可能是文件上传失败的原因之一。而一旦插件检测到您的`cds`和`token`为空，就会重新向系统获取。

<br>

### 2. 比邻云盘的稳定性怎么样？

由于比邻云盘架设在国内，其访问速度相当优秀，但其稳定性未知，请您谨慎保管您的数据。

<br>

### 3. 比邻云盘会设置防盗链吗？

事实上，比邻云盘原生支持图片外链功能，可见官方并不限制图片外链的使用，这也是其宣传特点之一。总之，比邻云盘大概率不会设置防盗链，但您仍然应该及时备份您的数据。



