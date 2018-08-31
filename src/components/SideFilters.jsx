import React from "react";

export default class SideFilters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amountFrom: "",
            amountTo: "",
            commentInput: "",
        }
    }

    handleChangeAmountFrom = (event) => {
        this.setState({
            amountFrom: event.target.value
        })
    }

    handleChangeAmountTo = (event) => {
        this.setState({
            amountTo: event.target.value
        })
    }

    handleChangeCommentInput = (event) => {
        this.setState({
            commentInput: event.target.value
        })
    }

    handleSetSideFilters = (event) => {
        if(typeof this.props.passTo === 'function') {
            //TODO: VALIDATION
        }
            // if (this.state.amountFrom !== "" && this.state.amountTo !== "" || this.state.commentInput !== "") {
                this.props.passTo({
                    'amountFrom': this.state.amountFrom,
                    'amountTo': this.state.amountTo,
                    'commentInput': this.state.commentInput
                });
        //     }
        // }else{
        //     this.setState({
        //         validation: "Uzupełnij dowolne pole."
        //     })
        // }
        this.setState({
            amountFrom: "",
            amountTo: "",
            commentInput: ""
        })
    }

    render() {
        //TODO: CREATE LIST OF CHECKBOX, TO LET FILTER BY CATEGORY
        // const checkboxLi = this.state.cat.map((el, i) => {
        //     return  <li key={i+"listItem"} className={"historyFilters__listItem"}>
        //         <input key={i} name={"checkbox"+i} type="checkbox" className={"historyFilters__checkbox"}
        //                checked={this.state.isChecked} onChange={e => this.handleCheckboxChange(e, i)}/>
        //         {el}
        //     </li>
        // });

        return (
            <div className={"historyFilters"}>
                {/*<label>Kategoria:</label>*/}
                {/*<ul className={"historyFilters__list"}>*/}
                    {/*{checkboxLi}*/}
                {/*</ul>*/}
                <label className={"historyFilters__amount-title"}>Kwota:</label>
                <div className={"historyFilters__amount"}>
                    <p className={"historyFilters__amount-from"}>od: <input type="number" className={"historyFilters__amount-input"} value={this.state.amountFrom}
                    onChange={this.handleChangeAmountFrom}/></p>
                    <p className={"historyFilters__amount-to"}>do: <input type="number"className={"historyFilters__amount-input"} value={this.state.amountTo}
                    onChange={this.handleChangeAmountTo}/></p>
                </div>
                <div className={"historyFilters__comment"}>
                    <label className={"historyFilters__comment-title"}>Treść komentarza:</label>
                    <input className={"historyFilters__comment-input"} type="text" value={this.state.commentInput}
                    onChange={this.handleChangeCommentInput}/>

                    <button className={"historyFilters__submit"} onClick={this.handleSetSideFilters}>Wyświetl</button>
                </div>

            </div>
        );
    }
}