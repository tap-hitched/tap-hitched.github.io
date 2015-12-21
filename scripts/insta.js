var app = angular.module("myApp", [])
    .filter('fromTo', function() {
        return function(input, from, total, lessThan) {
            from = parseInt(from);
            total = parseInt(total);
            for (var i = from; i < from + total && i < lessThan; i++) {
                input.push(i);
            }
            return input;
        }
    })
    .factory('instagram', ['$http',
        function($http) {
            return {
                fetchPopular: function(callback) {

                    var endPoint = "https://api.instagram.com/v1/tags/taphitched/media/recent?access_token=40480112.1fb234f.4866541998fd4656a2e2e2beaa5c4bb1&callback=JSON_CALLBACK";

                    $http.jsonp(endPoint).success(function(response) {
                        callback(response.data);
                    });
                }
            }
        }
    ])
    .controller("Example", function($scope, $interval, instagram, $location, anchorSmoothScroll) {
      var max_limit = 100;
      $scope.pics = [];
      $scope.have = [];
      $scope.orderBy = "-likes.count";
      $scope.getMore = function() {
        instagram.fetchPopular(function(data) {
            for(var i=0; i<max_limit; i++) {
              if (typeof $scope.have[data[i].id]==="undefined") {
                $scope.pics.push(data[i]) ;
                $scope.have[data[i].id] = "1";
              }
            }
        });
      };
      $scope.getMore();
      
        $scope.tags = [
            'testapimike'
        ]

      $scope.gotoElement = function (eID){
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash('bottom');
   
        // call $anchorScroll()
        anchorSmoothScroll.scrollTo(eID);
        
      };
    });

app.service('anchorSmoothScroll', function(){
    
    this.scrollTo = function(eID) {

        // This scrolling function 
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
        
        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 100);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
        
        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }
        
        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }

    };
    
});


