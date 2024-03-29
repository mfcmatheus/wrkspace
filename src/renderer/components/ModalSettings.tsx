import React, { useCallback, useMemo, useState } from 'react'
import { Form, Formik } from 'formik'

import { ModalSettingsPages } from 'renderer/@enums/ModalSettingsPages'
import SidebarItem from 'renderer/@types/SidebarItem'
import Lucide from 'renderer/base-components/lucide'
import ModalSettingsSidebar from 'renderer/components/ModalSettingsSidebar'
import ModalSettingsSidebarItem from 'renderer/components/ModalSettingsSidebarItem'
import SettingsFormSchema from 'renderer/@schemas/SettingsFormSchema'
import ModalSettingsAbout from 'renderer/components/ModalSettingsAbout'
import ButtonMain from 'renderer/base-components/ButtonMain'
import Folder from 'renderer/@types/Folder'
import Setting from 'renderer/@types/Setting'
import ModalSettingsFolders from 'renderer/components/ModalSettingsFolders'
import ModalSettingsGeneral from 'renderer/components/ModalSettingsGeneral'

interface ModalSettingsProps {
  folders: Folder[]
  settings: Setting
  onClose?: () => void
  onSave?: (values: Setting) => void
}

const defaultProps = {
  onClose: null,
  onSave: null,
}

function ModalSettings(props: ModalSettingsProps) {
  const { onClose, onSave, folders, settings } = props

  const [currentPage, setCurrentPage] = useState<number>(
    ModalSettingsPages.GENERAL
  )

  const isFoldersPage = useMemo(
    () => currentPage === ModalSettingsPages.FOLDERS,
    [currentPage]
  )
  const isAboutPage = useMemo(
    () => currentPage === ModalSettingsPages.ABOUT,
    [currentPage]
  )
  const isGeneralPage = useMemo(
    () => currentPage === ModalSettingsPages.GENERAL,
    [currentPage]
  )

  const sidebarItems: SidebarItem[] = useMemo(
    () => [
      {
        icon: 'Settings2',
        label: 'General',
        page: ModalSettingsPages.GENERAL,
      },
      {
        icon: 'Folder',
        label: 'Folders',
        page: ModalSettingsPages.FOLDERS,
      },
      {
        icon: 'Info',
        label: 'About',
        page: ModalSettingsPages.ABOUT,
      },
    ],
    []
  )

  const formValues = useMemo(
    () => ({
      folders,
      defaultPath: settings.defaultPath,
    }),
    [folders, settings]
  )

  const onClickClose = useCallback(() => onClose?.(), [onClose])
  const onFormSubmit = useCallback(
    (values: Setting) => onSave?.(values),
    [onSave]
  )

  return (
    <div className="flex absolute inset-0 w-screen h-screen">
      <div
        aria-hidden="true"
        className="absolute z-[3] inset-0 bg-black/[.6] backdrop-blur-sm"
        onClick={onClickClose}
      />
      <div className="flex relative z-[4] m-auto bg-[#202020] rounded-lg h-[80vh] w-[60vw] shadow">
        <ModalSettingsSidebar>
          {sidebarItems.map((item) => (
            <ModalSettingsSidebarItem
              {...item}
              key={item.label}
              current={currentPage === item.page}
              onClick={(page) => setCurrentPage(page)}
            >
              {item.label}
            </ModalSettingsSidebarItem>
          ))}
        </ModalSettingsSidebar>
        <div className="flex flex-col flex-1">
          <div className="flex p-3">
            <p className="text-white font-thin">Settings</p>
            <button
              type="button"
              className="text-white ml-auto"
              onClick={onClickClose}
            >
              <Lucide icon="X" />
            </button>
          </div>
          <Formik
            initialValues={formValues}
            validationSchema={SettingsFormSchema}
            onSubmit={onFormSubmit}
          >
            {({ values, isValid, dirty }) => (
              <Form className="flex flex-col flex-grow basis-0">
                {isGeneralPage && <ModalSettingsGeneral />}
                {isFoldersPage && (
                  <ModalSettingsFolders folders={values.folders} />
                )}
                {isAboutPage && <ModalSettingsAbout />}
                <div className="flex p-3">
                  <ButtonMain
                    sm
                    bordered
                    secondary
                    type="submit"
                    disabled={!isValid || !dirty}
                    className="ml-auto"
                  >
                    Save
                  </ButtonMain>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

ModalSettings.defaultProps = defaultProps

export default ModalSettings
