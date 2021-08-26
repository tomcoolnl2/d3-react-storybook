
import { csv } from 'd3'
import { FC, useEffect, useRef, useState } from 'react'
import { AreaChartChart } from './AreaChartChart'
import { RawMeasurement } from './models'


export const AreaChart: FC = () => {

    const svgRef = useRef<SVGSVGElement>(null)
    const [data, setData] = useState<RawMeasurement>(null)
    const [, setChart] = useState<AreaChartChart>(null)

    const fetchData = async () => {
        const csvData = await csv('https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv')
        setData(csvData)
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        data && setChart(new AreaChartChart(svgRef.current, data))
    }, [data])

    return <svg ref={svgRef} />
}