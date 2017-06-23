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
					d.trajetoria.forEach(function(e){e.datahora = formatT(e.datahora); })
				})
			}
		
			
			var color  = d3.scaleOrdinal(d3.schemeCategory20b);

			var map = new MapL("map",600,400, color);

			var divM =  document.createElement("div");
			divM.style.width = 100 +'%';
			divM.id = "divMain";
			
			document.body.appendChild(divM);

			var div = document.createElement("div");
			div.style.width = 600 +'px';
			div.style.height = 500 + 'px';
			div.id = "barchart1";
			div.style.position = "relative";
			div.style.display =  "inline";
			divM.appendChild(div);

			var mySVG = d3.select("#barchart1")
	    				.append("svg")
	    				.attr("width","500")
	    				.attr("height","400");

			var bar_chart = new BarChart("barchart1",mySVG,0,20,400,300);


			var div = document.createElement("div");
			div.style.width = 600 +'px';
			div.style.height = 500 + 'px';
			div.id = "linechart1";
			div.style.display =  "inline";
			divM.appendChild(div);

			var mySVG2 = d3.select("#linechart1")
	    				.append("svg")
	    				.attr("width","500")
	    				.attr("height","400");



			var line_chart = new LineChart("linechart1",mySVG2,0,50,400,300);

			map.setData(data, configData);
			bar_chart.setData(data,configData.nomes);
			line_chart.setData(data, configData.nomes);

			var myDispatcher = d3.dispatch("selectionChanged");





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

	    	myDispatcher.on("selectionChanged", function(){
				
			    if(this.callerID === "ganttchart"){
					line_chart.setDomain(this.time, this.datafiltered);
					map.setDomain(this.time);
				}
			    if(this.callerID === "")
				//mySCT1.setSelected(this.selectedIndices);
				console.log("IUIUIUIU")

				
			});
	    	map.dispatcher - myDispatcher;
	    	gantt_chart.dispatcher = myDispatcher;
	    	













		})
		
}







