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
    this.div;

    this.optionsDate = {  Weekday : {weekday: 'long'}, Year : {year: 'numeric'} , Month : {month: 'long'}, Day : {day: 'numeric'}, Hour : {"hour" : "numeric"} };

    this.griddone = false;
    this.button;
    this.opcoes;

//Create and append select list
  this.selectList = document.createElement("select");
  this.selectList.id = "comboboxBar";
  this.time;
  this.button =  document.createElement("button", {id: "back-button"});
  


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
    var that = this;
        this.opcoes = opcoes;
        this.div = document.getElementById(this.id);
    this.time = ["Year","Month","Weekday","Day","Hour"];
    this.div.appendChild(this.selectList);
    for (var i = 0; i < this.time.length; i++) {
        var option = document.createElement("option");
        option.value = this.time[i];
        option.text = this.time[i];
        this.selectList.appendChild(option);
    }
    this.selectList.onchange = this.returnB.bind(that);
    this.selected = this.time[0];

    

    
    var aux =        data.map(function(e){ e.trajetoria.forEach(function(c){c.id = e.idObj;} ) ; return e.trajetoria});
    var  teste =  [].concat.apply([], aux)
    var aux =     d3.nest()
                  .key(function(d) { return d.datahora.toLocaleString("en-us", that.optionsDate[that.selected]); })
                  .key(function(d) { return d.id })
                  .entries(teste);
    
   






   

    
    //var dataXExtent = d3.extent(this.data.map(function(d){return d[0]}));

    this.dados_chart = aux.map(
        function(d){
          return {
            idObj : d.key ,
            average: d.values.length,
            obj: d.values
          }
        }

      )

   
   


 
   
    this.xScale.domain(this.dados_chart.map(function(d){return d.idObj}));
    this.xAxis = d3.axisBottom(this.xScale).ticks(10);
    
    //

    var dataYExtent = d3.extent(this.dados_chart.map(function(d){return d.average}));
    //mudar
    dataYExtent[0] = 0;
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
        .text("Event per " + this.selected);
    var that = this;
    newBars.on("mouseover", this.barover.bind(this))
    .on("mouseout",function(){
      that.canvas.select(".tooltip").remove();
    })
    .on("click", this.barclick.bind(that))



  }
  barover(d){
      
      var group = this.canvas.append("g")
      .attr("class","tooltip");
      group.append("rect")
                .attr('height', 21 + 18*d.average)
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

      for(var x in d.obj){ 
        group.append("text")
          .attr("x",this.totalWidth - this.margin.left + 10)
          .attr("y", this.margin.top + (15*(parseInt(x)+2) ) )
          .style("fontSize", "small")
          .text(d.obj[x].key);
      }
      
  }
  barclick(obj){
        var that = this;
        this.selectList.innerHTML = "";
        for (var i = 0; i < this.opcoes.length; i++) {
            var option = document.createElement("option");
            option.value = this.opcoes[i];
            option.text = this.opcoes[i];
            this.selectList.appendChild(option);
        }
        var timeType = this.selected;
       
        this.selected = this.opcoes[0];

        this.selectList.onchange = this.changeComboBox.bind(that);
        




        this.selectedIDS = this.data.filter(function(d){ return (obj.obj.findIndex(x => x.key ===  d.idObj) != -1) });


        if(this.dispatcher)
          this.dispatcher.apply("selectionChanged",{callerID:that.id,time:obj.idObj,timeType: timeType,  datafiltered: that.selectedIDS})

        this.dados_chart = this.selectedIDS.map(
        function(d){
          return {
            idObj : d.idObj ,
            average: (d3.sum(d.trajetoria.map(function(e){return e[that.selected]})) / d.trajetoria.length)
          }
        }

      )
      this.updateInteractive();
       
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
    if(contx instanceof MouseEvent){
      //Retorno a tela anterior, remove o botaoe muda o combobox
      this.button.remove();
      this.selectList.innerHTML = "";
      for (var i = 0; i < this.time.length; i++) {
            var option = document.createElement("option");
            option.value = this.time[i];
            option.text = this.time[i];
            this.selectList.appendChild(option);
      }
        this.selectList.onchange = this.returnB.bind(that);
        this.selected = this.time[0];  
    }else{
      this.selected = contx.target.value;
    }
    var aux =        this.data.map(function(e){ e.trajetoria.forEach(function(c){c.id = e.idObj;} ) ; return e.trajetoria});
    var  teste =  [].concat.apply([], aux)
    var aux =     d3.nest()
                  .key(function(d) { return d.datahora.toLocaleString("en-us", that.optionsDate[that.selected] ); })
                  .key(function(d) { return d.id })
                  .entries(teste);


    this.dados_chart = aux.map(
        function(d){
          return {
            idObj : d.key ,
            average: d.values.length,
            obj: d.values
          }
        }

      )
    this.xScale = d3.scaleBand().rangeRound([0, this.width]).padding(0.2);
    this.yScale = d3.scaleLinear().rangeRound([this.height,0]);
    this.xScale.domain(this.dados_chart.map(function(d){return d.idObj}));
    var xScale = this.xScale;
    var yScale = this.yScale;  
    
    this.xAxis = d3.axisBottom(this.xScale).ticks(10);

    //
    var height = this.height;
    var dataYExtent = d3.extent(this.dados_chart.map(function(d){return d.average}));
    //mudar
    dataYExtent[0] = 0;
    this.yScale.domain(dataYExtent);
    this.xAxis.scale(this.xScale);
    this.xAxisGroup.call(this.xAxis);

    this.yAxis.scale(this.yScale);
    this.yAxisGroup.call(this.yAxis);

    
    this.canvas
        .selectAll(".bar").remove();
    this.canvas.select(".title")
                .text("Event per " + this.selected);
    
    this.canvas
        .selectAll(".bar")
        .data(this.dados_chart).enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {  return xScale(d.idObj); })
        .attr("y",function(d){  return yScale(d.average);  })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d.average); })
        .on("mouseover", this.barover.bind(this))
        .on("mouseout",function(){
            that.canvas.select(".tooltip").remove();
        })
        .on("click", this.barclick.bind(that))


    
     
    this.yAxisGroup
      .select(".ylabel")
      .text("Number of event")
    this.xAxisGroup
            .selectAll(".tick")
            .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

    this.xAxisGroup
      .select(".xlabel")
      .text(this.selected)




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

    this.selected   = thisCont.target.value;
    this.dados_chart = this.selectedIDS.map(
        function(d){
          return {
            idObj : d.idObj ,
            average: (d3.sum(d.trajetoria.map(function(e){return e[thisCont.target.value]})) / d.trajetoria.length)
          }
        }

    )

    var dataYExtent = d3.extent(this.dados_chart.map(function(d){return d.average}));
    if(dataYExtent[0]>= 0){
      dataYExtent[0] = 0;
    }else{
      if(dataYExtent[1] < 0){
        dataYExtent[1] = dataYExtent[0];
        dataYExtent[0] = 0;
      }
    }

    console.log(dataYExtent)
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
      .select(".ylabel")
      .text(this.selected)

    transition.select(".yAxis") // change the y axis
      .call(this.yAxis);

    
  }



}  
