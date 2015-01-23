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
            .when('/cominglist', {
                templateUrl : 'pages/cominglist.html',
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
            .otherwise({ redirectTo: '/cominglist' });
    }])

    .controller('mainCtrl', ['$rootScope', '$scope', '$location', function($rootScope, $scope, $location) {
        $rootScope.url = $location.path().replace('/', '')
        $scope.nightTipNr = Math.floor((Math.random()*3)+1)
        $scope.current_date = new Date().toJSON().slice(0,10)
        $scope.current_time = new Date().toJSON().slice(11,19)
        // $scope.current.time = .toJSON().slice(0,10)
        $scope.pages = [
            {url: 'cominglist',   title: 'Kava'},
            {url: 'newslist',     title: 'Uudised'},
            {url: 'eventlist',   title: 'Arhiiv'},
        ];

        $scope.nightToggle = function () {
            $scope.nightMode = !$scope.nightMode;
            $scope.hideNightTip = true;
        }
    }])

    .service('newsModel', ['$rootScope', '$http', '$window', function($rootScope, $http, $window) {
        if(!$rootScope.newslist) $rootScope.newslist = [];

        $rootScope.formatNews = function(data) {
            try        { var time = data.properties.time.values[0].value.toJSON().slice(0,10) }
            catch(err) { var time = '' }

            try        { var body = data.properties.body.values[0].value }
            catch(err) { var body = '' }

            try        { var title = data.properties.title.values[0].value }
            catch(err) { var title = '' }

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
            }
        };

        $rootScope.getNews = function(id, changed, only_news) {
            try        { var news = JSON.parse($window.localStorage.getItem('news-'+id)) }
            catch(err) { var news = {changed:''} }

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
            $http({method: 'GET', url: entuURL+'entity-597/childs', params: {definition: 'news'}}).success(function(data) {
                // cl(data.result)
                $rootScope.newslist_count   = data.result.news.entities.length;
                $rootScope.newslist_loaded  = 0;
                $rootScope.newslist         = [];

                for(i in data.result.news.entities) {
                    $rootScope.getNews(data.result.news.entities[i].id, new Date().toJSON().slice(0,10));
                };
            });
        };
    }])

    .service('eventModel', ['$rootScope', '$http', '$window', function($rootScope, $http, $window) {
        if(!$rootScope.eventlist) $rootScope.eventlist = []

        $rootScope.formatEvent = function(data) {
            cl(data.properties.time)
            try {
                var date = []
                var dates = data.properties.time.values
                for (var i = dates.length - 1; i >= 0; i--) {
                    date.push(dates[i].value)
                }
            }
            catch(err) { var date = [] }
            cl(date)

            try        { var description = data.properties.description.values[0].value }
            catch(err) { var description = '' }

            try        { var price = data.properties.price.values[0].value }
            catch(err) { var price = '' }

            try        { var title = data.properties.name.values[0].value }
            catch(err) { var title = '' }

            return {
                id          : data.id,
                changed     : data.changed,
                date        : date,
                price       : price,
                description : description,
                title       : title,
            }
        }

        $rootScope.pushEventToScope = function(event, only_event, is_coming) {
            if(only_event) {
                $rootScope.event = event
            } else {
                $rootScope.event = null

                $rootScope.eventlist_loaded += 1

                if(is_coming === true) {
                    $rootScope.cominglist.push(event)
                } else {
                    $rootScope.eventlist.push(event)
                }
            }
        }

        $rootScope.getEvent = function(id, changed, only_event, is_coming) {
            // cl(is_coming)
            try        { var event = JSON.parse($window.localStorage.getItem('event-'+id)) }
            catch(err) { var event = {changed:''} }

            if(!event) var event = {changed:''};
            if(event.changed == changed) {
                $rootScope.pushEventToScope(event, only_event, is_coming);
                return event;
            } else {
                cl('Get event #'+id+' from Entu');
                $http({method: 'GET', url: entuURL+'entity-'+id}).success(function(data) {
                    event = $rootScope.formatEvent(data.result);
                    $window.localStorage.setItem('event-'+id, JSON.stringify(event));
                    $rootScope.pushEventToScope(event, only_event, is_coming);
                    return event;
                });
            }
        };

        $rootScope.getEventList = function() {
            $http({method: 'GET', url: entuURL+'entity-597/childs', params: {definition: 'event'}}).success(function(data) {
                $rootScope.eventlist_count  = data.result.event.entities.length
                $rootScope.eventlist_loaded = 0
                $rootScope.eventlist        = []
                $rootScope.cominglist       = []
                // cl(data.result.event.entities)
                for(i in data.result.event.entities) {
                    // cl('Try event #'+data.result.event.entities[i].id+' from Entu')
                    $rootScope.getEvent(data.result.event.entities[i].id, new Date().toJSON().slice(0,10), false, true)
                }
                // cl('$rootScope.cominglist')
                // cl($rootScope.cominglist)
            })
            $http({method: 'GET', url: entuURL+'entity', params: {definition: 'event'}}).success(function(data) {
                $rootScope.eventlist_count  += data.result.length

                for(i in data.result) {
                    $rootScope.getEvent(data.result[i].id, data.result[i].changed.dt, false, false)
                }
            })
        }
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
