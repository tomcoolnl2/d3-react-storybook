
import * as d3 from 'd3'
import { 
    D3Stack, MarginCoords,
    D3IterableStackData, 
    D3Axis, 
    D3ScaleBand, 
    D3ScaleLinear, 
    D3ScaleOrdinal, 
    D3Selection, 
    D3AreaShape
} from '../../../models'
import { Measurement } from './models'


export class StackedBarChartChart {
    
    private readonly fullWidth: number = 460
    private readonly fullHeight: number = 400
    private readonly margin: MarginCoords = { top: 10, right: 30, bottom: 20, left: 50   }
    private readonly width: number = this.fullWidth - this.margin.left - this.margin.right
    private readonly height: number = this.fullHeight - this.margin.top - this.margin.bottom

    private readonly parent: SVGSVGElement = null
    private svg: D3Selection<SVGSVGElement> = null
    private mainGroup: D3Selection<SVGGElement> = null
    
    private xScale: D3ScaleBand = null
    private yScale: D3ScaleLinear = null
    private colorScale: D3ScaleOrdinal = null
    
    private xAxisCall: D3Axis = null
    private yAxisCall: D3Axis = null
    private xAxis: D3Selection<SVGGElement> = null
    private yAxis: D3Selection<SVGGElement> = null

    private data: any = null

    subgroups: any
    groups: any

    constructor(parent: SVGSVGElement, data: any) {

        this.parent = parent
        this.normalize(data)
        this.initialize()
        this.draw()
    }

    private normalize(data: any): void {

        this.subgroups = data.columns.slice(1)
        delete data.columns

        this.groups = data.map((d: any) => d.group)

        this.data = data
    }

    private initialize(): void {
        
        this.svg = d3.select(this.parent)
            .attr('width', this.fullWidth)
            .attr('height', this.fullHeight)

        this.mainGroup = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
        
        this.xScale = d3.scaleBand()
            .domain(this.groups)
            .range([0, this.width])
            .padding(0.2)

        this.yScale = d3.scaleLinear()
            .domain([0, 60])
            .range([this.height, 0])
        
        this.colorScale = d3.scaleOrdinal()
            .domain(this.subgroups)
            .range(['#e41a1c','#377eb8','#4daf4a'])

        this.xAxisCall = d3.axisBottom(this.xScale).tickSizeOuter(0)
        this.xAxis = this.mainGroup.append('g')
            .attr('transform', `translate(0, ${this.height})`)
            .call(this.xAxisCall)

        this.yAxisCall = d3.axisLeft(this.yScale)
        this.yAxis = this.mainGroup.append('g')
            .call(this.yAxisCall)
    }

    private draw(): void {
        
        const stackedData = d3.stack().keys(this.subgroups)(this.data)
        console.log('stackedData', stackedData)
        
        this.mainGroup.selectAll('g')
			.data(stackedData)
            .enter().append('g')
                .attr('fill', (d: any) => this.colorScale(d.key))
                .selectAll('rect')
                .data(d => d)
                .enter().append('rect')
                    .attr('x', (d: any) => this.xScale(d.data.group))
                    .attr('y', d => this.yScale(d[1]))
                    .attr('height', d => this.yScale(d[0]) - this.yScale(d[1]))
                    .attr('width', this.xScale.bandwidth)

        // svg.append("g")
        //     .selectAll("g")
        //     // Enter in the stack data = loop key per key = group per group
        //     .data(stackedData)
        //     .join("g")
        //         .attr("fill", d => color(d.key))
        //         .selectAll("rect")
        //         // enter a second time = loop subgroup per subgroup to add all rectangles
        //         .data(d => d)
        //         .join("rect")
        //         .attr("x", d => x(d.data.group))
        //         .attr("y", d => y(d[1]))
        //         .attr("height", d => y(d[0]) - y(d[1]))
        //         .attr("width",x.bandwidth())
    }
}
