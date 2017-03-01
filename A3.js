var margin = { top: 50, right: 300, bottom: 50, left: 50 },
    outerWidth = 1050,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

var xCat = "Fiber",
    yCat = "Protein",
    rCat = "Energy_Kcal";
    colorCat = "blue";

// load data
d3.csv("nutrition.csv", function(data) {
  data.forEach(function(d) {
    d.Energy_Kcal = +d.Energy_Kcal;
    d.Fiber = +d.Fiber_TD;
    d.Protein = +d.Protein;
    d.Lipid = +d.Lipid_Tot;
  });


// bar graph setting up
var name = d3.nest()
    .key(function(d){return d.FoodName})
    .rollup(function(v){return v.Fiber})
    .entries(data);

var sorted = data.sort(function(a, b) {
  return (b.Protein + b.Fiber) - (a.Protein + a.Fiber);
})

var x_domain = [];
var y_domain = [];
var y2_domain = [];
var sort20 =[];

for (i = 0; i < 20; i++) {
  x_domain[i] = sorted[i].FoodName;
  y_domain[i] = sorted[i].Protein;
  y2_domain[i] = sorted[i].Fiber;
  sort20[i] = sorted[i];
}

var trace1 = {
    x: x_domain,
    y: y_domain,
    name: 'Protein',
    type: "bar"
};

var trace2 = {
    x: x_domain,
    y: y2_domain,
    name: 'Fiber',
    type: "bar"
};

var barChart = [trace1, trace2]
      marker: {color: 'rgb(0,89,45)'};

var layout = {
  barmode: 'stack',
  yaxis: {
    title: 'Nutrition Content'
  }
};

// draw stacked bar graph
  Plotly.newPlot('bar', barChart, layout, {showLink: false, displayModeBar:false});

// sort by lipid function
$('#buttonLipid').click(function() {
  var sortedK = sort20.sort(function(a, b) {
    return b.Lipid - a.Lipid;
  })

  var x_domain = [];
  var y_domain = [];
  var y2_domain = [];

  for (i = 0; i < 20; i++) {
    x_domain[i] = sortedK[i].FoodName;
    y_domain[i] = sortedK[i].Protein;
    y2_domain[i] = sortedK[i].Fiber;
  }

  var trace1 = {
      x: x_domain,
      y: y_domain,
      name: 'Protein',
      type: "bar"
  };

  var trace2 = {
      x: x_domain,
      y: y2_domain,
      name: 'Fiber',
      type: "bar"
  };

  var barChart = [trace1, trace2]
        marker: {color: 'rgb(0,89,45)'};

  var layout = {
    barmode: 'stack',
    yaxis: {
      title: 'Nutrition Content'
    }
  };

// update the chart after sorting
    Plotly.newPlot('bar', barChart, layout, {showLink: false, displayModeBar:false});

});

// scatter plot setting up
  var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05,
      xMin = d3.min(data, function(d) { return d[xCat]; }),
      xMin = xMin > 0 ? 0 : xMin,
      yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
      yMin = d3.min(data, function(d) { return d[yCat]; }),
      yMin = yMin > 0 ? 0 : yMin;

  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

  var color = d3.scale.category10();

// create the tooltip
  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 5])
      .html(function(d) {
        return d.FoodName + ": " + "<br>" + xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat] + "<br>Lipid: " + d.Lipid;
      });

// zoom function, will add it back after fixing the problem that data points not moving with scale
  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      //.on("zoom", zoom);

  var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoomBeh);

  svg.call(tip);

// set up the axis and add label to it
  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .attr("x", width)
      .attr("y", margin.bottom - 10)
      .style("text-anchor", "end")
      .text(xCat);

  svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yCat);

// draw lines
  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height)

  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

  // draw circles
  objects.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .classed(".dot", true)
      .attr("r", function (d) { return 8 * Math.sqrt(d.Lipid/ 12); })
      .attr("cx", function(d) { return x[d.Protein];  })
        .attr("cy", function(d) { return y[d.Fiber];  })
      .attr("transform", transform)
      .style("fill", function(d) { return color(d[colorCat]); })
      .style("opacity", .3)
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

  d3.select("input").on("click", change);

  function change() {
    xCat = "Fiber";
    xMax = d3.max(data, function(d) { return d[xCat]; });
    xMin = d3.min(data, function(d) { return d[xCat]; });

    zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

    var svg = d3.select("#scatter").transition();

    svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);
    svg.select(".y.axis").duration(750).call(yAxis).select(".label").text(yCat);

    objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
  }

  function zoom() {
    svg.select(".x.axis").call(xAxis).style("font-size", '15pt');
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }
});

