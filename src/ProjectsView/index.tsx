import {
	TextInput,
	Button,
	Table,
} from 'flowbite-react';
import {
	PlusIcon,
	MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function ProjectsView() {
  return (
		<div className="flex flex-col m-2">
			<div className="flex flex-row items-center">
				<TextInput
					className="grow m-2"
					icon={MagnifyingGlassIcon}
					placeholder='Search text'
				/>
				<Button className="bg-blue-500 m-2">
					<PlusIcon className="mr-2 h-5 w-5" />
					Add Project
				</Button>
			</div>
			<Table className="m-2">
				<Table.Head>
					<Table.HeadCell>
						ID
					</Table.HeadCell>
					<Table.HeadCell>
						Division
					</Table.HeadCell>
					<Table.HeadCell>
						Project Name
					</Table.HeadCell>
					<Table.HeadCell>
						Category
					</Table.HeadCell>
					<Table.HeadCell>
					</Table.HeadCell>
				</Table.Head>
				<Table.Body>
					<Table.Row>
						<Table.Cell>
							1
						</Table.Cell>
						<Table.Cell>
							HQ
						</Table.Cell>
						<Table.Cell>
							Data Service
						</Table.Cell>
						<Table.Cell>
							Cloud
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table>
		</div>
  );
}