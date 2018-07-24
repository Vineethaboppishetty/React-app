import React from 'react'
import classes from './BuildControls.css'
import  BuildControl from './BuildControl/BuildControl'

const controls = [
    {label:'Salad',type:'salad'},
    {label:'Bacon',type:'bacon'},
    {label:'Cheese',type:'cheese'},
    {label:'Meat',type:'meat'}
]
const buildControls = (props) => {
    return(
        <div className={classes.BuildControls}>
            <p>Current Price: <strong>$ {props.price.toFixed(2)}</strong></p>
            {controls.map(ctrl =>{
               return <BuildControl
                   key={ctrl.label}
                   label={ctrl.label}
                   added={()=>props.addIngredients(ctrl.type)}
                   removed={()=>props.removeIngredients(ctrl.type)}
                   disabled={props.disable[ctrl.type]}
               />
            })}
            <button className={classes.OrderButton} disabled={!props.purchasable} onClick={props.ordered}>Order Now</button>
        </div>
    )
}

export default buildControls