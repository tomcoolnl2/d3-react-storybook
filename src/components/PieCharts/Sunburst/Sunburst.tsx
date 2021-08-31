
import { json } from 'd3'
import { FC, useEffect, useRef, useState } from 'react'
import { FlareHierarchy } from './models'
import { SunburstChart } from './SunburstChart'

export const Sunburst: FC = () => {

    const svgRef = useRef<SVGSVGElement>(null)
    const [data, setData] = useState<FlareHierarchy>(null)
    const [, setChart] = useState<SunburstChart>(null)

    const fetchData = async (): Promise<void> => {
        setData(await json<FlareHierarchy>('data/flare.json'))
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        data && setChart(new SunburstChart(svgRef.current, data))
    }, [data])

    return <svg ref={svgRef} />    
}