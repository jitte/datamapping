import { useContext, FormEvent } from 'react'
import { Dialog } from '@headlessui/react'
import {
	PlusIcon,
	PencilIcon,
	TrashIcon,
	IdentificationIcon,
} from '@heroicons/react/24/outline'

import { PopUpContext } from '../Contexts'
import { useLocalStore } from '../store'

export default function ProjectsView() {
	const projects  = useLocalStore((state) => state.projects)
	const setProjects = useLocalStore((state) => state.setProjects)
	const newProjectId = useLocalStore((state) => state.newProjectId)

	const { openPopUp, closePopUp } = useContext(PopUpContext)

	function handleFlow(id: any) {

	}

	function handleSubmit(event: FormEvent, id: number) {
		event.preventDefault()
		// collect form values
		const { value: name } = (event.target as any).name
		const { value: description } = (event.target as any).description
		// project to be added
		const newProject = { id, name, description }
		console.log({ at: 'handleSubmit', newProject })
		// update projects
		setProjects([newProject, ...projects.filter((pj) => pj.id !== id)])
		closePopUp()
	}

	function handleEdit(id: number | null) {
		console.log({ at: 'handleEdit', id })
		const project =  projects.find((pj) => pj.id === id) ?? { id: newProjectId(), name: '', description: '' }

		openPopUp(
			<Dialog open={true} onClose={closePopUp} className="z-50" >
				<div className="fixed inset-0 bg-black/30 flex items-center justify-center">
					<Dialog.Panel className="bg-white rounded-xl">
						<Dialog.Title className="bg-gray-100 rounded-t-xl p-4 drop-shadow text-center">
							Project Dialog
						</Dialog.Title>
						<form onSubmit={(event) => handleSubmit(event, project.id)}>
							<div className="flex flex-col p-4 text-sm">
								<label htmlFor="name">
									Project Name
								</label>
								<input type="text" name="name" className="form-input rounded" defaultValue={project.name} />
								<label htmlFor="description">
									Description
								</label>
								<textarea name="description" className="form-textarea rounded" defaultValue={project.description} />
							</div>
							<div className="flex flex-row justify-evenly pb-4">
								<input type="submit" className="bg-blue-700 hover:bg-blue-800 text-white rounded-full px-4" value="Submit"/>
								<button onClick={closePopUp} className="bg-blue-700 hover:bg-blue-800 text-white rounded-full px-4">Cancel</button>
							</div>
						</form>
					</Dialog.Panel>
				</div>
			</Dialog>
		)
	}

	function handleDelete(id:any) {
		setProjects(projects.filter((pj)=>pj.id !== id))
	}

  return (
		<div className="flex flex-col p-2">
			<div className="m-2">
				<button
					className="text-white bg-blue-700 hover:bg-blue-800 flex flex-row p-2 rounded-lg float-right"
					onClick={() => handleEdit(null)}
				>
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
					{projects.map((pj,idx) => (
						<tr key={idx} className="border-b min-w-0">
							<td className="px-6 py-4">{pj.id}</td>
							<td className="px-6 py-4">{pj.name}</td>
							<td className="px-6 py-4">{}</td>
							<td className="px-6 py-4">{}</td>
							<td className="px-6 py-4">{}</td>
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
  )
}