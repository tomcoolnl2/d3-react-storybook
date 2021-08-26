
import { csv } from 'd3'
import { FC, useRef, useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './styles.css'
import { StackedBarChartChart } from './StackedBarChartChart'
import { D3DSVData } from '../../../models'


export const StackedBarChart: FC = () => {
	
	const chartArea = useRef<SVGSVGElement>(null)
	const [chart, setChart] = useState<StackedBarChartChart>(null)
    const [data, setData] = useState<D3DSVData>(null)

    const fetchData = async () => {
        const data = await csv('data/data_stacked.csv')
        setData(data)
        setChart(new StackedBarChartChart(chartArea.current, data))
    }

    useEffect(() => {
        fetchData()
    }, [])

	return (
        <Container>
            <Row>
                <Col xs={12}>
                    {data?.length
                        ? <svg className='chart-area' ref={chartArea}></svg>
                        : 'No data yet'}
                </Col>
            </Row>
        </Container>
	)
}
