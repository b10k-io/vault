interface IPageSizeButton {
    size: number
    pageSize: number
    handlePageSizeChange: (size: number) => void
}

const PageSizeButton = ({ size, pageSize, handlePageSizeChange }: IPageSizeButton) => {
    let klass = "px-2 py-1 border border-white text-xs hover:bg-white hover:text-black hover:cursor-pointer"
    if (size === pageSize) {
        klass += " bg-white/25"
    }
    return (
        <button className={klass} onClick={() => handlePageSizeChange(size)}>{size}</button>
    )
}

export default PageSizeButton