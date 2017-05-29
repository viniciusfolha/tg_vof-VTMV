class BarChart{

    //container needs to be either an svg element
    //or a group element
  constructor(id,container,x,y,width,height,opcoes){
    this.id = id;
    this.margin = {top: 5, right: 2, bottom: 40, left: 40};  
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
    this.selected;

  
    this.yAxisGroup = this.canvas.append("g")
      .attr("class","yAxis")
      .attr("transform","translate(0,0)");
    this.yAxis = d3.axisLeft(this.yScale);
    this.yAxisGroup.call(this.yAxis);
    this.dados_chart = [];






    this.opcoes;

//Create and append select list
  this.selectList = document.createElement("select");
  this.selectList.id = "comboboxBar";


  


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
          .tickSize(-this.width)
          .tickFormat("")
      )
          
  }

  setData(data,opcoes){
    this.data = data;
    //
    this.opcoes = opcoes;
    document.body.appendChild(this.selectList);
    for (var i = 0; i < this.opcoes.length; i++) {
        var option = document.createElement("option");
        option.value = this.opcoes[i];
        option.text = this.opcoes[i];
        this.selectList.appendChild(option);
    }
    this.selected = this.opcoes[0];





    var that = this;

    this.selectList.onchange = this.changeComboBox.bind(that);
    //var dataXExtent = d3.extent(this.data.map(function(d){return d[0]}));

    this.dados_chart = data.map(
        function(d){
          return {
            idObj : d.idObj ,
            average: (d3.sum(d.trajetoria.map(function(e){return e[that.selected]})) / d.trajetoria.length)
          }
        }

      )





 
   
    this.xScale.domain(this.dados_chart.map(function(d){return d.idObj}));
    this.xAxis = d3.axisBottom(this.xScale).ticks(10);
    
    //

    var dataYExtent = d3.extent(this.dados_chart.map(function(d){return d.average}));
    this.yScale.domain(dataYExtent);
  

    this.do_grid();
    this.update();
  }

  update(){

    var myBars =
      this.canvas
        .selectAll(".bar")
        .data(this.dados_chart);
    
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
      .attr("x", function(d) {  return xScale(d.idObj); })
      .attr("y",function(d){  return yScale(d.average);  })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - yScale(d.average); })  
     

    this.xAxisGroup
            .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

    this.set_Y_label();
    
    this.xAxisGroup
        .append("text")             
          .attr("transform", "translate("+ this.width/2 +","+ this.margin.bottom +")")
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .attr("fill", "#000")
          .attr("opacity", 1)
          .text("Objeto");
      this.canvas
      .append("text")
        .attr("x", (this.width / 2))             
        .attr("y", 0 - (this.margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Trajectory average");






  }

  set_Y_label(){
    this.yAxisGroup
      .append("text")
        .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left)
      .attr("x",0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-transform", "capitalize")
      .style("text-anchor", "middle")
      .text(this.selected)
        .attr("fill", "#000")
  }

  changeComboBox(thisCont){

    this.selected   = thisCont.target.value;
    this.dados_chart = this.data.map(
        function(d){
          return {
            idObj : d.idObj ,
            average: (d3.sum(d.trajetoria.map(function(e){return e[thisCont.target.value]})) / d.trajetoria.length)
          }
        }

    )

    var dataYExtent = d3.extent(this.dados_chart.map(function(d){return d.average}));

    this.yScale.domain(dataYExtent);
 
   

      
    var trans = d3.select("body").transition();
    
    // Make the changes
      var transition = this.canvas.transition().duration(750),
        delay = function(d, i) { return i * 50; };


    var xScale = this.xScale;
    var yScale = this.yScale;  

    this.xAxis.scale(this.xScale);
    this.xAxisGroup.call(this.xAxis);

    this.yAxis.scale(this.yScale);
    this.yAxisGroup.call(this.yAxis);

    var height = this.height;
    
    this.canvas
        .selectAll(".bar")
        .data(this.dados_chart)
        .transition().duration(750)
        .attr("class", "bar")
        .attr("x", function(d) {  return xScale(d.idObj); })
        .attr("y",function(d){  return yScale(d.average);  })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d.average); })

    this.yAxisGroup
      .select("text")
      .text(this.selected)

    transition.select(".yAxis") // change the y axis
      .call(this.yAxis);

    
  }



}  
