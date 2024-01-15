import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Form, Formik } from 'formik'

import ModalStartSettings from 'renderer/components/ModalStartSettings'
import { ModalStartPages } from 'renderer/@enums/ModalStartPages'
import ModalStartWelcome from 'renderer/components/ModalStartWelcome'
import StartFormSchema from 'renderer/@schemas/StartFormSchema'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'
import Setting from 'renderer/@types/Setting'

interface ModalStartProps {
  onClose: () => void
  onSave: (data: Setting) => void
}

export default function ModalStart(props: ModalStartProps) {
  const { onClose, onSave } = props

  const [page, setPage] = useState<ModalStartPages>(ModalStartPages.WELCOME)
  const [settings, setSettings] = useState<Setting | null>(null)

  const isWelcomePage = useMemo(() => page === ModalStartPages.WELCOME, [page])
  const isSettingsPage = useMemo(
    () => page === ModalStartPages.SETTINGS,
    [page]
  )

  const onSubmit = useCallback(
    (data: Setting) => {
      onSave({ ...data, configured: true })
      onClose()
    },
    [onClose, onSave]
  )

  useEffect(() => {
    ipcRenderer.sendMessage('settings.get')
  }, [])

  useIpc('settings.get', (data: Setting) => setSettings(data))

  return (
    <div className="flex absolute inset-0 w-screen h-screen">
      <div
        aria-hidden="true"
        className="absolute z-[3] inset-0 bg-black/[.6] backdrop-blur-sm"
      />
      <div className="flex items-center justify-center relative z-[4] m-auto bg-[#202020] rounded-lg h-[60vh] w-[70vw] shadow">
        <Formik
          initialValues={{ defaultPath: settings?.defaultPath ?? '' }}
          validationSchema={StartFormSchema}
          onSubmit={onSubmit}
        >
          <Form className="flex flex-col flex-grow basis-0">
            {isWelcomePage && (
              <ModalStartWelcome
                onNext={() => setPage(ModalStartPages.SETTINGS)}
              />
            )}
            {isSettingsPage && <ModalStartSettings />}
          </Form>
        </Formik>
      </div>
    </div>
  )
}
