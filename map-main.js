//実装しきれなかったものはコメントアウト
const E_MIN = 1.0; const E_MAX = 10;  //拡大倍率の最小値・最大値
let px_w  = 16;let px_h  = 16;        //タイル1つ分のサイズを決定
let mapW = 18; let mapH = 14;         //マップのタイルの数
let mapSize=[18,14];                  //マップサイズの変化を検知するための変数
let expand = 1;                       //マップの倍率
let imgWsize = 16;                    //画像のタイル数(横)
let camera_x = 0;let camera_y = 0;  　//実画面へ映す位置を決めるカメラ
let camera_mx = 0;let camera_my = 0;  //マップ実画面へ映す位置を決めるカメラ
let van,vtx;                          //仮想画面
let can,ctx;                          //実画面
let tan,ttx;                          //移動キャンバス
let man,mtx;                          //マップキャンバス
let wan,wtx;                          //マップ仮想キャンバス
//let nCount = 0;                       //スクロール速度制限カウンタ
let dCount = 0;                       //決定時のアニメーションの長さ
let flag = false;                     //キーイベントのフラグ
let dFlag = false;                    //決定時アニメーションフラグ
let mFlag = false;                    //マップ描画フラグ
let conFlag=false;                    //描画続行フラグ
let judge = false;                    //タイル変化処理の "審判"
let mouseX = 0;let mouseY = 0;        //マウスのタイル座標
let mouseMX = 0;let mouseMY = 0;      //マップキャンバス内のマウス座標
let mouseWX, mouseWY;                 //マウスのブラウザ座標
let bgX = 0; let bgY = 0;             //タイル座標及びタイル描画開始座標
let MgX = 0; let MgY = 0;             //マップキャンバスのタイル座標及びタイル描画開始座標
let bX = 0; let bY = 0; let arrNum=0; //配列ナンバー
let sX = 0; let sY = 0; let snum = 0; //スプライトナンバー
let oX = 0; let oY = 0;               // bgX , bgY の別のタイルに移動する1つ前の座標
let dX = 0; let dY = 0;               //選択決定したタイルの座標
let wArr=[];                          //配列
let wArrC=[];                         //改行する前のwArrのコピー配列
let 画像 = new Image();               //画像ファイルの処理
let 画像幅 = 0; let 画像高さ = 0;     //画像の幅、高さ
let alt = 3; let ctrl=0;              //オプション
let back=false;                       //消すかどうかの処理
let altKey = false; let ctrlKey=false;//キー判定
let looping=false;                    //ループ続行判定

//初期化処理
const init =()=>{
  can = document.getElementById("canvas");ctx = can.getContext('2d');         //実画面取得
  can.width  = 300;   //マジックナンバー警察だ！
  tan = document.getElementById("trans_canvas"); ttx = tan.getContext("2d");  //移動キャンバス取得
  tan.style.position = "absolute";                                            //移動キャンバスのポジショニングを万全に
  tan.style.top= -150+"px";                                                   //何かしらの要素の邪魔をしないように位置を調節
  wan = document.createElement("canvas"); wtx = wan.getContext("2d");         //マップ仮想キャンバス取得
  man = document.getElementById("map_canvas");mtx = man.getContext('2d');     //マップキャンバス取得
  van = document.createElement("canvas"); vtx = van.getContext("2d");         //仮想画面取得
  //document.getElementById("operation").addEventListener('click',(e)=>{e.stopPropagation();});
}
//サイズ変更
const Resize=()=>{
  const ボタンの高さ = document.getElementById("menu").clientHeight;
  can.height = window.innerHeight - Number(ボタンの高さ);
  const メニューの高さ = document.getElementById("ope_label").clientHeight;
  man.width = window.innerWidth - can.width ;man.height = window.innerHeight - Number(メニューの高さ);                                          //種も仕掛けもありません
  }
//描画処理
const drawInit=()=>{
  ctx.fillStyle="lightgreen";
  ctx.fillRect(0, 0, can.width, can.height);
  }
  
//loop内のみの描画処理
const drawLoop=()=>{
  drawInit();
  drawMap();
  select();
  decide();
  ctx.drawImage( van, camera_x, camera_y, can.width, can.height, 0, 0, can.width, can.height); //仮想画面から実画面への描画
  }
//画像読み込み処理
function loadBase(files) {        // ア
    var reader = new FileReader();              // エ　ローカルファイルの処理
    reader.onload = function(event) {           // オ　ローカルファイルを読込後処理
        画像.onload = function() {              // キ　　　画像ファイル読込後の処理
            画像幅     = 画像.naturalWidth;
            画像高さ   = 画像.naturalHeight;
            van.width  = 画像幅;                 // ク　　　　　naturalWidthは画像の元のサイズ
            van.height = 画像高さ;               // ケ　　　　　canvas.widthはcanvasのサイズ
        }                                       // サ
        画像.src = event.target.result;         // シ　　　画像を読み込む
    }                                           // ス
    reader.readAsDataURL(files[0]);             // セ　ローカルファイルを読み込む
}
//すべてのスクロール処理
function scrollAll(){
 scrollButton();
 //scrollWheel();
}
//タッチパッドのスクロール処理
/*
function scrollWheel(){
  canvas.addEventListener('wheel',function(e){
    if( ++nCount ==30){
      if( camera_x >= 0 && camera_x <=  van.width ){
        camera_x += Math.sign(e.deltaX) ;
      }
      if( camera_y >= 0 && camera_y <=  van.height ){
        camera_y += Math.sign(e.deltaY);
      }
      nCount = 0;
    }
  });
  if(camera_x < 0)camera_x=0;
  if(camera_x > van.width)camera_x=van.width;
  if(camera_y < 0)camera_y=0;
  if(camera_y > van.height)camera_y=van.height;
  }
  */
//ボタンでのスクロール処理
function scrollButton(){
  document.addEventListener('keydown',function(e){
    if( flag )return;
    if( e.keyCode == 38 ){
      flag = true;
      camera_y -= 8;
      }
    if( e.keyCode == 40 ){
      flag = true;
      camera_y += 8;
    }
    },false);
  document.addEventListener('keyup',function(e){
    if( e.keyCode == 38 || e.keyCode == 40 )flag=false;
    },false);
}
//送信ボタンを押したときの処理
function getValue(){
  if(document.getElementById("px_w").value)
  px_w  = document.getElementById("px_w").value;
  if(document.getElementById("px_h").value)
  px_h  = document.getElementById("px_h").value;
  wan.width = Math.floor(px_w * mapW);
  wan.height = Math.floor(px_h * mapH);
  tan.width = px_w; tan.height = px_h;
  if( van.width  && van.height ){
    vtx.drawImage(画像, 0, 0) ;
  }
  option();
  drawChangeValue();
  }
//オプションや基本設定が変更されたときの描画処理
const drawChangeValue=()=>{
  if(wArr){
    for(y=0;y<mapH;y++){
      for(x=0;x<mapW;x++){
        let arrN = x + y*mapW;
        let dx = (wArr[ arrN ]%mapW)*px_w;
        let dy = Math.floor(wArr[ arrN ]/mapW)*px_h;
        wtx.drawImage( 画像, dx, dy, px_w, px_h, x*px_w, y*px_h, px_w, px_h);
      }
    }
  }
  madeBox(false);
  if( !looping ){
  loop();
  looping = true;
  }
  }
//ループ処理
function loop(){
  scrollAll();
  drawLoop();
  ttxAll();
  wanUpdate();
  Mecide();
  /* デバッグ
  ctx.font="20px 'Impact'";
  ctx.fillStyle="black";
  ctx.fillText("camera_mx " + camera_mx, 0, can.height);
  ctx.fillText("MgX " + MgX, 0, can.height - 20);
  ctx.fillText("bX " + bX, 0, can.height - 40);
  ctx.fillText("arrNum " + arrNum, 0, can.height - 60);
  ctx.fillText("camera_y " + camera_y, 0, can.height - 80);
  ctx.fillText("mFlag " + mFlag, 0, can.height - 100);
  */
  requestAnimationFrame(loop);
    }
//ブラウザ起動イベント
window.onload = function (){
  init();
  Resize();
  window.addEventListener("resize",()=>{
    Resize()
    drawInit();
    drawMap();},false); //ブラウザサイズ変更時、WmSize関数が呼ばれる
  drawInit();
  wanInit();
  drawMap();
}
// Window上のマウス座標を取得する
 window.onmousemove = function (e) {
     mouseWX = e.pageX;
     mouseWY = e.pageY;
 }
//マウスポインタの位置取得
document.getElementById("canvas").onmousemove = function (e) {
  let offsetX=0, offsetY=0;
  let element = this;
  // まずは、対象DIV要素が
  // 画面上のどの位置にあるかを取得する
  while (element) {
   offsetX += element.offsetLeft;
   offsetY += element.offsetTop;
   element = element.offsetParent;
  }
  // DIV位置を考慮して、X,Y座標を計算する
   mouseX = e.pageX - offsetX;
   mouseY = e.pageY - offsetY;
}
//右のマップチップキャンバスのセレクト処理
const select=()=>{
  let tX = Math.floor(mouseX/px_w);
  let tY = Math.floor(mouseY/px_h);
   bgX = Math.floor(tX * px_w );
   bgY = Math.floor(tY * px_h );
  if( oX != bgX || oY != bgY){
    //初期化
    vPInit( 1.0, "lightgreen", oX, oY, true, vtx);
    //ポインタ上のタイルの描画処理
    oX = bgX; oY = bgY; //移動前のポインタタイル座標を今の座標に更新
    vPInit( 0.5, "blue", bgX, bgY, false, vtx);
  }
}
//キャンバス上でクリックしたときの処理
document.getElementById("canvas").onclick = function(){
    dFlag = true;
  }
document.getElementById("map_canvas").onclick = function(){
  conFlag = true;
  }
//マップチップをクリックしたときの処理
const decide=()=>{
  if(!dFlag)return dCount = 0;
  vPInit( 0.5, "red", bgX, bgY, false, vtx);
  if( dCount++ == 0 ){
    dX = bgX;
    dY = bgY;
    sX = Math.floor(dX/px_w);
    sY = Math.floor(dY/px_h);
    snum = sX  + (sY * imgWsize);
  }else if(dCount == 10){
      vPInit( .5, "blue", bgX, bgY, true, vtx);
      dFlag = false
      dCount = 0;
  }
}
//タイル変化処理
const vPInit=( alpha, color, x, y, bool, elm)=>{
  //初期化処理
    elm.globalAlpha = alpha;
    elm.fillStyle = color;
    elm.fillRect( x, y, px_w, px_h);
    judge = bool;
    //描画処理
    judge ? elm.drawImage( 画像, x, y, px_w, px_h, x, y, px_w, px_h) :
            elm.globalAlpha = 1.0;
  }
//要素の位置取得処理
const getAbsolutePosition=(elm)=>{
  const {left, top} = elm.getBoundingClientRect();
  const {left: bleft, top: btop} = document.body.getBoundingClientRect();
  return {
    left: left - bleft,
    top: top - btop,
  };
}
//tanキャンバスのすべての処理
const ttxAll = () => {
  ttxTrans();
  drawTtx();
}
//tanキャンバスの移動処理
const ttxTrans = () =>{
  getAbsolutePosition(tan);
  tan.style.left = (mouseWX) + "px";
  tan.style.top  = (mouseWY - px_h) + "px";
  }
//tanキャンバス描画処理
const drawTtx = () => {
  vPInit( 1.0, "white", 0, 0, false, ttx);
  ttx.drawImage( 画像, dX, dY, px_w, px_h, 0, 0, px_w, px_h);
  }
//マップキャンバスでのマウスポインタの位置取得
document.getElementById("map_canvas").onmousemove = function (e) {
  let offsetX=0, offsetY=0;
  let element = this;
  // まずは、対象DIV要素が
  // 画面上のどの位置にあるかを取得する
  while (element) {
   offsetX += element.offsetLeft;
   offsetY += element.offsetTop;
   element = element.offsetParent;
  }
  // DIV位置を考慮して、X,Y座標を計算する
   mouseMX = e.pageX - offsetX;
   mouseMY = e.pageY - offsetY;
   if( mouseMX <= Math.floor(mapW * px_w * expand) + camera_mx && mouseMY <= Math.floor(mapH * px_h * expand) + camera_my ){
    mFlag = true;
  }else mFlag=false;
}
//マップキャンバス描画処理
const drawMap=()=>{
  mtx.fillStyle="#c0c0c0";
  mtx.fillRect(0,0,man.width,man.height);
  //マップ仮想キャンバスから実キャンバスに転送
  mtx.drawImage( wan, camera_mx, camera_my, wan.width, wan.height, 0, 0, Math.floor(wan.width * expand), Math.floor(wan.height * expand));
  }
//仮想マップ更新処理
const wanUpdate=()=>{
  bX = Math.floor(Math.floor(mouseMX/px_w)/expand) +Math.floor(camera_mx/px_w);
  bY = Math.floor(Math.floor(mouseMY/px_h)/expand);
  arrNum = Math.floor(bX + (bY * mapW));
  MgX = bX*px_w ;
  MgY = bY*px_h  + camera_my;
}
//マップキャンバス初期化処理
const wanInit=()=>{
  wArr=[];
  wan.width = Math.floor(px_w * mapW);
  wan.height = Math.floor(px_h * mapH);
  madeBox(true);
  }
//マップ描画及び配列追加処理
const Mecide=()=>{
  if(!mFlag)return;
  if(!ctrlKey && !conFlag)return;
  wtx.fillStyle="red"
  for(let i = 0; i<(altKey?alt:1); i++){
    let x = (i * px_w) + MgX;
    vPInit( 1.0, "#c0c0c0", x, MgY, false, wtx);
    if( i!=0 && (arrNum + i)%mapW==0 )break;
    back?wtx.fillRect( x, MgY, px_w, px_h):wtx.drawImage( 画像, dX, dY, px_w, px_h, x, MgY, px_w, px_h);
    wtx.strokeRect( x, MgY, px_w, px_h);
    back?wArr[arrNum + i]=-1:wArr[arrNum + i] = snum;
  }
    return conFlag = false;
}
//配列情報をテキストに変換してユーザに届ける
const giveText=()=>{
  if(wArr.length>mapW*mapH){
    let over = wArr.length - mapW*mapH;
    wArr.splice( mapW*mapH, over);
    }
  //配列データをコピー
  for(let i=0;i<wArr.length;i++){
    wArrC.push(wArr[i]);
    }
  //配列に改行をいれる
  for(let y=0;y<mapH; y++){
    for(let x = 0;x<mapW; x++){
      if( x == mapW - 1 ){
        if( (x + (y*mapW) + 1) >= (mapH * mapW))break;
        wArrC[x + (y * mapW) + 1] = "<br>"+wArrC[x + (y * mapW) + 1];
      }
}}
  str = wArrC.join(',');  //配列を文字列に変換
  window.open('map-tool2.html?data='+encodeURIComponent(str));  //別タブを開きデータを渡す
  wArrC =[];          //コピー配列初期化
}
//拡大倍率などのオプション
const option=()=>{
  //最小倍率と最大倍率の間に収まるようexpand(倍率)をユーザから設定してもらう
  if(document.getElementById("expand").value)
  expand = Math.max( E_MIN, Math.min(E_MAX, Math.floor(document.getElementById("expand").value)));
  //マップのマスの数を取得
  if(document.getElementById("mapW").value)
  mapW = document.getElementById("mapW").value;
  if(document.getElementById("mapH").value)
  mapH = document.getElementById("mapH").value;
  /*if( mapW*mapH>wArr.length){
    let overW = mapW - mapSize[0];
    let overH = mapH - mapSize[1];
    for(let y=0;y<mapSize[1];y++){
      for(let x=0;x<overW;x++){
        wArr.splice( mapW-1+x+(mapW*y), 0, -1);
        }
      }
    for(let i=0;i<overH*mapW;i++){
      wArr.unshift(-1);
      }
    }
  mapSize[0]=mapW;
  mapSize[1]=mapH;
  drawChangeValue();
  */
}
//マップ移動処理
const transMap=(dir)=>{
  if( dir == 0 )camera_mx +=  parseInt(px_w);
  if( dir ==1 )camera_mx -=  parseInt(px_w);
  }
//特殊操作(まとめて塗る)入力検知
document.onkeydown = function(e){
 if(e.keyCode ==   17 ){
   ctrlKey=true;
   } //ctrl
 if(e.keyCode ==   18 ){
   altKey=true;
   } //alt
  if(e.keyCode ==   66 ){
   back=true;
   } //b
}
document.onkeyup = function(e){
 if(e.keyCode ==   17 ){
   ctrlKey=false;
   } //ctrl
 if(e.keyCode ==   18 ){
   altKey=false;
   } //alt
  if(e.keyCode ==   66 ){
   back=false;
   } //b
}
//valueが変わった時点で取得
const change=()=>{
 alt =  document.getElementById("alt").value;
}
//黒い四角の枠を作るしょり
const madeBox=(bool)=>{
  for(let y = 0; y<mapH; y++){
  for(let x = 0; x<mapW; x++){
    wtx.strokeStyle = "black";
    wtx.strokeRect( x * px_w, y * px_h, px_w, px_h);
    if(bool)wArr.push( -1 );
  }}
  }