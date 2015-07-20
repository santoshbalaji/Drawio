var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var room = new Array();
var roomcount = 0;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.use(express.static(__dirname));

app.get("/",function(req,res)
{
  res.sendFile(__dirname+"/index.html");
});

io.on("connection",function(client)
{
  client.on("join",function(data)
  {
    room[roomcount] = client;
    roomcount++;
  });
  client.on("messages",function(data)
  {
    for(var i =0 ;i <room.length;i++)
    {
      if(room[i].id !== client.id)
      {
        console.log("inside "+i);
        room[i].emit("message",data);
      }
    }
  });
  client.on("disconnect",function(data)
  {
    for(var i =0;i<room.length;i++)
    {
      if(room[i].id ===  client.id )
      {
        roomcount--;
        room.splice(i,1);
      }
    }
  });
});

server.listen(port,ipaddress,function()
{
  console.log("Server running on port 8080");
});
