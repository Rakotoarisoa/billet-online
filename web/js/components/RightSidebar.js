import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class RightSidebar extends Component {
    componentDidMount() {

    }

    componentDidUpdate(props) {

    }

    componentWillUnmount() {

    }

    renderPortal(props) {

    }

    render() {
        return (
            <aside>
                <div className={"pull-right d-flex"}>
                    <div className="d-flex p-3 bg-light ">
                        <div className="p-2 bg-light"><button className={"btn btn-light"}>Table</button></div>
                        <div className="p-2 bg-light"><button className={"btn btn-light"}>Section</button></div>
                        <div className="p-2 bg-light"><button className={"btn btn-light"}>Rangée</button></div>
                    </div>
                </div>
            </aside>
        );
    }
}
export default RightSidebar;