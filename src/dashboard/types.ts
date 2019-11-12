import { Data as BarChartData } from '@/components/BarChart'
import { Data as DatePickerData } from '@/components/DatePicker'
import { Data as DonutChartData } from '@/components/DonutChart'
import { Data as LegendData } from '@/components/Legend'
import { Line } from '@/components/LinearChart'
import { Data as MultiBarChartData } from '@/components/MultiBarChart'
import { Data as ProgressBarData } from '@/components/ProgressBar'
import { Data as PyramidData } from '@/components/PyramidChart'
import { Data as RadarChartData } from '@/components/RadarChart'
import { Data as RangePickerData } from '@/components/RangePicker'
import { Data as StatsData } from '@/components/Stats'
import { Data as TableLegendData } from '@/components/TableLegend'
import { Data as TrafficLightData } from '@/components/TrafficLight'
import { Dashboard2 } from '@/dashboard/migration/migrations/dashboard2'
import { Status } from '@/ui/Badge'

import Dashboard = Dashboard2

export type MarginSize = Dashboard.MarginSize
export type Settings = Dashboard.Settings
export type WidgetItem = Dashboard.WidgetItem
export type ColumnsItem = Dashboard.ColumnsItem
export type ColumnsContent = Dashboard.ColumnsContent
export type BoxItem = Dashboard.BoxItem
export type Config = Dashboard.Config
export type DashboardState = Dashboard.State
export type DashboardVersion = DashboardState['version']

export enum DataType {
  Chart2D,
  PieChart,
  Number,
  NumberWithPercentAndStatus,
  Stats,
  Donut,
  BarChart,
  LinearChart,
  Pyramid,
  Text,
  TableLegend,
  TrafficLight,
  MultiBarChart,
  ProgressBar,
  Legend,
  DatePicker,
  RangePicker,
  RadarChart,
}

export type ColorGroups = { [key: string]: string }
type WithColorGroups = { colorGroups: ColorGroups }

export type DataMap = {
  [DataType.Chart2D]: {
    values: readonly number[]
  }
  [DataType.PieChart]: {
    values: readonly number[]
    color: readonly string[]
  }
  [DataType.Number]: number
  [DataType.NumberWithPercentAndStatus]: {
    value: number
    percentage: number
    status: Status
  }
  [DataType.Stats]: StatsData
  [DataType.Donut]: {
    data: DonutChartData
  } & WithColorGroups
  [DataType.BarChart]: {
    data: readonly BarChartData[]
  } & WithColorGroups
  [DataType.LinearChart]: {
    data: readonly Line[]
  } & WithColorGroups
  [DataType.Pyramid]: readonly PyramidData[]
  [DataType.Text]: string
  [DataType.TableLegend]: TableLegendData
  [DataType.TrafficLight]: TrafficLightData
  [DataType.ProgressBar]: {
    data: readonly ProgressBarData[]
  } & WithColorGroups
  [DataType.MultiBarChart]: {
    data: MultiBarChartData
  } & WithColorGroups
  [DataType.Legend]: {
    data: LegendData
  } & WithColorGroups
  [DataType.DatePicker]: DatePickerData
  [DataType.RangePicker]: RangePickerData
  [DataType.RadarChart]: RadarChartData & WithColorGroups
}

export type Dataset = {
  name: string
  id: string
  type: DataType
  formatLabel?: (n: number) => string
}

export type Data = { [k: string]: DataMap[DataType] }
