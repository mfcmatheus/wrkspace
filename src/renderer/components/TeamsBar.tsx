import classNames from 'classnames'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'
import Logo from 'renderer/base-components/Logo'
import Lucide from 'renderer/base-components/lucide'
import initials from 'renderer/helpers/initials'
import TeamAtom from 'renderer/store/atoms/TeamAtom'
import SettingCurrentTeamSelector from 'renderer/store/selectors/SettingCurrentTeamSelector'
import ElectronApi from 'services/ElectronApi'

export default function TeamsBar() {
  const [teams, currentTeam] = useRecoilValue(
    waitForAll([TeamAtom, SettingCurrentTeamSelector])
  )

  const baseClasses = useMemo(
    () =>
      'w-full relative aspect-square flex items-center justify-center bg-muted p-[6px] rounded-lg shadow-md border border-border/75',
    []
  )

  const selectorClasses = useMemo(
    () =>
      'before:content-[""] before:absolute before:left-[-17px] before:w-[4px] before:h-[25px] before:bg-[#d2d2d2] before:rounded-r-md',
    []
  )

  return (
    <div className="flex flex-col gap-y-2 w-[70px] h-full p-3 pt-10">
      <button
        type="button"
        className={classNames({
          [baseClasses!]: true,
          [selectorClasses!]: !currentTeam,
        })}
      >
        <Logo color="#d2d2d2" />
      </button>
      <div className="flex flex-col flex-grow basis-full overflow-y-auto">
        {teams.map((team) => (
          <button
            key={team.id}
            type="button"
            className={classNames({
              [baseClasses!]: true,
              [selectorClasses!]: currentTeam?.id === team.id,
            })}
          >
            {initials(team.name)}
          </button>
        ))}
        <button type="button" className={baseClasses}>
          <Lucide icon="Plus" size={24} strokeWidth={1} />
        </button>
      </div>
      <button
        type="button"
        className="flex h-12 w-12 justify-center items-center"
        onClick={() => ElectronApi.call('user.authenticate')}
      >
        <Lucide icon="UserCircle2" size={32} color="#6f6f6f" strokeWidth={1} />
      </button>
    </div>
  )
}
