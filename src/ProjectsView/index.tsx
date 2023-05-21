import {
	PlusIcon,
} from '@heroicons/react/24/outline';

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
	const data = initialProjects
  return (
		<div className="flex flex-col m-4">
			<div className="flex flex-row items-center m-2">
				<button className="text-white bg-blue-700 flex flex-row p-2 rounded-lg">
					<PlusIcon className="mr-2 h-5 w-5" />
					Add Project
				</button>
			</div>
			<table className="text-left text-sm drop-shadow-md m-2">
				<thead>
					<tr className="bg-gray-50 uppercase min-w-0">
						<th className="px-6 py-4">ID</th>
						<th className="px-6 py-4">Name</th>
						<th className="px-6 py-4">Subject</th>
						<th className="px-6 py-4">Controller</th>
						<th className="px-6 py-4">Processor</th>
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
						</tr>
					))}
				</tbody>
			</table>
			
		</div>
  );
}