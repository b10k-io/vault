function useRange(startIndex: number, endIndex: number): number[] {
    const size = endIndex - startIndex + 1;
    let nbArr = Array.from(Array(size).keys())
    nbArr = nbArr.map(k => k + startIndex)
    return nbArr;
}

export default useRange