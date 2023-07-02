import { useState, useContext, FormEvent } from 'react'
import { Node, Edge } from 'reactflow'
import { Dialog } from '@headlessui/react'
import {
	PlusIcon,
	PencilIcon,
	TrashIcon,
	DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'

import { useLocalStore } from '../lib/store'
import { GlobalContext } from '../contexts'
import { initialProject } from '../constants'

export type ProjectType = {
  id: number,
  name: string,
  description: string,
	nodes: Node[],
	edges: Edge[],
}

export default function ProjectsModal() {
	// contexts
	const { showProjectModal, setShowProjectModal } = useContext(GlobalContext)
	const { currentProject, setCurrentProject } = useContext(GlobalContext)

	// stores
	const projects  = useLocalStore((state) => state.projects)
	const setProjects = useLocalStore((state) => state.setProjects)
	const newProjectId = useLocalStore((state) => state.newProjectId)

	// states
	const [showEditModal, setShowEditModal] = useState(false)
	const [project, setProject] = useState<ProjectType>(initialProject(0))

	// Sub modal for editting project, hiddon on startup
	function EditModal() {
		function onSubmit(event: FormEvent, project: ProjectType) {
			event.preventDefault()
			// collect form values
			const { value: name } = (event.target as any).name
			const { value: description } = (event.target as any).description
			// project to be added
			const newProject = { ...project, name, description }
			console.log('at: onSubmit', { newProject })
			// update projects
			setCurrentProject(newProject)
			setProjects([newProject, ...projects.filter((pj) => pj.id !== project.id)])
			//closePopUp()
			setShowEditModal(false)
		}
		function onClose() {
			setShowEditModal(false)
		}
		return (
			<Dialog open={showEditModal} onClose={onClose} className="z-50" >
				<div className="fixed inset-0 bg-black/30 flex items-center justify-center">
					<Dialog.Panel className="bg-white rounded-xl w-[600px]">
						<Dialog.Title className="bg-gray-100 rounded-t-xl p-4 drop-shadow text-center">
							Project Edit Dialog
						</Dialog.Title>
						<form onSubmit={(event) => onSubmit(event, project)}>
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
								<button onClick={onClose} className="bg-blue-700 hover:bg-blue-800 text-white rounded-full px-4">Cancel</button>
							</div>
						</form>
					</Dialog.Panel>
				</div>
			</Dialog>
		)
	}

	function handleEdit(id: number | null) {
		console.log('at: handleEdit', { id })
		setProject(projects.find((pj) => pj.id === id) ?? initialProject(newProjectId()))
		setShowEditModal(true)
	}

	function handleDuplicate(id: number) {
		console.log('at: handleDuplicate', { id })
		const oldProject = projects.find((pj) => pj.id === id) as ProjectType
		const newId = newProjectId()
		const newProject = {
			id: newId,
			name: `${oldProject.name} (${newId})`,
			description: oldProject.description,
			nodes: [...oldProject.nodes],
			edges: [...oldProject.edges]
		}
		setProjects([newProject, ...projects])
	}

	function handleDelete(id: number) {
		console.log('at: handleDelete', { id, projects, currentProject })
		let newProjects = projects.filter((pj)=>pj.id !== id)
		if (id === currentProject.id) {
			if (newProjects.length === 0) {
				newProjects = [initialProject(1)]
			}
			setCurrentProject(newProjects[0])
		}
		setProjects(newProjects)
	}

	// Modal for projects, hidden on startup
	return (
		<Dialog open={showProjectModal} onClose={() => setShowProjectModal(false)} className="z-50">
			<div className="fixed inset-0 bg-black/30 flex items-center justify-center max-w-full">
				<Dialog.Panel className="bg-white rounded-xl m-4 w-[800px]">
					<Dialog.Title className="bg-gray-100 rounded-t-xl p-4 drop-shadow text-center">
						Project List Dialog
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
										<tr key={idx} className="border-b">
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
			<EditModal />
		</Dialog>
	)
}