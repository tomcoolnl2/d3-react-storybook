/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.8 - Activity: Your first visualization!
*/

const data = d3.json('../data/buildings.json').then(data => {
    
    data.forEach(d => {
		d.height = Number(d.height)
	})

    const svg = d3.select("#chart-area").append("svg")
        .attr("width", 500)
        .attr("height", 500)

    const buildings = svg.selectAll("rect")
		.data(data)
    
    const w = 50
    
    buildings.enter().append("rect")
        .attr("x", (d, i) => (i * (w + 20)))
        .attr("y", 0)
        .attr("width", 50)
        .attr("height", d => d.height)
    
}).catch(error => {
	console.log(error)
})