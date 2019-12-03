# 使用Camera API

通过 Camera API , 可以使用手机的摄像头拍照, 然后把拍到的照片发送给当前网页, 这些操作主要是通过一个 input元素 来实现的, 其中该元素的 **type属性必须为"file", accept属性要允许图片格式**, 这样才能知道文件选择框是用来选择图片的, 完整的HTML结构看起来是这样的:

```html
<input type="file" id="take-picture" accept="image/*">
```

当用户激活这个HTML元素的时候, 系统会呈现给用户一个选择界面, 其中一个选项是选择本地的图片文件, 另一个选项是通过摄像头直接拍摄照片作为所选文件, 如果用户选择了摄像头, 则会进入手机的拍照模式, 拍照结束后, 用户可以选择确定还是放弃, 如果接受了, 则该照片会作为所选文件发送给那个\<input>元素, 同时触发该元素的onchange事件



## 第一部分 获取到所拍摄照片的引用

通过 File API, 可以获取到用户所拍摄的照片或者所选择的图片文件的引用: 

```javascript
let takePicture = document.querySelector('#take-picture');
takePicture.onchange = function (event) {
    // 获得图片文件的引用
    let files = event.target.files,
        file;
    if (files && files.length > 0) {
        file = files[0];
    }
}
```



## 第二部分 在网页中展示图片

如果你获取到了那张照片的引用(也就是File对象), 你就可以使用 window.URL.createObjectURL() 方法创建一个指向那个照片的URL, 然后把得到的URL赋给 img 元素的src属性:

```javascript
// 获取到img元素
let showPicture = document.querySelector("#show-picture");

// 获取到window.URL对象
let URL = window.URL || window.webkitURL;

// 创建一个对象URL字符串
let imgURL = URL.createObjectURL(file);

// 设置img元素的src属性为那个URL
showPicture.src = imgURL;

// 释放那个对象URL, 提高性能
URL.revokeObjectURL(imgURL);
```

如果浏览器不支持 createObjcectURL() 方法, 还可以使用FileReader 来实现: 

```javascript
// 如果 createObjectURL 方法不可用
let fileReader = new FileReader();
fileReader.onload = function (event) {
    showPicture.src = event.target.result;
}
fileReader.readAsDataURL(file);
```



## 参考资料

* [MDN - Camera API](https://developer.mozilla.org/zh-CN/docs/Web/Guide/API/Camera)

