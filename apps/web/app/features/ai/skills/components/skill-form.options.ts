import { formOptions } from '@tanstack/react-form'
import { CreateSkillInput } from '../skill.schema'

export const skillFormOptions = (defaultValues: CreateSkillInput) =>
  formOptions({
    defaultValues,
  })
