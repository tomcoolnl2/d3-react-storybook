
import { tsv } from 'd3'
import { FC, useRef, useState, useEffect } from 'react'
import { D3DSVData } from '../../../models'
import { PieChartUpdateChart } from './PieChartUpdateChart'


export const PieChartUpdate: FC = () => {

    const svgRef = useRef<SVGSVGElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const [, setChart] = useState<PieChartUpdateChart>(null)
    const [data, setData] = useState<D3DSVData>(null)

    const fetchData = async (): Promise<void> => {
        const tsvData = await tsv('data/donut2.tsv')
        setData(tsvData)
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        data && setChart(new PieChartUpdateChart(svgRef.current, formRef.current, data))
    }, [data])

    return (
        <>
            <form name='chart' ref={formRef} />
            <svg ref={svgRef} />
        </>
    )
}