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

const dayFour = async () => {
  day(4)

  const dataString = await getData('/day4.txt')
  // console.log(dataString)

  const dataArray = dataString.split('\n')!

  const randomNumbers = dataArray
    .shift()!
    .split(',')
    .map((n) => +n)

  // console.log(dataArray)

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
        console.log('table', table)
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

  console.log('final score', score)
}

const main = async () => {
  await dayOne()
  await dayTwo()
  await dayThree()
  await dayFour()
}

main()
