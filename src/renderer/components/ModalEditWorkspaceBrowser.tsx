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

  const [browsers, setBrowsers] = useState<Browser[]>(
    field.value ?? workspace.browsers ?? []
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
      url: '',
    } as Browser
    const updatedBrowsers = [...browsers, browser] as Browser[]

    setBrowsers(updatedBrowsers)
    helpers.setValue(updatedBrowsers)
  }, [browsers, helpers])

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

      browser.url = e.target.value

      const updatedBrowsers = [...browsers]
      updatedBrowsers[index] = browser

      setBrowsers(updatedBrowsers)
      helpers.setValue(updatedBrowsers)
    },
    [browsers, helpers]
  )

  const onBlurUrl = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, browser: Browser) => {
      const index = browsers.findIndex((b) => b.id === browser.id)

      browser.url =
        e.target.value.includes('http://') ||
        e.target.value.includes('https://')
          ? e.target.value
          : `http://${e.target.value}`

      browser.url = browser.url.replace('localhost', '127.0.0.1')

      const updatedBrowsers = [...browsers]
      updatedBrowsers[index] = browser

      setBrowsers(updatedBrowsers)
      helpers.setValue(updatedBrowsers)
    },
    [browsers, helpers]
  )

  const renderError = useCallback(
    (message: string) => <p className="text-xs text-red-500">{message}</p>,
    []
  )

  useEffect(() => {
    if (!field.value && !workspace.browsers?.length) return

    helpers.setValue(field.value ?? workspace.browsers)
  }, [field.value, workspace.browsers, helpers])

  useEffect(() => {
    setBrowsers(workspace.browsers ?? [])
  }, [workspace.browsers])

  return (
    <div className="flex flex-col gap-y-5 flex-grow basis-0 overflow-auto p-3">
      <div className="flex">
        <div className="flex items-center gap-x-3">
          <p className="text-white font-thin">Browser pages</p>
          <Lucide
            id="pages-info"
            icon="Info"
            size={16}
            color="#d2d2d2"
            strokeWidth={1}
          />
          <Tooltip
            style={{ backgroundColor: '#181818', maxWidth: '200px' }}
            anchorSelect="#pages-info"
            place="bottom"
            className="flex flex-col text-center font-thin"
          >
            <span className="text-xs text-gray-100 font-thin">
              Add pages to open in the browser when the workspace is opened.
            </span>
          </Tooltip>
        </div>
        <ButtonMain
          sm
          bordered
          primary
          className="ml-auto"
          onClick={onClickAddPage}
        >
          New page
        </ButtonMain>
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
            <div className="col-span-12 flex">
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
              <button
                type="button"
                className="text-white px-4"
                onClick={() => onClickRemove(browser)}
              >
                <Lucide icon="X" size={16} color="#d2d2d2" strokeWidth={1} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ModalEditWorkspaceBrowser
