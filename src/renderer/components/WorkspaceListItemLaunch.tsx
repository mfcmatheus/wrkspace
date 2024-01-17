import classNames from 'classnames'
import React, { useMemo } from 'react'

import Workspace from 'renderer/@types/Workspace'
import LoadingIcon from 'renderer/base-components/LoadingIcon'

interface WorkspaceListItemLaunchProps {
  workspace: Workspace
  onClick?: () => void
}

const defaultProps = {
  onClick: () => {},
}

function WorkspaceListItemLaunch(props: WorkspaceListItemLaunchProps) {
  const { workspace, onClick } = props

  const classes = useMemo(
    () =>
      classNames({
        'flex cursor-pointer flex-1 text-center bg-[#353535] group-hover:bg-highlight-primary -mx-[13px] -mb-[13px] py-2 mt-1 rounded-b-[3px] transition ease-in-out duration-200':
          true,
        'group-hover:!bg-gradient-to-r from-highlight-primary to-highlight-secondary':
          workspace.favorite,
      }),
    [workspace]
  )

  return (
    <button type="button" className={classes} onClick={onClick}>
      {workspace?.loading ? (
        <div className="w-10 mx-auto py-1">
          <LoadingIcon icon="three-dots" color="#f0f0f0" />
        </div>
      ) : (
        <p className="uppercase text-[#f0f0f0] font-thin text-xs mx-auto">
          Launch
        </p>
      )}
    </button>
  )
}

WorkspaceListItemLaunch.defaultProps = defaultProps

export default WorkspaceListItemLaunch
