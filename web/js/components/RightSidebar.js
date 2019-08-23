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
                    <div className="d-flex p-3 bg-secondary text-white">
                        <div className="p-2 bg-info">Ajouter une table</div>
                        <div className="p-2 bg-warning">Ajouter une section</div>
                        <div className="p-2 bg-primary">Ajouter une rangée</div>
                    </div>
                </div>
            </aside>
        );
    }
}
export default RightSidebar;