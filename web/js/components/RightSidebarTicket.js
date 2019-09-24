import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from "@material-ui/core/Button";

function RightSidebarTicket(props) {
    const [billet, setBillet] = useState([]);
    const [seatSelected, setSeatSelected] = useState(null);
    const addTicket = () => {

    };
    const list = billet.map((ticket, i) =>
        <li className="list-group-item d-flex justify-content-between align-items-center" key={i}>
            <p ><span className={"fa fa-plus-circle fa-3x"} onClick={()=>{console.log("clicked")}}></span></p>
            <p>{ticket.libelle}</p>
            <p>{ticket.quantite} billets</p>
        </li>
    );
    useEffect(() => {
        let url = "http://localhost:8000";
        const fetchData = async () => {
            const result = await axios(
                url + '/api/typeBillet/395',
            );
            setBillet(result.data);
        };
        fetchData();
    }, []);
    return (
        <aside>
            <div className={''}>
                <div className="d-flex d-flex-row">
                    <ul className="col-sm-12 list-group">
                        {list}
                    </ul>
                </div>
                <br/>
                <div className="d-flex d-flex-row">
                    <Button
                        variant="contained"
                        color="secondary"
                        className={"btn btn-primary"}
                        onClick={addTicket}
                    >
                        Ajouter un billet
                    </Button>
                </div>
            </div>
        </aside>
    );
}

export default RightSidebarTicket;