
import { json } from 'd3'
import { FC, useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { ChartWrapper } from './ChartWrapper'
import { Table } from './Table'


export type StudentData = {
    age: string,
    height: string,
    name: string
}

export type Student = {
    age: number,
    height: number,
    name: string
}

export const ScatterPlotStudentHeight: FC = () => {

    // keeps track of data
    const [data, setData] = useState<StudentData[]>([])
    // keeps track of UI selection
    const [activeName, setActiveName] = useState<string>(null)

    useEffect(() => {
        const fetchData = async () => {
            await json<StudentData[]>('https://udemy-react-d3.firebaseio.com/children.json')
                .then(data => setData(data))
                .catch(error => console.log(error))
        }
        fetchData()
    }, [])

    return (
        <Container>
            <Row>
                <Col xs={12}>
                    {data.length 
                        ? <ChartWrapper data={data} setActiveName={setActiveName} /> 
                        : 'No data yet'}
                </Col>
                <Col xs={12}>
                    <br /><br />
                    <Table data={data} setData={setData} activeName={activeName} />
                </Col>
            </Row>
        </Container>
    )
}