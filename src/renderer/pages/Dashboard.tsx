import classNames from 'classnames'
import React, { useState } from 'react'
import { useRecoilCallback, useRecoilValue, waitForAll } from 'recoil'
import InputMain from 'renderer/base-components/InputMain'
import Lucide from 'renderer/base-components/lucide'
import ActionsMain from 'renderer/components/ActionsMain'
import FoldersMain from 'renderer/components/FoldersMain'
import LogsMain from 'renderer/components/LogsMain'
import LogsMainIndicator from 'renderer/components/LogsMainIndicator'
import MenuMain from 'renderer/components/MenuMain'
import TeamSelector from 'renderer/components/TeamSelector'
import TopBar from 'renderer/components/TopBar'
import WorkspaceList from 'renderer/components/WorkspaceList'
import MainLayout from 'renderer/layouts/MainLayout'
import SettingCurrentFilterSelector from 'renderer/store/selectors/SettingCurrentFilterSelector'
import SettingCurrentFolderSelector from 'renderer/store/selectors/SettingCurrentFolderSelector'
import SettingDefaultSelector from 'renderer/store/selectors/SettingDefaultSelector'
import SettingSearchSelector from 'renderer/store/selectors/SettingSearchSelector'
import SettingShowSearch from 'renderer/store/selectors/SettingShowSearch'

export default function Dashboard() {
  const [showLogs, setShowLogs] = useState<boolean>(false)
  const [showSearch, search, currentFilter] = useRecoilValue(
    waitForAll([
      SettingShowSearch,
      SettingSearchSelector,
      SettingCurrentFilterSelector,
      SettingCurrentFolderSelector,
    ])
  )

  const onClickSearch = useRecoilCallback(({ set }) => () => {
    set(SettingDefaultSelector, {
      showSearch: !showSearch,
    })
  })

  const onSearch = useRecoilCallback(({ set }) => (value: string) => {
    set(SettingDefaultSelector, {
      search: value.trim(),
    })
  })

  return (
    <MainLayout>
      <div className="flex flex-col p-3 h-full w-[275px] bg-background rounded-l-md border border-border/75 overflow-hidden">
        <div className="flex flex-col gap-y-6 flex-grow basis-full overflow-y-auto">
          <div className="flex items-center w-full gap-x-2">
            <TeamSelector />
            <button type="button" className="ml-auto" onClick={onClickSearch}>
              <Lucide icon="Search" size={18} strokeWidth={1} />
            </button>
          </div>
          {(showSearch || search) && (
            <div className="flex px-[1px] -mt-4">
              <InputMain
                standard
                placeholder="Search"
                value={search ?? ''}
                onChange={(e) => onSearch(e.target.value)}
                inputClasses="!h-[30px] !p-0 !px-3 !font-thin !text-sm"
                containerClasses={classNames({
                  'shadow-[0_0_0_1px_#fff]': search,
                })}
              />
            </div>
          )}
          <MenuMain />
          <FoldersMain />
          <ActionsMain />
        </div>
      </div>
      <div className="flex flex-col relative bg-background flex-1 rounded-r-md border border-l-0 border-border/75 overflow-hidden h-full">
        <TopBar />
        <WorkspaceList showAddButton={!currentFilter} />
        {showLogs && <LogsMain />}
        <LogsMainIndicator showLogs={showLogs} setShowLogs={setShowLogs} />
      </div>
    </MainLayout>
  )
}
