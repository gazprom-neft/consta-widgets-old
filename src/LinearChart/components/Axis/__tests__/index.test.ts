import { getGridTicksWithGuide } from '../'

describe('getGridTicksWithGuide', () => {
  describe('горизонтальный график', () => {
    it('возвращает пустые массивы, если нет ни направляющих, ни гайд-линии', () => {
      expect(
        getGridTicksWithGuide({
          isHorizontal: true,
          mainTickValues: [],
          secondaryTickValues: [],
          xGuideValue: undefined,
          yGuideValue: undefined,
        })
      ).toEqual({ x: [], y: [] })
    })

    it('возвращает гайд-линию, если нет направляющих', () => {
      expect(
        getGridTicksWithGuide({
          isHorizontal: true,
          mainTickValues: [],
          secondaryTickValues: [],
          xGuideValue: 0,
          yGuideValue: -2,
        })
      ).toEqual({ x: [0], y: [-2] })
    })

    it('возвращает направляющие как есть, если нет гайд-линии', () => {
      expect(
        getGridTicksWithGuide({
          isHorizontal: true,
          mainTickValues: [1, 2, 3],
          secondaryTickValues: [4, 5, 6],
          xGuideValue: undefined,
          yGuideValue: undefined,
        })
      ).toEqual({
        x: [1, 2, 3],
        y: [4, 5, 6],
      })
    })

    it('добавляет гайд-линию к направляющим', () => {
      expect(
        getGridTicksWithGuide({
          isHorizontal: true,
          mainTickValues: [1, 2, 3],
          secondaryTickValues: [-5, 5, 15],
          xGuideValue: 0,
          yGuideValue: 0,
        })
      ).toEqual({ x: [0, 1, 2, 3], y: [-5, 0, 5, 15] })
    })

    it('не добавляет гайд-линию, если её значение уже есть в направляющих', () => {
      expect(
        getGridTicksWithGuide({
          isHorizontal: true,
          mainTickValues: [0, 1, 2, 3],
          secondaryTickValues: [-2, 0, 2],
          xGuideValue: 0,
          yGuideValue: -2,
        })
      ).toEqual({
        x: [0, 1, 2, 3],
        y: [-2, 0, 2],
      })
    })
  })

  describe('вертикальный график', () => {
    it('возвращает направляющие как есть, если нет гайд-линии', () => {
      expect(
        getGridTicksWithGuide({
          isHorizontal: false,
          mainTickValues: [1, 2, 3],
          secondaryTickValues: [4, 5, 6],
          xGuideValue: undefined,
          yGuideValue: undefined,
        })
      ).toEqual({
        x: [4, 5, 6],
        y: [1, 2, 3],
      })
    })

    it('добавляет гайд-линию к направляющим', () => {
      expect(
        getGridTicksWithGuide({
          isHorizontal: false,
          mainTickValues: [1, 2, 3],
          secondaryTickValues: [-5, 5, 15],
          xGuideValue: 10,
          yGuideValue: 0,
        })
      ).toEqual({ x: [-5, 5, 10, 15], y: [0, 1, 2, 3] })
    })
  })
})
