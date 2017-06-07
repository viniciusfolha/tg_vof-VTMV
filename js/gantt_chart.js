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
	    this.selectedIDS = [];

	    this.canvas = container.append("g").attr("transform","translate(" + (this.x + this.margin.left) + "," + (this.y + this.margin.top) + ")");

	   // this.xScale = d3.scaleLinear().range([0, this.width]),
    	this.xScale = d3.scaleTime().range([0, this.width]);
    	this.yScale = d3.scaleBand().range([0, this.height]),
    	
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
	    this.opcoes;

	   	this.toline ;

	   	this.selected;
		this.opcoes;

  		this.selectList = document.createElement("select");
  		this.selectList.id = "comboboxLine";


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
	    var color  = d3.scaleOrdinal(d3.schemeCategory20b);

	    this.xAxis = d3.axisBottom(this.xScale);

	    this.xAxis.scale(this.xScale);
	    this.yAxis.scale(this.yScale);

		this.xAxisGroup.call(this.xAxis);
		this.yAxisGroup.call(this.yAxis);	    
		this.canvas.selectAll(".bargantt")
	      .data(this.data)
          .enter().append("rect")
          .attr("class", "bargantt")
          .attr("y", function(d) { return that.yScale(d.idObj); })
          .attr("height", that.yScale.bandwidth())
          .attr("x", function(d) { return that.xScale(d.startDate); })
          .attr("width", function(d) { return that.xScale(d.endDate) - that.xScale(d.startDate)})
          .attr("fill", function(d) { return color(d.idObj); })
          
	      
	      
		this.do_grid();
	    //this.update();

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