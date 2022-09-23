interface IPaginationButton {
    pageNumber: number
    currentPage: number
    handlePageChange: (pageNumber: number) => void
    text: string | number
    isEdge?: boolean
}

const PaginationButton = ({
    pageNumber,
    currentPage,
    handlePageChange,
    text,
    isEdge = false }: IPaginationButton) => {
    let klass = "px-2 py-1 border border-white text-xs hover:bg-white hover:text-black"
    if (pageNumber === currentPage && !isEdge) {
        klass += " bg-white/25"
    }
    return (<button className={klass} onClick={() => handlePageChange(pageNumber)}>{text}</button>)
}

export default PaginationButton;