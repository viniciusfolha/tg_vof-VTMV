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
			var mySVG = d3.select("body")
	    				.append("svg")
	    				.attr("width","1100")
	    				.attr("height","600");

			var bar_chart = new BarChart("barchart1",mySVG,100,100,400,300);

			var line_chart = new LineChart("linechart1",mySVG,600,100,400,300);

			map.setData(data, configData);
			bar_chart.setData(data,configData.nomes);
			line_chart.setData(data, configData.nomes);




		})
		
}







