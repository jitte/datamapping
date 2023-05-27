import React, { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { GlobalContext, PopUpContext } from "../contexts";

function normalCaseToSnakeCase(str: string) {
  return str
    .split(" ")
    .map((word, index) => {
      if (index === 0) {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    })
    .join("_");
};

export default function ExportModal() {
  const [open, setOpen] = useState(true);
  const [flowName, setFlowName] = useState("");

  const ref: React.MutableRefObject<any> = useRef();

  const { closePopUp } = useContext(PopUpContext);
  const { nodes, edges }  = useContext(GlobalContext);

  function setModalOpen(x: boolean) {
    setOpen(x);
    if (x === false) {
      setTimeout(() => {
        closePopUp();
      }, 300);
    }
  }

  function downloadFlow() {
    if (flowName === '') return;
    // create a data URI with the current flow data
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify({nodes, edges}, null, "\t")
    )}`;

    // create a link element and set its properties
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${normalCaseToSnakeCase(flowName)}.json`;

    // simulate a click on the link element to trigger the download
    link.click();
  };

  return (
    <Transition.Root show={open} appear={true} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={setModalOpen}
        initialFocus={ref}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 dark:bg-gray-600 dark:bg-opacity-75 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative flex flex-col justify-between transform h-[600px] overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 w-[700px]">
                <div className=" z-50 absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => {
                      setModalOpen(false);
                    }}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="h-full w-full flex flex-col justify-center items-center">
                  <div className="flex w-full pb-4 z-10 justify-center shadow-sm">
                    <div className="mx-auto mt-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-gray-900 sm:mx-0 sm:h-10 sm:w-10">
                      <ArrowDownTrayIcon
                        className="h-6 w-6 text-blue-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-4 text-center sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium dark:text-white leading-10 text-gray-900"
                      >
                        Export as
                      </Dialog.Title>
                    </div>
                  </div>
                  <div className="pt-16 flex flex-col items-start justify-start h-full w-full bg-gray-200 dark:bg-gray-900 p-4 gap-16">
                    <div className="w-full">
                      <label
                        htmlFor="name"
                        className="block mb-2 font-medium text-gray-700 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        onChange={(event) => setFlowName(event.target.value)}
                        type="text"
                        name="name"
                        value={flowName}
                        placeholder="File name"
                        id="name"
                        className="focus:border focus:border-blue block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="description"
                        className="block mb-2 font-medium text-gray-700 dark:text-white"
                      >
                        Description{" "}
                        <span className="text-gray-400 text-sm">
                          {" "}
                          (optional)
                        </span>
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        onChange={() => {}}
                        value=""
                        placeholder="Flow description"
                        rows={3}
                        className=" focus:border focus:border-blue block w-full px-3 py-2 border-gray-300 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      ></textarea>
                    </div>
                    <div className="w-full flex justify-end">
                      <button
                        onClick={downloadFlow}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Download Flow
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
