var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var members = new Array();
var membername = new Array();
var membercount = 0;
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
    members[membercount] = client;
    membername[membercount] = data;
    membercount++;
    for(var i =0 ;i <members.length;i++)
    {
      members[i].emit("message",membername);
    }
  });
  client.on("messages",function(data)
  {
    for(var i =0 ;i <members.length;i++)
    {
      if(members[i].id !== client.id)
      {
        members[i].emit("message",data);
      }
    }
  });
  client.on("disconnect",function(data)
  {
    for(var i =0;i<members.length;i++)
    {
      if(members[i].id ===  client.id )
      {
        membercount--;
        members.splice(i,1);
        membername.splice(i,1);
      }
    }
    for(var i =0 ;i <members.length;i++)
    {
      members[i].emit("message",membername);
    }
  });
});

server.listen(port,ipaddress,function()
{
  console.log("Server running on port 8080");
});
