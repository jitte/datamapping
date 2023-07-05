import { useLocalStore } from '@/lib/store'
import { Project, columns } from './columns'
import { DataTable } from './data-table'

function getData(): Project[] {
  return useLocalStore((state) => state.projects)
}

export default function ProjectPage() {
  const data = getData()

  return (
    <div className="container py-10 mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
