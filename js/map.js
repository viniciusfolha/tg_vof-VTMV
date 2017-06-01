class MapL{
	constructor(id, width, height, color){
		var that = this;

		this.color = color;
		var div = document.createElement("div");
		div.style.width = width +'px';
		div.style.height = height + 'px';
		div.id = id;
		document.body.appendChild(div);

		this.map = L.map(id).setView([-22.906323, -43.182386], 12);
		var mapLink =  '<a href="http://openstreetmap.org">OpenStreetMap</a>';
		        L.tileLayer(
		            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		            attribution: '&copy; ' + mapLink + ' Contributors',
		            maxZoom: 18,
		            }).addTo(this.map);

		L.svg().addTo(this.map);	
		this.svg = d3.select("#map").select("svg");
		this.g = this.svg.attr("id", "circles_layer").append("g");     


		L.svg().addTo(this.map);	
		var aux = d3.select("#map").selectAll("svg");
		this.newSVG = aux.filter(function (d, i) { return i === 1;})
		this.gLines = this.newSVG.attr("id", "lines_layer").append("g");

		this.data;
		this.info;
		this.idsObjs;
		this.legend;
		this.configData;
		this.circleGroup;
		this.featureL;
		this.toLine;


		this.legend = L.control({position: 'bottomright'});
	}

	setData(data, configData){
		this.map.setView([data[0].trajetoria[0].latitude,data[0].trajetoria[0].longitude],5);
		this.idsObjs = d3.map(data, function(d){return d.idObj;}).keys()
		this.data = data;
		this.configData = configData;
		this.createInfo();
		this.createLegend();
		this.createCircle(data);
		this.createLines()
		var that = this;
		//this.map.on("viewreset", this.update.bind(that));
		this.map.on("moveend", this.update.bind(that));
		
	}

	createCircle(data){
		var that = this;
		data.forEach(function(d) {
				d.trajetoria.forEach(function(e) {
					e.LatLng = new L.LatLng(e.latitude,
										e.longitude)
				})
				
		})	
		
		var featureC = this.g.selectAll("g")
				.data(data)
				.enter()
				.append('g')
				.attr("id", "groupOfCircles")
				.attr('idObj', function (d) {
					 return d.idObj;
				})
				.style("fill",  function(d) {return that.color(d.idObj); })

		this.circleGroup =	featureC.selectAll("circle")
					.data(function(d) {  return d.trajetoria; })
					.enter()
					.append("circle")
					.style("stroke", "black")  
					.style("opacity", 1) 
					.attr("r", 7)
					.on("mouseover", function(d) {
						
						var idObj = this.parentNode.getAttribute("idObj");
		    			that.info.update(d,idObj,that);
		    		})
					.on("mouseout", function(d){
						that.info.update();
					})
					.on("click", function(d){
						//
					})
					.attr("pointer-events","visible");  

					this.circleGroup.attr("transform", 
					     function(d) {
						 var pt = that.map.latLngToLayerPoint(d.LatLng);
					return "translate("+ 
						pt.x +","+ 
						pt.y +")";
					}
				)

	}
	createLines(){
		var that = this;
		this.toLine = d3.line()
				.curve(d3.curveLinear)
				.x(function(d){
					return that.map.latLngToLayerPoint(d.LatLng).x
				})
				.y(function(d){
					return that.map.latLngToLayerPoint(d.LatLng).y
				});

		this.featureL  = this.gLines.selectAll("path.line")
				.data(this.data).enter()
				.append("path")
				.attr("class", "line")
				.attr('d', function(d){  return that.toLine( d.trajetoria);}   )
				.attr("fill", "none")
		      	.attr("stroke", "red")
		      	.attr("stroke-linejoin", "round")
		      	.attr("stroke-linecap", "round")
		      	.attr("stroke-width", 1.5);
	}

	update(cnt) {
		
			var that = this;
			this.circleGroup.attr("transform", 
					     function(d) {
						 var pt = that.map.latLngToLayerPoint(d.LatLng);
					return "translate("+ 
						pt.x +","+ 
						pt.y +")";
					}
				)
				this.featureL.attr('d', function(d){  return that.toLine( d.trajetoria);} )
	}

	createLegend(){

		this.legend = L.control({position: 'bottomright'});
		var that = this;
		this.legend.onAdd = function (map) {

		    var div = L.DomUtil.create('div', 'info legend'),
		        grades = [],
		        labels = [];

		        div.id = "legend_id"
		        div.innerHTML = '<h4>Id Obj:</h4> '
		        
		    for (var i = 0; i < that.idsObjs.length; i++) {

		        div.innerHTML +=
		            '<i style="background:' + that.color(that.idsObjs[i]) + '"></i> ' +
		            that.idsObjs[i] + (that.idsObjs[i+1] ? '<br>' : '');
		    }
		    

		    L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation);
		    return div;
		};


		this.legend.addTo(this.map);
	}

	createInfo(){
		var that = this;
	
		this.info = L.control({position: 'bottomright'});
		this.info.onAdd = function (map) {
		    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		    this.update();
		    return this._div;
		};
		this.info.update = function (trajetoria, idObj,that) {

			if(idObj){
				
				this._div.innerHTML = '<h4>' + idObj + '</h4>';
				for ( var x in that.configData.nomes){
		    		this._div.innerHTML += '<b>'+ that.configData.nomes[x] +' : </b> ' + trajetoria[that.configData.nomes[x]] + '<br />'
		    	}
		    	this._div.innerHTML += '<b> Time :</b>' + trajetoria.datahora
			}else{
				this._div.innerHTML = '<h4>ID</h4>' + 'Hover over a circle';
			}
			

		};
		this.info.addTo(this.map);
	}





}