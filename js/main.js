var pathData = "data/hurdat2-1851-2016_CONVERTED.json";
var pathConfig = "data/hur.config";
var configData;
var datum;

readConfig(pathConfig);

function readConfig(pathConfig){
	d3.json(pathConfig, function(error, data) {
		if (error) return console.warn(error);
		configData = data;
		readData();
		
	})
}

function readData(){
		
		d3.json(pathData, function(error, data) {
			if (error) return console.warn(error);
			datum = data;


			//Formating the TIME
			if(configData.datahora == "default"){
				var formatT = d3.timeParse ('%Y%m%d-%H%M')
				data.forEach(function(d){
					configData.nomes.forEach(function(e,i){
						d["mean_".concat(e)] = 0;
					})
					d.trajetoria.forEach(function(e){ e.datahora = formatT(e.datahora); 
													e.LatLng = new L.LatLng(e.latitude, e.longitude);
													configData.nomes.forEach(function(z,i){
														d["mean_".concat(z)] += e[z] ; 
													});

								});
					/*configData.nomes.forEach(function(e,i){
						d["mean_".concat(e)] = d3.sum(d.trajetoria.map(function(z){return z[e]}) ) / d.trajetoria.length;
					})*/
					configData.nomes.forEach(function(e,i){
						d["mean_".concat(e)] /= d.trajetoria.length;
					})
					

					d.dateDomain = d3.extent(d.trajetoria.map(function(c){return c.datahora}));  
				})
			}else{
				data.forEach(function(d){
					configData.nomes.forEach(function(e,i){
						d["mean_".concat(e)] = 0;
					})
					d.trajetoria.forEach(function(e){
													e.LatLng = new L.LatLng(e.latitude, e.longitude);
													configData.nomes.forEach(function(z,i){
														d["mean_".concat(z)] += e[z] ; 
													});

								});
					/*configData.nomes.forEach(function(e,i){
						d["mean_".concat(e)] = d3.sum(d.trajetoria.map(function(z){return z[e]}) ) / d.trajetoria.length;
					})*/
					configData.nomes.forEach(function(e,i){
						d["mean_".concat(e)] /= d.trajetoria.length;
					})
					

					d.dateDomain = d3.extent(d.trajetoria.map(function(c){return c.datahora}));  
				})
			}

			data = data.filter(function(d){return d.trajetoria[0].datahora.getFullYear() >= 1970});
			
			var color  = d3.scaleOrdinal(d3.schemeCategory20b);


			var div = document.createElement("div");
			div.style.width = 1200 +'px';
			div.style.height = 600 + 'px';
			div.style.position = "relative";
			div.style.display =  "inline";
			div.id = "mapMain";
			div.style.float='left';
			var divM =  document.createElement("div");
			divM.style.width = 100 +'%';
			divM.id = "divMain";
			document.body.appendChild(divM);
			divM.appendChild(div);
			var map = new MapL("map",1200,600, color, div);
			

			var divG =  document.createElement("div");
			divG.style.height = 600 + 'px';
			divG.style.position = "relative";
			divG.style.display =  "inline";
			divG.style.height = 600 + 'px';
			divG.id = "divGraph";
			divG.style.float='left';
			divM.appendChild(divG);

			var div = document.createElement("div");
			div.style.width = 600 +'px';
			div.style.height = 300 + 'px';
			div.id = "barchart1";

			divG.appendChild(div);

			var mySVG = d3.select("#barchart1")
	    				.append("svg")
	    				.attr("width","500")
	    				.attr("height","300");

			var bar_chart = new BarChart("barchart1",mySVG,0,10,400,278);


			var div = document.createElement("div");
			div.style.width = 600 +'px';
			div.style.height = 300 + 'px';
			div.id = "linechart1";
						div.style.position = "absolute";
			div.style.display =  "inline";
			divG.appendChild(div);

			var mySVG2 = d3.select("#linechart1")
	    				.append("svg")
	    				.attr("width","500")
	    				.attr("height","300");



			var line_chart = new LineChart("linechart1",mySVG2,0,10,450,300);

			map.setData(data, configData);
			
			bar_chart.setData(data,configData.nomes);
			line_chart.setData(data, configData.nomes);

			var myDispatcher = d3.dispatch("selectionChanged");




/*
			//GANTT
			var div =  document.createElement("div");
			div.style.width = 100 +'%';
			div.id = "ganttchart";
			document.body.appendChild(div);
			var t = document.body.clientWidth; 
			var mySVG3 = d3.select("#ganttchart")
	    				.append("svg")
	    				.attr("width",t)
	    				.attr("height","400");
	    	var gantt_chart = new GanttChart("ganttchart",mySVG3,0,0,t,300);
	    	gantt_chart.setData(data,configData.nomes);
*/
	    	myDispatcher.on("selectionChanged", function(){
				
			    if(this.callerID === "canvas"){

					//line_chart.setDomainRange(this.datafiltered);
					map.setDomainRange(this.datafiltered);
				}
			    if(this.callerID === "barchart1"){
					if(!this.returnB){
						map.setDomainRange(this.datafiltered);
						line_chart.setDomainRange(this.datafiltered);
					}else{
						map.reset();
						line_chart.reset();
					}

			    }
				

				
			});
	    	map.dispatcher - myDispatcher;
	    	//gantt_chart.dispatcher = myDispatcher;
	    	bar_chart.dispatcher = myDispatcher;
	    	

	    	var div =  document.createElement("div");
			div.style.width = 100 +'%';
			div.id = "canvas";
			document.body.appendChild(div);
			var t = document.body.clientWidth; 
			var novoGannt  = new GanttChartCanvas(div.id, 0,0,t, 340);
			novoGannt.dispatcher = myDispatcher;
			novoGannt.setData(data,configData.nomes);











		})
		
}







