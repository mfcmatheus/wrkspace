import fs from 'fs'
import path from 'path'
import plist from 'simple-plist'
import { IpcMainEvent } from 'electron'

export const onApplicationsGet = async (
  event: IpcMainEvent,
  types = ['public.plain-text', 'public.text', 'txt', 'md', 'text']
) => {
  let applications = fs.readdirSync('/Applications') ?? []
  applications = applications.filter((application) =>
    application.endsWith('.app')
  )

  const textEditors = []

  for (const appName of applications) {
    const appPath = path.join('/Applications', appName)
    const infoPlistPath = path.join(appPath, 'Contents', 'Info.plist')
    if (fs.existsSync(infoPlistPath)) {
      try {
        const plistData = plist.readFileSync(infoPlistPath)

        const docTypes = plistData.CFBundleDocumentTypes
        if (docTypes) {
          for (const docType of docTypes) {
            const contentTypes = docType.LSItemContentTypes || []
            const extensions = docType.CFBundleTypeExtensions || []

            const isTextEditor = types.some(
              (type) => contentTypes.includes(type) || extensions.includes(type)
            )

            if (isTextEditor) {
              textEditors.push(appName)
              break
            }
          }
        }
      } catch (error) {
        console.error(`Error parsing plist for ${appName}:`, error)
      }
    }
  }

  event.reply('applications.get', textEditors)
  event.returnValue = textEditors
}
