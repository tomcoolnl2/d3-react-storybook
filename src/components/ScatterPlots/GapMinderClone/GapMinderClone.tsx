
import { FC, useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { ChartWrapper } from './ChartWrapper'
import { PublicationData } from './model'
import dataJSON from './data.json'


export const GapMinderClone: FC = () => {

    // keeps track of data
    const [data, setData] = useState<PublicationData[]>([])

    useEffect(() => {
        setData(dataJSON as PublicationData[])
    }, [])

    return (
        <Container>
            <Row>
                <Col xs={12}>
                    {data.length 
                        ? <ChartWrapper data={data} /> 
                        : 'No data yet'}
                </Col>
            </Row>
        </Container>
    )
}