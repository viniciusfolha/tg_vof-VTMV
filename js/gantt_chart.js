class GanttChart{
	constructor(id,container,x,y,width,height){
		this.id = id;
	    this.margin = {top: 3, right: 2, bottom: 30, left: 60};  
	    this.x = x;
	    this.y = y;
	    this.totalWidth  = width;
	    this.totalHeight = height;
	    this.width = this.totalWidth - this.margin.left - this.margin.right;
	    this.height = this.totalHeight - this.margin.top - this.margin.bottom;
	    this.time = [];

	    this.canvas = container.append("g")
	    	.attr("class", "gannt")
	    	.attr("transform","translate(" + (this.x + this.margin.left) + "," + (this.y + this.margin.top) + ")");

	    this.xScale = d3.scaleTime().range([0, this.width]).clamp(true);
    	this.yScale = d3.scaleBand().range([0, this.height]),
    	
    	//this.zScale = d3.scaleOrdinal(d3.schemeCategory20b);

	    this.data = [];

	    this.xAxisGroup = this.canvas.append("g")
	      .attr("class","xAxis")
	      .attr("transform","translate(0,"+this.height+")");
	    this.xAxis = d3.axisBottom(this.xScale);

	    this.xAxisGroup.call(this.xAxis);

	    

	  
	    this.yAxisGroup = this.canvas.append("g")
	      .attr("class","yAxis")
	      .attr("transform","translate(0,0)");

	    this.yAxis = d3.axisLeft(this.yScale);

	    this.yAxisGroup.call(this.yAxis);
	    this.opcoes;

	   	this.toline ;
	   	this.dataYear;

	   	this.selected;
		this.opcoes;

  		this.selectList = document.createElement("select");
  		this.selectList.id = "comboboxLine";
  		this.bargantt = this.canvas.append("g")
  			.attr("class", "bargantt");


  		this.heightCont = 30;
  		this.xScaleCont = d3.scaleTime().range([0, this.width]);
  		this.yScaleCont = d3.scaleLinear().range([this.heightCont,0]);
  		this.xAxisCont = d3.axisBottom(this.xScaleCont);
  		this.yAxisCont = d3.axisLeft(this.yScaleCont);

		this.brush = d3.brushX()
		    .extent([[0, 0], [this.width, this.heightCont]])
		    .on("brush end", this.brushed.bind(this));

		this.zoom = d3.zoom()
			.scaleExtent([1, Infinity])
			.translateExtent([[0, 0], [this.width, this.height]])
			.extent([[0, 0], [this.width, this.height]])
			.on("zoom", this.zoomed.bind(this));

		this.context = this.canvas.append("g")
		    .attr("class", "context")
		    .attr("transform", "translate(" + 0 + "," + (this.height + 20) +")");

		this.color  = d3.scaleOrdinal(d3.schemeCategory20b);
		this.dataYear;
	}

	setData(data,opcoes){
	    this.data = data;
	    this.opcoes = opcoes;

	    this.selected = this.opcoes[0];
        var that = this;
        var div = document.getElementById(this.id);
        
        div.appendChild(this.selectList);
        
	    for (var i = 0; i < this.opcoes.length; i++) {
	        var option = document.createElement("option");
	        option.value = this.opcoes[i];
	        option.text = this.opcoes[i];
	        this.selectList.appendChild(option);
	    }
	    //this.selectList.onchange = this.changeComboBox.bind(that);


	    var names = data.map(function(d){return d.idObj});



	    this.xScale.domain([
		    d3.min(this.data, function(c) { c.startDate = d3.min(c.trajetoria, function(d) { return d.datahora; });   return c.startDate; }),
		    d3.max(this.data, function(c) { c.endDate = d3.max(c.trajetoria, function(d) { return d.datahora; });  return c.endDate; })
		]);

	  	

	    this.yScale.domain(names);

	    //this.zScale.domain(this.data.map(function(c) { return c.idObj; }));
	    

	    this.xAxis = d3.axisBottom(this.xScale);

	    this.xAxis.scale(this.xScale);
	    this.yAxis.scale(this.yScale);

		this.xAxisGroup.call(this.xAxis);
		this.yAxisGroup.call(this.yAxis);	    
		this.bargantt.selectAll(".bargantt")
	      .data(this.data)
          .enter().append("rect")
          .attr("class", "rect_gannt")
          .attr("y", function(d) { return that.yScale(d.idObj); })
          .attr("height", that.yScale.bandwidth())
          .attr("x", function(d) { return that.xScale(d.startDate); })
          .attr("width", function(d) { return that.xScale(d.endDate) - that.xScale(d.startDate)})
          .attr("fill", function(d) { return that.color(d.idObj); })
        

	    this.dataYear = d3.nest()
                  .key(function(d) { return d.trajetoria[0].datahora.getFullYear() })
                  .entries(this.data);
       	console.log(this.dataYear);
        var auxDateDomain = d3.extent(this.dataYear.map(function(d){return d.key}));
        var dt1 = new Date(auxDateDomain[0])
        var dt2 = new Date(auxDateDomain[1])
        this.xScaleCont.domain([dt1,dt2]);
        this.yScaleCont.domain([ 0 
        							, d3.max(this.dataYear, function(c) { return c.values.length; }) ]);
        
        

       
        var area = d3.area()
        	.defined(function(d) { return d; })
        	.curve(d3.curveStep)
		    .x(function(d) {  return that.xScaleCont( new Date (d.key)); })
		    .y1(function(d) { return that.yScaleCont(d.values.length); });
		area.y0(that.yScaleCont(0));

		
	    this.context.append("g")
	    	.append("path")
	    	.datum(this.dataYear)
	    	.attr("fill", "steelblue")
			.attr("d", area);
        
        this.context.append("g")
			.attr("class", "xAxis")
			.attr("transform", "translate(0," + this.heightCont + ")")
			.call(this.xAxisCont);
		this.yAxisCont.tickValues(this.yScaleCont.domain());
		this.context.append("g")
			.attr("class", "yAxis")
			.attr("transform", "translate(0,0)")
			.call(this.yAxisCont);
	    this.context.append("g")
			.attr("class", "brush")
			.call(this.brush)
			.call(this.brush.move, this.xScale.range());
		
		this.canvas.append("rect")
	      .attr("class", "zoom")
	      .attr("width", this.width)
	      .attr("height", this.height)
	      .attr("fill","none")
	      .attr("pointer-events","all")
	      .call(this.zoom);
	      
	    


	

		//this.do_grid();
	    //this.update();

  	}

  	zoomed() {
	  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
	  
	  var that = this;
	  var t = d3.event.transform;
	  this.xScale.domain(t.rescaleX(this.xScaleCont).domain());
	  that.time = this.xScale.domain();
	  var datafiltered = this.data.filter(function(d){return !(that.time[0] > d.endDate || d.startDate > that.time[1]) })
	  var names = datafiltered.map(function(d){return d.idObj});
	  this.yScale.domain(names);

	   
	  this.yAxis.scale(this.yScale);

	  this.yAxisGroup.call(this.yAxis);	    


      this.bargantt.selectAll(".bargantt")
  		.data(datafiltered);

      this.bargantt.exit().remove()


	  this.bargantt.selectAll(".rect_gannt")
	  	  .attr("y", function(d) { return that.yScale(d.idObj); })
          .attr("height", that.yScale.bandwidth())
          .attr("x", function(d) { return that.xScale(d.startDate); })
          .attr("width", function(d) { return that.xScale(d.endDate) - that.xScale(d.startDate)})
          .attr("fill", function(d) { return that.color(d.idObj); });
	  this.xAxisGroup.call(this.xAxis);
	  this.context.select(".brush").call(this.brush.move, this.xScale.range().map(t.invertX, t));
	  that.time = this.xScale.domain();
	  if(this.dispatcher)
	    this.dispatcher.apply("selectionChanged",{callerID:that.id,time:that.time, datafiltered: datafiltered})
	}


	brushed() {
		if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoo
		var that = this;
		var s = d3.event.selection || this.xScaleCont.range();
		this.xScale.domain(s.map(this.xScaleCont.invert, this.xScaleCont));

		that.time = this.xScale.domain();
		var datafiltered = this.data.filter(function(d){return !(that.time[0] > d.endDate || d.startDate > that.time[1]) })
		var names = datafiltered.map(function(d){return d.idObj});
		this.yScale.domain(names);

	   
	  	this.yAxis.scale(this.yScale);

		this.yAxisGroup.call(this.yAxis);	    


        this.bargantt.selectAll(".bargantt")
  		.data(datafiltered);

        this.bargantt.exit().remove()
        

  		this.bargantt  		
  		.selectAll(".rect_gannt")  
		  .attr("y", function(d) { return that.yScale(d.idObj); })
          .attr("height", that.yScale.bandwidth())
          .attr("x", function(d) { return that.xScale(d.startDate); })
          .attr("width", function(d) { return that.xScale(d.endDate) - that.xScale(d.startDate)})
          .attr("fill", function(d) { return that.color(d.idObj); })
  		this.xAxisGroup.call(this.xAxis);
  		that.time = this.xScale.domain();
  		if(this.dispatcher)
	    this.dispatcher.apply("selectionChanged",{callerID:that.id,time:that.time, datafiltered: datafiltered})
	
	}




  	do_grid(){
		var that = this;
		function make_x_gridlines() {		
		    return d3.axisBottom(that.xScale)
		        .ticks(5)
		}

		// gridlines in y axis function
		function make_y_gridlines() {		
		    return d3.axisLeft(that.yScale)
		        .ticks(5)
		}


			  // add the X gridlines
	  	this.canvas.append("g")			
	      .attr("class", "grid")
	      .attr("transform", "translate(0," + this.height + ")")
	      .call(make_x_gridlines()
	          .tickSize(-this.height)
	          .tickFormat("")
	      )

	  // add the Y gridlines

	  	this.canvas.append("g")			
	      .attr("class", "grid")
	      .call(make_y_gridlines()
	          .tickSize(-this.totalWidth)
	          .tickFormat("")
	      )
          
	}


}