/*globals require:false*/
var express = require("express");
var app = express(),
    redis = require("redis"),
    redisclient = redis.createClient();

var bodyparser = require("body-parser");
app.use(bodyparser.json());

app.get("/", function(request, response) {
    response.send("Sumana");
});

redisclient.mget(["wins", "losses"], function(err, results) {
    if (err !== null) {
        console.log("ERROR" + err);
        return;
    }
    var win = parseInt(results[0], 10) || 0;
    var loose = parseInt(results[1], 10) || 0;

    app.post("/flip", function(request, response) {
        var choice = request.body.call;
        var random_value;
        var coin = Math.random();
        if (coin > 0.5) {
            random_value = "heads";
        } else if (coin <= 0.5) {
            random_value = "tails";
        }
        if (choice === random_value) {
            redisclient.incr("wins");
            response.send({
                "Result": "win"
            });
            win++;
        } else {
            redisclient.incr("losses");
            response.send({
                "Result": "loose"
            });
            loose++;
        }
    });
    app.delete("/stats", function(request, response) {

        redisclient.set("wins", 0);
        redisclient.set("losses", 0);
        win = 0; loose = 0;
        console.log("going into delete");
        response.send({
            "wins": 0,
            "losses": 0
        });
    });
    app.get("/stats", function(request, response) {
        response.send({
            "wins": win,
            "losses": loose
        });
        console.log("in get");
    });

});

app.listen(3000, function() {
    console.log("Example app listening on port 3000");
});