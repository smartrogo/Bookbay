import React from 'react'

export const Button = (props) => {
  return (
    <React.Fragment>
      <button className={props.cls_name} >{props.value}</button>
    </React.Fragment>
  )
}
