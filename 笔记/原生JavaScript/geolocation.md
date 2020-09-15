### 地理定位（geolocation）

地理定位api是最令人兴奋的新兴api，并且得到了广泛的支持。

通过这台api，JavaScript代码能够访问用户的当前位置信息。前提是访问前通过用户的明确许可，即同意在页面中共享其位置信息。

Geolocation API在浏览器中的实现是 `navigator.geolocation`对象。这个对象包含三个方法。

1. getCurrentPosition() , 调用这个方法会触发请求用户共享地理位置信息的对话框。

   这个方法接受三个参数： 成功的回调，失败的回调，和可选的选项对象。

   其中，成功的回调函数接受一个Position对象参数，这个参数对象有两个属性：coords和timestamp。

   coords对象中包含下列与位置相关的信息。

   latitude： 以10进制度数表示的纬度。

   longitude：以十进制度数表示的经度。

   accuracy： 经纬度坐标的精度，以米为单位。

2. 如果你希望跟踪用户的位置，那么可以使用另一个方法 watchPosition()。这个方法接收的参数

   与 getCurrentPosition() 方法完全相同。实际上， watchPosition() 与定时调用

   getCurrentPosition()的效果相同。在第一次调用 watchPosition()方法后，会取得当前位置，执

   行成功回调或者错误回调。然后，watchPosition()就地等待系统发出位置已改变的信号（它不会自

   己轮询位置）。

   调用 watchPosition()会返回一个数值标识符，用于跟踪监控的操作。基于这个返回值可以取消

   监控操作，只要将其传递给 clearWatch()方法即可