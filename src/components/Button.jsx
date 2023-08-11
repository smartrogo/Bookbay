import React from 'react'

export const Button = (props) => {
  return (
    <div>
      <button className={props.cls_name} >{props.value}</button>
    </div>
  )
}
