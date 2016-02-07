/**
 * Created by jadk157 on 2/6/16.
 */
(function(){
    var app = angular.module('timeline', ['inputyear']);

    app.controller('TimelineController', ['$http', function($http){
        var timeline = this;

        timeline.year = 0;
        timeline.world = {
            Europe: ["Germany", 'France', 'Britain', 'Italy', 'Spain', 'Russia', 'Turkey'],
            Asia: ['Thailand', 'Indonesia', 'Singapore', 'China', 'Japan', 'India'],
            Americas: ['Brazil', 'Argentina', 'Mexico', 'Venezuela', 'Cuba'],
            Africa: ['Africa', 'Liberia', 'Ethiopia', 'Egypt', 'Ghana', 'Morocco', 'Somalia', 'Burundi', 'Botswana', 'Rwanda']
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
            var quota_fulfill = false;
            for(j = 0; j < query.length; j++){
                var snippet = query[j].snippet;
                var main = query[j].headline.main;
                if(snippet != null && main != null){
                    if((snippet.toUpperCase().includes(country) || main.toUpperCase().includes(country)) //making sure that the country is in the snippet or headline
                    && quota_fulfill === false){
                        var newArticle = {
                            headline: "",
                            snippet: "",
                            country: country
                        }

                        newArticle.headline = query[j].headline.main;
                        newArticle.snippet = query[j].snippet;                        

                        timeline.articleList.push(newArticle);
                        quota_fulfill = true;                        
                    }
                }
            }
            console.log(timeline.articleList)
        };

        timeline.prepareDisplay = function(){
            
            console.log(timeline.articleList);
            for(i = 0; i < timeline.articleList.length; i++){

                var newArticle = {
                    headline: "",
                    snippet: ""
                }

                var currArticle = timeline.articleList[i];
                console.log(currArticle);
                if(currArticle.headline.main != null){
                    newArticle.headline = currArticle.headline.main;
                }
                if(currArticle.snippet != null){
                    newArticle.snippet = currArticle.snippet;
                }

                timeline.articleList[i] = newArticle;
            }

        };

        timeline.submit = function(){

            var countryList = timeline.randomizeCountries(timeline.world[timeline.region]);

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
                        timeline.selectArticle(query, countryList[i].toUpperCase());
                    }
                })(i, countryList));
            };


        };
    }]);
})();


//ng-model='timeline.headline' ng-click='update(timeline.headline, timeline.startYear, timeline.endYear)'

