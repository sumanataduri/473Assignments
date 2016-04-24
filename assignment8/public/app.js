/*globals $,io*/
var main = function() {
    "use strict";
    var socket = io.connect('http://localhost:3000'),
        $todoform = $('#todoform'),
        $todotext = $('#todotext'),
        todolocal = {};
    var orderReversed = false;

    $todoform.submit(function(e) {
        e.preventDefault();
        socket.emit('send message', $todotext.val());
        console.log('message sent from client');
        $todotext.val('');

    });

    socket.on('new message', function(data) {
        alert("New ToDO has been added");
        console.log(data + ":data" + JSON.stringify(data).todo + " stringify");
        addData(data);
        updateList();
    });

    socket.on('load old todos', function(data) {
        console.log("client : load old tools");
        todolocal = data;
        cleardata();
        addData(todolocal);
        initialize();
        updateList();
    });

    function cleardata() {
        $("main .lists").empty();
        orderReversed = false;
    }

    function addData(data) {

        data.forEach(function(value) {

            var $content = $("<ul>");
            $content.append($("<li>").text(value.todo));
            if (!orderReversed) {
                $("main .lists").append($content);
            } else {
                $("main .lists").prepend($content);
            }

        });
    }

    function updateList() {

        $(".tabs a span").toArray().forEach(function(element) {

            var active = $(element).hasClass("active");
            if (active) {
                $("main .lists").show();
                // var ulistObj = $("main .lists");
                if ($(element).parent().is(":nth-child(1)")) {
                    if (!orderReversed) {
                        var listItems = $("main .lists").children();
                        console.log(listItems);
                        var arrayItems = listItems.get().reverse();

                        $("main .lists").empty();

                        console.log(" array items : " + arrayItems.length);
                        for (var i = 0; i < arrayItems.length; i++) {
                            $("main .lists").append(arrayItems[i]);
                        };

                        orderReversed = true;
                    }
                    $('.addtodo').hide();
                } else if ($(element).parent().is(":nth-child(2)")) {
                    console.log("in second tab");
                    if (orderReversed) {
                        //ulistObj.reverse();
                        var listItems = $("main .lists").children();
                        console.log(listItems);
                        var arrayItems = listItems.get().reverse();

                        $("main .lists").empty();

                        console.log(" array items : " + arrayItems.length);
                        for (var i = 0; i < arrayItems.length; i++) {
                            $("main .lists").append(arrayItems[i]);
                        };

                        orderReversed = false;
                    }
                    $('.addtodo').hide();

                } else if ($(element).parent().is(":nth-child(3)")) {
                    console.log("in third tab");
                    $("main .lists").hide();
                    $('.addtodo').show();
                }
            }
        });
    }

    function initialize() {
        $(".tabs a span").toArray().forEach(function(element) {

            $(element).on("click", function(e) {
                e.preventDefault();
                var $element = $(element);
                $(".tabs a span").removeClass("active");
                $element.addClass("active");
                updateList();
            });
            //$(".tabs a:first-child span").trigger("click");
        });
    }


};
$(document).ready(main);