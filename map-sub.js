window.onload = function(){
var data = location.href.split("?")[1];
var str = data.split("=")[1];
document.getElementById("message").innerHTML = decodeURIComponent(str);   //受け取ったデータを記述
}