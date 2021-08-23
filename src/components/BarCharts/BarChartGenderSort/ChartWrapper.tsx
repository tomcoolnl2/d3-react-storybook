
import { FC, memo } from 'react'
import { useRef, useState, useEffect } from 'react'
import { GenderEnum } from '../../../models'
import { D3Chart } from './D3Chart'


export type ChartWrapperProps = {
    gender: GenderEnum
}

export const ChartWrapper: FC<ChartWrapperProps> = memo(({ gender }) => {
    
    const chartArea = useRef<SVGSVGElement>(null)
	const [chart, setChart] = useState<D3Chart>(null)

    useEffect(() => {
        setChart(new D3Chart(chartArea.current))
	}, [])

	useEffect(() => {
        chart?.data && chart?.update(gender)
	}, [chart, gender])

	return <svg className="chart-area" ref={chartArea}></svg>
})