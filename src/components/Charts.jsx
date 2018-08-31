import React from "react";
import * as firebase from "firebase";

import {PieChart} from 'react-easy-chart';
import {Legend} from 'react-easy-chart';

export default class Charts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        }
    }

    componentDidMount() {
        let ref = firebase.database().ref();

        ref.on("value", snapshot => {
            if (snapshot.val()) {
                // LOADING ALL OPERATIONS FROM FIREBASE
                const operations = snapshot.val().operations;

                let opArray = [];

                for (let id in operations) {
                    operations[id].id = id
                    opArray = [...opArray, operations[id]]
                }
                this.setState({
                    op: [...opArray],
                    loaded: true
                });
            }
        });
    }

    render() {
        if (this.state.loaded === false) {
            return <div className="loader__box">
                <div className="loader"></div>
            </div>;
        } else {
            //Creating incomes array
            let incomeArr = this.state.op.filter(function (el) {
                return el.amount >= 0;
            }).map(function (el) {
                return {key: el.category, value: el.amount}
            });
            //Creating expenses array
            let expenseArr = this.state.op.filter(function (el) {
                return el.amount < 0;
            }).map(function (el) {
                return {key: el.category, value: el.amount*-1}
            });

            return <div className={"charts__flex"}>
                <div className="charts__element">
                    <h2 className={"charts__header"}>Wykres przychodów:</h2>
                    <PieChart
                        size={400}
                        innerHoleSize={150}
                        styles={{
                            '.chart_lines': {
                                strokeWidth: 0
                            },
                            '.chart_text': {
                                fontFamily: 'serif',
                                fontSize: '1.25em',
                                fill: '#333'
                            }
                        }}
                        data={incomeArr}
                    />
                    <p className={"charts__subtitle"}>Kategorie:</p>
                    <div className="charts__legend">
                        <Legend data={incomeArr} dataId={'key'} />
                    </div>
                </div>
                <div className="charts__element">
                    <h2 className={"charts__header"}>Wykres wydatków:</h2>
                    <PieChart
                        size={400}
                        innerHoleSize={150}
                        data={expenseArr}
                    />
                    <p className={"charts__subtitle"}>Kategorie:</p>
                    <div className="charts__legend">
                        <Legend data={expenseArr} dataId={'key'} />
                    </div>
                </div>
            </div>
        }
    }
}