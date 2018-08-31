import React from 'react';
import ReactDOM from 'react-dom';

import AccountBalance from './components/AccountBalance.jsx';
import DateFilter from './components/DateFilter.jsx';
import SideFilters from './components/SideFilters.jsx';
import OperationAdd from './components/OperationAdd.jsx';
import Charts from './components/Charts.jsx';

import {
    HashRouter,
    Route,
    Link,
    Switch,
    NavLink,
} from 'react-router-dom';

require("./sass/main.scss");

import _ from 'underscore';
import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyBM3vM1_F6ICZdlSSnfc0QmUY8HGAbfEcs",
    authDomain: "financialapp-kk.firebaseapp.com",
    databaseURL: "https://financialapp-kk.firebaseio.com",
    projectId: "financialapp-kk",
    storageBucket: "financialapp-kk.appspot.com",
    messagingSenderId: "678970826811"
};
firebase.initializeApp(config);

class Menu extends React.Component {
    render() {
        return (<HashRouter>
                <div>
                    <ul className={"menu"}>
                        <li className={"menu__item"}><NavLink to={"/"} className={"menu__link"}
                                                              activeStyle={{color: "red"}}>Dodaj operację</NavLink>
                        </li>
                        <li className={"menu__item"}><NavLink to={"/operation_history"} className={"menu__link"}
                                                              activeStyle={{color: "red"}}>Historia operacji</NavLink>
                        </li>
                        <li className={"menu__item"}><NavLink to={"/account_balance"} className={"menu__link"}
                                                              activeStyle={{color: "red"}}>Stan konta</NavLink></li>
                        <li className={"menu__item"}><NavLink to={"/charts"} className={"menu__link"}
                                                              activeStyle={{color: "red"}}>Wykresy</NavLink></li>
                    </ul>
                    <Switch>
                        <Route exact path='/' component={OperationAdd}/>
                        <Route path='/operation_history' component={OperationHistory}/>
                        <Route path='/account_balance' component={AccountBalance}/>
                        <Route path='/charts' component={Charts}/>
                    </Switch>
                </div>
            </HashRouter>

        );
    }
}

class OperationHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            op: [],
            cat: [],
            dateFiltered: "",
            sideFiltered: ""
        }
    }

    componentDidMount() {
        let ref = firebase.database().ref();

        ref.on("value", snapshot => {
            if (snapshot.val()) {
                // LOADING ALL OPERATIONS FROM FIREBASE
                const operations = snapshot.val().operations;

                let opArray = [];
                let catArray = [];

                for (let id in operations) {
                    operations[id].id = id
                    opArray = [...opArray, operations[id]]
                    if (!catArray.includes(operations[id].category)) {
                        catArray = [...catArray, operations[id].category];
                    }
                }
                this.setState({
                    op: [...opArray],
                    cat: catArray,
                    loaded: true
                });
            }
        });
    }

    handleDeleteButton = (e, index) => {
        e.preventDefault();
        const accountBalanceRef = firebase.database().ref().child("accountBalance");
        accountBalanceRef.transaction(function (reduceBalance) {
            return reduceBalance - index.amount
        })

        const refDelete = firebase.database().ref("operations/" + index.id);
        refDelete.remove();
    };

    handlePassDateFilter = (arg) => {
        this.setState({
            dateFiltered: arg,
        })
    }

    handlePassSideFilters = (arg) => {
        this.setState({
            sideFiltered: arg,
        })
    }

    render() {
        if (this.state.loaded === false) {
            return <div className="loader__box">
                <div className="loader"></div>
            </div>;
        } else {

            let filtred = _.filter(this.state.op, (el) => {

                if (this.state.dateFiltered) {
                    // console.log(new Date(this.state.dateFiltered.startDate));
                    // console.log(new Date(this.state.dateFiltered.endDate));
                    // console.log(new Date(el.date))

                    return new Date(el.date).getTime() >= new Date(this.state.dateFiltered.startDate).getTime() && new Date(el.date).getTime() < new Date(this.state.dateFiltered.endDate).getTime()
                }
                return el;
            })


            //To side filter
            filtred = _.filter(filtred, (res) => {
                if (this.state.sideFiltered) {
                    if (this.state.sideFiltered.amountFrom && this.state.sideFiltered.amountTo) {
                        return res.amount >= Number(this.state.sideFiltered.amountFrom) &&
                            res.amount < Number(this.state.sideFiltered.amountTo)
                    }
                    else{
                        return res.comment.includes(this.state.sideFiltered.commentInput)
                    }
                }
                return res
            });

            const element = filtred.map((el, i) => {
                return <div key={i} className={"operationHistory__element"}>
                    <div className="operationHistory__row">
                        <p key={i + "date"} className={"operationHistory__date"}>{el.date}</p>
                        <p key={i + "category"} className={"operationHistory__category"}>{el.category}</p>
                        <p key={i + "amount"} className={"operationHistory__amount"}>{el.amount}zł</p>
                    </div>
                    <p key={i + "comment"} className={"operationHistory__comment"}>{el.comment}</p>
                    <div key={i} className={"operationHistory__settings"}
                         onClick={e => this.handleDeleteButton(e, el)}/>
                </div>
            });
            return <div>
                <DateFilter passTo={this.handlePassDateFilter} operations={this.state.op}/>
                <div className={"operation__flex"}>
                    <SideFilters passTo={this.handlePassSideFilters} categories={this.state.cat}/>
                    <div className={"operationHistory__container"}>
                        {element}
                    </div>
                </div>
            </div>
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    ReactDOM.render(
        <Menu/>,
        document.getElementById('app')
    );
});