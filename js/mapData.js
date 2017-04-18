var map = L.map('map').setView([-22.906323, -43.182386], 12);
		        mapLink = 
		            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
		        L.tileLayer(
		            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		            attribution: '&copy; ' + mapLink + ' Contributors',
		            maxZoom: 18,
		            }).addTo(map);
	/* Initialize the SVG layer */
	/* We simply pick up the SVG from the map object */
var svg = d3.select(map.getPanes().overlayPane).append("svg"),
g = svg.append("g").attr("class", "leaflet-zoom-hide");

d3.json("data/RIO_BRT_GPS.json", function(error, data) {
	if (error) return console.warn(error);

	
	data.veiculos.forEach(function(d) {
			//console.log(d.latitude);
			d.LatLng = new L.LatLng(d.latitude,
									d.longitude)
									})	
	var feature = g.selectAll("circle")
			.data(data.veiculos)
			.enter().append("circle")
			.style("stroke", "black")  
			.style("opacity", 1) 
			.style("fill", "red")
			.attr("r", 3);  

	map.on("viewreset", update);
	map.on("moveend", update);
	update();

	function update() {
			feature.attr("transform", 
			function(d) { 
				return "translate("+ 
					map.latLngToLayerPoint(d.LatLng).x +","+ 
					map.latLngToLayerPoint(d.LatLng).y +")";
				}
			)
	}



})

;