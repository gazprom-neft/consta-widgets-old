import React, { useLayoutEffect, useMemo } from 'react'
import { useDrop } from 'react-dnd'
import ReactGridLayout, { Layout, WidthProvider } from 'react-grid-layout-tmp-fork'
import useDimensions from 'react-use-dimensions'

import { updateAt } from '@gaz/utils/lib/array'
import { updateBaseSize } from '@gaz/utils/lib/css'

import { Box } from '@/dashboard/components/Box'
import { ItemTypes } from '@/dashboard/dnd-constants'
import { BoxItem, DashboardState, Data, Dataset } from '@/dashboard/types'
import { useUniqueNameGenerator } from '@/utils/uniq-name-hook'

import css from './index.css'

const GridLayout = WidthProvider(ReactGridLayout)

type Props = {
  dashboard: DashboardState
  onChange: (dashboard: Partial<DashboardState>) => void
}

export type DashboardProps = {
  baseMargin?: readonly [number, number]
  basePadding?: readonly [number, number]
  cols?: number
  datasets: readonly Dataset[]
  viewMode: boolean
  data: Data
  baseFontSize: number
  baseWidthForScaling?: number
  baseHeightForScaling?: number
  rowsCount: number
}

export const Dashboard: React.FC<DashboardProps & Props> = props => {
  const {
    cols,
    viewMode,
    onChange,
    dashboard,
    datasets,
    data,
    baseFontSize,
    baseMargin = [0, 0],
    basePadding = [0, 0],
    baseWidthForScaling,
    baseHeightForScaling,
    rowsCount,
  } = props
  const { boxes, config } = dashboard

  const [dimensionRef, { width, height }, element] = useDimensions()

  const { getUniqueName, removeName } = useUniqueNameGenerator(boxes.map(box => box.i!))

  const [dropPromise, setDropPromise] = React.useState(Promise.resolve({ x: 0, y: 0 }))

  const [, dropRef] = useDrop({
    accept: ItemTypes.BOX,
    drop: () => {
      dropPromise.then(({ x, y }: { x: number; y: number }) => {
        const newBoxes: readonly Layout[] = [
          ...boxes,
          { i: getUniqueName(ItemTypes.BOX), x, y, w: 1, h: 1 },
        ]

        onChange({ boxes: newBoxes })
      })
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      current: null,
    }),
  })

  const onDrop = (params: { x: number; y: number }) => {
    setDropPromise(new Promise(res => res(params)))
  }

  const onResizeStop = (value: readonly Layout[]) => {
    onChange({ boxes: value })
  }

  const removeBox = (name: string) => {
    const { [name]: value, ...restConfig } = config

    removeName(name)
    onChange({
      boxes: boxes.filter(item => item.i !== name),
      config: restConfig,
    })
  }

  const changeBox = (name: string, items: readonly BoxItem[]) => {
    onChange({
      config: {
        ...config,
        [name]: items,
      },
    })
  }

  const updateBox = (_layout: readonly Layout[], _oldItem: Layout, box: Layout) => {
    const index = boxes.findIndex(item => item.i === box.i)

    onChange({
      boxes: updateAt(boxes, index, { i: box.i, x: box.x, y: box.y, w: box.w, h: box.h }),
    })
  }

  const scale = useMemo(() => {
    const widthScale = baseWidthForScaling ? width / baseWidthForScaling : 1
    const heightScale = baseHeightForScaling ? height / baseHeightForScaling : 1

    return Math.min(widthScale, heightScale)
  }, [baseHeightForScaling, baseWidthForScaling, width, height])

  const margin = useMemo(() => [scale * baseMargin[0], scale * baseMargin[1]], [
    scale,
    baseWidthForScaling,
    baseHeightForScaling,
    baseMargin,
  ])

  const padding = useMemo(() => [scale * basePadding[0], scale * basePadding[1]], [
    scale,
    baseWidthForScaling,
    baseHeightForScaling,
    basePadding,
  ])

  useLayoutEffect(() => {
    if (element) {
      updateBaseSize(baseFontSize * scale, element)
    }
  }, [width, height, scale, element])

  const rowHeight = (height - 2 * basePadding[1] + baseMargin[1]) / rowsCount - baseMargin[1]

  return (
    <div
      ref={el => {
        dimensionRef(el)
        dropRef(el)
      }}
      className={css.dashboard}
    >
      <GridLayout
        autoSize={false}
        margin={margin as /* tslint:disable-line:readonly-array */ [number, number]}
        containerPadding={padding as /* tslint:disable-line:readonly-array */ [number, number]}
        cols={cols}
        rowHeight={rowHeight}
        className="layout"
        measureBeforeMount
        compactType={null}
        preventCollision
        isDroppable={!viewMode}
        isDraggable={!viewMode}
        isResizable={!viewMode}
        onDrop={onDrop}
        droppingPositionShift={{ x: -110, y: -80 }}
        onResizeStop={onResizeStop}
        onDragStop={updateBox}
      >
        {boxes.map(box => (
          <div key={box.i} data-grid={{ x: box.x, y: box.y, w: box.w, h: box.h }}>
            <Box
              data={data}
              viewMode={viewMode}
              onChange={items => changeBox(box.i!, items)}
              items={config[box.i!]}
              datasets={datasets}
            />
            {!viewMode ? (
              <button
                className={css.removeBox}
                type="button"
                onClick={() => removeBox(box.i!)}
                children="⚔"
              />
            ) : null}
          </div>
        ))}
      </GridLayout>
    </div>
  )
}
