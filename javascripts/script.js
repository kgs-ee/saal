var entuURL = 'https://saal.entu.ee/api2/';

function cl(data) {
    console.log(data);
}

// angular.module('filters', []).


angular.module('saalApp', ['ngRoute'])

    .filter('truncate', function () {
        return function (text, length, end) {
            if (isNaN(length))
                length = 10

            if (end === undefined)
                end = "..."

            if (text.length <= length || text.length - end.length <= length) {
                return text
            }
            else {
                return String(text).substring(0, length-end.length) + end
            }

        }
    })

    .config(['$routeProvider', '$sceDelegateProvider', function($routeProvider, $sceDelegateProvider) {
        $routeProvider
            .when('/eventlist', {
                templateUrl : 'pages/eventlist.html',
                controller  : 'eventListCtrl'
            })
            .when('/event/:id', {
                templateUrl : 'pages/event.html',
                controller  : 'eventCtrl'
            })
            .when('/newslist', {
                templateUrl : 'pages/newslist.html',
                controller  : 'newsListCtrl'
            })
            .when('/news/:id', {
                templateUrl : 'pages/news.html',
                controller  : 'newsCtrl'
            })
            .otherwise({ redirectTo: '/eventlist' });
    }])

    .controller('mainCtrl', ['$rootScope', '$scope', '$location', function($rootScope, $scope, $location) {
        $rootScope.url = $location.path().replace('/', '');
        $scope.nightTipNr = Math.floor((Math.random()*3)+1);
        $scope.pages = [
            {url: 'eventlist',   title: 'Sündmused'},
            {url: 'newslist',     title: 'Uudised'},
        ];

        $scope.nightToggle = function () {
            $scope.nightMode = !$scope.nightMode;
            $scope.hideNightTip = true;
        }
    }])

    .service('eventModel', ['$rootScope', '$http', '$window', function($rootScope, $http, $window) {
        if(!$rootScope.eventlist) $rootScope.eventlist = [];

        $rootScope.formatEvent = function(data) {
            try        { var date = data.properties.time.values.sort(); }
            catch(err) { var date = []; }

            try        { var description = data.properties.description.values[0].value; }
            catch(err) { var description = ''; }

            try        { var price = data.properties.price.values[0].value; }
            catch(err) { var price = ''; }

            try        { var title = data.properties.name.values[0].value; }
            catch(err) { var title = ''; }

            return {
                id          : data.id,
                changed     : data.changed,
                date        : date,
                price       : price,
                description : description,
                title       : title,
            };
        };

        $rootScope.pushEventToScope = function(event, only_event) {
            if(only_event) {
                $rootScope.event = event;
            } else {
                $rootScope.event = null;

                $rootScope.eventlist.push(event);
                $rootScope.eventlist_loaded += 1;

                if($rootScope.years.indexOf(event.year) == -1) {
                    $rootScope.years.push(event.year);
                    $rootScope.years = $rootScope.years.sort();
                    $rootScope.years = $rootScope.years.reverse();
                }

                for(a in event.author) {
                    if($rootScope.authors.indexOf(event.author[a]) == -1) {
                        $rootScope.authors.push(event.author[a]);
                        $rootScope.authors = $rootScope.authors.sort();
                    }
                }

                for(s in event.subject) {
                    if($rootScope.subjects.indexOf(event.subject[s]) == -1) {
                        $rootScope.subjects.push(event.subject[s]);
                        $rootScope.subjects = $rootScope.subjects.sort();
                    }
                }
            }
        };

        $rootScope.getEvent = function(id, changed, only_event) {
            try        { var event = JSON.parse($window.localStorage.getItem('event-'+id)); }
            catch(err) { var event = {changed:''}; }

            if(!event) var event = {changed:''};
            if(event.changed == changed) {
                $rootScope.pushEventToScope(event, only_event);
                return event;
            } else {
                cl('Get event #'+id+' from Entu');
                $http({method: 'GET', url: entuURL+'entity-'+id}).success(function(data) {
                    event = $rootScope.formatEvent(data.result);
                    $window.localStorage.setItem('event-'+id, JSON.stringify(event));
                    $rootScope.pushEventToScope(event, only_event);
                    return event;
                });
            }
        };

        $rootScope.getEventList = function() {
            $http({method: 'GET', url: entuURL+'entity', params: {definition: 'event'}}).success(function(data) {
                $rootScope.eventlist_count  = data.result.length;
                $rootScope.eventlist_loaded = 0;
                $rootScope.eventlist        = [];
                $rootScope.years            = [];
                $rootScope.authors          = [];
                $rootScope.subjects         = [];

                for(i in data.result) {
                    $rootScope.getEvent(data.result[i].id, data.result[i].changed.dt);
                };
            });
        };
    }])

    .service('newsModel', ['$rootScope', '$http', '$window', function($rootScope, $http, $window) {
        if(!$rootScope.newslist) $rootScope.newslist = [];

        $rootScope.formatNews = function(data) {
            try        { var time = data.properties.time.values[0].value; }
            catch(err) { var time = ''; }

            try        { var body = data.properties.body.values[0].value; }
            catch(err) { var body = ''; }

            try        { var title = data.properties.title.values[0].value; }
            catch(err) { var title = ''; }

            return {
                id          : data.id,
                changed     : data.changed,
                time        : time,
                body        : body,
                title       : title,
            };
        };

        $rootScope.pushNewsToScope = function(news, only_news) {
            if(only_news) {
                $rootScope.news = news;
            } else {
                $rootScope.news = null;

                $rootScope.newslist.push(news);
                $rootScope.newslist_loaded += 1;

                if($rootScope.years.indexOf(news.year) == -1) {
                    $rootScope.years.push(news.year);
                    $rootScope.years = $rootScope.years.sort();
                    $rootScope.years = $rootScope.years.reverse();
                }

                for(a in news.author) {
                    if($rootScope.authors.indexOf(news.author[a]) == -1) {
                        $rootScope.authors.push(news.author[a]);
                        $rootScope.authors = $rootScope.authors.sort();
                    }
                }

                for(s in news.subject) {
                    if($rootScope.subjects.indexOf(news.subject[s]) == -1) {
                        $rootScope.subjects.push(news.subject[s]);
                        $rootScope.subjects = $rootScope.subjects.sort();
                    }
                }
            }
        };

        $rootScope.getNews = function(id, changed, only_news) {
            try        { var news = JSON.parse($window.localStorage.getItem('news-'+id)); }
            catch(err) { var news = {changed:''}; }

            if(!news) var news = {changed:''};
            if(news.changed == changed) {
                $rootScope.pushNewsToScope(news, only_news);
                return news;
            } else {
                cl('Get news #'+id+' from Entu');
                $http({method: 'GET', url: entuURL+'entity-'+id}).success(function(data) {
                    news = $rootScope.formatNews(data.result);
                    $window.localStorage.setItem('news-'+id, JSON.stringify(news));
                    $rootScope.pushNewsToScope(news, only_news);
                    return news;
                });
            }
        };

        $rootScope.getNewsList = function() {
            $http({method: 'GET', url: entuURL+'entity', params: {definition: 'news'}}).success(function(data) {
                $rootScope.newslist_count   = data.result.length;
                $rootScope.newslist_loaded  = 0;
                $rootScope.newslist         = [];
                $rootScope.years            = [];
                $rootScope.authors          = [];
                $rootScope.subjects         = [];

                for(i in data.result) {
                    $rootScope.getNews(data.result[i].id, data.result[i].changed.dt);
                };
            });
        };
    }])

    .controller('eventListCtrl', ['$rootScope', '$scope', '$http', '$location', 'eventModel', function($rootScope, $scope, $http, $location, eventModel) {
        $rootScope.url = $location.path().replace('/', '');

        if($rootScope.eventlist.length < 1) $rootScope.getEventList();

    }])

    .controller('eventCtrl', ['$rootScope', '$scope', '$http', '$routeParams', 'eventModel', function($rootScope, $scope, $http, $routeParams, eventModel) {
        $rootScope.url = $routeParams.id;

        $rootScope.getEvent($routeParams.id, false, true);
    }])

    .controller('newsListCtrl', ['$rootScope', '$scope', '$http', '$location', 'newsModel', function($rootScope, $scope, $http, $location, newsModel) {
        $rootScope.url = $location.path().replace('/', '');

        if($rootScope.newslist.length < 1) $rootScope.getNewsList();

    }])

    .controller('newsCtrl', ['$rootScope', '$scope', '$http', '$routeParams', 'newsModel', function($rootScope, $scope, $http, $routeParams, newsModel) {
        $rootScope.url = $routeParams.id;

        $rootScope.getNews($routeParams.id, false, true);
    }])
