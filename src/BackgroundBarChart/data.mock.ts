import { Group } from '.'

const colors = {
  normal: 'var(--color-bg-normal)',
  alert: 'var(--color-bg-alert)',
  stripesAlert:
    'repeating-linear-gradient(45deg, var(--color-bg-alert), var(--color-bg-alert) 2px, transparent 2px, transparent 4px, var(--color-bg-alert) 4px, var(--color-bg-alert) 6px)',
}

const valueNames = ['ПВ', 'НПВ'] as const
const bgValueNames = ['Всего', 'Отклонение'] as const

export const groups: readonly Group[] = [
  {
    groupName: 'Бурение',
    values: [{ value: 22, color: colors.normal, name: valueNames[0] }],
    backgroundValues: [{ value: 22, color: colors.normal, name: bgValueNames[0] }],
  },
  {
    groupName: 'ВМР/Движка',
    values: [{ value: 3, color: colors.normal, name: valueNames[0] }],
    backgroundValues: [{ value: 25, color: colors.normal, name: bgValueNames[0] }],
  },
  {
    groupName: 'Обустройство',
    values: [{ value: 5, color: colors.normal, name: valueNames[0] }],
    backgroundValues: [{ value: 30, color: colors.normal, name: bgValueNames[0] }],
  },
  {
    groupName: 'КРС (ПР к ГРП)',
    values: [{ value: 5, color: colors.normal, name: valueNames[0] }],
    backgroundValues: [{ value: 35, color: colors.normal, name: bgValueNames[0] }],
  },
  {
    groupName: 'ГРП',
    values: [{ value: 3, color: colors.normal, name: valueNames[0] }],
    backgroundValues: [{ value: 38, color: colors.normal, name: bgValueNames[0] }],
  },
  {
    groupName: 'ГНКТ',
    values: [
      { value: 1, color: colors.normal, name: valueNames[0] },
      { value: 1, color: colors.alert, name: valueNames[1] },
    ],
    backgroundValues: [{ value: 40, color: colors.normal, name: bgValueNames[0] }],
  },
  {
    groupName: 'КРС (ЗР к ГРП)',
    values: [{ value: 3, color: colors.stripesAlert, name: valueNames[0] }],
    backgroundValues: [
      { value: 40, color: colors.normal, name: bgValueNames[0] },
      { value: 3, color: colors.alert, name: bgValueNames[1] },
    ],
    isDisabled: true,
  },
  {
    groupName: 'ВНР',
    values: [{ value: 3, color: colors.stripesAlert, name: valueNames[0] }],
    backgroundValues: [
      { value: 43, color: colors.normal, name: bgValueNames[0] },
      { value: 3, color: colors.alert, name: bgValueNames[1] },
    ],
    isDisabled: true,
  },
]

const valueNamesExample = ['Выросло', 'Съел колорадский жук'] as const
const bgValueNamesExample = ['В плане', 'Посадили не то'] as const

export const exampleData = {
  threshold: { value: 20, color: 'var(--color-bg-alert)' },
  unit: 'кг',
}

export const groupsExample: readonly Group[] = [
  {
    groupName: 'Картошка',
    values: [{ value: 22, color: colors.normal, name: valueNamesExample[0] }],
    backgroundValues: [{ value: 22, color: colors.normal, name: bgValueNamesExample[0] }],
  },
  {
    groupName: 'Капуста',
    values: [{ value: 3, color: colors.normal, name: valueNamesExample[0] }],
    backgroundValues: [{ value: 25, color: colors.normal, name: bgValueNamesExample[0] }],
  },
  {
    groupName: 'Морковка',
    values: [
      { value: 1, color: colors.normal, name: valueNamesExample[0] },
      { value: 1, color: colors.alert, name: valueNamesExample[1] },
    ],
    backgroundValues: [{ value: 40, color: colors.normal, name: bgValueNamesExample[0] }],
  },
  {
    groupName: 'Ананасы',
    values: [{ value: 3, color: colors.stripesAlert, name: valueNamesExample[0] }],
    backgroundValues: [
      { value: 43, color: colors.normal, name: bgValueNamesExample[0] },
      { value: 3, color: colors.alert, name: bgValueNamesExample[1] },
    ],
    isDisabled: true,
  },
]

export const groupsPotatoExample: readonly Group[] = [
  {
    groupName: 'Картошка',
    values: [{ value: 22, color: colors.normal, name: valueNamesExample[0] }],
    backgroundValues: [{ value: 22, color: colors.normal, name: bgValueNamesExample[0] }],
  },
  {
    groupName: 'Капуста',
    values: [{ value: 3, color: colors.normal, name: valueNamesExample[0] }],
    backgroundValues: [{ value: 25, color: colors.normal, name: bgValueNamesExample[0] }],
  },
  {
    groupName: 'Морковка',
    values: [
      { value: 1, color: colors.normal, name: valueNamesExample[0] },
      { value: 1, color: colors.alert, name: valueNamesExample[1] },
    ],
    backgroundValues: [{ value: 40, color: colors.normal, name: bgValueNamesExample[0] }],
  },
]

export const groupsAnanasExample: readonly Group[] = [
  {
    groupName: 'Ананасы',
    values: [{ value: 3, color: colors.stripesAlert, name: valueNamesExample[0] }],
    backgroundValues: [
      { value: 43, color: colors.normal, name: bgValueNamesExample[0] },
      { value: 3, color: colors.alert, name: bgValueNamesExample[1] },
    ],
    isDisabled: true,
  },
]
