import React from "react";

export default class DateFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: "",
            endDate: "",
            op: this.props.operations
        }
    }

    handleChangeStartDate = (event) => {
        this.setState({
            startDate: event.target.value
        })
    }

    handleChangeEndDate = (event) => {
        this.setState({
            endDate: event.target.value
        })
    }

    handleSetDateFilter = (event) => {
        if(typeof this.props.passTo === 'function') {
            this.props.passTo({
                'startDate': this.state.startDate,
                'endDate' : this.state.endDate
            });
        }
        this.setState({
            startDate: "",
            endDate: ""
        })
    }

    render() {
        return (
            <div className={"dateFilter"}>
                <p className={"dateFilter__title-from"}>Data od: </p>
                <input className={"dateFilter__changeDate"} value={this.state.startDate} type="date" onChange={this.handleChangeStartDate}/>
                <p className={"dateFilter__title-to"}>do: </p>
                <input className={"dateFilter__changeDate"} value={this.state.endDate} type="date" onChange={this.handleChangeEndDate} />
                <button className={"dateFilter__submit"} onClick={this.handleSetDateFilter}>Wyświetl</button>

            </div>
        );
    }
}