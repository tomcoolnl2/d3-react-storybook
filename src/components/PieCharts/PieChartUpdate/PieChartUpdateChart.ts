
import * as d3 from 'd3'
import { DefaultArcObject } from 'd3'
import { D3DSVData, D3Pie, D3Arc, D3ScaleOrdinal, D3Selection } from '../../../models'
import { ArcData, Product, ProductByRegion, GroupedByProduct, Region, ArcAngle, GroupedItem } from './models'


export class PieChartUpdateChart {

    private readonly width: number = 600
    private readonly height: number = 400
    private readonly radius: number = Math.min(this.width, this.height) / 2
    private readonly colorScale: D3ScaleOrdinal = d3.scaleOrdinal(d3.schemeCategory10)

    private readonly parent: SVGSVGElement = null
    private form: D3Selection<HTMLFormElement> = null
    private svg: D3Selection<SVGSVGElement> = null
    private mainGroup: D3Selection<SVGGElement> = null
    private pie: D3Pie<ProductByRegion> = null
    private arc: D3Arc = null

    private data: ProductByRegion[] = null
    private groupedData: GroupedByProduct = null

    constructor(parent: SVGSVGElement, form: HTMLFormElement, data: D3DSVData) {
        this.parent = parent
        this.normalize(data)
        this.initialize(form)
        this.draw()
    }

    private normalize(data: D3DSVData): void {
        
        delete data.columns

        this.data = data.map(({ count, fruit, region }): ProductByRegion => ({
            count: Number(count),
            fruit: fruit as Product,
            region: region as Region
        }))

        this.groupedData = d3.group(this.data, (d: ProductByRegion): Product => d.fruit)
    }

    private initialize(form: HTMLFormElement): void {

        this.form = d3.select(form)

        this.svg = d3.select(this.parent)
            .attr('width', this.width)
            .attr('height', this.height)

        this.mainGroup = this.svg.append('g')
            .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`)

        this.pie = d3.pie<ProductByRegion>()
            .value(d => d.count)
            .sort(null)

        this.arc = d3.arc()
            .innerRadius(this.radius - 80)
            .outerRadius(this.radius - 20)
    }

    private draw(): void {
        
        const label = this.form.selectAll<HTMLLabelElement, unknown>('label')
            .data(this.groupedData)
            .enter()
            .append('label')
        
        label.append('input')
            .attr('type', 'radio')
            .attr('name', 'fruit')
            .attr('value', ([ key ]) => key)
            .on('change', this.changeGroupHandler)
            .filter((_: GroupedItem, i: number): boolean => !i)
            .each(this.changeGroupHandler)
            .property('checked', true)

        label.append('span')
            .text(([ key ]: GroupedItem): string => key)
    }

    private changeGroupHandler = ([, group ]: GroupedItem): void => {
        
        let path = this.mainGroup.selectAll<SVGPathElement, ArcData>('path')
        const data0: ArcData[] = path.data()
        const data1: ArcData[] = this.pie(group)

        // JOIN elements with new data.
        path = path.data(data1, this.findRegionByKey)

        // EXIT old elements from the screen.
        path.exit()
            .datum((d: ArcData, i: number) => this.findNeighborArc(i, data1, data0) || d)
            .transition().duration(750)
                .attrTween("d", this.arcTween)
                .remove()
        
        // UPDATE elements still on the screen.
        path.transition().duration(750)
            .attrTween("d", this.arcTween)

        // ENTER new elements in the array.
        path.enter()
            .append("path")
            .each((d: ArcData, i: number): void => { console.log('path', d);d._current = this.findNeighborArc(i, data0, data1) || d })
            .attr("fill", (d: ArcData): string => this.colorScale(d.data.region))
            .transition()
            .duration(750)
            .attrTween("d", this.arcTween)
    }

    private findRegionByKey({ data: { region } }: ArcData): Region {
        return region
    }

    private findNeighborArc(i: number, data0: ArcData[], data1: ArcData[]): ArcAngle {
        
        let result: ArcAngle = null
        const precedingArc: ArcData = this.findPrecedingArc(i, data0, data1)
        const followingArc: ArcData = this.findFollowingArc(i, data0, data1)

        if (precedingArc) {
            result = { 
                startAngle: precedingArc.endAngle, 
                endAngle: precedingArc.endAngle 
            }
        } else if (followingArc) {
            result = {
                startAngle: followingArc.startAngle, 
                endAngle: followingArc.startAngle
            }
        }

        return result
    }

    // Find the element in data0 that joins the highest preceding element in data1.
    private findPrecedingArc(i: number, data0: ArcData[], data1: ArcData[]): ArcData {
        const m: number = data0.length
        while (--i >= 0) {
            const k: Region = this.findRegionByKey(data1[i])
            for (let j: number = 0; j < m; j += 1) {
                if (this.findRegionByKey(data0[j]) === k) {
                    return data0[j]
                }
            }
        }
    }

    // Find the element in data0 that joins the lowest following element in data1.
    private findFollowingArc(i: number, data0: ArcData[], data1: ArcData[]): ArcData {
        const n: number = data1.length, m: number = data0.length
        while (++i < n) {
            const k: Region = this.findRegionByKey(data1[i])
            for (let j: number = 0; j < m; j += 1) {
                if (this.findRegionByKey(data0[j]) === k) {
                    return data0[j]
                }
            }
        }
    }

    // Returns a tween for a transition’s "d" attribute, 
    // transitioning any selected arcs from their current angle to the specified new angle.
    
    // private arcTween(d: ArcData) {

    //     // To interpolate between the two angles, we use the default d3.interpolate.
    //     // (Internally, this maps to d3.interpolateNumber, since both of the
    //     // arguments to d3.interpolate are numbers.) The returned function takes a
    //     // single argument t and returns a number between the starting angle and the
    //     // ending angle. When t = 0, it returns d.endAngle; when t = 1, it returns
    //     // newAngle; and for 0 < t < 1 it returns an angle in-between.
    //     var i = d3.interpolate(d, d)
    //     return (t: number) => this.arc(i(t))
    // }

    // Returns a tween for a transition’s "d" attribute, transitioning any selected
    // arcs from their current angle to the specified new angle.
    // private arcTween(d: ArcData) {
    //     console.log('arcTween d: ', d)
    //     // The function passed to attrTween is invoked for each selected element when
    //     // the transition starts, and for each element returns the interpolator to use
    //     // over the course of transition. This function is thus responsible for
    //     // determining the starting angle of the transition (which is pulled from the
    //     // element’s bound datum, d.endAngle), and the ending angle (simply the
    //     // newAngle argument to the enclosing function).
    //     return (e: any) => {

    //         console.log('arcTween e: ', e)

    //         // To interpolate between the two angles, we use the default d3.interpolate.
    //         // (Internally, this maps to d3.interpolateNumber, since both of the
    //         // arguments to d3.interpolate are numbers.) The returned function takes a
    //         // single argument t and returns a number between the starting angle and the
    //         // ending angle. When t = 0, it returns d.endAngle; when t = 1, it returns
    //         // newAngle; and for 0 < t < 1 it returns an angle in-between.
    //         var interpolate = d3.interpolate(d._current , d)

    //         // The return value of the attrTween is also a function: the function that
    //         // we want to run for each tick of the transition. Because we used
    //         // attrTween("d"), the return value of this last function will be set to the
    //         // "d" attribute at every tick. (It’s also possible to use transition.tween
    //         // to run arbitrary code for every tick, say if you want to set multiple
    //         // attributes from a single function.) The argument t ranges from 0, at the
    //         // start of the transition, to 1, at the end.
    //         return (t: number) => {

    //             console.log('arcTween t: ', t)

    //             // Calculate the current arc angle based on the transition time, t. Since
    //             // the t for the transition and the t for the interpolate both range from
    //             // 0 to 1, we can pass t directly to the interpolator.
    //             //
    //             // Note that the interpolated angle is written into the element’s bound
    //             // data object! This is important: it means that if the transition were
    //             // interrupted, the data bound to the element would still be consistent
    //             // with its appearance. Whenever we start a new arc transition, the
    //             // correct starting angle can be inferred from the data.
    //             d = interpolate(t)
    //             delete d._current

    //             // Lastly, compute the arc path given the updated data! In effect, this
    //             // transition uses data-space interpolation: the data is interpolated
    //             // (that is, the end angle) rather than the path string itself.
    //             // Interpolating the angles in polar coordinates, rather than the raw path
    //             // string, produces valid intermediate arcs during the transition.
    //             return this.arc(d as unknown as DefaultArcObject)
    //         }
    //     }
    // }

    private arcTween(d: ArcData) {
        var i = d3.interpolate(d._current, d)
        d._current = i(0);
        return (t: any) => { return this.arc(i(t)); };
    }
}