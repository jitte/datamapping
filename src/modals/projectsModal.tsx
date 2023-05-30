import { useContext, FormEvent } from 'react'
import { Node, Edge } from 'reactflow'
import { Dialog } from '@headlessui/react'
import {
	PlusIcon,
	PencilIcon,
	TrashIcon,
	DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'

import { useLocalStore } from '../store'
import { GlobalContext, PopUpContext } from '../contexts'

export type ProjectType = {
  id: number,
  name: string,
  description: string,
	nodes: Node[],
	edges: Edge[],
}

export function initialProject(id: number) {
	return (
		{
			id: id ,
			name: 'New Project',
			description: '',
			nodes:  [
				{ id: id+'node-1', type: 'piiSubject'   , position: { x:  50, y: 250}, data: {}},
				{ id: id+'node-2', type: 'piiController', position: { x: 450, y:  50}, data: {}},
				{ id: id+'node-3', type: 'piiProcessor' , position: { x: 850, y:  50}, data: {}},
				{ id: id+'node-4', type: 'thirdParty'   , position: { x: 450, y: 450}, data: {}},
			],
			edges: [
				{ id: id+'edge-1-2',
					source: id+'node-1', sourceHandle: 'source_pii_flow',
					target: id+'node-2', targetHandle: 'target_pii_flow'},
				{ id: id+'edge-2-3',
					source: id+'node-2', sourceHandle: 'source_pii_flow',
					target: id+'node-3', targetHandle: 'target_pii_flow'},
				{ id: id+'edge-1-4',
					source: id+'node-1', sourceHandle: 'source_non_pii_flow',
					target: id+'node-4', targetHandle: 'target_non_pii_flow'},
			]
		}
	)
}

export default function ProjectsModal() {
	// contexts
	const { showProjects, setShowProjects } = useContext(GlobalContext)
	const { currentProject, setCurrentProject } = useContext(GlobalContext)
	const { openPopUp, closePopUp } = useContext(PopUpContext)

	// stores
	const projects  = useLocalStore((state) => state.projects)
	const setProjects = useLocalStore((state) => state.setProjects)
	const newProjectId = useLocalStore((state) => state.newProjectId)

	//console.log({ at: 'ProjectModal', projects, currentProject })

	function handleSubmit(event: FormEvent, project: ProjectType) {
		event.preventDefault()
		// collect form values
		const { value: name } = (event.target as any).name
		const { value: description } = (event.target as any).description
		// project to be added
		const newProject = { ...project, name, description }
		console.log({ at: 'handleSubmit', newProject })
		// update projects
		setCurrentProject(newProject)
		setProjects([newProject, ...projects.filter((pj) => pj.id !== project.id)])
		closePopUp()
	}

	function handleEdit(id: number | null) {
		console.log({ at: 'handleEdit', id })
		const project =  projects.find((pj) => pj.id === id) ?? initialProject(newProjectId())

		openPopUp(
			<Dialog open={true} onClose={closePopUp} className="z-50" >
				<div className="fixed inset-0 bg-black/30 flex items-center justify-center">
					<Dialog.Panel className="bg-white rounded-xl">
						<Dialog.Title className="bg-gray-100 rounded-t-xl p-4 drop-shadow text-center">
							Project Dialog
						</Dialog.Title>
						<form onSubmit={(event) => handleSubmit(event, project)}>
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

	function handleDuplicate(id:any) {
		console.log({ at: 'handleDuplicate', id})
	}

	function handleDelete(id:any) {
		console.log({ at: 'handleDelete', id, projects, currentProject })
		let newProjects = projects.filter((pj)=>pj.id !== id)
		if (id === currentProject.id) {
			if (newProjects.length === 0) {
				newProjects = [initialProject(1)]
			}
			setCurrentProject(newProjects[0])
		}
		setProjects(newProjects)
	}

	// open ProjectsModal
	return (
		<Dialog open={showProjects} onClose={() => setShowProjects(false)} className="z-50">
			<div className="fixed inset-0 bg-black/30 flex items-center justify-center">
				<Dialog.Panel className="bg-white rounded-xl">
					<Dialog.Title className="bg-gray-100 rounded-t-xl p-4 drop-shadow text-center">
						Project Dialog
					</Dialog.Title>
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
										<th className="px-6 py-4">Description</th>
										<th className="py-4">Action</th>
									</tr>
								</thead>
								<tbody>
									{projects.map((pj,idx) => (
										<tr key={idx} className="border-b min-w-0">
											<td className="px-6 py-4">{pj.id}</td>
											<td className="px-6 py-4">{pj.name}</td>
											<td className="px-6 py-4">{pj.description}</td>
											<td>
												<button onClick={()=>handleEdit(pj.id)}>
													<PencilIcon className="h-5 w-5 m-0.5" />
												</button>
												<button onClick={()=>handleDuplicate(pj.id)}>
													<DocumentDuplicateIcon className="h-5 w-5 m-0.5" />
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
				</Dialog.Panel>
			</div>
		</Dialog>
	)
}