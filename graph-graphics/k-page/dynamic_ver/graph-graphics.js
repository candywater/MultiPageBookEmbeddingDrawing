/*
   wrote by seikai y. 2016April
 */
/* fixed by seikai y. 2016 October */

//jsでは、{}が辞書である

var cx = 740, cy = 700;//フレームのながさ、広さ
var points = {};
var lines = {};
var label = {};
var vertexPosition = {};
var vertexPositionNowX = {};
var vertexPositionNowY = {};
var page = 0;
var mouseIsDragged = false;
var lineHeight = 370;
var whichMod = 1;//1,insert mod; 0, changeMod; 1は挿入型、0は交換型

var whichIsDragged = -1;//pos
//頂点の一番左の座標、右の座標、左と右の間の距離、頂点の半径、頂点間の空きスペース
var left = 20;
var right = cx-20;
var space = cx-40;
var vertex_r = 0;
var vertex_space = 0;

var searchPageNow = -1;

//p5jsの必要不可欠な関数
function setup() {
  var cnv = createCanvas(cx, cy);
  cnv.parent("drawingframe")
  //cnv.position(100, 65);
  noFill();
  initial();
}

//p5jsの必要不可欠な描画関数　main関数と一緒
function draw(){
  clear();
  rect(0,0,cx-1,cy-1);
  writePage();

  //頂点を描くための変数処理
  vertexCompute();
  edgesDraw();
  vertexDraw();
}

function initial(){
  page = 0;
  console.log("page:",page);

  //頂点の大きさ
  vertex_space = (space/n/2);
  vertex_r = vertex_space/2;
  for(var i = 0;i < n;i++){
    vertexPosition[i] = left + 2*vertex_r + (i)*2*vertex_r + (i)*vertex_space;//i , pos of vertex
    vertexPositionNowX[i] = vertexPosition[i];
    vertexPositionNowY[i] = lineHeight;
  }
  vertexPosition[-1] = 0;
  vertexPosition[n] = cx;
}

function vertexCompute(){
  vertex_space = (space/n/2);
  vertex_r = vertex_space/2;
  if(vertex_r<30) vertex_r = 30;
  return vertex_space;
}

//------------------------------------------
//描画処理の必要な関数集
//------------------------------------------
//ページ数の描画
function writePage(){
  //process of page
  if(page < -1) page =- 1;
  else if(page >= k) page = k-1;
  page = page % k;

  //num of page now
  if(Object.keys(nodes).length != 0){
    textSize(24);
    fill(0);
    var upperPage = "[ page ";
    var lowerPage = new String(upperPage);
    upperPage += new String(page);
    lowerPage += new String(page+1);
    upperPage += " ]";
    lowerPage += " ]";
    if(int(page) == -1){
      upperPage = "[ first ]";
    }
    if(int(page) == int(k)-1){
      lowerPage = "[ end ]";
    }
    text(upperPage, 600, 100);
    text(lowerPage, 600, 660);
  }
}
//すべての辺の描画
function edgesDraw(){
  for(var i=0;i<n;i++){
    label[nodes[i]] = i;
  }
  //index:label, value:pos
  //nodes[i],  index:pos, value:label

  //DRAW edges
  for(var i=0;i<m;i++){
    var t1 = int(edges[i][0]);
    var t2 = int(edges[i][1]);
    var tstr = edges[i][2]+"";
    var pos = int((tstr).slice(1,-1));//page
    if(pos != page && pos != page+1){
      continue;
    }
    if(pos==page){
      pos = 0;
    }
    else pos=1;

    t1 = label[t1];
    t2 = label[t2];

    lines[i] = new Edge(vertexPosition[t1], vertexPosition[t2], lineHeight,vertex_r,pos);
  }
}



//すべての頂点の描画及び、頂点の交換処理
function vertexDraw(){
  for(var i=0;i<n;i++){
    //現在マウスが頂点の上にあるかどうか
    var overVertex = false;
    //mouseIsPressed はp5jsのデフォルトで提供される変数である
    if(mouseIsPressed){
      whenMouseIsPressed(i, overVertex);
    }
    else{//after mousePressing
      //挿入型
      //挿入型とは、移動された頂点が移動先の２つの頂点の間に移動される
      if(whichMod == 1){
        insertModMove(i);
      }
      //交換型
      else{
        changeModMove(i);
      }
      //頂点をドラッグした後、頂点を頂点のありべき所へ戻す
      whichIsDragged = -1;
      vertexPositionNowX[i] = vertexPosition[i];
      vertexPositionNowY[i] = lineHeight;
    }
    //マウスの操作にかかわらず、頂点の描画をする。
    points[int(nodes[i])] = new Vertex(
        vertexPositionNowX[i],vertexPositionNowY[i],
        vertex_r,int(nodes[i]),overVertex);
  }
}

function whenMouseIsPressed(i, overVertex){
  if (isMouseOverVertex(i)
      && (i == whichIsDragged || whichIsDragged == -1)){
    overVertex = true;
    whichIsDragged = int(i);
    //pmouseX, pmouseY, mouseX, mouseYはすべてp5jsデフォルトで提供される変数である。
    if(pmouseX-mouseX != 0 || pmouseY-mouseY !=  0){
      vertexPositionNowX[i] = mouseX;
      vertexPositionNowY[i] = mouseY;
    }
  }
}

function isMouseOverVertex(i){
  return (distance(mouseX, mouseY,
        vertexPositionNowX[i], vertexPositionNowY[i]) <= vertex_r) ? true : false;
}

//y軸での判定
function isPointerOverVertexY(){
  return (vertexPositionNowY[whichIsDragged] < lineHeight+2*vertex_r
      && vertexPositionNowY[whichIsDragged] > lineHeight-2*vertex_r) ? true : false;
}
//x軸での判定(changeMod)
function isPointerOverVertexX_cm(iz){
  return (vertexPositionNowX[whichIsDragged] < vertexPosition[iz]+2*vertex_r
      && vertexPositionNowX[whichIsDragged] > vertexPosition[iz]-2*vertex_r) ? true : false;
}
//x軸での判定(insertMod)
function isPointerOverVertexX_im(iz){
  return (vertexPositionNowX[whichIsDragged] < vertexPosition[iz]
      && vertexPositionNowX[whichIsDragged] > vertexPosition[iz-1]) ? true : false;
}

//insert mod 左にずれる
function im_move_left(ix, tl){
  for(var iy = whichIsDragged;iy < ix;iy++){
    nodes[iy] = nodes[iy+1];
    label[nodes[iy]] = iy;
  }
  nodes[ix] = tl;
  label[nodes[ix]] = ix;
}
//insert mod 右にずれる
function im_move_right(ix, tl){
  for(var iy = whichIsDragged;iy > ix;iy--){
    nodes[iy] = nodes[iy-1];
    label[nodes[iy]] = iy;
  }
  nodes[ix] = tl;
  label[nodes[ix]] = ix;
}

function changeModMove(i){
  if( !isPointerOverVertexY() ){
    return;
  }
  //計算しやすくなるための、頂点の位置関係を表す変数
  var ix = -2;
  for(var iz=0;iz<n;iz++){
    if( isPointerOverVertexX_cm(iz) ){
      print("magic!vertex's position changed!");
      ix=iz;//ix=-1~n-1
      break;
    }
  }//for
  if(ix!=-2){
    var labeltmp = nodes[ix];
    var postmp = label[nodes[ix]];
    nodes[ix] = nodes[whichIsDragged];
    nodes[whichIsDragged] = labeltmp;
    label[nodes[ix]] = ix;
    label[nodes[whichIsDragged]] = whichIsDragged;
  }
  console.log("now:%d,ix:%d",whichIsDragged,ix);
}


function insertModMove(i){
  if( !isPointerOverVertexY() ){
    return;
  }
  //計算しやすくなるための、頂点の位置関係を表す変数
  var ix = -2;
  for(var iz=0;iz<=n;iz++){
    if( isPointerOverVertexX_im(iz) ){
      print("magic!vertex's position changed!");
      ix = iz-1;//ix=-1~n-1
      break;
    }
  }

  if(ix != -2){
    if(whichIsDragged > ix){
      ix++;
    }
    //label[i]:(i:label, label[i]:pos)//whichIsDragged is pos
    var tl = nodes[whichIsDragged];
    //左にずれる
    if(whichIsDragged < ix){
      im_move_left(ix, tl);
    }
    //右にずれる
    else if(whichIsDragged > ix){
      im_move_right(ix, tl);
    }
    console.log("now:%d,ix:%d",whichIsDragged,ix);
  }
}


//------------------------------------------
//頂点描画、辺描画、頂点の距離計算関数集
//------------------------------------------
function Vertex(x, y, vertex_r, v_label, overVertex){
  this.v_label = v_label;

  if(overVertex){
    fill(101);
  }
  else fill(51);

  ellipse(x, y, vertex_r, vertex_r);
  fill(204,204,204);
  textSize(15);
  textFont("BOLD");
  textAlign(CENTER, CENTER);
  text(str(v_label), x, y);
}
//ひとつの辺の描画
function Edge(x1, x2, h, vertex_r, pos){
  //pos==1, up; pos==2, bottom
  if(x1 > x2){
    var tmp = x1; x1 = x2; x2 = tmp;
  }
  noFill();
  if(pos==0) arc((x2+x1)/2, h, (x2-x1), (x2-x1), PI, 0);
  else arc((x2+x1)/2, h, (x2-x1), (x2-x1), 0, PI);
}

//２つの頂点の距離
function distance(x1, y1, x2, y2){
  return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}
//------------------------------------------
//ページ上のボタン集
//------------------------------------------
function addPageNum(){page++;console.log("page:",page);}
function subPageNum(){page--;console.log("page:",page);}
function changePageNum(){page = int(document.getElementsByName("changePage")[0].value);console.log("page:",page);}
function insertMod(){whichMod = 1;var tekito=document.getElementById("whichModNow").value="挿入型now";}
function changeMod(){whichMod = 0;document.getElementById("whichModNow").value="交換型now";}
function changechangeMod(){
  whichMod = (++whichMod)%2;
  document.getElementById("whichModNow").value = (whichMod == 1) ? "挿入型now" : "交換型now";
}

function search(){
  var left = document.getElementsByName("left")[0].value;
  var right = document.getElementsByName("right")[0].value;
  for(var ix=0;ix<m;ix++){
    if(edges[ix][0] <= 9 && edges[ix][0] >= 0){
      if(int(edges[ix][0]) == int(left) && int(edges[ix][1]) == int(right)){
        searchPageNow = ix;
        return edges[ix][2].slice(1,-1);
      }
      if(int(edges[ix][0]) == int(right) && int(edges[ix][1]) == int(left)){
        searchPageNow = ix;
        return edges[ix][2].slice(1,-1);
      }
    }
  }//for
}
function searchPage(){
  document.getElementsByName("searchPage")[0].value = search();
  console.log("searchPageNow:",searchPageNow);
}
function changechangePage(){
  search();
  var ptmp = (document.getElementsByName("searchPage")[0].value);
  //console.log(document.getElementsByName("searchPage")[0]);
  edges[searchPageNow][2] = "["+(ptmp+"")+"]";
  console.log("searchPageNow:",searchPageNow);
}
