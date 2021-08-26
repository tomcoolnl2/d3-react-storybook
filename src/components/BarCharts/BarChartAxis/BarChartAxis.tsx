
import * as d3 from 'd3'
import { FC, useRef, useState, useEffect } from 'react'
import { Measurement } from './models'
import { BarChartAxisChart } from './BarChartAxisChart'


const data: Measurement[] = [
    { name: 'foo', units: 32 },
    { name: 'bar', units: 67 },
    { name: 'baz', units: 81 },
    { name: 'hoge', units: 38 },
    { name: 'piyo', units: 28 },
    { name: 'hogera', units: 59 }
]

export const BarChartAxis: FC = () => {

    const svgRef = useRef<SVGSVGElement>(null)
    const [chart, setChart] = useState<BarChartAxisChart>(null)

    useEffect(() => {
        setChart(new BarChartAxisChart(svgRef.current, data))
    }, [])

    return <svg ref={svgRef} />
}
