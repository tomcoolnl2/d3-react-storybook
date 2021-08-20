
import { FC } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { GenderEnum } from '../../../models'


export type GenderDropdownProps = {
    setGender: Function
}

export const GenderDropdown: FC<GenderDropdownProps> = ({ setGender }) => {
	return (
		<Dropdown>
			<Dropdown.Toggle variant="primary" id="dropdown-basic">
				Please select gender
			</Dropdown.Toggle>

			<Dropdown.Menu>
				<Dropdown.Item onSelect={() => setGender(GenderEnum.MALE)}>Men</Dropdown.Item>
				<Dropdown.Item onSelect={() => setGender(GenderEnum.FEMALE)}>Women</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	)
}