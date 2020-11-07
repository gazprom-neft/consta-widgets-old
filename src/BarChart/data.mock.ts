export const colors = [
  'var(--color-bg-normal)',
  'var(--color-bg-alert)',
  'var(--color-bg-warning)',
] as const

export const minimalData = {
  colors,
  groups: [
    {
      groupName: 'март',
      values: [410],
    },
    {
      groupName: 'апрель',
      values: [670],
    },
    {
      groupName: 'май',
      values: [1200],
    },
  ],
  threshold: { value: 410, color: 'var(--color-bg-normal)' },
  unit: 'тыс. м³',
}

export const withNegativeValueData = {
  colors,
  groups: [
    {
      groupName: 'Q1-2016',
      values: [1000, -100, 50],
    },
    {
      groupName: 'Q2-2016',
      values: [-1000, undefined, 127],
    },
    {
      groupName: 'Q3-2016',
      values: [500, 450, undefined],
    },
    {
      groupName: 'Q4-2016',
      values: [undefined, -300, -200],
    },
    {
      groupName: 'Q5-2016',
      values: [10, 20, 50],
    },
  ],
  unit: 'тыс. м³',
}

export const withThreeColumnsData = {
  colors,
  groups: [
    {
      groupName: 'март',
      values: [410, 600, 270],
    },
    {
      groupName: 'апрель',
      values: [670, 1000, 1100],
    },
    {
      groupName: 'май',
      values: [1200, 630, 100],
    },
  ],
  unit: 'тыс. м³',
}

export const groupExampleData = {
  colors,
  groups: [
    {
      groupName: 'первая группа',
      values: [410, 115],
    },
    {
      groupName: 'вторая группа',
      values: [670, 210, 80],
    },
    {
      groupName: 'третья группа',
      values: [75],
    },
  ],
}
