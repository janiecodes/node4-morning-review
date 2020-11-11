import React, { Component } from 'react'
import axios from 'axios'

class Landing extends Component{
    componentDidMount(){
        axios.get('/api/user').then(res => {
            if(res.data.username){
                this.props.history.push('/home')
            }
        })
    }

    render(){
        return(
            <div>
                <h1>Welcome</h1>
                <button onClick={() => this.props.history.push('/authentication/login')}>Login</button>
                <button onClick={() => this.props.history.push('/authentication/register')}>Register</button>
                {/* history.push changes the route path */}
            </div>
        )
    }
}

export default Landing