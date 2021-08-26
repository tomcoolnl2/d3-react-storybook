
import * as d3 from 'd3'
import { D3Axis, D3ScaleBand, D3ScaleLinear, D3Selection, MarginCoords } from '../../../models'
import { Measurement } from './models'


export class BarChartAxisChart {

    private readonly fullWidth: number = 600
    private readonly fullHeight: number = 600
    private readonly margin: MarginCoords = { bottom: 100, left: 100 }
    private readonly width: number = this.fullWidth - this.margin.left
    private readonly height: number = this.fullHeight - this.margin.bottom
    
    private readonly parent: SVGSVGElement = null
    private svg: D3Selection<SVGSVGElement> = null
    private mainGroup: D3Selection<SVGGElement> = null
    private data: Measurement[] = null
    private xScale: D3ScaleBand = null
    private yScale: D3ScaleLinear = null
    private xAxisCall: D3Axis = null
    private yAxisCall: D3Axis = null
    private xAxisGroup: D3Selection<SVGGElement> = null
    private yAxisGroup: D3Selection<SVGGElement> = null

    constructor(parent: SVGSVGElement, data: Measurement[]) {
        this.parent = parent
        this.data = data
        this.initialize()
        this.draw()
    }

    private initialize(): void {

        this.svg = d3.select(this.parent)
            .attr('width', this.fullWidth)
            .attr('height', this.fullHeight)

        this.mainGroup = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left}, 0)`)

        this.xScale = d3.scaleBand()
            .domain(this.data.map(({ name }: Measurement) => name))
            .range([0, this.width])
            .padding(0.1)

        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, ({ units }: Measurement) => units)])
            .range([this.height, 0])
        
        this.xAxisCall = d3.axisBottom(this.xScale) 
        this.yAxisCall = d3.axisLeft(this.yScale)
            .ticks(3)
            .tickFormat(d3NumberValue => `${d3NumberValue} units`)
        
        this.xAxisGroup = this.mainGroup.append('g')
            .attr('transform', `translate(0, ${this.height})`)
            .call(this.xAxisCall)

        this.yAxisGroup = this.mainGroup.append('g')
            .call(this.yAxisCall)
    }

    private draw(): void {

        this.xAxisGroup.selectAll('text')
            .attr('transform', 'rotate(-40)')
            .attr('text-anchor', 'end')
            .attr('font-size', '15px')

        // bar chart
        this.mainGroup.append('g')
            .selectAll('rect')
                .data(this.data)
                .enter().append('rect')
                    .attr('fill', 'mediumaquamarine')
                    .attr('width', this.xScale.bandwidth)
                    .attr('height', ({ units }: Measurement) => this.height - this.yScale(units))
                    .attr('x', ({ name }: Measurement) => this.xScale(name))
                    .attr('y', ({ units }: Measurement) => this.yScale(units))
    }
}