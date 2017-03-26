import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {getProfile, updateProfile} from './actions/index';
import {Link} from 'react-router';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import Divider from 'material-ui/Divider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';

const buttonStyle = {
    margin: 10,
    marginLeft: 'initial'
}

const containerStyle = {
    margin: 10,
    padding: 20,
    position: 'relative',
}

const picStyle = {
    height:300,
    width:300,
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
    overflow: 'hidden',
    position: 'relative'
}

const fabStyle={
    margin: 'auto',
    position: 'absolute',
    left: "60%",
    bottom: "3%",
}

const inputStyle={
    marginTop: 10,
    marginBottom: 10
}

const createInput = function(input, label, type){
    switch (type){
        case 'textarea':
            return(
                <TextField
                    {...input}
                    hintText={label}
                    multiLine={true}
                    fullWidth={true}
                />
            );
        case 'date':
            return(
                <DatePicker style={inputStyle} hintText="Date of Birth" />
            );
        case 'radio':
            return(
                <div>
                  <p>{label}</p>
                  <RadioButtonGroup
                      {...input}
                      defaultSelected="male">
                    <RadioButton
                        value="male"
                        label="Male"
                    />
                    <RadioButton
                        value="female"
                        label="Female"
                    />
                  </RadioButtonGroup>
                </div>
            );
        default:
            return(
                <TextField
                    {...input}
                    fullWidth= {true}
                    hintText={label}
                    floatingLabelText={label}
                />
            );
    }
}

const renderInput = function({input, label, type}){
    return(
        <div>{createInput(input, label, type)}</div>
    )
}


class ProfilePage extends Component {

    onSubmit(formProp){
        console.log('these are formProprs', formProp);
        this.props.updateProfile(formProp);
    }

    componentWillMount(){
        const user = this.props.getProfile();
        console.log('state in componentWillMount', this.state);
    }
    render(){
        const {handleSubmit} = this.props;
        console.log(this.props.user);
        return (
            <div>
              <AppBar
                  title="User Profile"
                  iconElementRight={<FlatButton label = "Log Out"/>}
              />
              <Paper style={containerStyle} zDepth={1}>
                <h3>What's up, {this.props.user !== null ? this.props.user.username: 'User'}?</h3>
                <Paper style={picStyle} circle={true} zDepth={2}>
                  <img style={{
                      width:'100%',
                      height:'auto'}}
                       src="https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/5/005/095/0d0/0796c17.jpg" alt="profile"/>
                    <FloatingActionButton style={fabStyle}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Paper>
              </Paper>
              <Paper style={containerStyle} zDepth={1}>
                <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                  <Field name='username' component={renderInput} type="text" label="Username"/>
                  <Field name='name' component={renderInput} type="text" label="Name"/>
                  <Field name='email' component={renderInput} type="text" label="E-mail"/>
                  <Field name='age' component={renderInput} type="date" label="Birthday"/>
                  <Field name='gender' component={renderInput} type='radio' label="Gender"/>
                  <Field name='lookingFor' component={renderInput} type="radio" label="Looking For"/>
                  <Field name='biography' component={renderInput} type="textarea" label="About Me"/>
                  <RaisedButton
                      style={buttonStyle} label="Update Profile" primary={true}
                      type="submit"/>
                  <RaisedButton style={buttonStyle} label="Save" secondary={true}/>
                  <Link to='/events'><RaisedButton>Cancel</RaisedButton></Link>
                </form>
              </Paper>
            </div>
        )
    }
}

function validate(values){
    console.log('hey, form values in validate', values);
}

function mapStateToProps(state){
    console.log('this is state in mapStateToProps', state);
    return {
        user: state.user.user,
        initialValues: state.user.user
    }
}

export default connect(mapStateToProps, {getProfile, updateProfile})(reduxForm({
    form: 'Profile',
    validate
})(ProfilePage));