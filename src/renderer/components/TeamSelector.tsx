import { Formik } from 'formik'
import React from 'react'
import { useRecoilValue, waitForAll } from 'recoil'
import * as Yup from 'yup'
import SelectMain from 'renderer/base-components/SelectMain'
import SettingCurrentTeamSelector from 'renderer/store/selectors/SettingCurrentTeamSelector'
import TeamAtom from 'renderer/store/atoms/TeamAtom'

export default function TeamSelector() {
  const [team, teams] = useRecoilValue(
    waitForAll([SettingCurrentTeamSelector, TeamAtom])
  )

  const schema = Yup.object({
    team_id: Yup.string().nullable(),
  })

  return (
    <Formik
      initialValues={{ team }}
      validationSchema={schema}
      onSubmit={() => {}}
    >
      <div className="p-1 w-full">
        <SelectMain
          name="team_id"
          inputClasses="!h-[30px] !p-0 !px-3 !font-thin !text-sm"
        >
          <option selected value={null}>
            Main space
          </option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </SelectMain>
      </div>
    </Formik>
  )
}
