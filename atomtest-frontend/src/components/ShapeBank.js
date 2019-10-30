import React, { Component } from 'react';
import { render } from 'react-dom';

class ShapeBank extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return ( <div>
            <button onClick={ () => this.props.onAddNode() }>Add a node</button>
            <button onClick={ () => this.props.onAddLink() }>Add a link</button>
        </div> )
    }
}

export default ShapeBank