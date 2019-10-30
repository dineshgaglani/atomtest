import React, { Component } from 'react';
import Sidebar from "react-sidebar";

class AtomTestSidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
          sidebarOpen: true
        };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  render() {
    return (
      <Sidebar
        sidebar={<div>
                    <label>Selected Node Action: </label><input onChange={() => console.log("Action Changed")} value={this.props.nodeSelected.text}/>
                    <label>Selected Node Locator: </label><input onChange={() => console.log("Locator Changed")} value={this.props.nodeSelected.uiLocator}/>
                </div>}
        open={this.state.sidebarOpen}
        onSetOpen={this.onSetSidebarOpen}
        styles={{ sidebar: { background: "brown", height: 80, alignment: "right"} }}
      >
         <button onClick={() => this.onSetSidebarOpen(true)}>
                  Open sidebar
                </button>
      </Sidebar>
    );
  }

}

export default AtomTestSidebar

