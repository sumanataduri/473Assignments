 var express=require("express"),
       http=require("http"),
       mongoose=require("mongoose"),
       bodyparser=require("body-parser"),
       app=express();
   app.use(bodyparser.json());
  
  app.use(express.static(__dirname+"/client"));
  app.use(bodyparser.urlencoded({extended:false}));
 
  mongoose.connect('mongodb://localhost:27017/amazeriffic');
 
  var ToDoSchema=mongoose.Schema({
      title: String,
      link:String,
      clicks: Number
  },{versionKey:false});
 
  var ToDo= mongoose.model("ToDo",ToDoSchema);
 
  http.createServer(app).listen(3000);
 
  app.get("/links",function(req,res){
      ToDo.find({},function(err,toDos){
          if(err){
          console.log(err);
          }
      res.send(toDos);
      });
  });
  app.get("/links/:title",function(req,res){
  var query={"title":req.params.title};
      console.log("going into /links/:title = "+req.params.title);
      console.log("value of query object="+ query.title);
      ToDo.findOneAndUpdate(query,{$inc:{clicks:1}},function(err,result){
          if(err){
              console.log("ERROR"+err);
          }
          else if(result===null){
              console.log("value not present");
          }else{
          res.redirect(result.link);
          //console.log(result+"  ---value of result.link--"+result.link);
          }
      });
 });
  app.post("/links",function(req,res){
      console.log(req.body);
      var newToDo=new ToDo({"title":req.body.title,
                             "link":req.body.link, "clicks":0});
      newToDo.save(function(err,result){
          if(err!==null){
              console.log(err);
              res.send("ERROR");
          }else{
              ToDo.find({},function(err,result){
                  if(err!==null){
                      res.send("ERROR");
                  }
                  res.send(result);
             });
          }
      });
  });