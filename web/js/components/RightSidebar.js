import React, {Component} from 'react';
import CreateRangeForm from "./forms/CreateRangeForm";
import CreateTableForm from "./forms/CreateTableForm";

class RightSidebar extends Component {
    constructor(props) {
        super(props);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    };

    handleSubmit(event) {
        alert('Nom de rangée: ' + this.state.value);
        event.preventDefault();
    }

    componentDidMount() {

    }

    componentDidUpdate(props) {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <aside>
                <div className={"pull-right d-flex"}>
                    <div className="d-flex p-3 bg-light ">
                        <div className="p-2 bg-light">
                            <button className={"btn btn-light"} data-toggle={"collapse"}
                                    data-target={"#tableCreate"}>Table
                            </button>
                        </div>
                        <div className="p-2 bg-light">
                            <button className={"btn btn-light"} data-toggle={"collapse"}
                                    data-target={"#zoneCreate"} aria-expanded="false" aria-controls="zoneCreate">Zone
                            </button>
                        </div>
                        <div className="p-2 bg-light">
                            <button className={"btn btn-light"} data-toggle={"collapse"} data-target={"#sectionCreate"}
                                    aria-expanded="false" aria-controls="sectionCreate">Rangée
                            </button>
                        </div>
                    </div>
                </div>
                <div className={"collapse"} id="sectionCreate">
                    <div className="d-flex p-3 bg-light">
                        <CreateRangeForm canvas={this.props.canvas} />
                    </div>
                </div>
                <div className={"collapse"} id="tableCreate">
                    <div className="d-flex p-3 bg-light">
                        <CreateTableForm canvas={this.props.canvas} />
                    </div>
                </div>
            </aside>
        );
    }
}

export default RightSidebar;