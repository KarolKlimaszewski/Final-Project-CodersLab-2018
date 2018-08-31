import React from "react";
import * as firebase from "firebase";

export default class AccountBalance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accountBalance: ""
        }
    }

    componentDidMount() {
        let that = this;
        let accountBalanceRef = firebase.database().ref("accountBalance");
        accountBalanceRef.on("value", function (data) {
            that.setState({
                accountBalance: data.val()
            });
        }, function (error) {
            console.log("Error: " + error.code);
        });
    }

    render() {
        return (<div className={"accountBalance__container"}>
                <h1 className={"accountBalance__header"}>
                    Stan konta: {this.state.accountBalance}
                </h1>
            </div>
        );
    }
}