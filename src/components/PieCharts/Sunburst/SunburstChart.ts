
import * as d3 from 'd3'
import { D3Arc, D3ScaleOrdinal, D3Selection, D3Transition } from '../../../models'
import { FlareTree, FlareLeaf, FlareTreeLevel, FlareHierarchyItem } from './models'


export class SunburstChart {
    
    private readonly π = Math.PI
    private readonly width: number = 932
    private readonly radius: number = this.width / 6

    private svg: D3Selection<SVGSVGElement> = null
    private mainGroup: D3Selection<SVGGElement> = null
    private arc: D3Arc<FlareHierarchyItem> = null

    private colorScale: D3ScaleOrdinal = null
    private data: any = null

    constructor(parent: SVGSVGElement, data: any) {
        this.normalize(data)
        this.initialize(parent)
        this.draw()
    }

    private normalize(data: FlareTree) {

        const rootData = d3.hierarchy<FlareTreeLevel>(data)
            .sum((d): number =>  (d as FlareLeaf)?.value)
            .sort((a, b): number => b.value - a.value)

        const formattedData: FlareHierarchyItem = d3.partition<FlareTreeLevel>()
            .size([2 * this.π, rootData.height + 1])
            (rootData)

        formattedData.each(d => d.current = d)

        this.data = formattedData
    }

    private initialize(parent: SVGSVGElement): void {

        this.colorScale = d3.scaleOrdinal(
            d3.quantize(d3.interpolateRainbow, this.data.children.length + 1)
        )

        this.svg = d3.select(parent)
            .attr('viewBox', `0 0 ${this.width} ${this.width}`)
            .style('font', '10px sans-serif')
    
        this.mainGroup = this.svg.append('g')
            .attr('transform', `translate(${this.width / 2}, ${this.width / 2})`)

        this.arc = d3.arc<FlareHierarchyItem>()
            .startAngle(({ x0 }) =>  x0)
            .endAngle(({ x1 }) => x1)
            .padAngle(({ x0, x1 }) => Math.min((x1 - x0) / 2, 0.005))
            .padRadius(this.radius * 1.5)
            .innerRadius(({ y0 }) => y0 * this.radius)
            .outerRadius(({ y0, y1 }) => Math.max(y0 * this.radius, y1 * this.radius - 1))
    }

    private draw(): void {

        const clicked = (_: Event, p: FlareHierarchyItem) => {
            parent.datum(p.parent || this.data);
        
            this.data.each((d: FlareHierarchyItem) => d.target = {
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * this.π,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * this.π,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
            })
        
            const t: D3Transition = this.mainGroup.transition().duration(750)
        
            // Transition the data on all arcs, even the ones that aren’t visible,
            // so that if this transition is interrupted, entering arcs will start
            // the next transition from the desired position.
            path.transition(t)
                .tween('data', (d) => {
                    const i = d3.interpolate(d.current, d.target)
                    return (t) => d.current = i(t)
                })
                .filter((d) => +d.node().getAttribute('fill-opacity') || this.arcVisible(d.target))
                .attr('fill-opacity', d => this.arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
                .attrTween('d', d => () => this.arc(d.current))
            
                label.filter((d) => {
                    return +d.node().getAttribute('fill-opacity') || this.labelVisible(d.target);
                  }).transition(t)
                    .attr('fill-opacity', d => +this.labelVisible(d.target))
                    .attrTween('transform', d => () => this.labelTransform(d.current));
              }

              /* -------- */

        const path = this.mainGroup.append('g')
            .selectAll<SVGPathElement, unknown>('path')
            .data<FlareHierarchyItem>(this.data.descendants().slice(1))
            .join('path')
            .attr('fill', d => { 
                while (d.depth > 1) {
                    d = d.parent
                    return this.colorScale(d.data.name)
                }
            })
            .attr('fill-opacity', d => this.arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
            .attr('d', d => this.arc(d.current))

        path.filter(d => !!d.children)
            .style('cursor', 'pointer')
            .on('click', clicked)
    
        path.append('title')
            .text(d => `${d.ancestors().map(d => d.data.name).reverse().join('/')}\n${d3.format(',d')(d.value)}`)

        const label = this.mainGroup.append('g')
            .attr('pointer-events', 'none')
            .attr('text-anchor', 'middle')
            .style('user-select', 'none')
            .selectAll<SVGTextElement, unknown>('text')
            .data<FlareHierarchyItem>(this.data.descendants().slice(1))
            .join('text')
            .attr('dy', '0.35em')
            .attr('fill-opacity', d => +this.labelVisible(d.current))
            .attr('transform', d => this.labelTransform(d.current))
            .text(d => d.data.name)
        
        const parent = this.mainGroup.append('circle')
            .datum(this.data)
            .attr('r', this.radius)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('click', clicked)
    }

    private arcVisible(d: FlareHierarchyItem): boolean {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0
    }

    private labelVisible(d: FlareHierarchyItem): boolean {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03
    }
    
    private labelTransform(d: FlareHierarchyItem): string {
        const x = (d.x0 + d.x1) / 2 * 180 / this.π
        const y = (d.y0 + d.y1) / 2 * this.radius
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`
    }
}