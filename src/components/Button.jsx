import React from 'react'

export const Button = (props) => {
  return (
    <div>
      <button type={props.type} className={props.cls_name} >{props.value}</button>
    </div>
  )
}
