import React from "react";
import {Transformer} from "react-konva";

class TransformHandler extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
        // not really "react-way". But it works.
        const stage = this.transformer.getStage();
        const selected = stage.findOne(".rectangle");
        //this.transformer.attachTo(selected);
        this.transformer.getLayer().batchDraw();
    }
    render() {
        return (
            <Transformer
                ref={node => {
                    this.transformer = node;
                }}
                enabledAnchors={["bottom-right"]}
                rotateEnabled={true}
                resizeEnabled={false}
                borderEnabled={true}
                borderDash={true}
            />
        );
    }
}
export default TransformHandler;