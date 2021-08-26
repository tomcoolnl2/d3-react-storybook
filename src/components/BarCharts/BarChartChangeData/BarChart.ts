
import * as d3 from 'd3'
import { D3ScaleLinear, D3Selection, D3Transition } from '../../../models'
import { DataRange } from './models'


export class BarChart {
    
    private readonly width: number = 600
    private readonly height: number = 400
    private readonly parent: SVGSVGElement = null
    private svg: D3Selection<SVGSVGElement> = null
    private dataPartition: DataRange = null
    private yScale: D3ScaleLinear = null

    constructor(parent: SVGSVGElement, dataPartition: DataRange) {
        this.parent = parent
        this.initialize()
        this.draw(dataPartition)
    }

    private initialize(): void {

        this.svg = d3.select(this.parent)
            .attr('width', this.width)
            .attr('height', this.height)
            .style('border', '1px solid black')
        
        this.yScale = d3.scaleLinear()
            .range([0, this.height - 100])
    }

    public draw(dataPartition: DataRange): void {
    
        this.dataPartition = dataPartition

        this.yScale.domain([0, d3.max(this.dataPartition)])

        const selection = this.svg.selectAll<SVGRectElement, unknown>('rect')
            .data<number>(this.dataPartition)

        
        const t: D3Transition = d3.transition().duration(300)
        
        selection
            .transition(t)
                .attr('height', (d: number) => this.yScale(d))
                .attr('y', (d: number) => this.height - this.yScale(d))

        selection
            .enter()
            .append('rect')
            .attr('x', (d: number, i: number) => i * 45)
            .attr('y', this.height)
            .attr('width', 40)
            .attr('height', 0)
            .attr('fill', 'tomato')
            .transition(t)
                .attr('height', (d: number) => this.yScale(d))
                .attr('y', (d: number) => this.height - this.yScale(d))
        
        selection
            .exit()
            .transition(t)
                .attr('y', this.height)
                .attr('height', 0)
                .remove()
    }
}