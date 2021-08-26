/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

const MARGIN = { LEFT: 100, RIGHT: 50, TOP: 10, BOTTOM: 130 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM
    
const g = d3.select("#chart-area")
    .append("svg")
        .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
    .append("g")
        .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// X label
g.append("text")
    .attr("class", "x axis-label")
    .attr("x", WIDTH / 2)
    .attr("y", HEIGHT + 50)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month")

// Y label
g.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (HEIGHT / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue")

d3.csv("/data/revenues.csv").then(data => {
    console.log(data)

    const x = d3.scaleBand()
        .domain(data.map(d => d.month))
        .range([0, WIDTH])
        .paddingInner(0.3)
        .paddingOuter(0.2)

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.revenue)])
        .range([HEIGHT, 0])

    const xAxisCall = d3.axisBottom(x)
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${HEIGHT})`)
        .call(xAxisCall)

    const yAxisCall = d3.axisLeft(y)
    g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall)


    const rects = g.selectAll("rect")
        .data(data)
      
    rects.enter().append("rect")
        .attr("y", d => y(d.revenue))
        .attr("x", d => x(d.month))
        .attr("width", x.bandwidth)
        .attr("height", d => HEIGHT - y(d.revenue))
        .attr("fill", "rebeccapurple")
})