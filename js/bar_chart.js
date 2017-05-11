class BarChart{

    //container needs to be either an svg element
    //or a group element
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
    this.xScale = d3.scaleBand().rangeRound([0, this.width]).padding(0.2);
    this.yScale = d3.scaleLinear().rangeRound([this.height,0]);


    this.data = [];

    this.xAxisGroup = this.canvas.append("g")
      .attr("class","xAxis")
      .attr("transform","translate(0,"+(height-this.margin.top - this.margin.bottom)+")");
    this.xAxis = d3.axisBottom(this.xScale).ticks(10);

    this.xAxisGroup.call(this.xAxis);

    

  
    this.yAxisGroup = this.canvas.append("g")
      .attr("class","yAxis")
      .attr("transform","translate(0,0)");
    this.yAxis = d3.axisLeft(this.yScale);
    this.yAxisGroup.call(this.yAxis);


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

    //var dataXExtent = d3.extent(this.data.map(function(d){return d[0]}));
   
    this.xScale.domain(this.data.map(function(d){return d[0]}));
    this.xAxis = d3.axisBottom(this.xScale).ticks(10);

    //

    var dataYExtent = d3.extent(this.data.map(function(d){return d[1]}));
    this.yScale.domain(dataYExtent);
 
    this.update();
  }

  update(){

    var myBars =
      this.canvas
        .selectAll(".bar")
        .data(this.data);
    
    myBars
      .exit()
      .remove();

    
    
    


    var xScale = this.xScale;
    var yScale = this.yScale;  

    this.xAxis.scale(this.xScale);
    this.xAxisGroup.call(this.xAxis);

    this.yAxis.scale(this.yScale);
    this.yAxisGroup.call(this.yAxis);
    var height = this.height;

    var newBars = myBars
      .enter()
      .append("rect")
      .merge(myBars)
      .attr("class", "bar")
      .attr("x", function(d) {  return xScale(d[0]); })
      .attr("y",function(d){  return yScale(d[1]);  })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - yScale(d[1]); })  
     

    this.xAxisGroup
            .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

   

  }



}  
