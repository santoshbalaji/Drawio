var socket,username;
var canvas = document.getElementById("draw");
var context = canvas.getContext("2d");
var prevX=0,prevY=0,nextX=0,nextY=0,pOX=0,pOY=0,nOX=0,nOY=0;
var strokecolor="black",socolor;
var status = "false";

///For start button onclick listener
document.getElementById("start").addEventListener("click",start);

document.getElementById("username").addEventListener("keydown",function(event)
{
  if(event.keyCode === 13)
  {
    start();
  }
});

function start()
{
  if(document.getElementById("username").value.trim().length !== 0)
  {
    username = document.getElementById("username").value;
    socket =  io.connect("ws://drawio-sbkumar.rhcloud.com:8000");
    ///The following methods are handling the sockets
    socket.on("connect",function(data)
    {
      socket.emit("join","{\"username\":\""+username+"\"}");
    });

    socket.on("message",function(data)
    {
      if(typeof data === "string")
      {
        var json = JSON.parse(data);
        if(json.pOX !== null)
        {
          pOX = json.pOX;
          pOY = json.pOY;
          nOX = json.nOX;
          nOY = json.nOY;
          socolor = json.socolor;
          draw("other");
        }
      }
      else if(typeof data === "object")
      {
        document.getElementById("member-panel").innerHTML="";
        for(var i=0;i < data.length;i++)
        {
          var obj = JSON.parse(data[i]);
          var div = document.createElement("DIV");
          div.className = "list-group-item";
          div.innerText = obj.username;
          document.getElementById("member-panel").appendChild(div);
        }
      }
      show();
    });
    ////////////////////////////////////////////////////////////////////////////
  }
}

function show()
{
  document.getElementsByClassName("userdetails-panel")[0].style.display="none";
  document.getElementsByClassName("painting-panel")[0].style.display="block";
}
//////////////////////////////////////////////////////////////////////////

///The following methods are used when mouse events on canvas screen occurs
canvas.addEventListener("mousedown",function(event)
{
  prevX = event.offsetX;
  prevY = event.offsetY;
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
////////////////////////////////////////////////////////////////////////////

///////These functions are for drawing operations on canvas
function draw(user,event)
{
  if(user === "self")
  {
    nextX = event.offsetX;
    nextY = event.offsetY;
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
////////////////////////////////////////////////////////////////////////////

///////The code for adding event listeners for all colors
var colorpallets = document.getElementsByClassName("colorpallets");
for(var i =0 ;i<colorpallets.length;i++)
{
  colorpallets[i].addEventListener("click",function()
  {
    strokecolor = this.style.backgroundColor;
  });
}
/////////////////////////////////////////////////////////////////////////////
