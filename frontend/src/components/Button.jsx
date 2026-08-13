import React from 'react'

export const Button = (props) => {
  return (
    <div>
      <button type={props.type} className={props.cls_name} onClick={props.onClick}>{props.value}</button>
    </div>
  )
}
