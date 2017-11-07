class GanttChartCanvas{
	constructor(divId,x,y,width,height){
		this.id = divId;
		this.margin = {top: 10, right: 10, bottom: 25, left: 3};  
		this.x = x;
		this.y = y;
		this.totalWidth  = width;
		this.totalHeight = height;
		this.width = this.totalWidth - this.margin.left - this.margin.right;
		this.height = this.totalHeight - this.margin.top - this.margin.bottom;
		this.time = [];
		this.brushHeight = 50;
		this.heightCanvas = this.height - this.brushHeight;
		var canvas  = d3.select("#" + divId).append("canvas");
		canvas
		.attr("id", "canvas")
		.attr("width", this.width)
		.attr("height", this.heightCanvas);

		this.contextSVG = d3.select("#" + divId)
		.append("svg")
		.attr("width",this.width)
		.attr("height",this.brushHeight);

		this.xScaleCont = d3.scaleTime().range([50, this.width]);
		this.	yScaleCont = d3.scaleLinear().range([this.brushHeight - 17 ,4]);
		this.xAxisCont = d3.axisBottom(this.xScaleCont).ticks(20);
		this.yAxisCont = d3.axisLeft(this.yScaleCont);

    	/*this.brush = d3.brushX()
    	.extent([[50, 4], [this.width, this.brushHeight - 17]])
    	.on("brush", this.brushed.bind(this));	
    	*/


    	this.context = canvas.node().getContext("2d");

		// Create an in memory only element of type 'custom'
		var detachedContainer = document.createElement("custom");

		// Create a d3 selection for the detached container. We won't
		// actually be attaching it to the DOM.
		this.dataContainer = d3.select(detachedContainer);
		this.brushes = [];
		this.xScale = d3.scaleTime().range([50, this.width]).clamp(true);
		//this.yScale = d3.scaleTime().range([this.heightCanvas + this.margin.top - this.margin.bottom , this.margin.top ]).clamp(true);
		this.yScale = d3.scaleBand().rangeRound([this.heightCanvas + this.margin.top - this.margin.bottom , this.margin.top ]);
		this.init = true;
		this.data;
		this.selectedData = [];

	}


	setData(data,opcoes){
		if(!this.data){
			this.data = data;
			this.dataYear = d3.nest()
			.key(function(d) { return d.trajetoria[0].datahora.getFullYear() })
			.entries(data);
			var auxDateDomain = d3.extent(this.dataYear.map(function(d){return d.key}));

			var dt1 = new Date(auxDateDomain[0])
			var dt2 = new Date(auxDateDomain[1],11,31);
			this.xScaleCont.domain([dt1,dt2]);
			
			this.yScaleCont.domain([ 0 
				, d3.max(this.dataYear, function(c) { return c.values.length; }) ]);
			this.drawBrushArea();
    		/*this.contextSVG.append("g")
    		.attr("class", "brush")
    		.call(this.brush)
    		.call(this.brush.move, [200,300]);
    		*/
    		this.gBrush = this.contextSVG.append("g")
    		.attr("class", "brush");

    		this.newBrush();
    		this.drawBrushes();

    	}else{

    		var that = this;

    		this.dataYear = d3.nest()
    		.key(function(d) { return d.trajetoria[0].datahora.getFullYear() })
    		.entries(data);
    		var auxDateDomain = d3.extent(this.dataYear.map(function(d){return d.key}));

    		var dt1 = new Date(auxDateDomain[0])
    		var dt2 = new Date(auxDateDomain[1],11,31);
    		var diffYear = this.dataYear.length;;


    		this.xScale.domain([new Date(2012, 0, 1), new Date(2012, 11, 31)]);
    		this.dateToShow = this.dataYear.map(x => x.key)
    		this.yScale.domain(this.dateToShow);

    		this.color  = d3.scaleOrdinal(d3.schemeCategory20b);
    		if(this.dateToShow.length > 1){
    			that.heightS = that.yScale(this.dateToShow[0]) - that.yScale(this.dateToShow[1]);
    		}else if(this.dateToShow.length==1) {
    			var aux = that.yScale.range();
    			that.heightS = aux[0] - aux[1];
    		}else{
    			return;
    		}this.dataBinding = this.dataContainer.selectAll("custom.rect")
    		.data(this.dataYear, function(d) { return d; });

	    		// update existing element to have size 15 and fill green
	    		this.dataBinding
	    		.attr("x", that.xScale.range()[0])
	    		.attr("y", function(d, i){
	    			return that.yScale(d.key) ;	})
	    		.attr("height", function(d, i, e){
	    			return that.heightS; })
	    		.attr("width", that.width)
	    		.attr("fillStyle", function(d, i){ return that.color(i);});

		  // for new elements, create a 'custom' dom node, of class rect
		  // with the appropriate rect attributes
		  this.dataBinding.enter()
		  .append("custom")
		  .classed("rect", true)
		  .attr("x", that.xScale.range()[0])
		  .attr("y", function(d, i){
		  	return that.yScale(d.key) ;	})
		  .attr("height", function(d, i, e){
		  	return that.heightS; })
		  .attr("width", that.width)
		  .attr("fillStyle", function(d, i){ return that.color(i);});

		  // for exiting elements, change the size to 5 and make them grey.
		  this.dataBinding.exit().remove();

		  var auxRect =  this.dataContainer.selectAll("custom.rect");
		  this.smallBars = auxRect.selectAll("custom.smallrect").data(function(d){ return d.values });

		  this.smallBars.each(function(d,i,j){
		  	var aux = new Date(d.dateDomain[0].getTime()); 
		  	var XdateAuxInit= that.xScale(aux.setFullYear(2012)); 
		  	var year = d.dateDomain[0].getFullYear();
		  	var color  = that.color(year);

		  	var dtaux = new Date(aux);
		  	var dtaux1 = new Date(d.dateDomain[1].getTime());
		  	var width = that.xScale(dtaux1.setFullYear(2012)) - that.xScale(dtaux.setFullYear(2012))

		  	var yAuxInit = that.yScale(year) ;
		  	var yAuxEnd = that.yScale(year) + that.heightS;
		  	var barHeight = yAuxInit - yAuxEnd;
		  	barHeight = barHeight/j.length;
		  	var yprint = yAuxInit - barHeight*(i+1);
		  	d3.select(this)
		  	.attr("y", yprint)
		  	.attr("height", barHeight)
		  	.attr("x", XdateAuxInit)
		  	.attr("width", width)
		  	.attr("fillStyle", color)
		  });

		  this.smallBars.enter().append("custom").classed("smallrect", true)
		  .each(function(d,i,j){
		  	var aux = new Date(d.dateDomain[0].getTime()); 
		  	var XdateAuxInit= that.xScale(aux.setFullYear(2012)); 
		  	var year = d.dateDomain[0].getFullYear();
		  	var color  = that.color(year);

		  	var dtaux = new Date(aux);
		  	var dtaux1 = new Date(d.dateDomain[1].getTime());
		  	var width = that.xScale(dtaux1.setFullYear(2012)) - that.xScale(dtaux.setFullYear(2012))


		  	var yAuxInit = that.yScale(year) ;
		  	var yAuxEnd = that.yScale(year) + that.heightS;
		  	var barHeight = yAuxInit - yAuxEnd;
		  	barHeight = barHeight/j.length;
		  	var yprint = yAuxInit - barHeight*(i+1);
		  	d3.select(this)
		  	.attr("y", yprint)
		  	.attr("height", barHeight)
		  	.attr("x", XdateAuxInit)
		  	.attr("width", width)
		  	.attr("fillStyle", color)
		  });



		  this.smallBars.exit().remove();

		  this.clearCanvas();
		  this.drawCanvas();
		  this.drawxAxis();
		  this.drawyAxis();



		}

	}




	newBrush() {
		var that = this;
		var brush = d3.brushX()
		.extent([[50, 4], [this.width, this.brushHeight - 17]])
		.on("start", brushstart)
		.on("brush", brushed.bind(this))
		.on("end", brushend.bind(this));

		this.brushes.push({id: this.brushes.length, brush: brush});
		if(this.brushes.length==1){
				var brushSelection = this.gBrush
					.selectAll('.brush')
					.data(this.brushes, function (d){return d.id});

				// Set up new brushes
				brushSelection.enter()
				.insert("g", '.brush')
				.attr('class', 'brush')
				.attr('id', function(brush){ return "brush-" + brush.id; })
				.each(function(brushObject) {
				      //call the brush

				      brushObject.brush(d3.select(this));

				      if (brushObject.id === 0) {
				      brushObject.brush.move(d3.select(this), [that.width - 100, that.width]);};
			})
		}

		function brushstart() {
    		// your stuff here
    	};

    	function brushed() {
    		var that = this;
    		var newInterval = d3.brushSelection(arguments[2][0]).map(this.xScaleCont.invert, this.xScaleCont);;
    		this.brushes[arguments[0].id].range = newInterval;
    		var maxDate = d3.max(this.brushes, function(c) { if(c.range) return c.range[1]; })
    		var minDate = d3.min(this.brushes, function(c) { if(c.range) return c.range[0]; })

    		var auxDatafilt = this.data.filter(function(d){
    			return that.brushes.some(function(c){return c.range && !(c.range[1]  < d.dateDomain[0] || d.dateDomain[1] < c.range[0]) });
    		})

    		this.yScale.domain(minDate,maxDate);
			
			//this.xScale.domain(s.map(this.xScaleCont.invert, this.xScaleCont));

			that.time = this.yScale.domain();
			
			var test = 1;
			this.setData(auxDatafilt,test);
			this.dispatcher.apply("selectionChanged",{callerID:that.id,time:that.time, datafiltered: auxDatafilt})
    	}

	    function brushend() {
		    // Figure out if our latest brush has a selection
		    var lastBrushID = this.brushes[this.brushes.length - 1].id;
		    var lastBrush = document.getElementById('brush-' + lastBrushID);
		    var selection = d3.brushSelection(lastBrush);

		    // If it does, that means we need another one
		    if (selection && selection[0] !== selection[1]) {
		    	this.newBrush();
		    }
		    		
		    // Always draw brushes
		    this.drawBrushes();
		}
	}

	drawBrushes() {
		var brushSelection = this.gBrush
		.selectAll('.brush')
		.data(this.brushes, function (d){return d.id});

		// Set up new brushes
		brushSelection.enter()
		.insert("g", '.brush')
		.attr('class', 'brush')
		.attr('id', function(brush){ return "brush-" + brush.id; })
		.each(function(brushObject) {
	      //call the brush
	      brushObject.brush(d3.select(this));
	  	});

		/* REMOVE POINTER EVENTS ON BRUSH OVERLAYS
		 *
		 * This part is abbit tricky and requires knowledge of how brushes are implemented.
		 * They register pointer events on a .overlay rectangle within them.
		 * For existing brushes, make sure we disable their pointer events on their overlay.
		 * This frees the overlay for the most current (as of yet with an empty selection) brush to listen for click and drag events
		 * The moving and resizing is done with other parts of the brush, so that will still work.
		 */
		 var that = this;
		 brushSelection
		 .each(function (brushObject){
		 	d3.select(this)
		 	.attr('class', 'brush')
		 	.selectAll('.overlay')
		 	.style('pointer-events', function() {
		 		var brush = brushObject.brush;
		 		if (brushObject.id === that.brushes.length-1 && brush !== undefined) {
		 			return 'all';
		 		} else {
		 			return 'none';
		 		}
		 	});
		 })

		 brushSelection.exit()
		 .remove();

	}



	drawBrushArea(){
		var that = this;
		var area = d3.area()
		.defined(function(d) { return d; })
		.curve(d3.curveStepBefore)
		.x(function(d) { return that.xScaleCont( new Date (d.key,11,31)); })
		.y1(function(d) { return that.yScaleCont(d.values.length); });

		area.y0(that.yScaleCont(0));

		this.dataYear.unshift({key : (that.xScaleCont.domain()[0].getFullYear()) , values: [0]} );

		this.contextSVG.append("g")
		.append("path")
		.datum(this.dataYear)
		.attr("fill", "steelblue")
		.attr("d", area);

		this.dataYear.shift();

		this.contextSVG.append("g")
		.attr("class", "xAxis")
		.attr("transform", "translate(0," + (this.brushHeight - 17) + ")")
		.call(this.xAxisCont);

		this.yAxisCont.tickValues(this.yScaleCont.domain());

		this.contextSVG.append("g")
		.attr("class", "yAxis")
		.attr("transform", "translate(50,0)")
		.call(this.yAxisCont);





	}
	drawyAxis(){
		var that = this;
		var tickCount = 10,
		tickSize = 6,
		x0 = that.xScale.range()[0],
		y0 = that.yScale.range()[0],
		y1 = that.yScale.range()[1],
		tickSize = x0 - tickSize,
		tickPadding = 3,
		ticks = this.dateToShow;
		//tickFormat = that.yScale.tickFormat(tickCount);

		that.context.beginPath();
		ticks.forEach(function(d) {
			that.context.moveTo(tickSize, that.yScale(d));
			that.context.lineTo(x0, that.yScale(d));
		});
		that.context.strokeStyle = "black";
		that.context.stroke();

		that.context.beginPath();
		that.context.moveTo(tickSize, y0);
		that.context.lineTo(x0, y0);
		that.context.lineTo(x0, y1);
		that.context.lineTo(tickSize, y1);
		that.context.strokeStyle = "black";
		that.context.stroke();

		that.context.fillStyle = 'black';
		that.context.textAlign = "right";
		that.context.textBaseline = "middle";
		ticks.forEach(function(d) {
			that.context.fillText(d, tickSize - tickPadding, that.yScale(d) + that.heightS/2 );
		});

		that.context.save();
		that.context.rotate(-Math.PI / 2);
		that.context.textAlign = "right";
		that.context.textBaseline = "top";
		that.context.font = "bold 10px sans-serif";
		that.context.fillText("Date Time", -30, 0);
		that.context.restore();
	}
	drawxAxis() {
		var that = this;
		var tickCount = 10,
		tickSize = 10,
		x0 = that.xScale.range()[0],
		x1 = that.xScale.range()[1],
		ticks = that.xScale.ticks(tickCount),
		y1 = that.yScale.range()[0],
		y0 = y1 + tickSize,
		tickFormat = that.xScale.tickFormat(5,d3.timeFormat("%B"));
		this.context.beginPath();
		ticks.forEach(function(d) {
			that.context.moveTo(that.xScale(d), y1);
			that.context.lineTo(that.xScale(d), y0);
		});
		that.context.strokeStyle = "black";
		that.context.stroke();

		that.context.beginPath();
		that.context.moveTo(x0, y0);
		that.context.lineTo(x0, y1);
		that.context.lineTo(x1, y1);
		that.context.lineTo(x1, y0);

		that.context.strokeStyle = "black";
		that.context.stroke();

		that.context.fillStyle = 'black';
		that.context.textAlign = "center";
		that.context.textBaseline = "top";
		ticks.forEach(function(d) {
			that.context.fillText(tickFormat(d), that.xScale(d) + 30, that.heightCanvas - 11);
		});
	}
	clearCanvas(){
	// clear canvas
		this.context.clearRect(0, 0, this.width, this.heightCanvas);
	}
	drawCanvas() {
		var that = this;

		var elements = this.dataContainer.selectAll("custom.rect");
		elements.each(function(d) {
			var node = d3.select(this);

			that.context.beginPath();
			var t =  d3.color(node.attr("fillStyle"));
			t.opacity = 0.2;
			that.context.fillStyle = t;
			that.context.rect(node.attr("x"), node.attr("y"), node.attr("width"), node.attr("height"));
			that.context.fill();
			that.context.closePath();

		});
		var smallrect = this.dataContainer.selectAll("custom.smallrect");
		smallrect.each(function(d) {
			var node = d3.select(this);

			that.context.beginPath();
			var t =  d3.color(node.attr("fillStyle"));
			that.context.fillStyle = t;
			that.context.rect(node.attr("x"), node.attr("y"), node.attr("width"), node.attr("height"));
			that.context.fill();
			that.context.closePath();

		});
	}
/*
	zoomed() {
	  	if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush" && d3.event.sourceEvent.type === "start") return; // ignore zoom-by-brush
	  	console.log("aqui nao");
	  	var that = this;
	  	var t = d3.event.transform;
	  	this.yScale.domain(t.rescaleX(this.xScaleCont).domain());
	  	that.time = this.yScale.domain();
	  	this.context.select(".brush").call(this.brush.move, this.xScale.range().map(t.invertX, t));

	  	var auxDatafilt = this.data.filter(function(d){var val = ( 
	  		that.time[1] < d.dateDomain[0] || d.dateDomain[1] < that.time[0]   ); 
	  	return !val ;});

	  	var datafiltered = d3.nest()
	  	.key(function(d) { return d.trajetoria[0].datahora.getFullYear() })
	  	.entries(auxDatafilt);

	  	this.yAxis.scale(this.yScale);
	  	this.yAxisGroup.call(this.yAxis);	  

	  	var dt1 = this.yScale.domain()[0];
	  	var dt2 = this.yScale.domain()[1];

	  	dt1.setUTCMonth(0,1);
	  	dt2.setUTCMonth(11,31);

	  	var diffYear = datafiltered.length;
	  	var t = this.height/diffYear; 
	  	this.yScale.clamp(true);
	  	this.bigRects = this.canvas.select(".bigrect").selectAll("rect").data(datafiltered);
	  	this.bigRects.exit().remove();
	  	let enteredGannt = this.bigRects.enter().append("rect").attr("x", 0).attr("width",  that.width);

	  	this.bigRects.merge(enteredGannt)
	  	.attr("y", function(d, i){
	  		return that.yScale(new Date(d.key,11,31)) ;
	  	})
	  	.attr("height", function(d, i, e){
	  		return (that.yScale(new Date(d.key,0)) - that.yScale(new Date(d.key,11,31))); }
	  		)
	  	.attr("fill", function(d,i){
	  		return that.color(i);
	  	});

	  	this.ganntyear  = this.canvas.select(".bargantt").selectAll(".ganntyear").data(datafiltered);
	  	this.ganntyear.exit().remove();
	  	let enteterdGanntYear = this.ganntyear.enter().append("g").attr("class", "ganntyear");
	  	this.smallBars = this.ganntyear.merge(enteterdGanntYear).selectAll("rect").data(function(d){ return d.values });
	  	let enteredSmallBars = this.smallBars.enter().append("rect")
	  	this.smallBars.exit().remove();


	  	var XdateAuxInit;
	  	var barHeight;
	  	var yAuxInit;
	  	var yAuxEnd;
	  	this.smallBars.merge(enteredSmallBars)
	  	.attr("y", function(d,i,j) {
	  		yAuxInit = that.yScale(new Date(d.dateDomain[0].getFullYear(),0)) ;
	  		yAuxEnd = that.yScale(new Date(d.dateDomain[0].getFullYear(),11,31));
	  		barHeight = yAuxInit - yAuxEnd;
	  		barHeight = barHeight/j.length;
					//return that.yScale(new Date(d.dateDomain[0].getFullYear(),0)) - (i+1)*(t/j.length);

					return yAuxEnd + barHeight*i;

				})
	  	.attr("height", barHeight)
	  	.attr("x", function(d) { var aux = new Date(d.dateDomain[0].getTime()); 
	  		XdateAuxInit= that.xScale(aux.setFullYear(2012)); 
	  		return XdateAuxInit;})
	  	.attr("width", function(d) {var dtaux = new Date(d.dateDomain[0].getTime());
	  		var dtaux1 = new Date(d.dateDomain[1].getTime());
	  		return that.xScale(dtaux1.setFullYear(2012)) - that.xScale(dtaux.setFullYear(2012))})
	  	.attr("fill", function(d) { return that.color(d.dateDomain[0].getFullYear()); })


	  	this.dispatcher.apply("selectionChanged",{callerID:that.id,time:that.time, datafiltered: auxDatafilt})

	  }
*/

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
/*
			var datafiltered = d3.nest()
			.key(function(d) { return d.trajetoria[0].datahora.getFullYear() })
			.entries(auxDatafilt);
			*/
			var test = 1;
			this.setData(auxDatafilt,test);
			this.dispatcher.apply("selectionChanged",{callerID:that.id,time:that.time, datafiltered: auxDatafilt})

		}

	}

  	setHighlight(dataToHigh){
	  	var that = this;
	  	var test =  this.dataContainer.selectAll("custom.smallrect").select( function(d) {return dataToHigh.some(e => d === e)?this:null;})
			.attr("fillStyle", "black");

		test.each(function(d) {
			var node = d3.select(this);

			that.context.beginPath();
			var t =  d3.color(node.attr("fillStyle"));
			that.context.fillStyle = t;
			that.context.rect(node.attr("x"), node.attr("y"), node.attr("width"), node.attr("height"));
			that.context.fill();
			that.context.closePath();

		});

		//this.clearCanvas();
		//this.drawCanvas();
		//this.drawxAxis();
		//this.drawyAxis();
  	}

  	clearHighlight(dataToHigh){
	  	var that = this;
	  	var test =  this.dataContainer.selectAll("custom.smallrect").select( function(d) {return dataToHigh.some(e => d === e)?this:null;})
			.attr("fillStyle",function(d){ return that.color(d.dateDomain[0].getFullYear())} );
		test.each(function(d) {
			var node = d3.select(this);

			that.context.beginPath();
			var t =  d3.color(node.attr("fillStyle"));
			that.context.fillStyle = t;
			that.context.rect(node.attr("x"), node.attr("y"), node.attr("width"), node.attr("height"));
			that.context.fill();
			that.context.closePath();

		});
	
  	}


}