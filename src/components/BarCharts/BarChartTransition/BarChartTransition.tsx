
import * as d3 from 'd3'
import { FC, useRef, useState, useEffect } from 'react'
import randomstring from 'randomstring'
import { Measurement } from './models'
import { BarChart } from './BarChart'


const initialData: Measurement[] = [
    { name: 'foo', units: 32 },
    { name: 'bar', units: 67 },
    { name: 'baz', units: 81 },
    { name: 'hoge', units: 38 },
    { name: 'piyo', units: 28 },
    { name: 'hogera', units: 59 }
]

export const BarChartTransition: FC = () => {

    const svgRef = useRef<SVGSVGElement>(null)
    const [data, setData] = useState<Measurement[]>(initialData)
    const [chart, setChart] = useState<BarChart>(null)

    useEffect(() => {
        setChart(new BarChart(svgRef.current, data))
    }, [])

    useEffect(() => {
        chart && chart.setData(data).draw()
    }, [data])

    const addData = () => {
        const dataToAdd: Measurement = {
            name: randomstring.generate(),
            units: Math.round(Math.random() * 80 + 20),
        }
        setData([...data, dataToAdd])
    }

    const removeData = () => {
        if (data.length !== 0) {
            setData([...data.slice(0, data.length - 1)])
        }
    }

    return (
        <>
            <svg ref={svgRef} />
            <button onClick={addData}>Add Data</button>
            <button onClick={removeData}>Remove Data</button>
        </>
    )
}
