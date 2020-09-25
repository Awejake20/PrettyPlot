



//counties is the array of data
//target is the selection of the g element to place the graph in
//xscale,yscale are the x and y scales.
var drawPlot = function(counties,target,
                         xScale,yScale)
{
    target
    .selectAll("circle")
    .data(counties)
    .enter()
    .append("circle")
    .attr("cx",function(county)
    {
        return xScale(county.white_pct);   
    })
    .attr("cy",function(county)
    {
        return yScale(county.trumpPercentage);    
    })
    .attr("r",2.5)
    .attr("class",function(county)
    {
        if(county.lesscollege_pct<80)
        {
            return "lessCollege"        
        }
        else if(county.clf_unemploy_pct<6)
        {
            return "unemployment";        
        }
    })//tooltip on
    .on("mouseenter" ,function(county)
      {
        
      var xPos = d3.event.pageX;
      var yPos = d3.event.pageY;
      
        d3.select("#tooltip")
        .classed("hidden",false)
        .style("top",yPos+"px")
        .style("left",xPos+"px")
        
        d3.select("#state")
        .text(county.state);
        
        d3.select("#county")
        .text(county.county);
      })//tool tip off
    .on("mouseleave",function()
    {
        d3.select("#tooltip")    
        .classed("hidden",true);
    })
}


var makeTranslateString = function(x,y)
{
    return "translate("+x+","+y+")";
}


//graphDim is an object that describes the width and height of the graph area.
//margins is an object that describes the space around the graph
//xScale and yScale are the scales for the x and y scale.
var drawAxes = function(graphDim,margins,
                         xScale,yScale)
{
   //var xAxis=d3.svg.axis()
   //.scale(xScale)
   //.orient("bottom")
   var xAxis=d3.axisBottom(xScale)
   d3.select("svg")
    .append("g")
    .call(xAxis)
    .attr("transform", makeTranslateString(margins.left, graphDim.height+margins.top))
    
    var yAxis = d3.axisLeft(yScale)
    d3.select("svg")
    .append("g")
    .attr("transform", makeTranslateString(margins.left, margins.top))
    .call(yAxis)
 
}


//graphDim -object that stores dimensions of the graph area
//margins - objedct that stores the size of the margins
var drawLabels = function(graphDim,margins)
{
    var title = d3.select("svg")
   
    title.append("text")
    .text("Trump Support")
    .classed("title", true)
    .attr("text-anchor","middle")
    .attr("x",margins.left+(graphDim.width/2))
    .attr("y",margins.top)
    
    var xLabel = d3.select("svg")
    
    xLabel.append("text")
    .text("Percent White")
    .classed("label", true)
    .attr("text-anchor","middle")
    .attr("x",margins.left+(graphDim.width/2))
    .attr("y",graphDim.height+margins.top+margins.bottom)
    
    var yLabel = d3.select("svg")
    yLabel.append("text")
    .attr("transform",makeTranslateString(margins.left/2, margins.top+graphDim.height/2 ) + " rotate(-90)")
    .text("Percentage Voting for Trump")
    .classed("label","true")
    .attr("text-anchor","middle")
    //.attr("transform", "rotate(-90)")
}


var drawLegend = function(graphDim,margins)
{
    
 
   var categories = [
       {
           class:"lessCollege",
           name:"Less College"
       },
       {
           class:"unemployment",
           name:"High unemployment"
       }
    ]

var legend = d3.select("svg")
    .append("g")
    .classed("legend",true)
    .attr("transform", makeTranslateString(90,70) )

var entries = legend.selectAll("g")
        .data(categories.map(function(category)
                            {
            return category.name
        }))
        .enter()
        .append("g")
        .classed("legendEntry",true)
        .attr("fill", function(category)
              { 
            if(category == "Less College")
                {return "red"}
            if(category == "High unemployment")
                {return "blue"}
        })
        .attr("transform",function(categories,index)
              {
                return "translate(0,"+index*20+")";
              })
              
        entries.append("rect")
                .attr("width",10)
                .attr("height",10)
    
        entries.append("text")
                .text(function(name){return name})
                .attr("x",15)
                .attr("y",10)
    
    
    
}

//sets up several important variables and calls the functions for the visualization.
var initGraph = function(counties)
{
    //size of screen
    var screen = {width:800,height:600}
    //how much space on each side
    var margins = {left:70,right:20,top:50,bottom:30}
    
    
    
    var graph = 
        {
            width:screen.width-margins.left-margins.right,
            height:screen.height - margins.top-margins.bottom
        }
    console.log(graph);
    
    d3.select("svg")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
    var target = d3.select("svg")
    .append("g")
    .attr("id","#graph")
    .attr("transform",
          "translate("+margins.left+","+
                        margins.top+")");
    
    
    var xScale = d3.scaleLinear()
        .domain([0,100])
        .range([0,graph.width])

    var yScale = d3.scaleLinear()
        .domain([0,1])
        .range([graph.height,0])
    
    drawAxes(graph,margins,xScale,yScale);
    drawPlot(counties,target,xScale,yScale);
    drawLabels(graph,margins);
    drawLegend(graph,margins);
    
    
    
    
    
}




var successFCN = function(counties)
{
    console.log("politics",counties);
    initGraph(counties);
}

var failFCN = function(error)
{
    console.log("error",error);
}

var polPromise = d3.csv("data/politics.csv")
polPromise.then(successFCN,failFCN);