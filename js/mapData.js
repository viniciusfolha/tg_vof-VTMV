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
// RIO_BRT to new format
//var test = new Parser_RIO_BRT('data/RIO_BRT_GPS_T.json');
//test.data();




d3.json("data/RIO_BRT_GPS_T.json", function(error, data) {
	if (error) return console.warn(error);


	var info = L.control();

	info.onAdd = function (map) {
	    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	    this.update();
	    return this._div;
	};


	info.update = function (veiculo) {
	    this._div.innerHTML = '<h4>BRT</h4>' +  (veiculo ?
	        '<b> Linha: ' + veiculo.linha + '</b><br /> Velocidade:' + veiculo.velocidade + ' km / h'
	        : 'Hover over a circle');
	};

	info.addTo(map);



	var color  = d3.scaleOrdinal(d3.schemeCategory20b);

	// LENGENDA

	var linhas_L = d3.map(data.veiculos, function(d){return d.linha;}).keys()

	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

	    var div = L.DomUtil.create('div', 'info legend'),
	        grades = [],
	        labels = [];


	        div.innerHTML = '<h4>Linhas:</h4> '
	    for (var i = 0; i < linhas_L.length; i++) {

	        div.innerHTML +=
	            '<i style="background:' + color(linhas_L[i]) + '"></i> ' +
	            linhas_L[i] + (linhas_L[i+1] ? '<br>' : '');
	    }

	    return div;
	};

	legend.addTo(map);
















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
	
	var toLine = d3.line()
			.curve(d3.curveLinear)
			.x(function(d){
				return applyLatLngToLayer(d).x
			})
			.y(function(d){
				return applyLatLngToLayer(d).y
			});
	function applyLatLngToLayer(d) {
	    var y = d.latitude
	    var x = d.longitude
	    return map.latLngToLayerPoint(new L.LatLng(y, x))
	}
    var featureElement = g.selectAll("path")
            .data(data.veiculos)
            .enter()
            .append("path")
            .attr("class", "line")
            .attr('d', function(d){return toLine( data.veiculos.filter(x => x.linha === d.linha  ));}   )
			.attr("fill", "none")
	      	.attr("stroke", "red")
	      	.attr("stroke-linejoin", "round")
	      	.attr("stroke-linecap", "round")
	      	.attr("stroke-width", 1.5);
	

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