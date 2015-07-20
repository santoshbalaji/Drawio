var socket = io.connect("ws://drawio-sbkumar.rhcloud.com:8000");
var canvas = document.getElementById("draw");
var context = canvas.getContext("2d");
var prevX=0,prevY=0,nextX=0,nextY=0,pOX=0,pOY=0,nOX=0,nOY=0;
var strokecolor="black",socolor;
var status = "false";

canvas.addEventListener("mousedown",function(event)
{
  prevX = event.clientX;
  prevY = event.clientY;
  status = "true";
});
canvas.addEventListener("mousemove",function(event)
{
  if(status === "true")
  {
    draw("self",event);
  }
});
canvas.addEventListener("mouseup",function(event)
{
  status = false;
});
canvas.addEventListener("mouseout",function(event)
{
  status = false;
});

socket.on("connect",function(data)
{
  socket.emit("join","connected");
});
socket.on("message",function(data)
{
  var json = JSON.parse(data);
  pOX = json.pOX;
  pOY = json.pOY;
  nOX = json.nOX;
  nOY = json.nOY;
  socolor = json.socolor;
  draw("other");
});

function draw(user,event)
{
  if(user === "self")
  {
    nextX = event.clientX;
    nextY = event.clientY;
    socket.emit("messages","{\"pOX\":"+prevX+",\"pOY\":"+prevY+",\"nOX\":"+nextX+",\"nOY\":"+nextY+",\"socolor\":\""+strokecolor+"\"}");
    context.beginPath();
    context.moveTo(prevX,prevY);
    context.lineTo(nextX,nextY);
    context.lineWidth=4;
    context.strokeStyle =strokecolor;
    context.stroke();
    context.closePath();
    prevX = nextX;
    prevY = nextY;
  }
  else if(user === "other")
  {
    context.beginPath();
    context.moveTo(pOX,pOY);
    context.lineTo(nOX,nOY);
    context.lineWidth=4;
    context.strokeStyle = socolor;
    context.stroke();
    context.closePath();
  }
}

var colorpallets = document.getElementsByClassName("colorpallets");
for(var i =0 ;i<colorpallets.length;i++)
{
  colorpallets[i].addEventListener("click",function()
  {
    strokecolor = this.style.backgroundColor;
  });
}
