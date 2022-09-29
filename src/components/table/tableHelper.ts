import { ITableCell } from "../../constants/types/Table"

export function klass(cell: ITableCell, defaultKlass: string = "") {
    const klass = [defaultKlass]
    if (cell.textRight) {
        klass.push("text-right")
    }
    return klass.join(" ")
}