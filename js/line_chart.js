class LineChart{
	constructor(id,container,x,y,width,height){
		this.id = id;
	    this.margin = {top: 3, right: 2, bottom: 5, left: 10};  
	    this.x = x;
	    this.y = y;
	    this.totalWidth  = width;
	    this.totalHeight = height;
	    this.width = this.totalWidth - this.margin.left - this.margin.right;
	    this.height = this.totalHeight - this.margin.top - this.margin.bottom;
	    this.selectedIDS = [];

	    this.canvas = container.append("g").attr("transform","translate(" + (this.x + this.margin.left) + "," + (this.y + this.margin.top) + ")");

	    this.xScale = d3.scaleLinear().range([0, this.width]),
    	this.yScale = d3.scaleLinear().range([this.height, 0]),
    	
    	//this.zScale = d3.scaleOrdinal(d3.schemeCategory20b);

	    this.data = [];

	    this.xAxisGroup = this.canvas.append("g")
	      .attr("class","xAxis")
	      .attr("transform","translate(0,"+(height-this.margin.top - this.margin.bottom)+")");
	    this.xAxis = d3.axisBottom(this.xScale);

	    this.xAxisGroup.call(this.xAxis);

	    

	  
	    this.yAxisGroup = this.canvas.append("g")
	      .attr("class","yAxis")
	      .attr("transform","translate(0,0)");
	    this.yAxis = d3.axisLeft(this.yScale);
	    this.yAxisGroup.call(this.yAxis);


	   	this.toline = d3.line()
	   		.x(function(d) { return this.xScale(d.datahora); })
		    .y(function(d) {  return this.yScale(d.velocidade); });



	    /*
	    var that = this;
	    this.brush = d3.brush();
	    this.brushGroup = this.canvas.append("g").attr("class","brush");
	    this.brush(this.brushGroup);
	    this.brush.on("start",function(){that.brushStarted(that)});
	    this.brush.on("brush",function(){that.brushMoved(that)});
	    this.brush.on("end",function(){that.brushEnded(that)});
	  */

	}




	setData(data){
	    this.data = data;
	    //

	    var dataXExtent = d3.extent(data , function(d){return d.datahora;});
	   	console.log(dataXExtent);
	    this.xScale.domain(dataXExtent);
	    this.xAxis = d3.axisBottom(this.xScale);

	    //

	    var dataYExtent = d3.extent(data, function(d) { return d.velocidade;});
	    this.yScale.domain(dataYExtent);
	 	console.log(dataYExtent);

	    this.update();

  	}



  	update(){

	    var myLines =
	      this.canvas
	        .selectAll(".line_chart")
	        .data(this.data);
	    
	    myLines
	      .exit()
	      .remove();

	    
	    
	    


	    var xScale = this.xScale;
	    var yScale = this.yScale;  

	    this.xAxis.scale(this.xScale);
	    this.xAxisGroup.call(this.xAxis);

	    this.yAxis.scale(this.yScale);
	    this.yAxisGroup.call(this.yAxis);
	    var height = this.height;
	   


	    var newLines = myLines
	      .enter()
	      .append("path")
	      .merge(myLines)
	      .attr("class", "line_chart")
	      .attr("d", this.toline  )
	    

	    this.xAxisGroup
	            .selectAll("text")  
	          .style("text-anchor", "end")
	          .attr("dx", "-.8em")
	          .attr("dy", ".15em")
	          .attr("transform", "rotate(-65)");

   

  }
}