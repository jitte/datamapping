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
	const storeProjects = useLocalStore((state) => state.storeProjects)
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
			storeProjects([newProject, ...projects.filter((pj) => pj.id !== project.id)])
			//closePopUp()
			setShowEditModal(false)
		}
		function onClose() {
			setShowEditModal(false)
		}
		return (
			<Dialog open={showEditModal} onClose={onClose} className="z-50" >
				<div className="fixed inset-0 flex items-center justify-center bg-black/30">
					<Dialog.Panel className="bg-white rounded-xl w-[600px]">
						<Dialog.Title className="p-4 text-center bg-gray-100 rounded-t-xl drop-shadow">
							Project Edit Dialog
						</Dialog.Title>
						<form onSubmit={(event) => onSubmit(event, project)}>
							<div className="flex flex-col p-4 text-sm">
								<label htmlFor="name">
									Project Name
								</label>
								<input type="text" name="name" className="rounded form-input" defaultValue={project.name} />
								<label htmlFor="description">
									Description
								</label>
								<textarea name="description" className="rounded form-textarea" defaultValue={project.description} />
							</div>
							<div className="flex flex-row pb-4 justify-evenly">
								<input type="submit" className="px-4 text-white bg-blue-700 rounded-full hover:bg-blue-800" value="Submit"/>
								<button onClick={onClose} className="px-4 text-white bg-blue-700 rounded-full hover:bg-blue-800">Cancel</button>
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
		storeProjects([newProject, ...projects])
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
		storeProjects(newProjects)
	}

	// Modal for projects, hidden on startup
	return (
		<Dialog open={showProjectModal} onClose={() => setShowProjectModal(false)} className="z-50">
			<div className="fixed inset-0 flex items-center justify-center max-w-full bg-black/30">
				<Dialog.Panel className="bg-white rounded-xl m-4 w-[800px]">
					<Dialog.Title className="p-4 text-center bg-gray-100 rounded-t-xl drop-shadow">
						Project List Dialog
					</Dialog.Title>
						<div className="flex flex-col p-2">
							<div className="m-2">
								<button
									className="flex flex-row float-right p-2 text-white bg-blue-700 rounded-lg hover:bg-blue-800"
									onClick={() => handleEdit(null)}
								>
									<PlusIcon className="w-5 h-5 mr-2" />
									Project
								</button>
							</div>
							<table className="m-2 text-sm text-left drop-shadow-md">
								<thead>
									<tr className="uppercase bg-gray-50">
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