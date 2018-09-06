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
            select: "choose",
            valCategory: 'Uzupełnij pole "kategoria"',
            valComment: 'Uzupełnij pole "komentarz"',
            valAmount: 'Uzupełnij pole "kwota"',
            valDate: 'Uzupełnij pole "data"',
            valSelect: 'Wybierz, czy jest to wpływ, czy wydatek',
        }
    }

    handleChangeCategory = (event) => {
        this.setState({
            category: event.target.value
        })
        if (event.target.value === "") {
            this.setState({
                valCategory: 'Uzupełnij pole "kategoria"'
            })
        }
        else {
            this.setState({
                valCategory: ""
            })
        }
    }

    handleChangeComment = (event) => {
        this.setState({
            comment: event.target.value
        })
        if (event.target.value === "") {
            this.setState({
                valComment: 'Uzupełnij pole "komentarz"'
            })
        }
        else {
            this.setState({
                valComment: ""
            })
        }
    }

    handleChangeAmount = (event) => {
        this.setState({
            amount: event.target.value
        })
        if (event.target.value === "") {
            this.setState({
                valAmount: 'Uzupełnij pole "kwota"'
            })
        }
        else {
            this.setState({
                valAmount: ""
            })
        }
    }

    handleChangeDate = (event) => {
        this.setState({
            date: event.target.value
        })
        if (event.target.value === "") {
            this.setState({
                valDate: 'Uzupełnij pole "data"'
            })
        }
        else {
            this.setState({
                valDate: ""
            })
        }
    }

    handleChangeSelect = (event) => {
        if (event.target.value === "choose") {
            this.setState({
                valSelect: 'Wybierz, czy jest to wpływ, czy wydatek'
            })
        }
        else {
            this.setState({
                select: event.target.value,
                valSelect: ""
            })
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        var operationsRef = firebase.database().ref("operations");
        if (this.state.valCategory === "" && this.state.valComment === "" && this.state.valAmount === ""
            && this.state.valDate === "" && this.state.valSelect === "") {
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
        }else{
            this.setState({

            })
        }
    }



    render() {
        return (
            <div className={"container"}>
                <div className="addOperation__validation-container">
                    <h2 className={"addOperation__validation"}>{this.state.valCategory}</h2>
                    <h2 className={"addOperation__validation"}>{this.state.valComment}</h2>
                    <h2 className={"addOperation__validation"}>{this.state.valAmount}</h2>
                    <h2 className={"addOperation__validation"}>{this.state.valDate}</h2>
                    <h2 className={"addOperation__validation"}>{this.state.valSelect}</h2>
                </div>
                <form className={"addOperation__form"}>
                    <input className={"addOperation__category"} type="text" onChange={this.handleChangeCategory}
                           placeholder={"Kategoria"} value={this.state.category}/>
                    <input className={"addOperation__comment"} type="text" onChange={this.handleChangeComment}
                           placeholder={"Komentarz"} value={this.state.comment}/>
                    <div className="addOperation__container">
                        <input className={"addOperation__amount"} type="number" onChange={this.handleChangeAmount}
                               placeholder={"Kwota"} value={this.state.amount}/>
                        <select className={"addOperation__select"} name="amount-info"
                                onChange={this.handleChangeSelect}>
                            <option className={"addOperation__option-first"} value="choose">Wybierz</option>
                            <option className={"addOperation__option-second"} value="income">Wpływ</option>
                            <option className={"addOperation__option-third"} value="expense">Wydatek</option>
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