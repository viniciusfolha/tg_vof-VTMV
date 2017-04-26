var map = L.map('map').setView([-22.906323, -43.182386], 12);
		        mapLink = 
		            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
		        L.tileLayer(
		            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		            attribution: '&copy; ' + mapLink + ' Contributors',
		            maxZoom: 18,
		            }).addTo(map);


L.svg().addTo(map);	
var svg = d3.select("#map").select("svg");
var g = svg.append("g");

	/* Initialize the SVG layer */
	/* We simply pick up the SVG from the map object */

//////////////////



d3.json("data/RIO_BRT_GPS.json", function(error, data) {
	if (error) return console.warn(error);


	var info = L.control();

	info.onAdd = function (map) {
	    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	    this.update();
	    return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info.update = function (veiculo) {
	    this._div.innerHTML = '<h4>BRT</h4>' +  (veiculo ?
	        '<b> Linha: ' + veiculo.linha + '</b><br /> Velocidade:' + veiculo.velocidade + ' km / h'
	        : 'Hover over a circle');
	};

	info.addTo(map);

	var color  = d3.scaleOrdinal(d3.schemeCategory20b);
	data.veiculos.forEach(function(d) {
			
			d.LatLng = new L.LatLng(d.latitude,
									d.longitude)
									})	
	var feature = g.selectAll("circle")
			.data(data.veiculos)
			.enter().append("circle")
			.style("stroke", "black")  
			.style("opacity", 1) 
			.style("fill",  function(d) { return color(d.linha); })
			.attr("r", 8)
			.on("mouseover", function(d) {
    			info.update(d);
    		})
			.on("mouseout", function(d){
				info.update();
			})
			.on("click", function(d){
				//
			})
			.attr("pointer-events","visible");  

	map.on("viewreset", update);
	map.on("moveend", update);
	update();

	function update() {
			feature.attr("transform", 
				     function(d) {
					 var pt = map.latLngToLayerPoint(d.LatLng);
				return "translate("+ 
					pt.x +","+ 
					pt.y +")";
				}
			)
	}



})

;