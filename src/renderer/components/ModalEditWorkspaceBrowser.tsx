import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ErrorMessage, useField, useFormikContext } from 'formik'

import classNames from 'classnames'
import { Tooltip } from 'react-tooltip'
import { useRecoilValue } from 'recoil'
import Browser from 'renderer/@types/Browser'
import Workspace from 'renderer/@types/Workspace'
import ButtonMain from 'renderer/base-components/ButtonMain'
import InputMain from 'renderer/base-components/InputMain'
import fakeId from 'renderer/helpers/fakeId'
import Browsers from 'renderer/@enums/Browsers'
import Lucide from 'renderer/base-components/lucide'
import ApplicationSelector from 'renderer/store/selectors/ApplicationSelector'

interface ModalEditWorkspaceBrowserProps {
  workspace: Workspace
}

function ModalEditWorkspaceBrowser(props: ModalEditWorkspaceBrowserProps) {
  const { workspace } = props

  const applications = useRecoilValue(ApplicationSelector)
  const { errors } = useFormikContext()
  const [field, meta, helpers] = useField('browsers')

  const [url, setUrl] = useState<string>('')
  const [browsers, setBrowsers] = useState<Browser[]>(
    field.value ?? workspace?.browsers ?? []
  )

  const installedBrowsers = useMemo(() => {
    return (
      applications
        .filter((app) => !!Object.values(Browsers).includes(app))
        .map((app) => app.replace('.app', '')) ?? []
    )
  }, [applications])

  const onClickAddPage = useCallback(() => {
    const browser = {
      id: fakeId(),
      application: Browsers.CHROME,
      url,
    } as Browser
    const updatedBrowsers = [...browsers, browser] as Browser[]

    setBrowsers(updatedBrowsers)
    helpers.setValue(updatedBrowsers)
    setUrl('')
  }, [browsers, helpers, url])

  const onClickRemove = useCallback(
    (browser: Browser) => {
      const index = browsers.findIndex((b) => b.id === browser.id)
      const updatedBrowsers = [...browsers]

      updatedBrowsers.splice(index, 1)

      setBrowsers(updatedBrowsers)
      helpers.setValue(updatedBrowsers)
    },
    [browsers, helpers]
  )

  const onChangeApp = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>, browser: Browser) => {
      const index = browsers.findIndex((b) => b.id === browser.id)

      browser.application = e.target.value

      const updatedBrowsers = [...browsers]
      updatedBrowsers[index] = browser

      setBrowsers(updatedBrowsers)
      helpers.setValue(updatedBrowsers)
    },
    [browsers, helpers]
  )

  const onChangeUrl = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, browser: Browser) => {
      const index = browsers.findIndex((b) => b.id === browser.id)
      const newData = { ...browser }

      newData.url = e.target.value

      const updatedBrowsers = [...browsers]
      updatedBrowsers[index] = newData

      setBrowsers(updatedBrowsers)
      helpers.setValue(updatedBrowsers)
    },
    [browsers, helpers]
  )

  const onBlurUrl = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, browser: Browser) => {
      const index = browsers.findIndex((b) => b.id === browser.id)

      const updatedBrowsers = [...browsers]
      updatedBrowsers[index] = browser

      setBrowsers(updatedBrowsers)
      helpers.setValue(updatedBrowsers)
    },
    [browsers, helpers]
  )

  const normalize = useCallback((value: string) => {
    const newValue =
      value.includes('http://') || value.includes('https://')
        ? value
        : `http://${value}`

    return newValue.replace('localhost', '127.0.0.1')
  }, [])

  const renderError = useCallback(
    (message: string) => <p className="text-xs text-red-500">{message}</p>,
    []
  )

  useEffect(() => {
    if (!field.value && !workspace?.browsers?.length) return
    helpers.setValue(field.value ?? workspace?.browsers)
  }, [field.value, workspace?.browsers, helpers])

  return (
    <div className="flex flex-col gap-y-8 flex-grow basis-0 overflow-auto p-[1px]">
      <div className="flex flex-col gap-y-1">
        <p className="text-white">Browser pages</p>
        <span className="text-sm text-zinc-400 font-thin">
          Add pages to open in the browser when the workspace is opened.
        </span>
      </div>
      <div className="flex flex-col border border-border rounded-md p-4 gap-y-6">
        <p className="text-white">Add a new browser page</p>
        <label className="flex flex-col gap-y-2">
          <span className="text-sm font-light">Page URL</span>
          <InputMain
            standard
            placeholder="Ex: https://wrkspace.co"
            value={url}
            onChange={(e) => setUrl(normalize(e.target.value.trim()))}
          />
        </label>
        <div className="flex items-center -mx-4 -mb-4 border-t border-border py-2 px-4">
          <div className="flex items-center gap-x-2">
            <Lucide icon="Info" size={16} color="#d2d2d2" />
            <span className="text-xs font-light">
              For local URLs use http://127.0.0.1 or http://your-local-ip.
            </span>
          </div>
          <ButtonMain
            secondary
            bordered
            sm
            onClick={onClickAddPage}
            disabled={!url}
            className="ml-auto"
          >
            Save
          </ButtonMain>
        </div>
      </div>
      <div className="flex flex-col gap-y-3">
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
            <div className="col-span-12 flex gap-x-3">
              <InputMain
                containerClasses={classNames({
                  'border border-red-500': errors.browsers?.[index]?.url,
                })}
                placeholder="https://example.com"
                name={`browsers[${index}].url`}
                value={browser.url}
                defaultValue={browser.url}
                onChange={(e) => onChangeUrl(e, browser)}
                onBlur={(e) => onBlurUrl(e, browser)}
              />
              <ButtonMain
                bordered
                primary
                sm
                onClick={() => onClickRemove(browser)}
              >
                <Lucide icon="CircleMinus" size={20} color="#d2d2d2" />
              </ButtonMain>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ModalEditWorkspaceBrowser
