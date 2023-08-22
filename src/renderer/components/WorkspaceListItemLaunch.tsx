import React from 'react'

interface WorkspaceListItemLaunchProps {
  onClick?: () => void
}

const defaultProps = {
  onClick: () => {},
}

function WorkspaceListItemLaunch(props: WorkspaceListItemLaunchProps) {
  const { onClick } = props

  return (
    <button
      type="button"
      className="cursor-pointer flex-1 text-center bg-[#353535] group-hover:bg-indigo-600 -mx-3 -mb-3 py-2 mt-1 rounded-b transition ease-in-out duration-200"
      onClick={onClick}
    >
      <p className="uppercase text-[#f0f0f0] font-thin text-xs">Launch</p>
    </button>
  )
}

WorkspaceListItemLaunch.defaultProps = defaultProps

export default WorkspaceListItemLaunch
