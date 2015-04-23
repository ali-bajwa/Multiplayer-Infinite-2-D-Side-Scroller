// Javascript for _layout.cshtml partial view

$(document).ready(function () {

  $('#login').hide()
  $('#loginLink').click(function () {
    $('#login').toggle();
  });

  //DO NOT DELETE THIS
  /* var marginLeftVal = $("#login").css("margin-left").valueOf();
   var marginLeftInt = parseInt(marginLeftVal.substring(0, marginLeftVal.length - 2));
   var previousWidth = $(window).width();
   var checkCurrentWidth = $(window).width();
   var incrementer = 0;

   console.log($(window).length);
   $(window).resize(function () {
       checkCurrentWidth = $(window).width();


       console.log(checkCurrentWidth + ' < this is the current width');

       if (checkCurrentWidth < 2000 && checkCurrentWidth > 1350) {



           if ($(window).width() != previousWidth) {

                   console.log(incrementer);

                   if ($(window).width() > previousWidth + 1) {

                       if (checkCurrentWidth < 1450) { incrementer = 10; }
                       else if (checkCurrentWidth < 1500) { incrementer = 6; }
                       else if (checkCurrentWidth < 1550) { incrementer = 6; }
                       else if (checkCurrentWidth < 1600) { incrementer = 6; }
                       else if (checkCurrentWidth < 1750) { incrementer = 5; }
                       else if (checkCurrentWidth < 1850) { incrementer = 5; }
                       else { incrementer = 2; }

                       marginLeftVal = parseInt(marginLeftVal) + incrementer;
                       $('#login').css("margin-left", marginLeftVal + 'px');
                       console.log(marginLeftVal);
                       previousWidth = $(window).width();
                   }

                   else if ($(window).width() < previousWidth + 1) {
                       if (checkCurrentWidth < 1450) { incrementer = -10; }
                       else if (checkCurrentWidth < 1500) { incrementer = -6; }
                       else if (checkCurrentWidth < 1550) { incrementer = -6; }
                       else if (checkCurrentWidth < 1600) { incrementer = -6; }
                       else if (checkCurrentWidth < 1750) { incrementer = -5; }
                       else if (checkCurrentWidth < 1850) { incrementer = -5; }
                       else { incrementer = 2; }

                       marginLeftVal = parseInt(marginLeftVal) + incrementer;
                       $('#login').css("margin-left", marginLeftVal + 'px');
                       console.log(marginLeftVal);
                       previousWidth = $(window).width();
                   }

               }
               checkCurrentWidth = $(window).width();
       }
   });
*/
});