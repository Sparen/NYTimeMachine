/**
 * Created by jadk157 on 2/6/16.
 */
(function(){
    var app = angular.module('timeline', ['inputyear']);

    app.controller('TimelineController', ['$http', function($http){
        var timeline = this;

        timeline.year = 0;
        timeline.world = {
            europe: ["Germany", 'France', 'Britain', 'Italy', 'Spain', 'Russia', 'Turkey'],
            asia: ['Thailand', 'Indonesia', 'Singapore', 'China', 'Japan', 'India'],
            americas: ['Brazil', 'Argentina', 'Mexico', 'Venezuela', 'Cuba'],
            africa: ['Liberia', 'Ethiopia', 'Egypt', 'Ghana']
        };

        timeline.region = "";

        timeline.articleList = [];

        // Shows the list of articles to be pushed onto the screen
        timeline.showArticles = function(){
        	console.log(timeline.articleList);
        };

        // Randomly selects countries from a region 
        timeline.randomizeCountries = function(region){
            var countryList = region;
            for(i = 0; i < countryList.length; i++){
                var random = Math.floor((Math.random() * 10) + 1);
                if(random > 7){
                    countryList.splice(i, 1);
                }
            }
            return countryList;
        };

        // Adds to articleList the first article given back by the API query result that has
        // the country's name either in its snippet or its headline
        timeline.selectArticle = function(query, country){
            console.log('Select Article - country parameter: ' + country);
            var quota_fulfill = false;

            for(j = 0; j < query.length; j++){
                var snippet = query[j].snippet;
                var main = query[j].headline.main;
                if((snippet.includes(country) || main.includes(country)) //making sure that the country is in the snippet or headline
                    && quota_fulfill === false){
                        timeline.articleList.push(query[j]);
                        quota_fulfill = true;
                }
            }
        };

        timeline.submit = function(){

            var countryList = timeline.randomizeCountries(timeline.world[timeline.region]);
            console.log('timeline.submit - randomized country list: ' + countryList);

            for(i = 0; i < countryList.length; i++){
                $http.get('http://api.nytimes.com/svc/search/v2/articlesearch.json?q='
                    + countryList[i] 
                    + '&begin_date=' 
                    + timeline.year
                    + '0101&end_date='
                    + (timeline.year + 1)
                    + '0101&sort=oldest&fl=snippet%2Cheadline&api-key=db6c22023a90449345e4d9e999dabb02:2:74312658')
                .success((function(i, countryList){ //solution 2 from http://stackoverflow.com/questions/19116815/how-to-pass-a-value-to-an-angularjs-http-success-callback accepted answer
                    return function(data){
                        var query = data.response.docs;
                        console.log('timeline.submit - i: ' + i);
                        console.log('timeline.submit - query: ' + query);
                        console.log('timeline.submit - countryList[i]: ' + countryList[i]);
                        console.log("Hey");
                        timeline.selectArticle(query, countryList[i]);
                    }
                })(i, countryList));
            };

            // http://api.nytimes.com/svc/search/v2/articlesearch.json?q=Brazil&begin_date=19000101&end_date=19200101&sort=oldest&fl=snippet%2Cheadline&api-key=sample-key

            //timeline.showArticles();
        };
    }]);
})();


//ng-model='timeline.headline' ng-click='update(timeline.headline, timeline.startYear, timeline.endYear)'

