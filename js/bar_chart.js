class BarChart{

    //container needs to be either an svg element
    //or a group element
  constructor(id,container,x,y,width,height,opcoes){
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
    this.escolha;

  
    this.yAxisGroup = this.canvas.append("g")
      .attr("class","yAxis")
      .attr("transform","translate(0,0)");
    this.yAxis = d3.axisLeft(this.yScale);
    this.yAxisGroup.call(this.yAxis);
    this.dados_chart = [];






    this.opcoes = opcoes;

//Create and append select list
  this.selectList = document.createElement("select");
  this.selectList.id = "mySelect";


  document.body.appendChild(this.selectList);
  for (var i = 0; i < this.opcoes.length; i++) {
    var option = document.createElement("option");
    option.value = this.opcoes[i];
    option.text = this.opcoes[i];
    this.selectList.appendChild(option);
  }
  this.escolha = this.opcoes[0];


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
  changeComboBox(data){
 
    this.escolha   = this.value;
    var value  = this.value;
    this.dados_chart = data.map(function (e) {
               return(e.trajetoria.map(function(t){
                return [e.idObj , (t[value])];
              }))
              
          });
    this.dados_chart = [].concat.apply([], this.dados_chart);
    
    var dataYExtent = d3.extent(this.dados_chart.map(function(d){return d[1]}));
    this.yScale.domain(dataYExtent);
    
    this.update();


  }

  setData(data){
    this.data = data;
    //
    this.selectList.onchange = this.changeComboBox(data);
    //var dataXExtent = d3.extent(this.data.map(function(d){return d[0]}));
    this.dados_chart = data.map(function (e) {
               return(e.trajetoria.map(function(t){
                return [e.idObj , t.velocidade];
              }))
              
          });
    this.dados_chart = [].concat.apply([], this.dados_chart);
    this.xScale.domain(this.dados_chart.map(function(d){return d[0]}));
    this.xAxis = d3.axisBottom(this.xScale).ticks(10);

    //

    var dataYExtent = d3.extent(this.dados_chart.map(function(d){return d[1]}));
    this.yScale.domain(dataYExtent);
 
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
