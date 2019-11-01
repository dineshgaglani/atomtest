import React, { Component } from 'react';
import { render } from 'react-dom';

class ShapeBank extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return ( <div>
            <button onClick={ () => this.props.onAddNode() }>Add a node</button>
        </div> )
    }
}

export default ShapeBank