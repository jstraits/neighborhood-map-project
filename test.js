var map;

var mapData = {
	places: ko.observableArray([
	{
		name: "Pete's Place",
		lat: 42.218538,
		lng: -83.267840
	},
	{
		name: "Mallie's",
		lat: 42.213908,
		lng: -83.223309
	},
	{
		name: "Bierkeller",
		lat: 42.227418,
		lng: -83.230178
	},
	{
		name: "Rosie O'Grady's",
		lat: 42.199659,
		lng: -83.211449
	},
	{
		name: "Joey's Cheesesteaks",
		lat: 42.213273,
		lng: -83.202015
	},
/*	{
		name: "",
		lat: ,
		lng: 
	},
	{
		name: "",
		lat: ,
		lng: 
	}*/
	])
};

$(document).ready(function () {
   createMap();
   ko.applyBindings(viewModel);
});

function MyViewModel(data) {
    var self = this;
	self.name = mapData.places.name;
    self.lat = mapData.places.lat;
    self.lng = mapData.places.lng;
	
}
    function createMap(){    
    var myLatLng = new google.maps.LatLng(42.2256387, -83.3035803);
    var myOptions = {
        center: myLatLng,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map($('#map')[0], myOptions);
	}


ko.bindingHandlers.map = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
    var position = new google.maps.LatLng(allBindingsAccessor().latitude(), allBindingsAccessor().longitude());
        var marker = new google.maps.Marker({
            map: allBindingsAccessor().map,
            position: position,
            title: name
        });

            viewModel._mapMarker = marker;
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var latlng = new google.maps.LatLng(allBindingsAccessor().latitude(), allBindingsAccessor().longitude());
                viewModel._mapMarker.setPosition(latlng);

            }
        };


var viewModel = new MyViewModel();