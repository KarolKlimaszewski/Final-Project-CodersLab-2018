import React from "react";
import * as firebase from "firebase";

export default class OperationAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: "",
            comment: "",
            amount: "",
            date: "",
            select: "choose"
        }
    }

    handleChangeCategory = (event) => {
        this.setState({
            category: event.target.value
        })
    }

    handleChangeComment = (event) => {
        this.setState({
            comment: event.target.value
        })
    }

    handleChangeAmount = (event) => {
        this.setState({
            amount: event.target.value
        })
    }

    handleChangeDate = (event) => {
        this.setState({
            date: event.target.value
        })
    }

    handleChangeSelect = (event) => {
        this.setState({
            select: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        var operationsRef = firebase.database().ref("operations");
        if (this.state.select === "income") {
            operationsRef.push(
                {
                    category: this.state.category,
                    comment: this.state.comment,
                    amount: Number(this.state.amount),
                    date: this.state.date,
                    type: this.state.select
                });
            let amount = Number(this.state.amount);
            const accountBalanceRef = firebase.database().ref().child("accountBalance");
            accountBalanceRef.transaction(function (addBalance) {
                return addBalance + amount;
            })
        } else {
            operationsRef.push(
                {
                    category: this.state.category,
                    comment: this.state.comment,
                    amount: Number(this.state.amount) * -1,
                    date: this.state.date,
                    type: this.state.select
                });
            const accountBalanceRef = firebase.database().ref().child("accountBalance");
            let amount = Number(this.state.amount) * -1;
            accountBalanceRef.transaction(function (addBalance) {
                return addBalance + amount
            })
        }
        this.setState({
            category: "",
            comment: "",
            amount: "",
            date: "",
            select: "choose"
        })
    }


    render() {
        return (
            <div className={"container"}>
                <form className={"addOperation__form"}>
                    <input className={"addOperation__category"} type="text" onChange={this.handleChangeCategory}
                           placeholder={"Kategoria"} value={this.state.category}/>
                    <input className={"addOperation__comment"} type="text" onChange={this.handleChangeComment}
                           placeholder={"Komentarz"} value={this.state.comment}/>
                    <div className="addOperation__container">
                        <input className={"addOperation__amount"} type="number" onChange={this.handleChangeAmount}
                               placeholder={"Kwota"} value={this.state.amount}/>
                        <select className={"addOperation__select"} name="amount-info" onChange={this.handleChangeSelect}>
                            <option className={"addOperation__option-first"} value="choose">Wybierz</option>
                            <option className={"addOperation__option-second"} value="income">Wpływ</option>
                            <option className={"addOperation__option-third"} value="expense" >Wydatek</option>
                        </select>
                        <input className={"addOperation__date"} type="date" onChange={this.handleChangeDate}
                               placeholder={"Data"} value={this.state.date}/>
                    </div>
                    <button className={"addOperation__submit"} type={"submit"} onClick={this.handleSubmit}>Dodaj
                    </button>
                </form>

            </div>
        );
    }
}