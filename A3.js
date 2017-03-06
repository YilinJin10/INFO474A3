var margin = { top: 50, right: 300, bottom: 50, left: 50 },
    outerWidth = 1050,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

var xCat = "Fiber_TD",
    yCat = "Protein",
    rCat = "Lipid_Tot";
     // colorCat = "FoodName";

d3.csv("nutrition.csv", function(data) {
  data.forEach(function(d) {
    // d.Calories = +d.Calories;
    // d.Carbs = +d.Carbs;
    // d["Cups per Serving"] = +d["Cups per Serving"];
    // d["Dietary Fiber"] = +d["Dietary Fiber"];
    // d["Display Shelf"] = +d["Display Shelf"];
    // d.Fat = +d.Fat;
    // d.Potassium = +d.Potassium;
    // d["Protein (g)"] = +d["Protein (g)"];
    // d["Serving Size Weight"] = +d["Serving Size Weight"];
    // d.Sodium = +d.Sodium;
    // d.Sugars = +d.Sugars;
    // d["Vitamins and Minerals"] = +d["Vitamins and Minerals"];
    d.Protein = +d.Protein;
    d.Fiber_TD = +d.Fiber_TD;
    d.Lipid_Tot = +d.Lipid_Tot;
  });

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

  // var color = d3.scale.category10();

  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
       return d.FoodName + ": " + "<br>" + xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat] + "<br>Lipid: " + d.Lipid_Tot;
      });

  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoomBeh);

  svg.call(tip);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height);

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

  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

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

  objects.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .classed("dot", true)
      .attr("r", function (d) { return 6 * Math.sqrt(d[rCat] / Math.PI); })
      .attr("transform", transform)
      .style("fill", "#4682b4")
      .style("opacity", "0.5")
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

  // var legend = svg.selectAll(".legend")
  //     .data(color.domain())
  //   .enter().append("g")
  //     .classed("legend", true)
  //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // legend.append("circle")
  //     .attr("r", 3.5)
  //     .attr("cx", width + 20)
  //     .attr("fill", color);

  // legend.append("text")
  //     .attr("x", width + 26)
  //     .attr("dy", ".35em")
  //     .text(function(d) { return d; });

  d3.select("input").on("click", change);

  function change() {
    xCat = "Fiber_TD";
    xMax = d3.max(data, function(d) { return d[xCat]; });
    xMin = d3.min(data, function(d) { return d[xCat]; });

    zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

    var svg = d3.select("#scatter").transition();

    svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);

    objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
  }

  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }









// bar graph setting up
var name = d3.nest()
    .key(function(d){return d.FoodName})
    .rollup(function(v){return v.Fiber_TD})
    .entries(data);

var sorted = data.sort(function(a, b) {
  return (b.Protein + b.Fiber_TD) - (a.Protein + a.Fiber_TD);
})

var x_domain = [];
var y_domain = [];
var y2_domain = [];
var sort20 =[];

for (i = 0; i < 20; i++) {
  x_domain[i] = sorted[i].FoodName;
  y_domain[i] = sorted[i].Protein;
  y2_domain[i] = sorted[i].Fiber_TD;
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
    return b.Lipid_Tot - a.Lipid_Tot;
  })

  var x_domain = [];
  var y_domain = [];
  var y2_domain = [];

  for (i = 0; i < 20; i++) {
    x_domain[i] = sortedK[i].FoodName;
    y_domain[i] = sortedK[i].Protein;
    y2_domain[i] = sortedK[i].Fiber_TD;
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



});













