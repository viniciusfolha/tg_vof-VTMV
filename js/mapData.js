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
var configData;
var dados;

readConfig("data/brt.config");
	/* Initialize the SVG layer */
	/* We simply pick up the SVG from the map object */

function readConfig(path){
	d3.json(path, function(error, data) {
		if (error) return console.warn(error);
		configData = data;
		readdata();
		
	})
}

function readdata(){

	d3.json("data/RIO_BRT_ALL_CONVERTED2.json", function(error, data) {
		if (error) return console.warn(error);

		
		
		var info = L.control({position: 'bottomright'});

		info.onAdd = function (map) {
		    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		    this.update();
		    return this._div;
		};


		info.update = function (trajetoria, idObj) {
			if(idObj){
				this._div.innerHTML = '<h4>' + idObj + '</h4>';
				for ( x in configData.nomes){
		    		this._div.innerHTML += '<b>'+ configData.nomes[x] +' : </b> ' + trajetoria[configData.nomes[x]] + '<br />'
		    	}
		    	this._div.innerHTML += '<b> Time :</b>' + trajetoria.datahora
			}else{
				this._div.innerHTML = '<h4>ID</h4>' + 'Hover over a circle';
			}
			

		};

		info.addTo(map);



		var color  = d3.scaleOrdinal(d3.schemeCategory20b);

		// LENGENDA

		var idsObjs = d3.map(data, function(d){return d.idObj;}).keys()
		
		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

		    var div = L.DomUtil.create('div', 'info legend'),
		        grades = [],
		        labels = [];

		        div.id = "legend_id"
		        div.innerHTML = '<h4>Linhas:</h4> '
		        
		    for (var i = 0; i < idsObjs.length; i++) {

		        div.innerHTML +=
		            '<i style="background:' + color(idsObjs[i]) + '"></i> ' +
		            idsObjs[i] + (idsObjs[i+1] ? '<br>' : '');
		    }
		    


		    return div;
		};


		legend.addTo(map);
		var elem = L.DomUtil.get('legend_id');
		L.DomEvent.on(elem, 'mousewheel', L.DomEvent.stopPropagation);


	//BAR_CHART
		 
		var mySVG =
	    d3.select("body")
	    	.append("svg")
	    	.attr("width","1100")
	    	.attr("height","600");

		var bar_chart = new BarChart("barchart1",mySVG,100,100,400,300,configData.nomes);
		var dados_chart = [];

		var dados_chart0 = data.map(function(d){ return (d.trajetoria)});

		var dados_chart1 = data.map(function(d){ return (d.trajetoria )});
		var dados_chart = []
		dados_chart = data.map(function (e) {
							 return(e.trajetoria.map(function(t){
								return [e.idObj , t.velocidade];
							}))
	    				
					});

		dados_chart = [].concat.apply([], dados_chart);
		
		bar_chart.setData(data);


	//LINE_CHART

		var line_chart = new LineChart("linechart1",mySVG,600,100,400,300);
		dados_line1 = data.map(function(d){ return d.datahora });
		var dados_line = dados_line1.map(function (e, i) {
	    				return {datahora : e, velocidade: dados_chart1[i]};
					});
		//line_chart.setData(dados_line);




	// CIRCLE

		data.forEach(function(d) {
				d.trajetoria.forEach(function(e) {
					e.LatLng = new L.LatLng(e.latitude,
										e.longitude)
				})
				
		})	
		
		var featureC = g.selectAll("g")
				.data(data)
				.enter()
				.append('g')
				.attr("id", "groupOfCircles")
				.attr('idObj', function (d) {
					 return d.idObj;
				})
				.style("fill",  function(d) {return color(d.idObj); })

		var circleGroup =	featureC.selectAll("circle")
					.data(function(d) {  return d.trajetoria; })
					.enter()
					.append("circle")
					.style("stroke", "black")  
					.style("opacity", 1) 
					.attr("r", 7)
					.on("mouseover", function(d) {
						idObj = this.parentNode.getAttribute("idObj");
		    			info.update(d,idObj);
		    		})
					.on("mouseout", function(d){
						info.update();
					})
					.on("click", function(d){
						//
					})
					.attr("pointer-events","visible");  

		
		//LINE
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
		};

		var featureL  = g.selectAll("path.line")
				.data(data).enter().append("path")
				.attr("class", "line")
				.attr('d', function(d){  return toLine( d.trajetoria);}   )
				.attr("fill", "none")
		      	.attr("stroke", "red")
		      	.attr("stroke-linejoin", "round")
		      	.attr("stroke-linecap", "round")
		      	.attr("stroke-width", 1.5);
	

		map.on("viewreset", update);
		map.on("moveend", update);
		update();

		function update() {
				circleGroup.attr("transform", 
					     function(d) {
						 var pt = map.latLngToLayerPoint(d.LatLng);
					return "translate("+ 
						pt.x +","+ 
						pt.y +")";
					}
				)
				featureL.attr('d', function(d){  return toLine( d.trajetoria);} )
		}



	})
}
;