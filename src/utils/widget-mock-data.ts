import { DataMap, DataType } from '@/dashboard/types'

const mockData: DataMap = {
  [DataType.Chart2D]: {
    values: [1, 2, 3],
  },
  [DataType.PieChart]: {
    values: [1, 2, 3],
    color: ['red', 'blue'],
  },
  [DataType.Number]: 23,
  [DataType.NumberWithPercentAndStatus]: {
    value: 123,
    percentage: 11,
    status: 'danger',
  },
  [DataType.Donut]: [
    [
      {
        color: 'red',
        value: 20,
      },
      {
        color: 'blue',
        value: 15,
      },
      {
        color: 'yellow',
        value: 7,
      },
    ],
    [
      {
        color: 'red',
        value: 20,
      },
      {
        color: 'blue',
        value: 15,
      },
      {
        color: 'yellow',
        value: 7,
      },
    ],
    [
      {
        color: 'red',
        value: 25,
      },
      {
        color: 'blue',
        value: 1,
      },
      {
        color: 'yellow',
        value: 5,
      },
    ],
  ],
  [DataType.BarChart]: [
    {
      categorie: 'март',
      values: [
        {
          value: 410,
          description: 'blue',
        },
        {
          value: 600,
          description: 'red',
        },
        {
          value: 270,
          description: 'orange',
        },
      ],
    },
    {
      categorie: 'апрель',
      values: [
        {
          value: 670,
          description: 'blue',
        },
        {
          value: 1000,
          description: 'red',
        },
        {
          value: 1100,
          description: 'orange',
        },
      ],
    },
    {
      categorie: 'май',
      values: [
        {
          value: 1200,
          description: 'blue',
        },
        {
          value: 630,
          description: 'red',
        },
        {
          value: 100,
          description: 'orange',
        },
      ],
    },
  ],
  [DataType.LinearChart]: [
    {
      color: '#20B55F',
      values: [{ x: 0, y: -1 }, { x: 1, y: 3 }, { x: 2, y: 1 }, { x: 3, y: 4 }],
      dots: true,
    },
    {
      color: '#56B9F2',
      values: [{ x: 0, y: -2 }, { x: 1, y: 4 }, { x: 2, y: 0 }, { x: 3, y: 5 }],
    },
  ],
}

export function getWidgetMockData<T extends DataType>(dataType: T): DataMap[T] {
  return mockData[dataType]
}
