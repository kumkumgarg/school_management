import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function NoData(props) {
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(props.loading ? props.loading : false)
     }, [props])
    return (
        <div className="text-center">
            { loading 
                ? <FontAwesomeIcon icon="spinner" spin />
                : <>
                    <FontAwesomeIcon icon="exclamation-circle" size="5x" color="grey" />
                    <h3 className={"display-7"}>
                        { props.message
                            ? props.message
                            :  "You don't have any data to display!"
                        }
                    </h3>
                </>
            }
        </div>
    )
}