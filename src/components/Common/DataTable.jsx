import { MDBDataTable } from 'mdbreact'
import React, { useEffect, useState } from 'react'
import NoData from './NoData'
import { Button} from 'reactstrap';

export default function DataTable(props) {
    const { columns, rows, links, lastPage, currentPage, setChangePage } = props
    const [tableData, setTableData] = useState(null)
    const [pages, setPages] = useState([])
    
    
    useEffect(() => {
        setTableData({
            columns: columns,
            rows: rows,
        })
        setPaginate()
    }, [rows])

    // setting pagination list
    const setPaginate = () => {
        const sheets = [];
        links.forEach(element => {
            sheets.push(element.label)
        });
        sheets[0] = "Previous"
        sheets[lastPage + 1] = "Next"
        setPages(sheets);
    }

    // func for handle pagination
    const handleChange = (page) => {
        if(page == "Previous"){
            
            if(currentPage == 1){
                setChangePage(1)
            }else{
                setChangePage(currentPage - 1)
            }
        }else if(page == "Next"){
            
            if (currentPage == lastPage) {
                setChangePage(lastPage)
            } else {
                setChangePage(currentPage + 1)
            }
        }else{
            
            setChangePage(page)
        }
    }

    return (
        <React.Fragment>
            {tableData ? (
                <div className="">
                    <MDBDataTable
                        responsive
                        striped
                        fixed
                        noBottomColumns
                        sortable
                        data={tableData}
                        paging={false} // Enable pagination
                        searching={false}
                    />
                    <div className="pagination-wrapper">
                        <nav>
                            <ul className="pagination">
                            {pages.map(page => (
                                <li key={page} className={`page-item ${page == currentPage ? 'active' : ''}`}>
                                    <Button className="page-link" onClick={() =>{handleChange(page)}}>
                                        {page}
                                    </Button>
                                </li>
                            ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            ) : (
                <NoData />
            )}
        </React.Fragment>
    )
}
