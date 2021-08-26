
import * as d3 from "d3"
import { D3ScaleBand, D3ScaleLinear, D3Selection } from "../../../models"
import { Measurement } from "./models"


export class BarChart {
    
    private readonly width: number = 800
    private readonly height: number = 500
    private readonly parent: SVGSVGElement = null
    private data: Measurement[] = null
    private svg: D3Selection<SVGSVGElement> = null
    private mainGroup: D3Selection<SVGGElement> = null
    private xScale: D3ScaleBand = null
    private yScale: D3ScaleLinear = null

    constructor(parent: SVGSVGElement, data: Measurement[]) {
        this.parent = parent
        this.setData(data)
        this.initialize()
        this.draw()
    }
    
    private initialize(): void {

        this.svg = d3.select(this.parent)
            .attr('width', this.width)
            .attr('height', this.height)

        this.mainGroup = this.svg.append('g')

        this.xScale = d3.scaleBand()
            .domain(this.data.map(({ name }: Measurement) => name))
            .range([0, this.width])
            .padding(0.05)

        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, ({ units }: Measurement) => units)])
            .range([this.height, 0])

        this.mainGroup
            .selectAll('rect')
            .data<Measurement>(this.data)
            .enter().append('rect')
                .attr('x', ({ name }: Measurement) => this.xScale(name))
                .attr('y', this.height)
                .attr('width', this.xScale.bandwidth)
                .attr('fill', 'orange')
                .attr('height', 0)
                .transition().duration(700).delay((_: Measurement, i: number) => i * 100).ease(d3.easeElastic)
                    .attr('height', ({ units }: Measurement) => this.height - this.yScale(units))
                    .attr('y', ({ units }: Measurement) => this.yScale(units))
    }

    public setData(data: Measurement[]): BarChart {
        this.data = data
        return this
    }

    public draw(): void {

        this.xScale.domain(this.data.map(({ name }: Measurement) => name))
        this.yScale.domain([0, d3.max(this.data, ({ units }: Measurement) => units)])

        const rects = this.mainGroup.selectAll<SVGRectElement, unknown>('rect').data<Measurement>(this.data)

        rects.exit()
            .transition().ease(d3.easeElastic).duration(400)
                .attr('height', 0)
                .attr('y', this.height)
                .remove()

        rects.transition().delay(300)
            .attr('x', ({ name }: Measurement) => this.xScale(name))
            .attr('y', ({ units }: Measurement) => this.yScale(units))
            .attr('width', this.xScale.bandwidth)
            .attr('height', ({ units }: Measurement) => this.height - this.yScale(units))
            .attr('fill', 'orangered')

        rects.enter().append('rect')
            .attr('x', ({ name }: Measurement) => this.xScale(name))
            .attr('width', this.xScale.bandwidth)
            .attr('height', 0)
            .attr('y', this.height)
            .transition().delay(400).duration(500).ease(d3.easeElastic)
                .attr('height', ({ units }: Measurement) => this.height - this.yScale(units))
                .attr('y', this.height)
    }
}