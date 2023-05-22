import { useState, useContext } from 'react'
import { Dialog, Transition } from "@headlessui/react";
import {
	PlusIcon,
	PencilIcon,
	TrashIcon,
	IdentificationIcon,
} from '@heroicons/react/24/outline';

import { PopUpContext } from '../Contexts'

const initialProjects = [
	{
		id: 1,
		name: "Project 1",
		subjects: ["subject1", "subject2"],
		controllers: ["controller1"],
		processors: ["processor1", "processor2"]
	},
	{
		id: 2,
		name: "Project 2",
		subjects: ["subject1", "subject2"],
		controllers: ["controller1"],
		processors: ["processor1", "processor2"]
	},
	{
		id: 3,
		name: "Project 3",
		subjects: ["subject1", "subject2"],
		controllers: ["controller1"],
		processors: ["processor1", "processor2"]
	},
]

export default function ProjectsView() {
	const [data, setData] = useState(initialProjects)
	const {openPopUp, closePopUp} = useContext(PopUpContext)

	function handleFlow(id:any) {

	}
	function handleEdit(id:any) {
		console.log({at: handleEdit, id})
		openPopUp(
			<Dialog
				open={true}
				onClose={closePopUp}
				className="z-50"
			>
				<div className="fixed inset-0 bg-black/30 flex items-center justify-center">
					<Dialog.Panel className="bg-white rounded-xl">
						<Dialog.Title className="bg-gray-100 rounded-t-xl p-4 drop-shadow text-center">
							Project Dialog
						</Dialog.Title>
						<form>
							<div className="flex flex-col p-4 text-sm">
								<label htmlFor="name">
									Project Name
								</label>
								<input type="text" name="name" className="form-input rounded" />
								<label htmlFor="description">
									Description
								</label>
								<textarea name="description" className="form-textarea rounded" />
							</div>
							<div className="flex flex-row justify-evenly pb-4">
								<button onClick={closePopUp} className="bg-blue-700 hover:bg-blue-800 text-white rounded-full px-4">OK</button>
								<button onClick={closePopUp} className="bg-blue-700 hover:bg-blue-800 text-white rounded-full px-4">Cancel</button>
							</div>
						</form>
					</Dialog.Panel>
				</div>
			</Dialog>
		)
	}
	function handleDelete(id:any) {
		setData(data.filter((pj)=>pj.id != id))
	}
  return (
		<div className="flex flex-col p-2">
			<div className="m-2">
				<button className="text-white bg-blue-700 hover:bg-blue-800 flex flex-row p-2 rounded-lg float-right">
					<PlusIcon className="mr-2 h-5 w-5" />
					Project
				</button>
			</div>
			<table className="text-left text-sm drop-shadow-md m-2">
				<thead>
					<tr className="bg-gray-50 uppercase">
						<th className="px-6 py-4">ID</th>
						<th className="px-6 py-4">Name</th>
						<th className="px-6 py-4">Subject</th>
						<th className="px-6 py-4">Controller</th>
						<th className="px-6 py-4">Processor</th>
						<th className="py-4">Action</th>
					</tr>
				</thead>
				<tbody>
					{data.map((pj,idx) => (
						<tr key={idx} className="border-b min-w-0">
							<td className="px-6 py-4">{pj.id}</td>
							<td className="px-6 py-4">{pj.name}</td>
							<td className="px-6 py-4">{pj.subjects.join(", ")}</td>
							<td className="px-6 py-4">{pj.controllers.join(", ")}</td>
							<td className="px-6 py-4">{pj.processors.join(", ")}</td>
							<td>
								<button onClick={()=>handleFlow(pj.id)}>
									<IdentificationIcon className="h-5 w-5 m-0.5" />
								</button>
								<button onClick={()=>handleEdit(pj.id)}>
									<PencilIcon className="h-5 w-5 m-0.5" />
								</button>
								<button onClick={()=>handleDelete(pj.id)}>
									<TrashIcon className="h-5 w-5 m-0.5" />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
  );
}