var entuURL = 'https://saal.entu.ee/api2/';

function cl(data) {
    console.log(data);
}

angular.module('saalApp', ['ngRoute'])

    .config(['$routeProvider', '$sceDelegateProvider', function($routeProvider, $sceDelegateProvider) {
        $routeProvider
            .when('/events', {
                templateUrl : 'pages/events.html',
                controller  : 'listCtrl'
            })
            .when('/:id', {
                templateUrl : 'pages/event.html',
                controller  : 'eventCtrl'
            })
            .otherwise({ redirectTo: '/events' });
    }])

    .controller('mainCtrl', ['$rootScope', '$scope', '$location', function($rootScope, $scope, $location) {
        $rootScope.url = $location.path().replace('/', '');
        $scope.nightTipNr = Math.floor((Math.random()*3)+1);
        $scope.pages = [
            {url: 'events',   title: 'Sündmused'},
        ];

        $scope.nightToggle = function () {
            $scope.nightMode = !$scope.nightMode;
            $scope.hideNightTip = true;
        }
    }])

    .service('eventModel', ['$rootScope', '$http', '$window', function($rootScope, $http, $window) {
        if(!$rootScope.events) $rootScope.events = [];

        $rootScope.formatLecture = function(data) {
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
                description : description,
                title       : title,
            };
        };

        $rootScope.pushLectureToScope = function(event, only_event) {
            if(only_event) {
                $rootScope.event = event;
            } else {
                $rootScope.event = null;

                $rootScope.events.push(event);
                $rootScope.events_loaded += 1;

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
                $rootScope.pushLectureToScope(event, only_event);
                return event;
            } else {
                cl('Get event #'+id+' from Entu');
                $http({method: 'GET', url: entuURL+'entity-'+id}).success(function(data) {
                    event = $rootScope.formatLecture(data.result);
                    $window.localStorage.setItem('event-'+id, JSON.stringify(event));
                    $rootScope.pushLectureToScope(event, only_event);
                    return event;
                });
            }
        };

        $rootScope.getEvents = function() {
            $http({method: 'GET', url: entuURL+'entity', params: {definition: 'event'}}).success(function(data) {
                $rootScope.events_count  = data.result.length;
                $rootScope.events_loaded = 0;
                $rootScope.events        = [];
                $rootScope.years           = [];
                $rootScope.authors         = [];
                $rootScope.subjects        = [];

                for(i in data.result) {
                    $rootScope.getEvent(data.result[i].id, data.result[i].changed.dt);
                };
            });
        };
    }])

    .controller('listCtrl', ['$rootScope', '$scope', '$http', '$location', 'eventModel', function($rootScope, $scope, $http, $location, eventModel) {
        $rootScope.url = $location.path().replace('/', '');

        if($rootScope.events.length < 1) $rootScope.getEvents();

     }])

    .controller('eventCtrl', ['$rootScope', '$scope', '$http', '$routeParams', 'eventModel', function($rootScope, $scope, $http, $routeParams, eventModel) {
        $rootScope.url = $routeParams.id;

        $rootScope.getEvent($routeParams.id, false, true);

        $scope.palyAudio = function(event) {
            $rootScope.current_event = event;
        }
    }]);
