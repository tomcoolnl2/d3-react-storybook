
import * as d3 from 'd3'
import { D3Area, D3ScaleLinear, D3ScaleTime, D3Selection, MarginCoords } from '../../../models'
import { Measurement, RawMeasurement } from './models'


export class AreaChartChart {
    
    private readonly fullWidth: number = 460
    private readonly fullHeight: number = 400
    private readonly margin: MarginCoords = { top: 10, right: 30, bottom: 30, left: 50 }
    private readonly width = this.fullWidth - this.margin.left - this.margin.right
    private readonly height = this.fullHeight - this.margin.top - this.margin.bottom

    private readonly parent: SVGSVGElement = null
    private svg: D3Selection<SVGSVGElement> = null
    private mainGroup: D3Selection<SVGGElement> = null
    private xScale: D3ScaleTime = null
    private yScale: D3ScaleLinear = null
    private xAxis: D3Selection<SVGGElement> = null
    private yAxis: D3Selection<SVGGElement> = null
    private area: D3Area<Measurement>

    private data: Measurement[] = null

    constructor(parent: SVGSVGElement, data: RawMeasurement) {
        this.parent = parent
        this.normalize(data)
        this.initialize()
        this.draw() 
    }

    private normalize(data: RawMeasurement): void {
        this.data = data.map(({ date, value }): Measurement => ({
            date: d3.timeParse('%Y-%m-%d')(date),
            value: parseFloat(value)
        }))
    }

    private initialize(): void {

        this.svg = d3.select(this.parent)
            .attr('width', this.fullWidth)
            .attr('height', this.fullHeight)
        
        this.mainGroup = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
        
        this.xScale = d3.scaleTime()
            .domain(d3.extent(this.data, d => d.date))
            .range([ 0, this.width ]);

        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d.value )])
            .range([ this.height, 0 ]);

        this.xAxis = this.mainGroup.append('g')
            .attr('transform', `translate(0, ${this.height})`)
            .call(d3.axisBottom(this.xScale))

        this.yAxis = this.mainGroup.append('g')
            .call(d3.axisLeft(this.yScale))

        this.area = d3.area<Measurement>()
            .x(d => this.xScale(d.date))
            .y0(this.yScale(0))
            .y1(d => this.yScale(d.value))
    }

    private draw(): void {
        
        this.mainGroup.append('path')
            .datum(this.data)
            .attr('fill', '#cce5df')
            .attr('stroke', '#69b3a2')
            .attr('stroke-width', 1.5)
            .attr('d', this.area)
    }
}