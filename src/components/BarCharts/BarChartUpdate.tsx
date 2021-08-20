import * as d3 from 'd3'
import { FC, useRef, useState, useEffect, FormEvent } from 'react'
import { D3SVGSVGElementSelection } from '../../models'

type LengthData = {
    name: string,
    units: number
}

let initialData: LengthData[] = [
    {
        name: 'foo',
        units: 32,
    },
    {
        name: 'bar',
        units: 67,
    },
    {
        name: 'baz',
        units: 81,
    },
    {
        name: 'hoge',
        units: 38,
    },
    {
        name: 'piyo',
        units: 28,
    },
    {
        name: 'hogera',
        units: 59,
    },
]

export const BarChartUpdate: FC = () => {
    
    const dimensions = { width: 800, height: 500 }
    const svgRef = useRef<SVGSVGElement>(null)
    const [data, setData] = useState<LengthData[]>(initialData)
    const [name, setName] = useState<string>('')
    const [unit, setUnit] = useState<string>('')

    let x = d3.scaleBand()
        .domain(data.map(({ name }: LengthData) => name))
        .range([0, dimensions.width])
        .padding(0.05)

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, ({ units }: LengthData) => units)])
        .range([dimensions.height, 0])

    const [selection, setSelection] = useState<D3SVGSVGElementSelection>(null)

    useEffect(() => {
        if (!selection) {
            setSelection(d3.select(svgRef.current))
        } else {
            selection
                .selectAll('rect')
                .data(data)
                .enter()
                .append('rect')
                .attr('x', ({ name }: LengthData) => x(name))
                .attr('y', ({ units }: LengthData) => y(units))
                .attr('width', x.bandwidth)
                .attr('height', ({ units }: LengthData) => dimensions.height - y(units))
                .attr('fill', 'orange')
        }
    }, [selection])

    /**
     * another useEffect with data as its dependency
     * runs everytime data changes so updates can be made to the chart
     */
    useEffect(() => {
        if (selection) {
            /**
             * update the scales
             */
            x = d3.scaleBand()
                .domain(data.map(({ name }: LengthData) => name))
                .range([0, dimensions.width])
                .padding(0.05)
            y = d3.scaleLinear()
                .domain([0, d3.max(data, ({ units }: LengthData) => units)])
                .range([dimensions.height, 0])

            /**
             * join the data
             */
            const rects = selection.selectAll('rect').data<LengthData>(data)
            /**
             * remove exit selection
             */
            rects.exit().remove()
            /**
             * update the current shapes in the DOM
             */
            rects
                .attr('x', ({ name }: LengthData) => x(name)!)
                .attr('y', ({ units }: LengthData) => y(units))
                .attr('width', x.bandwidth)
                .attr('height', ({ units }: LengthData) => dimensions.height - y(units))
                .attr('fill', 'orange')
            /**
             * append the enter selection shapes to the DOM
             */
            rects
                .enter()
                .append('rect')
                .attr('x', ({ name }: LengthData) => x(name))
                .attr('y', ({ units }: LengthData) => y(units))
                .attr('width', x.bandwidth)
                .attr('height', ({ units }: LengthData) => dimensions.height - y(units))
                .attr('fill', 'orange')
        }
    }, [data])

    const submit = (e: FormEvent) => {
        e.preventDefault()
        setData([...data, { name, units: parseInt(unit) }])
    }
    return (
        <>
            <svg
                ref={svgRef}
                width={dimensions.width}
                height={dimensions.height}
            />
            <form onSubmit={submit}>
                Name:
                <input value={name} onChange={e => setName(e.target.value)} />
                Units:
                <input value={unit} onChange={e => setUnit(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
        </>
    )
}
