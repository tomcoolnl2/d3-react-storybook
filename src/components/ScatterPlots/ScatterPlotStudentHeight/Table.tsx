
import { FC, useState, ChangeEvent, MouseEvent, MouseEventHandler } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { StudentData } from './ScatterPlotStudentHeight'


type TableProps = {
	data: StudentData[]
	setData: Function
	activeName: string
}

type TableRowProps = {
	data: StudentData[]
	handleRemove: MouseEventHandler<HTMLInputElement>
	activeName: string
}

const TableRows: FC<TableRowProps> = ({ data, handleRemove, activeName }) => {
	
	return (
		<>
			{data.map(({ name, height, age }: StudentData) => {
				const backgroundColor = (name === activeName) ? 'lightgrey' : 'white'
				return (
					<Row
						key={name}
						style={{ padding: '10px 0', backgroundColor }}
					>
						<Col xs={3}>{name}</Col>
						<Col xs={3}>{height}</Col>
						<Col xs={3}>{age}</Col>
						<Col xs={3}>
							<Button
								variant={'danger'}
								type={'button'}
								style={{ width: '100%' }}
								name={name}
								onClick={handleRemove}
							>
								Remove
							</Button>
						</Col>
					</Row>
				)
			})}
		</>
	)
}

export const Table: FC<TableProps> = ({ data, setData, activeName }) => {
	
	const initialState: StudentData = {
		name: '',
		height: '',
		age: ''
	}

	const [student, setStudent] = useState<StudentData>(initialState)

	const handleSubmit = () => {
		setData([...data, student])
		setStudent(initialState)
	}

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setStudent({ ...student, [event.target.name]: event.target.value })
	}

	const handleRemove = (event: MouseEvent<HTMLInputElement>) => {
		const newData = data.filter(d => d.name !== (event.target as HTMLInputElement).name)
		setData(newData)
	}

	return (
		<>
			<Row>
				<Col xs={3}>
					<Form.Control
						placeholder={'Name'}
						name={'name'}
						value={student.name}
						onChange={handleChange}
					/>
				</Col>
				<Col xs={3}>
					<Form.Control
						type={'text'} 
						pattern={'\d*'}
						maxLength={4}
						placeholder={'Height'}
						name={'height'}
						value={student.height}
						onChange={handleChange}
					/>
				</Col>
				<Col xs={3}>
					<Form.Control
						type={'text'} 
						pattern={'\d*'}
						maxLength={4}
						placeholder={'Age'}
						name={'age'}
						value={student.age}
						onChange={handleChange}
					/>
				</Col>
				<Col>
					<Button
						variant={'primary'}
						type={'button'}
						style={{ width: '100%' }}
						onClick={handleSubmit}
					>
						Add
					</Button>
				</Col>
			</Row>
			<TableRows data={data} handleRemove={handleRemove} activeName={activeName} />
		</>
	)
}