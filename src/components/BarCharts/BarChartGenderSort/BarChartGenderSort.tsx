
import { FC, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { ChartWrapper } from './ChartWrapper'
import { GenderDropdown } from './GenderDropdown'
import { GenderEnum } from '../../../models'


export const BarChartGenderSort: FC = () => {

    const [gender, setGender] = useState<GenderEnum>(GenderEnum.MALE)

    return (
        <Container>
            <Row>
                <Col xs={12}><GenderDropdown setGender={setGender} /></Col>
            </Row>
            <Row>
                <Col xs={12}><ChartWrapper gender={gender} /></Col>
            </Row>
        </Container>
    )
}
