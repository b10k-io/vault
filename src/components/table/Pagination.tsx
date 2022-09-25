import { useEffect, useState } from "react"
import { getStartEndPages, getTotalPages, updateIndexes } from "../helpers/pagination"
import PageSizeButton from "./PageSizeButton"
import PaginationButton from "./PaginationButton"

interface IPagination {
    totalItems: number
    currentPage?: number
    maxPages?: number
    handleIndexChange: (startIndex: number, endIndex: number) => void
}

const Pagination = ({
    totalItems = 0,
    maxPages = 100,
    handleIndexChange
}: IPagination) => {

    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [startPage, setStartPage] = useState<number>(1)
    const [endPage, setEndPage] = useState<number>(1)
    const [pages, setPages] = useState<number[] | []>([])

    useEffect(() => {
        const totalPages = getTotalPages(totalItems, pageSize, currentPage)
        const { startPage, endPage } = getStartEndPages(totalPages, maxPages, currentPage)
        setStartPage(startPage)
        setEndPage(endPage)

        const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
        setPages(pages)

        const { startIndex, endIndex } = updateIndexes(currentPage, pageSize, totalItems)

        // Make sure it flips to first page if needed
        if (pages.length === 1 && currentPage !== 1) {
            setCurrentPage(1)
        }

        handleIndexChange(startIndex, endIndex)
    }, [currentPage, pageSize, maxPages, totalItems])

    function handlePageChange(pageNumber: number) {
        setCurrentPage(pageNumber);
    }

    function handlePageSizeChange(size: number) {
        setPageSize(size)        
    }

    return (
        <div className="flex justify-between">
            <div>
                <PaginationButton pageNumber={startPage} currentPage={currentPage} handlePageChange={handlePageChange} text="First" isEdge={true} />
                <PaginationButton pageNumber={currentPage - 1} currentPage={currentPage} handlePageChange={handlePageChange} text="Prev" disabled={currentPage === startPage} />
                {pages.map((pageNumber: number) => <PaginationButton key={pageNumber} pageNumber={pageNumber} currentPage={currentPage} handlePageChange={handlePageChange} text={pageNumber} />)}
                <PaginationButton pageNumber={currentPage + 1} currentPage={currentPage} handlePageChange={handlePageChange} text="Next" disabled={currentPage === endPage} />
                <PaginationButton pageNumber={endPage} currentPage={currentPage} handlePageChange={handlePageChange} text="Last" isEdge={true} />
            </div>
            <div>
                {[10, 20, 50].map((size, key) => <PageSizeButton key={key} size={size} pageSize={pageSize} handlePageSizeChange={handlePageSizeChange} />)}
            </div>
        </div>
    )
}

export default Pagination;