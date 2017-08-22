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
    	this.yScale = d3.scaleTime().range([this.height,0 ]).clamp(true);
    	
    	//this.zScale = d3.scaleOrdinal(d3.schemeCategory20b);

	    this.data = [];

	    this.xAxisGroup = this.canvas.append("g")
	      .attr("class","xAxis")
	      .attr("transform","translate(0,"+this.height+")");

	    this.xAxis = d3.axisBottom(this.xScale)
	    .tickSize(16, 0)
    	.tickFormat(d3.timeFormat("%B"));

	    this.xAxisGroup.call(this.xAxis);

	    

	  
	    this.yAxisGroup = this.canvas.append("g")
	      .attr("class","yAxis")
	      .attr("transform","translate(0,0)");

	    this.yAxis = d3.axisLeft(this.yScale);

	    this.yAxisGroup.call(this.yAxis);



	    this.bigRects;
	   	this.ganntyear;


  		this.selectList = document.createElement("select");
  		this.selectList.id = "comboboxLine";
  		this.bargantt = this.canvas.append("g")
  			.attr("class", "bargantt");


  		this.heightCont = 30;
  		this.xScaleCont = d3.scaleTime().range([0, this.width]);
  		this.yScaleCont = d3.scaleLinear().range([this.heightCont,0]);
  		this.xAxisCont = d3.axisBottom(this.xScaleCont).ticks(20);
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
		this.color;
	}

	setData(data,opcoes){
	    this.data = data;
	  

	   
        var that = this;



	    


	    this.dataYear = d3.nest()
                  .key(function(d) { return d.trajetoria[0].datahora.getFullYear() })
                  .entries(this.data);
       	var auxDateDomain = d3.extent(this.dataYear.map(function(d){return d.key}));

        var dt1 = new Date(auxDateDomain[0])

        var dt2 = new Date(auxDateDomain[1],11,31);
        var diffYear = Math.floor ( (dt2 - dt1) / 31536000000);

        this.xScaleCont.domain([dt1,dt2]);
        this.yScaleCont.domain([ 0 
        							, d3.max(this.dataYear, function(c) { return c.values.length; }) ]);
        
        
		this.xScale.domain([new Date(2012, 0, 1), new Date(2012, 11, 31)]);

	    this.yScale.domain(this.xScaleCont.domain());


	    this.xAxis.scale(this.xScale);
	    this.yAxis.scale(this.yScale);
	    
		this.xAxisGroup.call(this.xAxis);
		this.xAxisGroup.selectAll(".tick text")
    		.style("text-anchor", "start")
    		.attr("x", 6)
    		.attr("y", 6);

		this.yAxisGroup.call(this.yAxis);
		var t = this.height/diffYear  ;  

		this.color  = d3.scaleOrdinal(d3.schemeCategory20b);
		this.bigRects = this.canvas.append("g").attr("class", "bigrect")
		    .selectAll("rect")
		   .data(this.dataYear)
		   .enter()
		   .append("rect")
		   .attr("x", 0)
		   .attr("y", function(d, i){
		      return i*t ;
		  })
		   .attr("width", function(d){
		      return that.width;
		   })
		   .attr("height",t )
		   .attr("stroke", "none")
		   .attr("fill", function(d,i){
		   	
		          return that.color(i);
		    
		   })
		   .attr("opacity", 0.2);


		this.ganntyear = this.bargantt.selectAll(".ganntyear")
					.data(this.dataYear).enter().append("g").attr("class", "ganntyear");


		this.ganntyear.selectAll("rect")
	      .data(function(d){return d.values })
          .enter().append("rect")
          .attr("class", "rect_gannt")
          .attr("y", function(d,i,j) { return that.yScale(new Date(d.trajetoria[0].datahora.getFullYear(),0)) - (i+1)*(t/j.length) })
          .attr("height", function(d,i,j){ return t/j.length})
          .attr("x", function(d) {var dtaux = new Date(d.dateDomain[0].getTime()); return that.xScale(dtaux.setFullYear(2012)); })
          .attr("width", function(d) {var dtaux = new Date(d.dateDomain[0].getTime());
          							  var dtaux1 = new Date(d.dateDomain[1].getTime());
          							 return that.xScale(dtaux1.setFullYear(2012)) - that.xScale(dtaux.setFullYear(2012))})
          .attr("fill", function(d) { return that.color(d.dateDomain[0].getFullYear()); })
        

       
        var area = d3.area()
        	.defined(function(d) { return d; })
        	.curve(d3.curveStepBefore)
		    .x(function(d) { return that.xScaleCont( new Date (d.key,11,31)); })
		    .y1(function(d) { return that.yScaleCont(d.values.length); });
		area.y0(that.yScaleCont(0));
	
		this.dataYear.unshift({key : (dt1.getFullYear()) , values: [0]} );
	    this.context.append("g")
	    	.append("path")
	    	.datum(this.dataYear)
	    	.attr("fill", "steelblue")
			.attr("d", area);
      this.dataYear.shift();

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
			.call(this.brush.move, this.xScaleCont.range());
		
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
	  this.yScale.domain(t.rescaleX(this.xScaleCont).domain());
	  that.time = this.yScale.domain();
	  this.context.select(".brush").call(this.brush.move, this.xScale.range().map(t.invertX, t));

	  

		
		var datafiltered = this.dataYear.filter(function(d){ var dtaux = new Date(d.key,11,31); return (that.time[0] <=  dtaux && that.time[1] >= dtaux)  })
		datafiltered.forEach(function(d){
								
								d.value = d.values.filter(function(e){ return !(that.time[0] > e.dateDomain[1] || e.dateDomain[0] > that.time[1]) ; })
										}
							);
				
	  this.yAxis.scale(this.yScale);

	  this.yAxisGroup.call(this.yAxis);	  

	  this.bigRects.remove();



        var dt1 = this.yScale.domain()[0];

        var dt2 = this.yScale.domain()[1];

        dt1.setUTCMonth(0,1);
        dt2.setUTCMonth(11,31);
        var diffYear = Math.ceil ( ((dt2 - dt1) / 31536000000));
        var t = this.height/diffYear  ; 

        this.bigRects = this.canvas.selectAll(".bigrect")
        
		this.bigRects = this.bigRects.selectAll("rect")
		   .data(datafiltered)
		   .enter()
		   .append("rect")
		   .attr("x", 0)
		   .attr("y", function(d, i){
		      return i*t ;
		  })
		   .attr("width", function(d){
		      return that.width;
		   })
		   .attr("height",t )
		   .attr("stroke", "none")
		   .attr("fill", function(d,i){
		   	
		          return that.color(i);
		    
		   })
		   .attr("opacity", 0.2);



		this.ganntyear.remove();

		this.ganntyear = this.bargantt.selectAll(".ganntyear")
					.data(datafiltered).enter().append("g").attr("class", "ganntyear");;
		
		
		//Melhorar
		this.ganntyear.selectAll("rect")
	      .data(function(d){ return d.value })
          .enter().append("rect")
          .attr("class", "rect_gannt")
          .attr("y", function(d,i,j) { return that.yScale(new Date(d.trajetoria[0].datahora.getFullYear(),0)) - (i+1)*(t/j.length) })
          .attr("height", function(d,i,j){ return t/j.length})
          .attr("x", function(d) {var dtaux = new Date(d.dateDomain[0].getTime()); return that.xScale(dtaux.setFullYear(2012)); })
          .attr("width", function(d) {var dtaux = new Date(d.dateDomain[0].getTime());
          							  var dtaux1 = new Date(d.dateDomain[1].getTime());
          							 return that.xScale(dtaux1.setFullYear(2012)) - that.xScale(dtaux.setFullYear(2012))})
          .attr("fill", function(d) { return that.color(d.dateDomain[0].getFullYear()); })


        var auxDatafilt = this.data.filter(function(d){var val = ( that.time[0] > d.dateDomain[1] || d.dateDomain[0] > that.time[1]   ); 
	  													 return !val ;});

	  if(this.dispatcher)
	    this.dispatcher.apply("selectionChanged",{callerID:that.id,time:that.time, datafiltered: auxDatafilt})
	
	}


	brushed() {
		if(this.dispatcher){
			if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom" && d3.event.sourceEvent.type === "start") return; // ignore brush-by-zoo
			var that = this;
			 
			var s = d3.event.selection || this.xScaleCont.range();

			this.yScale.domain(s.map(this.xScaleCont.invert, this.xScaleCont));
			
			//this.xScale.domain(s.map(this.xScaleCont.invert, this.xScaleCont));

			that.time = this.yScale.domain();
			

	        var auxDatafilt = this.data.filter(function(d){var val = ( that.time[1] < d.dateDomain[0] || d.dateDomain[1] < that.time[0]   ); 
		  													 return !val ;});
	     
			var datafiltered = d3.nest()
                  .key(function(d) { return d.trajetoria[0].datahora.getFullYear() })
                  .entries(auxDatafilt);
			
			/*
			var datafiltered = this.dataYear.filter(function(d){ var dtaux = new Date(d.key,11,31); return (that.time[0] <=  dtaux && that.time[1] >= dtaux)  })
			datafiltered.forEach(function(d){
									
									d.value = d.values.filter(function(e){ return !(that.time[0] > e.dateDomain[1] || e.dateDomain[0] > that.time[1]) ; })
											}

								);
			*/		
			
			


		  	this.yAxis.scale(this.yScale);

			this.yAxisGroup.call(this.yAxis);

			//this.bigRects.remove();



	        var dt1 = this.yScale.domain()[0];

	        var dt2 = this.yScale.domain()[1];

	        dt1.setUTCMonth(0,1);
	        dt2.setUTCMonth(11,31);
	       // var diffYear = Math.ceil ( ((dt2 - dt1) / 31536000000));
	        var diffYear = datafiltered.length;
	        var t = this.height/diffYear; 

	        this.bigRects = this.canvas.select(".bigrect").selectAll("rect").data(datafiltered);
	        this.bigRects.exit().remove();
	        this.bigRects.enter().append("rect").attr("x", 0);
	        			   

	        this.bigRects
                           .attr("x", 0)
						   .attr("y", function(d, i){
						      		return i*t ;
						  		})
						   .attr("width", function(d){
						      		return that.width;
						   		})
						   .attr("height",t )
						   .attr("stroke", "none")
						   .attr("fill", function(d,i){
						          return that.color(i);
						   		})
						   .attr("opacity", 0.2);

			this.ganntyear  = this.canvas.select(".bargantt").selectAll(".ganntyear").data(datafiltered);
			this.ganntyear.exit().remove();
			this.ganntyear.enter().append("g").attr("class", "ganntyear");
			this.lev2 = this.ganntyear.selectAll("rect").data(function(d){ return d.values });
			this.lev2.enter().append("rect")
			this.lev2.exit().remove();

			
	        
	        this.lev2
	          .attr("y", function(d,i,j) { return that.yScale(new Date(d.trajetoria[0].datahora.getFullYear(),0)) - (i+1)*(t/j.length) })
	          .attr("height", function(d,i,j){ return t/j.length})
	          .attr("x", function(d) {var dtaux = new Date(d.dateDomain[0].getTime()); return that.xScale(dtaux.setFullYear(2012)); })
	          .attr("width", function(d) {var dtaux = new Date(d.dateDomain[0].getTime());
	          							  var dtaux1 = new Date(d.dateDomain[1].getTime());
	          							 return that.xScale(dtaux1.setFullYear(2012)) - that.xScale(dtaux.setFullYear(2012))})
	          .attr("fill", function(d) { return that.color(d.dateDomain[0].getFullYear()); })


		   this.dispatcher.apply("selectionChanged",{callerID:that.id,time:that.time, datafiltered: auxDatafilt})

		}
	
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