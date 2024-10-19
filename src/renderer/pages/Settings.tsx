import React, { useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import { Form, Formik } from 'formik'
import { useRecoilValue, waitForAll } from 'recoil'
import SidebarItem from 'renderer/@types/SidebarItem'
import Lucide from 'renderer/base-components/lucide'
import MainLayout from 'renderer/layouts/MainLayout'
import { ModalSettingsPages } from 'renderer/@enums/ModalSettingsPages'
import ModalSettingsGeneral from 'renderer/components/ModalSettingsGeneral'
import ModalSettingsFolders from 'renderer/components/ModalSettingsFolders'
import ModalSettingsAbout from 'renderer/components/ModalSettingsAbout'
import ButtonMain from 'renderer/base-components/ButtonMain'
import SettingsFormSchema from 'renderer/@schemas/SettingsFormSchema'
import SettingAtom from 'renderer/store/atoms/SettingAtom'
import FolderAtom from 'renderer/store/atoms/FolderAtom'
import Setting from 'renderer/@types/Setting'

export default function Settings() {
  const navigate = useNavigate()
  const [settings, folders] = useRecoilValue(
    waitForAll([SettingAtom, FolderAtom])
  )
  const [currentPage, setCurrentPage] = useState<ModalSettingsPages>(
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
        icon: 'Info',
        label: 'About',
        page: ModalSettingsPages.ABOUT,
      },
    ],
    []
  )

  const onClickBack = useCallback(() => {
    return navigate('/')
  }, [navigate])

  const formValues = useMemo(
    () => ({
      ...settings,
      folders,
    }),
    [folders, settings]
  )

  const onFormSubmit = useCallback((values: Setting) => {
    //
  }, [])

  return (
    <MainLayout>
      <div className="flex flex-col p-3 h-full w-[275px] bg-background rounded-l-md border border-border/75 overflow-hidden">
        <div className="flex flex-col gap-y-6 flex-grow basis-full overflow-y-auto">
          <button
            type="button"
            className="cursor-default flex items-center gap-x-2"
            onClick={onClickBack}
          >
            <Lucide icon="ChevronLeft" size={24} />
            <span className="font-light">Settings</span>
          </button>
          <ul className="flex flex-col gap-y-1">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  className={classNames({
                    'cursor-default flex items-center gap-x-2 w-full py-1 px-2 rounded hover:bg-border':
                      true,
                    'bg-border text-white': currentPage === item.page,
                  })}
                  onClick={() => setCurrentPage(item.page)}
                >
                  <Lucide icon={item.icon} size={14} />
                  <span className="font-light text-sm">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col relative bg-background flex-1 rounded-r-md border border-l-0 border-border/75 overflow-hidden h-full">
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
              <ButtonMain
                sm
                bordered
                secondary
                type="submit"
                disabled={!isValid || !dirty}
                className="fixed bottom-6 right-6"
              >
                Save
              </ButtonMain>
            </Form>
          )}
        </Formik>
      </div>
    </MainLayout>
  )
}
