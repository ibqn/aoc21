const getData = async (fileName: string) => {
  const result = await fetch(fileName)

  const data = await result.text()

  return data
}

const day = (n: number) => console.log(`# day ${n} #`)

const countIncreases = (array: number[]) => {
  let count = 0
  let previous = +array[0]
  for (let index = 1; index < array.length; index++) {
    const current = array[index]
    if (current > previous) {
      count++
    }
    previous = current
  }
  return count
}

const dayOne = async () => {
  day(1)

  const data = await getData('/day1.txt')

  const dataArray = data
    .split('\n')
    .filter(Boolean)
    .map((n) => +n)

  // console.log('data: ', data)

  let count = countIncreases(dataArray)

  console.log('part one count', count)

  const threeSum = []
  for (let index = 2; index < dataArray.length; index++) {
    const sum = dataArray[index] + dataArray[index - 1] + dataArray[index - 2]
    threeSum.push(sum)
  }

  // console.log(threeSum)

  count = countIncreases(threeSum)

  console.log('part two count', count)
}

const dayTwo = async () => {
  day(2)

  let dataString = await getData('/day2.txt')

  const dataArray = dataString
    .split('\n')
    .filter(Boolean)
    .map((input) => {
      const [command, value] = input.split(' ')
      return { command, value: +value }
    })

  // dataArray = dataArray.map((input) => input.split(' '))

  // console.log(dataArray)

  type Position = {
    horizontal: number
    depth: number
    aim: number
  }

  let position = {
    horizontal: 0,
    depth: 0,
  } as Position

  for (const inputPosition of dataArray) {
    // console.log(inputPosition)
    const { command, value } = inputPosition

    switch (command) {
      case 'forward':
        position.horizontal += value
        break
      case 'down':
        position.depth += value
        break
      case 'up':
        position.depth -= value
        break
      default:
        throw new Error(`unknown command: ${command}`)
    }
  }

  console.log('result of part one', position.horizontal * position.depth)

  position = {
    horizontal: 0,
    aim: 0,
    depth: 0,
  }

  for (const inputPosition of dataArray) {
    // console.log(inputPosition)
    const { command, value } = inputPosition

    switch (command) {
      case 'forward':
        position.horizontal += value
        position.depth += position.aim * value
        break
      case 'down':
        position.aim += value
        break
      case 'up':
        position.aim -= value
        break
      default:
        throw new Error(`unknown command: ${command}`)
    }
  }

  console.log('result of part two', position.horizontal * position.depth)
}

const revertBits = (binaryString: string) => {
  let reverted = ''
  for (const digit of binaryString) {
    if (digit === '1') {
      reverted += '0'
    } else {
      reverted += '1'
    }
  }

  return reverted
}

const dayThree = async () => {
  day(3)

  const dataString = await getData('/day3.txt')
  // console.log(dataArray)

  const dataArray = dataString.split('\n').filter(Boolean)

  let binaryString = ''

  const positionLength = dataArray[0].length

  for (let position = 0; position < positionLength; position++) {
    let countOnes = 0

    for (const binaryNumber of dataArray) {
      const digit = binaryNumber[position]
      if (digit === '1') {
        countOnes++
      }
    }

    if (countOnes > dataArray.length - countOnes) {
      binaryString += '1'
    } else {
      binaryString += '0'
    }
  }

  // console.log(binaryString, revertBits(binaryString))

  const epsilon = parseInt(binaryString, 2)
  const gamma = parseInt(revertBits(binaryString), 2)

  console.log('part one: power consumption', epsilon * gamma)

  let binaryList = dataArray.slice()

  let result: string = ''

  for (let position = 0; position < positionLength; position++) {
    let countOnes = 0
    let bit: string

    for (const binaryNumber of binaryList) {
      const digit = binaryNumber[position]
      if (digit === '1') {
        countOnes++
      }
    }

    if (countOnes >= binaryList.length - countOnes) {
      bit = '1'
    } else {
      bit = '0'
    }

    binaryList = binaryList.filter((d) => d[position] === bit)

    if (binaryList.length === 1) {
      result = binaryList[0]
      break
    }
  }

  const oxygenGeneratorRating = parseInt(result, 2)

  console.log(
    'binary',
    result,
    'oxygen generator rating',
    oxygenGeneratorRating
  )

  binaryList = dataArray.slice()

  for (let position = 0; position < positionLength; position++) {
    let countOnes = 0
    let bit: string

    for (const binaryNumber of binaryList) {
      const digit = binaryNumber[position]
      if (digit === '1') {
        countOnes++
      }
    }

    if (countOnes >= binaryList.length - countOnes) {
      bit = '0'
    } else {
      bit = '1'
    }

    binaryList = binaryList.filter((d) => d[position] === bit)

    if (binaryList.length === 1) {
      result = binaryList[0]
      break
    }
  }

  const co2ScrubberRating = parseInt(result, 2)
  console.log('binary', result, 'CO2 scrubber rating', co2ScrubberRating)

  console.log('life support rating', co2ScrubberRating * oxygenGeneratorRating)
}

const constructBingoTables = (dataArray: string[]) => {
  const bingoTables = []
  const offset = 6
  for (let index = offset; index < dataArray.length; index += offset) {
    const table = dataArray.slice(index - offset + 1, index).map((line) =>
      line
        .split(' ')
        .filter(Boolean)
        .map((n) => +n)
    )

    // console.log(table)

    const bingoSets = table.map((line) => new Set(line))

    for (let c = 0; c < table.length; c++) {
      const column = []
      for (let r = 0; r < table[c].length; r++) {
        column.push(table[r][c])
      }
      bingoSets.push(new Set(column))
    }

    bingoTables.push(bingoSets)
  }
  return bingoTables
}

const scoreOfFirstWinningBoard = (
  randomNumbers: number[],
  dataArray: string[]
) => {
  const bingoTables = constructBingoTables(dataArray)

  let winningTable = false
  let score = 0
  for (const calledNumber of randomNumbers) {
    if (winningTable) {
      break
    }

    for (const table of bingoTables) {
      if (winningTable) {
        break
      }

      for (const bag of table) {
        if (bag.has(calledNumber)) {
          bag.delete(calledNumber)
        }
        winningTable = winningTable || bag.size === 0
      }

      if (winningTable) {
        // console.log('table', table)
        score =
          [
            ...table.reduce(
              (union, current) => new Set([...union, ...current]),
              new Set()
            ),
          ].reduce((sum, num) => sum + num, 0) * calledNumber
      }
    }
  }

  return score
}

const scoreOfLastWinningBoard = (
  randomNumbers: number[],
  dataArray: string[]
) => {
  let bingoTables = constructBingoTables(dataArray).map((listOfBags) => ({
    win: false,
    listOfBags,
  }))

  let score = 0
  for (const calledNumber of randomNumbers) {
    for (const table of bingoTables) {
      const { listOfBags } = table

      for (const bag of listOfBags) {
        if (bag.has(calledNumber)) {
          bag.delete(calledNumber)
        }
        table.win = table.win || bag.size === 0
      }

      if (table.win) {
        // console.log('table', table)
        score =
          [
            ...listOfBags.reduce(
              (union, current) => new Set([...union, ...current]),
              new Set()
            ),
          ].reduce((sum, num) => sum + num, 0) * calledNumber
      }
    }

    bingoTables = bingoTables.filter((table) => table.win === false)
  }

  return score
}

const dayFour = async () => {
  day(4)

  const dataString = await getData('/day4.txt')
  // console.log(dataString)

  const [randomString, ...dataArray] = dataString.split('\n')!

  const randomNumbers = randomString.split(',').map((n) => +n)

  // console.log(dataArray)

  let score = scoreOfFirstWinningBoard(randomNumbers, dataArray)

  console.log('final score of first winning board', score)

  score = scoreOfLastWinningBoard(randomNumbers, dataArray)

  console.log('final score of last winning board', score)
}

const dayFive = async () => {
  day(5)

  let dataString = await getData('/day5.txt')

  const dataArray = dataString
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split('->'))
    .map(([p1, p2]) => {
      const [x1, y1] = p1.split(',').map((n) => +n)
      const [x2, y2] = p2.split(',').map((n) => +n)
      return {
        p1: { x: x1, y: y1 },
        p2: { x: x2, y: y2 },
      }
    })

  // console.log(dataArray)

  let hydrothermalVentures = new Array()

  dataArray
    .filter(({ p1, p2 }) => p1.x === p2.x || p1.y === p2.y)
    .forEach((interval) => {
      const { p1, p2 } = interval
      for (let x = Math.min(p1.x, p2.x); x <= Math.max(p1.x, p2.x); x++) {
        let range = hydrothermalVentures[x] || new Array()

        for (let y = Math.min(p1.y, p2.y); y <= Math.max(p1.y, p2.y); y++) {
          const current = range[y] || 0
          range[y] = current + 1
        }
        hydrothermalVentures[x] = range
      }
    })

  let overlaps = hydrothermalVentures
    .flat()
    .filter((e) => e)
    .filter((e) => e > 1).length

  console.log('count of horizontal and vertical overlaps', overlaps)

  // part two
  hydrothermalVentures = new Array()

  dataArray
    .filter(
      ({ p1, p2 }) =>
        (p1.x - p2.x) % (p1.y - p2.y) === 0 ||
        (p1.y - p2.y) % (p1.x - p2.x) === 0
    )
    .forEach((interval) => {
      const { p1, p2 } = interval

      const mx = Math.sign(p2.x - p1.x)
      const my = Math.sign(p2.y - p1.y)
      const length = Math.max(Math.abs(p1.x - p2.x), Math.abs(p1.y - p2.y))

      for (let t = 0; t <= length; t++) {
        const x = p1.x + t * mx
        const y = p1.y + t * my

        const range = hydrothermalVentures[x] || new Array()

        const current = range[y] || 0
        range[y] = current + 1

        hydrothermalVentures[x] = range
      }
    })

  overlaps = hydrothermalVentures
    .flat()
    .filter((e) => e)
    .filter((e) => e > 1).length

  console.log('the number of points where at least two lines overlap', overlaps)
}

const calculateFishPopulationAfter = (
  initialState: number[],
  numberofDays: number
) => {
  let mapOfStates = new Map<number, number>()
  initialState.forEach((state) => {
    const current = mapOfStates.get(state) || 0
    mapOfStates.set(state, current + 1)
  })

  console.log(mapOfStates)

  Array.from({ length: numberofDays }).forEach(() => {
    // console.log('.')
    const newState = new Map<number, number>()

    for (const [state, value] of mapOfStates) {
      // console.log(state, value)

      if (state === 0) {
        const currentValue = newState.get(6) || 0
        newState.set(6, currentValue + value)
        newState.set(8, value)
      } else {
        const currentValue = newState.get(state - 1) || 0
        newState.set(state - 1, currentValue + value)
      }
    }
    mapOfStates = newState
  })

  // console.log(mapOfStates)

  return [...mapOfStates.values()].reduce((sum, val) => sum + val, 0)
}

const daySix = async () => {
  day(6)

  const dataString = await getData('/day6.txt')
  // console.log(dataString)

  const initialState = dataString.split(',').map((n) => +n)
  // const initialState = [3, 4, 3, 1, 2]

  // console.log(initialState)

  let fishPopulation = calculateFishPopulationAfter(initialState, 80)
  console.log('total number of fish', fishPopulation)

  fishPopulation = calculateFishPopulationAfter(initialState, 265)
  console.log('total number of fish', fishPopulation)
}

const estimateCosts = (array: number[], move: number) =>
  array.map((e) => Math.abs(e - move)).reduce((sum, e) => sum + e, 0)

const daySeven = async () => {
  day(7)

  const dataString = await getData('/day7.txt')
  // console.log(dataString)

  const initialPositions = dataString.split(',').map((n) => +n)
  // console.log(initialPositions)

  // console.log(
  //   'sorted',
  //   initialPositions.sort((a, b) => a - b)
  // )
  // console.log('len', initialPositions.length)

  const minimalHorizontalPosition = initialPositions.sort((a, b) => a - b)[
    Math.ceil(initialPositions.length / 2)
  ]
  // console.log(minimalHorizontalPosition)

  const fuelCost = estimateCosts(initialPositions, minimalHorizontalPosition)

  console.log(
    `fuel cost ${fuelCost} to reach optimal position ${minimalHorizontalPosition}`
  )

  // Array.from(
  //   { length: 20 },
  //   (_, i) => minimalHorizontalPosition + i - 10
  // ).forEach((i) => console.log(i))
}

const main = async () => {
  // await dayOne()
  // await dayTwo()
  // await dayThree()
  // await dayFour()
  // await dayFive()
  // await daySix()
  await daySeven()
}

main()
