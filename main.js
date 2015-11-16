//Map variable for Google Maps
//Array of markers to use later
var map;
var allMarkers = [];

//Main function to create Google map
function initialize() {
	//Changes the map appearance via Google Maps styling features 
	var styles = [
	{
		stylers: [
			{hue: "#006c80"},
			{saturation: 20}
		]
	},{
		featureType: "road",
		elementType: "geometry",
		stylers: [
			{lightness: 100},
			{visibility: "simplified"}
		]
	}
	];
	
	var downRiver = new google.maps.LatLng(42.2256387,  -83.3035803); //Starting point over Taylor, MI
	var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});
	var mapOptions = {
		zoom: 12,
		center: downRiver,
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
		},
		disableDefaultUI: true
		};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');
}

//Creates and places markers on map using marker variable as a parameter
function addmapMarkers(m){        
	// Display multiple markers on a map
	var infoWindow = new google.maps.InfoWindow();

	function makeInfoWindow(mark){
	//Creates the DOM element for the marker window
		var infoWindowContent = '<div class="info_content">';
		infoWindowContent += '<h4>' + mark.title + '</h4>';
		infoWindowContent += '<p class="review"><img src="' + mark.pic + '">' + mark.blurb + '</p>';
		infoWindowContent += '</div>';

	//Takes above infoWindowContent and sets the content of the marker window
	infoWindow.setContent(String(infoWindowContent));
	infoWindow.open(map, mark);
	}

	//Deletes all markers on the map
	function deleteAllMarkers(){
		//Loops over the markers on the map and uses .setMap(null) to remove it
		for(var i = 0, max=allMarkers.length; i < max; i++ ) {
			allMarkers[i].setMap(null);
		}
		//Clears the allMarkers variable
		allMarkers = [];
	}
		//Removes any marker object in all Markers variable
		if(allMarkers.length > 0){
			deleteAllMarkers();
		}

	//Loops through the array of markers and places them on the map
	for(var i = 0, max=m.length; i < max; i++ ) {
		var position = new google.maps.LatLng(m[i][2], m[i][3]);
		//Creates new object from the marker param
		var newMark = new google.maps.Marker({
			position: position,
			map: map,
			animation: google.maps.Animation.DROP,
			title: m[i][0],
			ph: m[i][1],
			pic: m[i][4],
			blurb: m[i][5]
			});
		//Updates allMarkers array variable
		allMarkers.push(newMark);
		//Uses Google Maps event method to bind a mouseover event to the marker
		//Uses makeInfoWindow Method to create info window
		google.maps.event.addListener(newMark, 'mouseover', (function(mark, i) {
			return function() {
				makeInfoWindow(mark);
			};
		})(newMark, i));

		//Uses Google Maps event method to bind a mouse click event to the marker
		//Creates and shows info window as well as calls the marker animation
		google.maps.event.addListener(newMark, 'click', (function(mark, i){
			return function(){
				makeInfoWindow(mark);
				toggleBounce(mark, i);
			};
		})(newMark, i));
	}

	//Animates the marker
	function toggleBounce(mark, i) {
		var yelpMarkerDetailUl = $('.yelp-list').find('ul'),

		yelpMarkerDetail = yelpMarkerDetailUl.find('li'),
		yelpMarkerDetailPos = 212 * i,
		activeYelpMarkerDetail = yelpMarkerDetail.eq(i);

		//Removes the marker animation attribute if exists        
		if (mark.getAnimation() !== null) {
			mark.setAnimation(null);
			yelpMarkerDetailUl.removeClass('show');
			activeYelpMarkerDetail.removeClass('active');

		//If marker does not have animation attribue it is removed.
		//Animation attribute is set to the clicked marker
		} else {
			for(am in allMarkers){
				//Checks all the markers for the animation attribute
				var isMoving = allMarkers[am].getAnimation();
				//If the marker is animated and index is not self sets the animated marker's attribute to null
				if(isMoving && am !== i){
					allMarkers[am].setAnimation(null);
				}
			}
			//Adds the Bounce animation to the clicked marker using Google Map's animation method
			//Also adds the show className from the Yelp list to animate the child DOM to the top
			mark.setAnimation(google.maps.Animation.BOUNCE);
			yelpMarkerDetailUl.addClass('show').animate({
				scrollTop: yelpMarkerDetailPos
			}, 300);
			yelpMarkerDetailUl.find('.active').removeClass('active');
			activeYelpMarkerDetail.addClass('active');
		}
	}

	//add click event to the yelp-list ul li dom
	$('.results').find('li').click(function(){
		// get index of clicked element
		var pos = $(this).index();
		// iterate through allMarkers array
		for(am in allMarkers){
			var isMoving = allMarkers[am].getAnimation();
			// if marker is animated, remove animation
			if(isMoving && am !== pos){
				allMarkers[am].setAnimation(null);
			}
		}

		//Adds the Bounce animation to the marker that's clicked using Google Map's animation method 
		allMarkers[pos].setAnimation(google.maps.Animation.BOUNCE);
		//Removes the active className from the active Yelp-list ul li dom
		$('.results').find('.active').removeClass('active');
		//Adds the active className to the clicked element
		$(this).addClass('active');
	});	
}

//Calls the Yelp API and creates the map markers.
function yelpCall(searchNear, searchFor) {
	// For use for this class only.
	// You wouldn't actually want to expose your secrets like this in a real application.
	var auth = {
		consumerKey : "BzpesVW-QhQWzYm6iA8SOQ",
		consumerSecret : "5DIG4daEZKngvI6Zrc2wShZeWno",
		accessToken : "Jq7b8HJlTeQOyF5yM6KZOnqG6Jwun_uH",
		accessTokenSecret : "GlcGihVv1GGO9nSJUQEzbWQcefc",
		serviceProvider : {
			signatureMethod : "HMAC-SHA1"
		}
	};
	
	//Creates a variable for the OAuth.SignatureMethod
	var accessor = {
	    consumerSecret : auth.consumerSecret,
	    tokenSecret : auth.accessTokenSecret
	};
	
	var parameters = [];
	parameters.push(['term', searchFor]);
	parameters.push(['location', searchNear]);
	parameters.push(['callback', 'cb']);
	parameters.push(['oauth_consumer_key', auth.consumerKey]);
	parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
	parameters.push(['oauth_token', auth.accessToken]);
	parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
	
	var message = {
	    'action' : 'http://api.yelp.com/v2/search',
	    'method' : 'GET',
	    'parameters' : parameters
	};
	
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);
	
	var parameterMap = OAuth.getParameterMap(message.parameters);
	settings(message.action, parameterMap);
}

//Ajax OAuth method to get Yelp's data
function settings(url, ydata){
	$.ajax({
		'url' : url,
		'data' : ydata,
		'dataType' : 'jsonp',
		'global' : true,
		'jsonpCallback' : 'cb',
		'success' : function(data){
			makeYelpList(data);
		}
	});
}

//	Function to create the list from Yelp's API
function makeYelpList(d){

	var $yelpList = $('.results');
			results = d.businesses,
			el = '';

	//Clear the yelpList to add new entries
	$yelpList.empty();

	//Create the markers Array object
	var markers = [];
	if(results.length > 0){	
		//Loops through the returned data and creates a variable to use in populating the Yelp li Dom
		for (result in results){
			var business = results[result],
				name = business.name,
				img = business.image_url,
				ph = /^\+1/.test(business.display_phone) ? business.display_phone : '',
				stars = business.rating_img_url,
				num = business.review_count,
				loc = {
					lat: business.location.coordinate.latitude,
					lng: business.location.coordinate.longitude,
					address: business.location.display_address[0] + '<br>' + business.location.display_address[business.location.display_address.length - 1]
				},
				review = {
					img: business.snippet_image_url,
					txt: business.snippet_text
				};

			//Creates the DOM object
			var makeEl = '<li><div class="heading row"><p class="col-sm-5 img-container">';
			
			makeEl += '<img src="' + stars + '" height=17 width=84 alt="Yelp Rating">';
			makeEl += '<img src="' + img + '" height=120 width=120 class="img-thumbnail">';
			makeEl += '<div class="col-sm-7">';
			makeEl += '<h4>' + name + '</h4>';
			makeEl += '<span>' + loc.address + '</span></p>';
			makeEl += '<p><strong>' + ph + '</strong></p>';
			makeEl += '<p>' + num + ' Reviews' + '</p>';
			makeEl += '</div></div></li>';
			
			//Adds the object to the el variable
			el += makeEl;

		//Creates the marker array object then adds markers						
	    var marker = [name, ph, loc.lat, loc.lng, review.img, review.txt];
	    markers.push(marker);
		}
		
		$yelpList.append(el);

		google.maps.event.addDomListener(window, 'load', addmapMarkers(markers));
		
	//Error message if no data comes back
	} else {
		$yelpList.addClass('open').append('<li><h3>Error finding results.</h3><p>Enter a different search.</p></li>');
		//Use google map api to clear the markers on the map
		google.maps.event.addDomListener(window, 'load', addmapMarkers(markers));
	}
}

//Calls the Google Maps function
initialize();

//Calls the Yelp function
yelpCall('48180', 'diners');

//---View Model---
function myViewModel() {
	var self = this;
	self.searchItem = ko.observable('Diners'); //Starts the search with displaying diners

	//Updates the view model
	self.updatedYelp = function(){
	//Returns the updated data from the search field
	//then runs the ajax function to create the yelp list
		ko.computed(function(){
			yelpCall('48180', self.searchItem());
		}, self);
	};
}

//Calls Knockout
ko.applyBindings(new myViewModel());