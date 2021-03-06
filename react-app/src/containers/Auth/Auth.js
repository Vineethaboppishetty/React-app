import React,{Component} from 'react'
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import Spinner from '../../components/UI/Spinner/Spinner'
import classes from './Auth.css'
import * as actions from '../../Store/actions/index'
import {connect} from 'react-redux'

class Auth extends Component{
    state ={
        controls:{
            email:{
                elementType:'input',
                elementConfig:{
                    type: 'email',
                    placeholder:'Mail Address'
                },
                value:'',
                validation:{
                    required: true,
                    isEmail:true
                },
                valid: false,
                touched: false
            },
            password:{
                elementType:'input',
                elementConfig:{
                    type: 'password',
                    placeholder:'password'
                },
                value:'',
                validation:{
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignUp: false
    }

    submitHandler = (event) =>{
        event.preventDefault()
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value,this.state.isSignUp)
    }

    checkValidity(value,rules){
        let isValid = true
        if(!rules){
            return true
        }
        if(rules.required){
            isValid = value.trim() !== '' && isValid
        }
        if(rules.minLength && isValid){
            isValid = value.length >= rules.minLength && isValid
        }
        if(rules.maxLength ){
            isValid = value.length <= rules.maxLength && isValid
        }
        if(rules.isEmail){
            const pattern =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            isValid = pattern.test(value) && isValid
        }
        return isValid
    }

    inputChangeHandler = (event,ctrlName) =>{
        const updatedControls = {
            ...this.state.controls,
            [ctrlName]:{
                ...this.state.controls[ctrlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value,this.state.controls[ctrlName].validation),
                touched: true
            }
        }
        this.setState({controls: updatedControls})
    }

    switchAuthModeHandler = () =>{
        this.setState(prevState =>{
            return {isSignUp:!prevState.isSignUp}
        })
    }

    render(){
        const formElementsArray = []
        for(let key in this.state.controls){
            formElementsArray.push({
                id:key,
                config:this.state.controls[key]
            })
        }
        let form = formElementsArray.map(formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                changed={(event)=>this.inputChangeHandler(event,formElement.id)}
                inValid={!formElement.config.valid}
                touched={formElement.config.touched}
                shouldValidate={formElement.config.validation}
            />
        ))

        if(this.props.loading){
            form = <Spinner />
        }
        let errorMessage = null

        if(this.props.error){
            errorMessage = (
                <p>{this.props.error.message}</p>
            )
        }

        return(
            <div className={classes.Auth}>
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType={"Success"}>SUBMIT</Button>
                </form>
                <Button
                    clicked={this.switchAuthModeHandler}
                    btnType={"Danger"}>Switch to {this.state.isSignUp ? "SIGNIN" : "SIGNUP"}</Button>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return {
        loading: state.auth.loading,
        error: state.auth.error
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email,password,isSignUp) => dispatch(actions.auth(email,password,isSignUp))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Auth)