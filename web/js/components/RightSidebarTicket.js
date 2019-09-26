import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import Button from "@material-ui/core/Button";
import EventContext from "./contexts/EventContext";

function RightSidebarTicket(props) {
    const [billet, setBillet] = useState([]);
    const [seatSelected, setSeatSelected] = useState(null);
    const addTicket = () => {

    };
    const {colors,setColors} = React.useState([]);
    function generateColor() {
        const nb=20;
        let listColors=[];
        for(let i=0;i<nb;i++)
        {
            listColors.push('#' +  Math.random().toString(16).substr(-6));
        }
        setColors(listColors);
        console.log(colors);
    };
    const event_id = useContext(EventContext);
    const list = billet.map((ticket, i) =>
        <li className="list-group-item d-flex justify-content-between align-items-center" key={i}>
            <p ><span className={"fa fa-plus-circle fa-3x"} onClick={()=>{console.log("clicked")}} style={{color : "#EEE"}}></span></p>
            <p>{ticket.libelle}</p>
            <p>{ticket.quantite} billets</p>
        </li>
    );
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                '/api/typeBillet/'+event_id
            );
            setBillet(result.data);
        };
        fetchData();
    }, []);
    return (
        <aside>
            <div className={''} onClick={generateColor}>
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