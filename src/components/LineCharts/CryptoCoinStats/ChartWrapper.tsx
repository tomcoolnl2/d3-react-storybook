
import { FC, useRef, useState, useEffect } from 'react'
import { Range } from 'rc-slider'
import { Dropdown } from 'react-bootstrap'
import { RawCryptoCoinStatistics, CryptoCoinDataOptionId } from './models'
import { 
	CryptoCurrencyEnum, 
	cryptoCurrencies, 
	readableCryptoCurrencies as currencyLabels, 
	cryptoCurrenciesAbbr
} from './enums'
import { CryptoCoinStatsChart } from './CryptoCoinStatsChart'


type CryptoCoinStatsProps = {
	data: RawCryptoCoinStatistics
}

export const ChartWrapper: FC<CryptoCoinStatsProps> = ({ data }) => {
	
	const dataOptionIds = Object.keys(CryptoCoinStatsChart.cryptoCoinDataOptions) as CryptoCoinDataOptionId[]
	const dataOptions: string[] = Object.values(CryptoCoinStatsChart.cryptoCoinDataOptions)

	const chartArea = useRef<SVGSVGElement>(null)
	const [chart, setChart] = useState<CryptoCoinStatsChart>(null)
	const [currency, setCurrency] = useState<CryptoCurrencyEnum>(cryptoCurrencies[0])
	const [currencyLabel, setCurrencyLabel] = useState<string>(currencyLabels[0])
	const [dataOptionId, setDataOptionId] = useState<CryptoCoinDataOptionId>(dataOptionIds[0])
	const [dataOption, setDataOption] = useState<string>(dataOptions[0])

	useEffect(() => {
		setChart(new CryptoCoinStatsChart(chartArea.current, data, currency, dataOptionId))
	}, [])

	const handleCurrencyChange = (currency: CryptoCurrencyEnum, currencyLabel: string): void => {
		setCurrency(currency)
		setCurrencyLabel(currencyLabel)
		chart.filterDataByCurrency(currency)
	}

	const handleDataOptionChange = (optionId: CryptoCoinDataOptionId, option: string) : void => {
		setDataOptionId(optionId)
		setDataOption(option)
		chart.filterDataByOption(optionId)
	}

	return (
		<>
			<svg className='chart-area' ref={chartArea}></svg>
			<br/><br/>
    		<Range />
			<br/><br/>
			<Dropdown>   
				<Dropdown.Toggle variant="success">
					{currencyLabel}
				</Dropdown.Toggle>
				<Dropdown.Menu>
					{cryptoCurrencies.map((currency: CryptoCurrencyEnum, i: number) => (
						<Dropdown.Item key={currency} onSelect={() => {
							handleCurrencyChange(currency, currencyLabels[i])}
						}>
							{`${currencyLabels[i]} (${cryptoCurrenciesAbbr[i]})`}
						</Dropdown.Item>
					))}
				</Dropdown.Menu>
			</Dropdown>
			<br/>
			<Dropdown>   
				<Dropdown.Toggle variant="success">
					{dataOption}
				</Dropdown.Toggle>
				<Dropdown.Menu>
					{dataOptionIds.map((optionId: CryptoCoinDataOptionId, i: number) => (
						<Dropdown.Item key={optionId} onSelect={() => {
							handleDataOptionChange(optionId, dataOptions[i])}
						}>
							{dataOptions[i]}
						</Dropdown.Item>
					))}
				</Dropdown.Menu>
			</Dropdown>	
		</>
	)
}
