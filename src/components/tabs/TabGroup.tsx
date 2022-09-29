import { useState } from "react"
import Tab from "./Tab"

interface ITab {
    text: string
    element: JSX.Element
}

interface ITabGroup {
    groups: ITab[]
}

function TabGroup({ groups }: ITabGroup) {

    const [selected, setSelected] = useState<number>(0)

    function handleClick(index: number) {
        setSelected(index)
    }

    return (
        <div>
            <div className="flex text-xs">
                {groups.map((group, key) => <Tab key={key} index={key} isSelected={key === selected} text={group.text} handleClick={handleClick} />)}
            </div>
            <div>
                {groups[selected].element}
            </div>
        </div>
    )
}

export default TabGroup