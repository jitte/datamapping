import { useContext, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { GlobalContext } from '../contexts'
import { useLocalStore } from '../lib/store'

function normalCaseToSnakeCase(str: string) {
  return str
    .split(' ')
    .map((word, index) => {
      if (index === 0) {
        return word[0].toUpperCase() + word.slice(1).toLowerCase()
      }
      return word.toLowerCase()
    })
    .join('_')
}

export default function ExportModal() {
  const projects = useLocalStore((state) => state.projects)
  const { showExportModal, setShowExportModal } = useContext(GlobalContext)
  const [fileName, setFileName] = useState('Data mapping')

  function downloadFlow() {
    // create a data URI with the current flow data
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(projects, null, '\t')
    )}`

    // create a link element and set its properties
    const link = document.createElement('a')
    link.href = jsonString
    link.download = `${normalCaseToSnakeCase(fileName)}.json`

    // simulate a click on the link element to trigger the download
    link.click()
  }

  return (
    <Dialog
      open={showExportModal}
      onClose={() => setShowExportModal(false)}
      className="z-50"
    >
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
        <Dialog.Panel className="bg-white rounded-xl w-[800px]">
          <Dialog.Title className="bg-gray-100 rounded-t-xl p-4 drop-show text-center">
            Export as
          </Dialog.Title>
          <div className="pt-16 flex flex-col items-start justify-start h-full w-full bg-white p-4 gap-16 rounded-xl">
            <div className="w-full">
              <label
                htmlFor="name"
                className="block mb-2 font-medium text-gray-700 dark:text-white"
              >
                File Name
              </label>
              <input
                onChange={(event) => setFileName(event.target.value)}
                type="text"
                name="name"
                value={fileName}
                id="name"
                className="focus:border focus:border-blue block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
            <div className="w-full flex justify-end">
              <button
                onClick={downloadFlow}
                disabled={fileName.length === 0}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
              >
                Download
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
