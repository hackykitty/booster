import { Class, ReadModelFilterHooks, ReadModelInterface, RoleAccess } from '@boostercloud/framework-types'
import { Booster } from '../booster'
import { getPropertiesMetadata } from './metadata'

/**
 * Decorator to register a class as a ReadModel
 * @param attributes
 */
export function ReadModel(
  attributes: RoleAccess & ReadModelFilterHooks
): (readModelClass: Class<ReadModelInterface>) => void {
  return (readModelClass) => {
    Booster.configureCurrentEnv((config): void => {
      if (config.readModels[readModelClass.name]) {
        throw new Error(`A read model called ${readModelClass.name} is already registered.
        If you think that this is an error, try performing a clean build.`)
      }

      const properties = getPropertiesMetadata(readModelClass)

      config.readModels[readModelClass.name] = {
        class: readModelClass,
        properties,
        authorizedRoles: attributes.authorize,
        before: attributes.before ?? [],
      }
    })
  }
}
