interface ITab {
    text: string
    index: number
    isSelected: boolean
    handleClick: (index: number) => void
}

function Tab({ text, index, isSelected, handleClick }: ITab) {
    let klass = "px-2 py-1 border border-white text-xs hover:bg-white hover:text-black hover:cursor-pointer"
    if (isSelected) {
        klass += " bg-white/25"
    }
    return (
        <button className={klass} onClick={() => handleClick(index)}>{text}</button>
    )
}


export default Tab