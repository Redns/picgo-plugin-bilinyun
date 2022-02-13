const config = (ctx) => {
    let userConfig = ctx.getConfig('picBed.bilinyun')
    if (!userConfig) {
        userConfig = {}
    }
    const config = [
        {
            name: 'email',
            type: 'input',
            alias: '比邻云帐号',
            default: userConfig.email || '',
            message: '帐号不能为空',
            required: true
        },
        {
            name: 'password',
            type: 'input',
            alias: '比邻云密码',
            default: userConfig.password || '',
            message: '密码不能为空',
            required: true
        },
        {
            name: 'dir',
            type: 'input',
            alias: '文件夹',
            default: userConfig.dir || '',
            message: '文件夹不能为空',
            required: true
        },
        {
            name: 'cds',
            type: 'input',
            alias: 'cds',
            default: userConfig.cds || '',
            message: '初次安装后自动获取, 请勿填写!',
            required: false
        },
        {
            name: 'token',
            type: 'input',
            alias: 'token',
            default: userConfig.token || '',
            message: '初次安装后自动获取, 请勿填写!',
            required: false
        }
    ]
    return config
}


/**
 * 创建登录请求
 * 每个cds和token都具有时限, 大约到当年年底(12.20)
 * @param {比邻云帐号} email 
 * @param {比邻云密码} password 
 */
const loginRequestConstruct = (email, password) => {
    return {
        'method': 'POST',
        'url': 'https://pan.bilnn.cn/api/v3/user/session',
        'headers': {
            'Origin': 'https://pan.bilnn.cn',
            'Referer': 'https://pan.bilnn.cn/login',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'userName': email,
            'Password': password,
            'ticket': '',
            'randstr': ''
        })
    }
}


/**
 * 上传图片
 * @param {云盘识别号} cds 
 * @param {令牌} token 
 * @param {存储文件夹} dir 
 * @param {文件名称} filename 
 * @param {文件拓展名} extname 
 * @param {文件内容(二进制形式)} img 
 * @returns 
 */
const uploadRequestConstruct = (cds, token, dir, filename, extname, img) => {
    return {
        'method': 'POST',
        'url': 'https://pan.bilnn.cn/api/v3/file/upload?chunk=0&chunks=1',
        'headers': {
            'Origin': 'https://pan.bilnn.cn',
            'Cookie': 'cloudreve-session=' + cds + '; token=' + token + '; path_tmp=' + dir,
            'x-cr-filename': filename,
            'x-cr-path': '/' + dir,
            'Content-Type': 'image/' + extname.slice(1)
        },
        body: img
    }
}


/**
 * 获取指定文件夹下的文件信息
 * @param {*} cds 
 * @param {令牌} token 
 * @param {指定文件夹} dir 
 * @returns 
 */
const imageIdRequestConstruct = (cds, token, dir) => {
    return {
        'method': 'GET',
        'url': 'https://pan.bilnn.cn/api/v3/directory/' + dir,
        'headers': {
            'Cookie': 'cloudreve-session=' + cds + '; token=' + token
        }
    }
}


/**
 * 获取图片外链
 * @param {图片ID} fileId 
 * @param {*} cds 
 * @param {令牌} token 
 * @returns 
 */
const urlRequestConstruct = (fileId, cds, token) => {
    return {
        'method': 'GET',
        'url': 'https://pan.bilnn.cn/api/v3/file/source/' + fileId,
        'headers': {
            'Cookie': 'cloudreve-session=' + cds + '; token=' + token
        }
    }
}


const handle = async (ctx) => {
    // 获取用户配置信息
    const userConfig = ctx.getConfig('picBed.bilinyun')
    const email = userConfig.email
    const password = userConfig.password
    const dir = userConfig.dir
    var cds = userConfig.cds
    var token = userConfig.token

    if(!userConfig){
        throw new Error('请配置相关信息!')
    }      
    if((cds == '') || (token == '')){
        // 创建登录请求获取cds和token
        const loginRequest = loginRequestConstruct(email, password)
        await ctx.Request.request(loginRequest, function(err, loginResponse){
            if(loginResponse.statusCode == 200){
                cds = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1]
                token = loginResponse.headers['set-cookie'][1].split(';')[0].split('=')[1]
                ctx.saveConfig({
                    'picBed.bilinyun': {
                        email: email,
                        password: password,
                        dir: dir,
                        cds: cds,
                        token: token
                    }
                })
            }
            else{
                ctx.log.error('登陆失败, 请检查帐号和密码是否正确')
            }
        })
    } 

    const imgList = ctx.output
    for(var i in imgList){
        try{
            let img = imgList[i].buffer
            if(!img && imgList[i].base64Image){
                img = Buffer.from(imgList[i].base64Image, 'base64')
            }

            // 格式化图片名称
            var myDate = new Date()
            var fileName = `${myDate.getFullYear()}${myDate.getMonth() + 1}${myDate.getDate()}${myDate.getHours()}${myDate.getMinutes()}${myDate.getSeconds()}.${imgList[i].extname}`
            var fileId = '0'

            // 上传图片
            const uploadRequest = uploadRequestConstruct(cds, token, dir, fileName, imgList[i].extname, img)
            const uploadResponse = await ctx.Request.request(uploadRequest)
            const uploadResponseObject = JSON.parse(uploadResponse)
            if(uploadResponseObject.code == 0){
                // 获取图片ID
                const imageIdRequest = imageIdRequestConstruct(cds, token, dir)
                const imageIdResponse = await ctx.Request.request(imageIdRequest)
                const imageIdResponseObject = JSON.parse(imageIdResponse)
                if(imageIdResponseObject.code == 0){
                    let objects = imageIdResponseObject.data.objects
                    for(var k in objects){
                        if(objects[k].name == fileName){
                            fileId = objects[k].id
                            break
                        }
                    }

                    if(fileId != '0'){
                        // 获取图片外链
                        const urlRequest = urlRequestConstruct(fileId, cds, token)
                        const urlResponse = await ctx.Request.request(urlRequest)
                        const urlResponseObject = JSON.parse(urlResponse)
                        if(urlResponseObject.data){
                            imgList[i].imgUrl = urlResponseObject.data.url
                        }
                        else{
                            ctx.log.error('获取图片外链失败')
                        }
                    }
                    else{
                        ctx.log.error('未在云端获取到文件信息')
                    }
                }
                else{
                    ctx.log.error('获取文件ID失败')
                }
            }
            else{
                ctx.log.error('文件上传失败')
            }
        }
        catch(err){
            if (err.error === 'Upload failed') {
                ctx.emit('notification', {
                    title: '上传失败!',
                    body: '请检查你的配置项是否正确'
                })
            } 
            else {
                ctx.emit('notification', {
                    title: '上传失败!',
                    body: '请检查你的配置项是否正确'
                })
            }
            throw err
        }    
    }
    return ctx
}


module.exports = (ctx) => {
    const register = () => {
        ctx.log.success('bilinyun加载成功！')
        ctx.helper.uploader.register('bilinyun', {
            handle: handle,
            config: config,
            name: 'bilinyun'
        })
    }
    return {
        register,
        uploader: 'bilinyun'
    }
}