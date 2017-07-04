class BarChart{

    //container needs to be either an svg element
    //or a group element
  constructor(id,container,x,y,width,height,opcoes){
    this.id = id;
    this.margin = {top: 5, right: 2, bottom: 20, left: 40};  
    this.x = x;
    this.y = y;
    this.totalWidth  = width;
    this.totalHeight = height;
    this.width = this.totalWidth - this.margin.left - this.margin.right;
    this.height = this.totalHeight - this.margin.top - this.margin.bottom;
    this.selectedIDS;

    this.canvas = container.append("g").attr("transform","translate(" + (this.x + this.margin.left) + "," + (this.y + this.margin.top) + ")");
    //this.xScale = d3.scaleBand().rangeRound([0, this.width]).padding(0.2);
    this.xScale = d3.scaleLinear().rangeRound([0, this.width]);
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
    this.div;

   
    this.griddone = false;
    this.button;
    this.opcoes;
    this.newBars;
//Create and append select list
  this.selectList = document.createElement("select");
  this.selectList.id = "comboboxBar";
  this.selectList.style.position = "absolute";
  this.selectList.style = "position: absolute; top: 10px;right: 0px;";
  this.time;
  this.button =  document.createElement("button", {id: "back-button"});
  


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
    var that = this;
        this.opcoes = opcoes;
        this.div = document.getElementById(this.id);
    
    this.div.appendChild(this.selectList);
    for (var i = 0; i < this.opcoes.length; i++) {
            var option = document.createElement("option");
            option.value = this.opcoes[i];
            option.text = this.opcoes[i];
            this.selectList.appendChild(option);
    }
    this.selectList.onchange = this.changeComboBox.bind(that);
    this.selected = this.opcoes[0];

    const histogram = d3.histogram()
      .value(d => d["mean_".concat(that.selected)])
      .thresholds(10);

    this.dados_chart = histogram(data);
    this.yScale.domain([0, d3.max(that.dados_chart, function(d) { return d.length; })]);
    var dataXExtent = d3.extent(this.data.map(function(d){return d["mean_".concat(that.selected)]}));
    this.xScale.domain(dataXExtent);
    this.update();
    this.do_grid();
  }

  update(){

    var myBars =
      this.canvas
        .selectAll(".bar")
        .data(this.dados_chart);
    
    myBars
      .exit()
      .remove();

    
    
    
      var that = this;

    var xScale = this.xScale;
    var yScale = this.yScale;  

    this.xAxis.scale(this.xScale);
    this.xAxisGroup.call(this.xAxis);

    this.yAxis.scale(this.yScale);
    this.yAxisGroup.call(this.yAxis);
    var height = this.height;

  this.newBars = myBars
    .enter().append("g")
    .merge(myBars)
    .attr("class", "bar");
     
     this.newBars.append("rect")
        .attr("x", function(d) { return xScale(d.x0)})
        .attr("y", function(d) { return yScale(d.length)})
        .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) - 1})
        .attr("height", function(d) { return height - yScale(d.length); });

    this.xAxisGroup
            .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

    this.set_Y_label("Number of event");
    
    this.xAxisGroup
        .append("text")     
          .attr("class", "xlabel")        
          .attr("transform", "translate("+ this.width/2 +","+ this.margin.bottom +")")
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .attr("fill", "#000")
          .attr("opacity", 1)
          .text(this.selected);
    
    this.canvas
      .append("text")
        .attr("class", "title")
        .attr("x", (this.width / 2))             
        .attr("y", 0 - (this.margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Histogram of ".concat(this.selected) );
    
    
    this.newBars.on("mouseover", this.barover.bind(this))
    .on("mouseout",function(){
      that.canvas.select(".tooltip").remove();
    })
    .on("click", this.barclick.bind(that))

    

  }
  barover(d){
      
      var that = this;
      var group = this.canvas.append("g")
      .attr("class","tooltip");
      group.append("rect")
                .attr('height', 21 + 18*d.length)
                .attr('width', 100)
                .attr('x',  this.totalWidth - this.margin.left -2)
                .attr('y', this.margin.top  )
                .style('fill', 'LightGray')
                .attr('stroke', 'black')
                .style ("opacity",0.7 );
      group.append("text")
          .attr("x",this.totalWidth - this.margin.left +3)
          .attr("y", this.margin.top + 15)
          .text("ID:");
      d.forEach(function(x,i){      
          group.append("text")
            .attr("x",that.totalWidth - that.margin.left + 10)
            .attr("y", that.margin.top + (15*(parseInt(i)+2) ) )
            .style("fontSize", "small")
              .text(x.idObj);});
    
      
  }
  barclick(obj){
        var that = this;

        this.selectedIDS = obj;

        this.button =  document.createElement("button", {id: "back-button"});
        this.button.setAttribute('content', 'text content');
        this.button.setAttribute('class', 'btn');
        this.button.style = "top: 3; right: 0;position:absolute;z-index: 9999; margin-top: 50px;margin-right: 10px;"
        this.button.innerHTML = 'Return';
        this.button.onclick = this.returnB.bind(this);
        this.div.appendChild(this.button);
        if(this.dispatcher)
          this.dispatcher.apply("selectionChanged",{callerID:that.id, returnB : false ,datafiltered: that.selectedIDS})


      
       
  }
  updateInteractive(){
    this.button =  document.createElement("button", {id: "back-button"});
    this.button.setAttribute('content', 'text content');
    this.button.setAttribute('class', 'btn');
    this.button.style = "top: 3; right: 0;position:absolute;z-index: 9999; margin-top: 50px;margin-right: 10px;"
    this.button.innerHTML = 'Return';
    this.button.onclick = this.returnB.bind(this);
    this.div.appendChild(this.button);


    this.canvas.select(".tooltip").remove();
    var dataYExtent = d3.extent(this.dados_chart.map(function(d){return d.average}));

    dataYExtent[0] = 0;
    this.xScale = d3.scaleBand().rangeRound([0, this.width]).padding(0.2);
    this.yScale = d3.scaleLinear().rangeRound([this.height,0]);

    this.xScale.domain(this.dados_chart.map(function(d){return d.idObj}));
    this.xAxis = d3.axisBottom(this.xScale).ticks(10);
    this.yScale.domain(dataYExtent);

    
    
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
        .selectAll(".bar").remove();
    this.canvas.select(".title")
      .text("Average of " + this.selected);

    this.canvas
        .selectAll(".bar")
        .data(this.dados_chart).enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {  return xScale(d.idObj); })
        .attr("y",function(d){  return yScale(d.average);  })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d.average); })


    
     
    this.yAxisGroup
      .select(".ylabel")
      .text(this.selected)
    this.xAxisGroup
            .selectAll(".tick")
            .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

    this.xAxisGroup
      .select(".xlabel")
      .text("Objeto")




    
  
  }
  returnB(contx){
    
    var that = this;
    
      //Retorno a tela anterior, remove o botaoe muda o combobox
      if(this.dispatcher)
          this.dispatcher.apply("selectionChanged",{callerID:that.id, returnB: true})
    this.button.remove();
    

  }
  set_Y_label(name){
    this.yAxisGroup
      .append("text")
      .attr("class", "ylabel")
        .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left)
      .attr("x",0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-transform", "capitalize")
      .style("text-anchor", "middle")
      .text(name)
        .attr("fill", "#000")
  }

  changeComboBox(thisCont){
    
    var that = this;
    this.selected   = thisCont.target.value;
    const histogram = d3.histogram()
      .value(d => d["mean_".concat(that.selected)])
      .thresholds(10);
    this.dados_chart = histogram(this.data);
    this.canvas.selectAll(".title").remove();
    this.newBars.remove();
    this.yScale.domain([0, d3.max(that.dados_chart, function(d) { return d.length; })]);
    this.xAxisGroup.selectAll(".xlabel").remove();
    this.yAxisGroup.selectAll(".ylabel").remove();
    var dataXExtent = d3.extent(this.data.map(function(d){return d["mean_".concat(that.selected)]}));
    this.xScale.domain(dataXExtent);
    this.update();
    
   

    
  }



}  
