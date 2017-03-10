var margin = { top: 50, right: 300, bottom: 50, left: 50 },
    outerWidth = 1050,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var attributes = ["Lipid_Tot"];
var ranges = [0, 100];

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
    d.Protein = +d.Protein;
    d.Fiber_TD = +d.Fiber_TD;
    d.Lipid_Tot = +d.Lipid_Tot;
    d.Energ_kcal = +d.Energ_kcal;
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

drawVis(data);



function drawVis(data){
  svg.selectAll(".dot").remove();
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
  
  // objects.selectAll(".dot")
  //     .data(data)
  //   .enter().append("circle")
  //     .classed("dot", true)
  //     .attr("r", function (d) { return 6 * Math.sqrt(d[rCat] / Math.PI); })
  //     .attr("transform", transform)
  //     .style("fill", function(d) {
  //         var sortd = data.sort(function(a, b) {
  //             return (b.Protein + b.Fiber_TD) - (a.Protein + a.Fiber_TD);
  //         })

  //         var sort20 = [];
  //         for (i = 0; i < 20; i++) {
  //           sort20[i] = sortd[i];
  //           if (data.FoodName == sort20[i].FoodName) {
  //             return "rgb(0, 89, 45)";
  //           }
  //         }
  //         return "#4682b4";
  //     })
  //     .style("opacity", "0.5")
  //     .on("mouseover", tip.show)
  //     .on("mouseout", tip.hide);
  
  // var sorted = data.sort(function(a, b) {
  //   return (b.Protein + b.Fiber_TD) - (a.Protein + a.Fiber_TD);
  // })

  // var x_domain = [];
  // var y_domain = [];
  // var y2_domain = [];
  // var sort20 =[];

  // for (i = 0; i < 20; i++) {
  //   x_domain[i] = sorted[i].FoodName;
  //   y_domain[i] = sorted[i].Protein;
  //   y2_domain[i] = sorted[i].Fiber_TD;
  //   sort20[i] = sorted[i];
  // }

  // objects.selectAll(".dot")
  //     .data(sort20)
  //   .enter().append("circle")
  //     .classed("dot", true)
  //     .attr("r", function (d) { return 6 * Math.sqrt(d[rCat] / Math.PI); })
  //     .attr("transform", transform)
  //     .style("fill", 'rgb(221, 221, 221)')
  //     .style("opacity", "0.5")
  //     .on("mouseover", tip.show)
  //     .on("mouseout", tip.hide);
} 

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

// slider filter for lipid

function filter(attr, values) {
    //  set range of changed attribute to the new values from the slider
    for (i = 0; i < attributes.length; i++) {
        if(attr === attributes[i]) {
            ranges[i] = values;
        }
    }
    var toVisualize = data.filter(function(d) {return isInRange(d)});
    drawVis(toVisualize);
}

// Fiber slider
$(function() {
    $("#range2").slider({
        range: true,
        min: 0,
        max: 100,
        values: [0, 100],
        slide: function(event, ui) {
            $("#LipidRange").val(ui.values[0] + " - " + ui.values[1]);
            filter("Lipid_Tot", ui.values);
        }
    });
    $("#LipidRange").val($("#range2").slider("values",0) + " - " + $("#range2").slider("values",1));
});

function isInRange(datum) {
    for (i = 0; i < attributes.length; i++) {
        if (datum[attributes[i]] < ranges[i][0] || datum[attributes[i]] > ranges[i][1]) {
            return false;
        }
    }
    return true;
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
    title: 'Nutrition Content (g)/100g',
      fixedrange: true,
  },
  xaxis: {
    fixedrange:true,
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

  $('#reset').click(function() {


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
          title: 'Nutrition Content (g)/100g',
            fixedrange: true,
        },
        xaxis: {
          fixedrange:true,
        }
      };

      // draw stacked bar graph
        Plotly.newPlot('bar', barChart, layout, {showLink: false, displayModeBar:false});

});

});













