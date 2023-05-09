$(function () {
    var layer = layui.layer
    // 1.1 获取被裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比（裁剪框的宽高比）
        aspectRatio: 1,
        // 指定预览区域（右侧圆型图片）
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 为上传按钮绑定事件（点击>>>触发文件选择框）
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })
    // 为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择图片！')
        }
        // 1.拿得用户选择的文件
        var file = e.target.files[0]
        // 2.将文件，转化为路径
        var imgURL = URL.createObjectURL(file)
        // 3.重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域（更新右侧圆型图片）
    })
    $('#btnUpload').on('click', function () {

        // 1.拿到用户裁剪之后的图像
        var dataURL = $image
            .cropper('getCroppedCanvas', { //创建一个Canvas画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') //将Canvas画布上的内容，转化为base64 格式的字符串
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: { avatar: dataURL },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新头像失败！')
                }
                layer.msg('更新头像成功！')
                window.parent.getUserInfo()
            }
        })

    })
})