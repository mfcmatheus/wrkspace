import React, { useEffect, useMemo, useState } from 'react'
import { ErrorMessage, useField } from 'formik'

import Browser from 'renderer/@types/Browser'
import Workspace from 'renderer/@types/Workspace'
import ButtonMain from 'renderer/base-components/ButtonMain'
import InputMain from 'renderer/base-components/InputMain'
import fakeId from 'renderer/helpers/fakeId'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'
import Browsers from 'renderer/@enums/Browsers'
import Lucide from 'renderer/base-components/lucide'

interface ModalEditWorkspaceBrowserProps {
  workspace: Workspace
}

function ModalEditWorkspaceBrowser(props: ModalEditWorkspaceBrowserProps) {
  const { workspace } = props

  const [field, meta, helpers] = useField('browsers')

  const [browsers, setBrowsers] = useState<Browser[]>(workspace.browsers ?? [])
  const [applications, setApplications] = useState<string[]>([])

  const installedBrowsers = useMemo(() => {
    return (
      applications
        .filter((app) => !!Object.values(Browsers).includes(app))
        .map((app) => app.replace('.app', '')) ?? []
    )
  }, [applications])

  const onClickAddPage = () => {
    const browser = {
      id: fakeId(),
      application: Browsers.CHROME,
      url: '',
    } as Browser
    const updatedBrowsers = [...browsers, browser] as Browser[]

    setBrowsers(updatedBrowsers)
    helpers.setValue(updatedBrowsers)
  }

  const onClickRemove = (browser: Browser) => {
    const index = browsers.findIndex((b) => b.id === browser.id)
    const updatedBrowsers = [...browsers]

    updatedBrowsers.splice(index, 1)

    setBrowsers(updatedBrowsers)
    helpers.setValue(updatedBrowsers)
  }

  const onChangeApp = (
    e: React.ChangeEvent<HTMLSelectElement>,
    browser: Browser
  ) => {
    const index = browsers.findIndex((b) => b.id === browser.id)

    browser.application = e.target.value

    const updatedBrowsers = [...browsers]
    updatedBrowsers[index] = browser

    setBrowsers(updatedBrowsers)
    helpers.setValue(updatedBrowsers)
  }

  const onChangeUrl = (
    e: React.ChangeEvent<HTMLInputElement>,
    browser: Browser
  ) => {
    const index = browsers.findIndex((b) => b.id === browser.id)

    browser.url = e.target.value

    const updatedBrowsers = [...browsers]
    updatedBrowsers[index] = browser

    setBrowsers(updatedBrowsers)
    helpers.setValue(updatedBrowsers)
  }

  const onBlurUrl = (
    e: React.ChangeEvent<HTMLInputElement>,
    browser: Browser
  ) => {
    const index = browsers.findIndex((b) => b.id === browser.id)

    browser.url =
      e.target.value.includes('http://') || e.target.value.includes('https://')
        ? e.target.value
        : `http://${e.target.value}`

    const updatedBrowsers = [...browsers]
    updatedBrowsers[index] = browser

    setBrowsers(updatedBrowsers)
    helpers.setValue(updatedBrowsers)
  }

  const renderError = (message: string) => (
    <p className="text-xs text-red-500">{message}</p>
  )

  useEffect(() => {
    if (!workspace.browsers) return

    helpers.setValue(workspace.browsers)
  }, [workspace.browsers, helpers])

  useEffect(() => {
    ipcRenderer.sendMessage('applications.get')
  }, [])

  useIpc('applications.get', (data: string[]) => {
    setApplications(data)
  })

  return (
    <div className="flex flex-col gap-y-3 flex-grow basis-0 overflow-auto p-3">
      <div className="flex">
        <ButtonMain
          className="text-white border border-indigo-600 !text-xs ml-auto"
          onClick={onClickAddPage}
        >
          New page
        </ButtonMain>
      </div>
      {browsers.map((browser: Browser, index: number) => (
        <div
          key={browser.id}
          className="grid grid-cols-12 gap-x-1 items-center"
        >
          {/* <select
            className="col-span-4"
            name="browsers[].application"
            value={browser.application}
            onChange={(e) => onChangeApp(e, browser)}
          >
            {installedBrowsers.map((app) => (
              <option key={app} value={app}>
                {app}
              </option>
            ))}
          </select> */}
          <InputMain
            className="col-span-11"
            placeholder="https://example.com"
            name={`browsers[${index}].url`}
            value={browser.url}
            defaultValue={browser.url}
            onChange={(e) => onChangeUrl(e, browser)}
            onBlur={(e) => onBlurUrl(e, browser)}
          />
          <div className="col-span-1 flex justify-center">
            {index > 0 && (
              <button type="button" onClick={() => onClickRemove(browser)}>
                <Lucide icon="Trash" size={20} color="#dc2626" />
              </button>
            )}
          </div>
          <div className="col-span-12">
            <ErrorMessage
              name={`browsers[${index}].url`}
              render={renderError}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ModalEditWorkspaceBrowser
