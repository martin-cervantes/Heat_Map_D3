const getData = async () => {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json`, { mode: 'cors' });

    const data = await response.json();

    return data;
  } catch (error) {
    alert(error);
  }
  return false;
};


const drawMap = async (info) => {
  const temperatures = await info;
  const data = temperatures.monthlyVariance;

  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const minYear = data.reduce((max, item) => (item.year < max ? item.year : max), Number.MAX_SAFE_INTEGER);

  const maxYear = data.reduce((min, item) => (item.year > min ? item.year : min), 0);

  const colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];

  const width = window.innerWidth - 20;
  const height = window.innerHeight - 130;

  const padding = 70;

  const xScale = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([padding, width - padding]);

  const yScale = d3.scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .range([padding, height - padding]);

  const widthConst = parseFloat(width / (maxYear - minYear));
  const heightConst = yScale.bandwidth();

  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format("d"))
    .ticks(26);

  const yAxis = d3.axisLeft(yScale)
    .tickValues(yScale.domain())
    .tickFormat(function(d){
      return month[d];
    });

  const svg = d3.select("#main")
     .append("svg")
     .attr("width", width)
     .attr("height", height);

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 + padding - 60)
    .attr("x", 0 - height / 2.5)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Months");

  svg
    .append("g")
    .attr("transform", "translate(" + padding + "," + 0 + ")")
    .attr("id", "y-axis")
    .call(yAxis);

  svg
    .append("text")
    .attr("transform","translate(" + width / 2 + " ," + (height - padding + 40) + ")")
    .style("text-anchor", "middle")
    .text("Year");

  svg
    .append("g")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .attr("id", "x-axis")
    .call(xAxis);

  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "toolTip")
    .attr("id", "tooltip");

  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("x", d => (xScale(d.year)))
    .attr("y", d => (yScale(d.month - 1)))
    .attr("width", widthConst)
    .attr("height", heightConst)
    .attr("data-month",(d) => d.month - 1)
    .attr("data-year",(d) => d.year)
    .attr("data-temp",(d) => d.variance)
    .style("fill", (d, i) => {
      const temp =  parseFloat(d.variance + temperatures.baseTemperature);

      if(temp < 2.8)
        return colors[0];
      else if(temp < 3.9)
        return colors[1];
      else if(temp < 5.0)
        return colors[2];
      else if(temp < 6.1)
        return colors[3];
      else if(temp < 7.2)
        return colors[4];
      else if(temp < 8.3)
        return colors[5];
      else if(temp < 9.4)
        return colors[6];
      else if(temp < 10.5)
        return colors[7];
      else if(temp < 11.6)
        return colors[8];
      else if(temp < 12.7)
        return colors[9];
      else
        return colors[10];
    }).on("mouseover", function(d, i) {
      const tempCalc =  parseFloat(d.variance + temperatures.baseTemperature);

      tooltip.attr("data-year",d.year)
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY + "px")
        .style("display", "inline-block")
        .style("opacity", 1)
        .html("Varience: " + d.variance + "<br>" + "temperature: " + tempCalc.toFixed(1));

    }).on("mouseout", function(d) {
      tooltip.style("opacity", 0);
    });

  const legendsvg = d3.select("#main")
    .append("svg")
    .attr("class","svglegend")
    .attr("width", width)
    .attr("height", 60)
    .attr("x",padding)
    .attr("y",height)
    .attr("id","legend");

  const xScaleLegend = d3.scaleLinear()
    .domain([0,9])
    .range([padding, (width / 3) - padding]);

  const xAxisLegend = d3
    .axisBottom(xScaleLegend)
    .tickFormat(function(d,i){
      const scaleLabel = (2.8 + (1.1*(i)));
      return scaleLabel.toFixed(1);
    });

  legendsvg
    .append("g")
    .attr("transform", "translate(0," + (40) + ")")
    .attr("id", "x-axislegend")
    .call(xAxisLegend);

  legendsvg.selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("x", (d, i)=>{
      return xScaleLegend(i-1);
    }).attr("y", (d) => {
      return 10;
    }).attr("width", 50)
    .attr("height", 30)
    .style("fill",(d,i)=>{
       return colors[i];
    })
}

drawMap(getData());
