import React, { Component } from 'react';
import Sidebar from "react-sidebar";

class AtomTestSidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
          sidebarOpen: true,
          updatedUiLocators: [...this.props.nodeSelected.uiLocators],
          updatedUiAction: this.props.nodeSelected.uiAction,
          updatedUiValue: this.props.nodeSelected.uiValue,
          updatedTarget: this.props.nodeSelected.target
        };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    this.onUiLocatorChanged = this.onUiLocatorChanged.bind(this);
    this.onUiPropertyChanged = this.onUiPropertyChanged.bind(this);
    this.onUiLocatorsUpdateButtonPressed = this.onUiLocatorsUpdateButtonPressed.bind(this);
    this.onAddUiLocatorButtonPressed = this.onAddUiLocatorButtonPressed.bind(this);
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  onUiPropertyChanged(textChangeEvent) {
    console.log("Property: " + textChangeEvent.target.id + " changed with value : " + textChangeEvent.target.value)
    this.setState({ [textChangeEvent.target.id]: textChangeEvent.target.value })
  }


  onUiLocatorChanged(index, textChangeEvent) {
    var textChanged = textChangeEvent.target.value
    console.log("locator for index " + index + " with value: " + textChanged + " changed!" )
    var newUpdatedUiLocators = [...this.state.updatedUiLocators.slice(0, index), [textChanged, 'linkText'], ...this.state.updatedUiLocators.slice(index + 1)]
    this.setState({
        ...this.state,
        updatedUiLocators:
            newUpdatedUiLocators
    })
  }

  onUiLocatorsUpdateButtonPressed() {
    console.log("update ui locators clicked")
    this.props.onSubmitUiLocatorsChange(this.props.nodeSelected.key, this.state.updatedUiLocators, this.state.updatedUiAction, this.state.updatedUiValue)
  }

  onAddUiLocatorButtonPressed(event) {
    var newUpdatedUiLocators = [...this.state.updatedUiLocators].concat('')
    this.setState({
        ...this.state,
        updatedUiLocators:
            newUpdatedUiLocators
    })
  }

  render() {
    const locatorsRender = this.state.updatedUiLocators.map( (uiLocator, index) => <input type="text" onChange={ (e) => this.onUiLocatorChanged(index, e) } defaultValue={uiLocator[0]} key={index} /> )
    return (
      <Sidebar
        sidebar={<div>
                    <label>Selected Node Action: </label><input id='updatedUiAction' onChange={this.onUiPropertyChanged} defaultValue={this.state.updatedUiAction}/><br/>
                    <label>Selected Node Locators: </label> {locatorsRender}
                    <button onClick={e => this.onAddUiLocatorButtonPressed(e)}>+</button><br/>
                    <label>Selected Node UiTarget: </label><input id='updatedTarget' onChange={this.onUiPropertyChanged} defaultValue={this.state.updatedTarget}/><br/>
                    <label>Selected Node UiValue: </label><input id='updatedUiValue' onChange={this.onUiPropertyChanged} defaultValue={this.state.updatedUiValue}/><br/>
                    <button onClick={this.onUiLocatorsUpdateButtonPressed}>update UI properties for node</button>
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

