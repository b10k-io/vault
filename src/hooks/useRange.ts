import { BigNumber } from "ethers";

function useRange(startIndex: number, endIndex: number): BigNumber[] {
    const size = endIndex - startIndex + 1;
    let nbArr = Array.from(Array(size).keys())
    nbArr = nbArr.map(k => k + startIndex)
    return nbArr.map(k => BigNumber.from(k))
}

export default useRange