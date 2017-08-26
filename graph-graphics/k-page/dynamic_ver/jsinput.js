/*
wrote by seikai y. 2016April
*/
/* fixed by seikai y. 2016October */

var n;//num of nodes
var k;//num of pages
var m;//num of edges
var nodes = {};
var edges = {};

//INPUT
function input(){
  var str = document.getElementsByName("jsinput")[0].value.split("\n");
  console.log("===================\ngot input data\n");
  console.log("input data:\n",str);
  fGetData(str);
}
//コメント読み飛ばし機能付き、ただし初めの行は標準フォーマットでなければ認識できない
function fGetData(str){
  var npos = 0;
  var kpos = 1;
  while(str[npos][0] == "#") {npos++; kpos++;}
  n = int(str[npos]);//num of nodes
  while(str[kpos][0] == "#") {kpos++;}
  k = int(str[kpos]);//num of pages
  var ix = kpos+1;
  while(str[ix][0] == "#"){ix++;}
  for(var i = 0; i < n; i++)
    nodes[i] = int(str[ix++]);
  //edges
  m = str.length-ix;
  for(var i = ix; i < str.length; i++){
    edges[i-ix] = str[i];
    edges[i-ix] = edges[i-ix].split(" ");
    //edges[i-ix]=edges[i-ix].split("#",1);
  }
  console.log("n:%d",n);
  console.log("k:%d",k);
  console.log("m:%d",m);
  console.log("nodes:\n",nodes);
  console.log("edges:\n",edges);

  initial();
}
//OUTPUT
function jsoutput(){
  var outputstr = "";
  outputstr += (n+"\n");
  outputstr += ((k)+"\n");
  for(var i = 0; i < n; i++)
    outputstr += ((nodes[i])+"\n");
  for(var i = 0; i < m; i++){
    if(edges[i][0] <= "9" && edges[i][0] >= "0"){
      outputstr += edges[i][0] + " " + edges[i][1] + " ";
      outputstr += edges[i][2];
      outputstr += "\n";
    }
  }
  document.getElementsByName("jsoutput")[0].innerHTML = outputstr;
  console.log(outputstr);
}
