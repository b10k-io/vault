export interface ITableCell {
    value: string | JSX.Element
    link?: string
    textRight?: boolean
}

export interface ITable {
    headers: ITableCell[],
    rows: JSX.Element[][]
}