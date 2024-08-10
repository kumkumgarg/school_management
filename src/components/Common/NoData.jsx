import React from 'react'
import { connect } from 'react-redux'

export const NoData = (
    props = { text, height, bgColor, textColor, fontSize }
) => {
    return (
        <div
            style={{
                marginTop: '1em',
                textAlign: 'center',
                height: props.height ? props.height : '5em',
                width: '100%',
                background: props.bgColor ? props.bgColor : '#e6e6e6',
                color: props.textColor ? props.textColor : '#595959',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: props.fontSize ? props.fontSize : '2em',
            }}
        >
            {props.text ? props.text : 'NO DATA AVAILABLE'}
        </div>
    )
}

export default connect()(NoData)
