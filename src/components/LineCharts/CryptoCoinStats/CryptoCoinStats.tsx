
import { FC, useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { ChartWrapper } from './ChartWrapper'
import { RawCryptoCoinStatistics } from './models'
import dataJSON from './data.json'


export const CryptoCoinStats: FC = () => {

    // keeps track of data
    const [data, setData] = useState<RawCryptoCoinStatistics>(null)

    useEffect(() => {
        setData(dataJSON as RawCryptoCoinStatistics)
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