class MapL{
	constructor(id, width, height, color, divM){
		var that = this;

		this.color = color;
		var div = document.createElement("div");
		div.style.width = width +'px';
		div.style.height = height + 'px';
		div.id = id;
		
		divM.appendChild(div);

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
		this.legend2;
		this.configData;
		this.circleGroup;
		this.featureL;
		this.toLine;
		this.Selected;
		this.colorScale;
		this.segments;
		this.domainSelected;
		this.optionsDate = {  Weekday : {weekday: 'long'}, Year : {year: 'numeric'} , Month : {month: 'long'}, Day : {day: 'numeric'}, Hour : {"hour" : "numeric"} };
		this.legend = L.control({position: 'bottomright'});
	}

	setData(data, configData){
		this.map.setView([data[0].trajetoria[0].latitude,data[0].trajetoria[0].longitude],5);
		this.idsObjs = d3.map(data, function(d){return d.idObj;}).keys()
		this.data = data;
		this.configData = configData;
		
		/*
		this.createInfo();
		this.createLegend();
		this.createCircle(data);
		*/

		this.createLines()
		
		this.createLegend2();
		var that = this;
		//this.map.on("viewreset", this.update.bind(that));
		this.map.on("moveend", this.update.bind(that));
		
	}

	createCircle(data){
		var that = this;

		
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
					.attr("r", 3)
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
	reset(){
		var that = this;
		//this.circleGroup.remove();
		this.featureL.remove();
		
		//var test = this.data.filter(function(d){return !( time[0] > d.dateDomain[1] || d.dateDomain[0] > time[1]   );  })
		
		this.featureL = this.gLines.selectAll(".lines_group")
      			.data(this.data)
    			.enter().append("g").attr("class","lines_group" );

    	this.segments = this.featureL.selectAll("path")
      				.data(that.createsegments)
      			.enter().append("path")
      				.attr("d", that.toLine)
      				.style("stroke", function(d) {return that.colorScale( (d[0].wind + d[1].wind)/2 ) })
      				.attr("fill", "none")
      				.attr("stroke-linejoin", "round")
			      	.attr("stroke-linecap", "round")
			      	.attr("stroke-width", 1.5);

		
	}

	createsegments(values) {
		
	  var traj = values.trajetoria
	  var i = 0, n = traj.length, segments = new Array(n - 1);
	  while (++i < n) segments[i - 1] = [traj[i - 1], traj[i]];
	  
	  return segments;
	}

	createLines(){
		var that = this;
		this.domainSelected = [
		    d3.min(this.data, function(c) { return d3.min(c.trajetoria, function(d) { return d.wind; }); }),
		    d3.max(this.data, function(c) { return d3.max(c.trajetoria, function(d) { return d.wind }); })
		];

		this.colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
        .domain(this.domainSelected);

		this.toLine = d3.line()
				.curve(d3.curveLinear)
				.x(function(d){
					return that.map.latLngToLayerPoint(d.LatLng).x
				})
				.y(function(d){
					return that.map.latLngToLayerPoint(d.LatLng).y
				});
		this.featureL = this.gLines.selectAll(".lines_group")
      			.data(this.data)
    			.enter().append("g").attr("class","lines_group" );

    	this.segments = this.featureL.selectAll("path")
      				.data(that.createsegments)
      			.enter().append("path")
      				.attr("d", that.toLine)
      				.style("stroke", function(d) {return that.colorScale( (d[0].wind + d[1].wind)/2 ) })
      				.attr("fill", "none")
      				.attr("stroke-linejoin", "round")
			      	.attr("stroke-linecap", "round")
			      	.attr("stroke-width", 1.5);

	}

	update(cnt) {
		
			var that = this;
			/*
			this.circleGroup.attr("transform", 
					     function(d) {
						 var pt = that.map.latLngToLayerPoint(d.LatLng);
					return "translate("+ 
						pt.x +","+ 
						pt.y +")";
					}
				)
			*/		
				this.segments.attr("d", that.toLine)
      				
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

	createLegend2(){

		this.legend2 = L.control({position: 'bottomleft'});
		var that = this;
		var color = d3.scaleQuantize()
		  .domain(this.domainSelected)
		  .range(d3.schemeRdYlGn['8'])


		this.legend2.onAdd = function (map) {

		    var div = L.DomUtil.create('div', 'info legend2'),
		        grades = d3.schemeRdYlGn['8'],
		        labels = [];

		        div.id = "legend_id2"
		        div.innerHTML = '<h4>Velocidade:</h4> '
		       
		    for (var i = 0; i < grades.length; i++) {
		    	var aux = color.invertExtent(grades[i]);

		        div.innerHTML +=
		            '<i style="background:' + grades[i] + '"></i> ' +
		             aux[0].toFixed(2) + (aux[1].toFixed(2) ? ' &ndash; ' + aux[1].toFixed(2) + '<br>' : '+');
		    }
		    

		    //L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation);
		    return div;
		};


		this.legend2.addTo(this.map);
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

	setDomainRange(datafiltered){
		var that = this;
		//this.circleGroup.remove();
		this.featureL.remove();
		
		//var test = this.data.filter(function(d){return !( time[0] > d.dateDomain[1] || d.dateDomain[0] > time[1]   );  })
		
		this.featureL = this.gLines.selectAll(".lines_group")
      			.data(datafiltered)
    			.enter().append("g").attr("class","lines_group" );

    	this.segments = this.featureL.selectAll("path")
      				.data(that.createsegments)
      			.enter().append("path")
      				.attr("d", that.toLine)
      				.style("stroke", function(d) {return that.colorScale( (d[0].wind + d[1].wind)/2 ) })
      				.attr("fill", "none")
      				.attr("stroke-linejoin", "round")
			      	.attr("stroke-linecap", "round")
			      	.attr("stroke-width", 1.5);


	}

	setDomain(time, timeType){
		var that = this;
		this.circleGroup.style("opacity", 0.05);
		this.segments.style("opacity", 0.05);
		this.circleGroup.filter(function(d){  return ( d.datahora.toLocaleString("en-us", that.optionsDate[timeType] ) == time ) })
  			.style("opacity", 1)
  			console.log(time)
  		this.segments.filter(function(d){ return ( (d[0].datahora.toLocaleString("en-us", that.optionsDate[timeType] ) == time  && d[1].datahora.toLocaleString("en-us", that.optionsDate[timeType] ) == time )  ) })
  		.style("opacity", 1)
	}

	rename_attr(obj, old_name, new_name) {
      if (obj.hasOwnProperty(old_name)) {
          obj[new_name] = obj[old_name];
          delete obj[old_name];
      }
	}



}