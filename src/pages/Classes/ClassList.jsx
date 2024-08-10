import React, { useState, useEffect } from 'react'
import { setBreadcrumbItems } from '../../store/actions'
import { connect } from 'react-redux'
import { Button, Card, CardHeader, CardBody } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import RoleForm from './ClassForm';
import { toast } from 'react-toastify'
import DataTable from '../../components/Common/DataTable'
import Spinners from '../../components/Common/Spinner';
import ClassProvider from '../../providers/ClassProvider'

const ClassList = (props) => {
    document.title = 'Class'

    const CP = ClassProvider()

    const [loading, setLoading] = useState(false)
    const [createClass, setCreateClass] = useState(false)
    const [createEditText, setCreateEditText] = useState('create')
    const [changePage, setChangePage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);
    const [links, setLinks] = useState();
    const [id, setId] = useState(null)
    const [comeBackFromForm, setComeBackFromForm] = useState(false)
    const [classButton, setClassButton] = useState(false)
    const [rows, setRows] = useState([])
    const [columns, setColumns] = useState([
        {
            label: 'Name',
            field: 'name',
            sort: 'asc',
            width: 75,
        },
        // {
        //     label: 'Code',
        //     field: 'code',
        //     sort: 'asc',
        //     width: 75,
        // },
        {
            label: 'Action',
            field: 'id',
        },
    ])

    useEffect(() => {
        fetchData(changePage)
    }, [classButton, changePage])  // after deleting class

    // coming back from create/edit form
    useEffect(() => {
        if(comeBackFromForm){
            fetchData()
        }
    }, [comeBackFromForm])

    const fetchData = (page) => {
        let params = {
            page: page,
        }
        setLoading(true)
        CP.getClassData(params)
            .then(resp => {
                setCurrentPage(resp.current_page);
                setLastPage(resp.last_page);
                setLinks(resp.links)

                if (resp.data && resp.data.length > 0) {
                    let data = resp.data
                    data = data.map((item) => {
                        return {
                            name: item.name,
                            id: (
                                <div className="d-flex justify-content-evenly align-items-center w-25" >
                                    <Button
                                        color="info"
                                        onClick={() =>{
                                            setCreateClass(!createClass)
                                            setCreateEditText('Edit')
                                            setId(item.id)
                                        }}
                                    >
                                        <i className="mdi mdi-account-edit"></i>
                                    </Button>
                                    <Button
                                        color="danger"
                                        onClick={() => ClassDelete(item.id)}
                                    >
                                        <i className="mdi mdi-trash-can"></i>
                                    </Button>
                                </div>
                            ),
                        }
                    })
                    setRows(data)
                }
                setComeBackFromForm(false)
            })
            .catch((e) => {
                console.error('Error fetching class list:', e);
            })
            .finally(() => setLoading(false))
            setClassButton(false)
    }

    const ClassDelete = (id) =>{
        CP.delete({ id: id})
            .then(resp => {
                toast.success(resp.message)
                setClassButton(true)
            })
            .catch((err) => {
                toast.error(err.response.data)
            })
    }

    return (
        <Card className='parent-component-height'>
            <CardHeader className={`${createClass ? '' : 'd-flex justify-content-between align-items-center mb-3'}`}>
                {!createClass && <h5> Class List </h5>}
                {createClass
                    ? <h4>
                        <FontAwesomeIcon
                            icon={"arrow-left"}
                            className={"mypointer mr-2 "}
                            onClick={() => {
                                setCreateClass(!createClass)
                                setId(null)
                                setComeBackFromForm(!comeBackFromForm)
                            }}
                        />
                        &nbsp; {createEditText} Class
                    </h4>
                    : <Button
                        onClick={() => {
                            setCreateClass(!createClass)
                            setCreateEditText('Create')
                            setId(null)
                        }}
                        className={"ml-2 d-flex align-items-center"}
                        color="primary">

                        <FontAwesomeIcon icon="plus" className={"mr-2"} />
                        &nbsp; Create Class
                    </Button>
                }
            </CardHeader>
            <CardBody className='h-100'>
                { loading
                    ? <Spinners setLoading={setLoading} />
                    : (createClass
                        ? <RoleForm
                            createClass={createClass}
                            setCreateClass={setCreateClass}
                            createEditText = {createEditText}
                            id = {id}
                            setId = {setId}
                            comeBackFromForm = {comeBackFromForm}
                            setComeBackFromForm = {setComeBackFromForm}
                        />
                        : <>
                            {rows.length > 0 && (
                                <DataTable
                                    rows={rows}
                                    columns={columns}
                                    links={links}
                                    lastPage={lastPage}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    setChangePage={setChangePage}
                                />
                            )}
                        </>
                    )
                }
            </CardBody>
        </Card>
    )
}

export default connect(null, { setBreadcrumbItems })(ClassList)
