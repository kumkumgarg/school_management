import React from 'react'
import _ from 'lodash'
import { Row, Col } from 'reactstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import NoData from "./NoData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import paginationFactory,
{ PaginationListStandalone, PaginationProvider } from 'react-bootstrap-table2-paginator'

export default function TableBody(props) {
    const { columns, page, sizePerPage, totalSize, list, handleTableChange, onSelectRow, message, rowEvents, expandRow, rowClasses } = props

    return (
        <PaginationProvider
            pagination={paginationFactory({
                custom: true,
                page,
                sizePerPage,
                totalSize,
                hideSizePerPage: true,
                hidePageListOnlyOnePage: true,
                prePageText: <FontAwesomeIcon icon={"arrow-left"} />,
                nextPageText: <FontAwesomeIcon icon={"arrow-right"} />,
                lastPageText: "Last Page",
                firstPageText: "First Page"
            })}
        >
            {
                ({ paginationProps, paginationTableProps }) => (
                    <>
                        <Row>
                            <Col>
                                <BootstrapTable
                                    remote
                                    responsive
                                    headerClasses="rounded-bottom"
                                    classes="p-0 table-borderless bg-white"
                                    wrapperClasses="table-responsive data-table-overflow-x"
                                    bootstrap4
                                    keyField={"id"}
                                    data={list}
                                    columnToggle
                                    columns={_.cloneDeep(columns)}
                                    rowEvents={rowEvents}
                                    expandRow={expandRow}
                                    rowClasses={rowClasses}
                                    onTableChange={handleTableChange}
                                    bordered={false}
                                    striped
                                    hover
                                    noDataIndication={<NoData message={message} loading={props.loading} />}
                                    // selectRow={ {
                                    //     mode: 'checkbox',
                                    //     clickToSelect: true,
                                    //     hideSelectAll: true,
                                    //     onSelect: onSelectRow
                                    //   } } 
                                    // cellEdit={cellEditFactory({ mode: "click" })}
                                    {...paginationTableProps}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className={"d-flex justify-content-center"}>
                                <PaginationListStandalone {...paginationProps} />
                            </Col>
                        </Row>
                    </>
                )
            }
        </PaginationProvider>
    )
}
