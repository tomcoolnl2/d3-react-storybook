
import { csv } from 'd3'
import { FC, useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { ChartWrapper } from './ChartWrapper'


export const StackedArea: FC = () => {

    // keeps track of data
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const csvData = await csv('data/browser_stacked.csv')
            setData(csvData)
        }
        fetchData()
    }, [])

    return (
        <Container>
            <Row>
                <Col xs={12}>
                    {data 
                        ? <ChartWrapper data={data} /> 
                        : 'No data yet'}
                </Col>
            </Row>
        </Container>
    )
}