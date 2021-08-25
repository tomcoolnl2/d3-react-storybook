
import { FC, useRef, useState, useEffect } from 'react'
import { StackedAreaChart } from './StackedAreaChart'
import { RawStackedItem } from './models'


type CryptoCoinStatsProps = {
	data: RawStackedItem[]
}

export const ChartWrapper: FC<CryptoCoinStatsProps> = ({ data }) => {
	
	const chartArea = useRef<SVGSVGElement>(null)
	const [chart, setChart] = useState<StackedAreaChart>(null)

	useEffect(() => {
		setChart(new StackedAreaChart(chartArea.current, data))
	}, [])

	return (
		<svg className='chart-area' ref={chartArea}></svg>
	)
}
