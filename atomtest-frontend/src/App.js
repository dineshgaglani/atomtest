import React, { Component } from 'react';
import { render } from 'react-dom';
import ShapeBank from './components/ShapeBank';
import WorkArea from './components/WorkAreaCanvas.js';
import AtomTestSidebar from './components/Sidebar.js'

import * as go from 'gojs';
import { ToolManager, Diagram } from 'gojs';
import { GojsDiagram, ModelChangeEventType } from 'react-gojs';

// Courtesy: https://github.com/nicolaserny/react-gojs-example-es6
class App extends Component {
    nodeId = 1
    scenarioId = 1;

  constructor() {
    super();
    this.modelChangeHandler = this.modelChangeHandler.bind(this);
    this.nodeSelectionHandler = this.nodeSelectionHandler.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.removeLink = this.removeLink.bind(this);
    this.addNode = this.addNode.bind(this);
    this.addLink = this.addLink.bind(this);
    this.updateNodeText = this.updateNodeText.bind(this);
    this.onTextEdited = this.onTextEdited.bind(this);

    this.state = {
        selectedNodes: [],
        model: {
            nodeDataArray: [],
            linkDataArray: [],
            scenarios: []
        },
        sidebarOpen: false
    };
  }

  addNode() {
    this.setState( {
           ...this.state,
           model: {
               ...this.state.model,
               nodeDataArray: [
                   ...this.state.model.nodeDataArray,
                   { key: this.nodeId, text: 'node: ' + this.nodeId, color: 'red', uiAction: '', uiLocator: '' }
               ]
           }
       }
      )
      this.nodeId += 1
  }


  addLink(fromNode, toNode) {
      console.log("adding link for: from: " + fromNode + " to Node " + toNode)
      if(this.state.model.linkDataArray.findIndex(link => link.from == fromNode.key && link.to == toNode.key) > -1) {
                console.log("link from: " + fromNode.key + " to: " + toNode.key + " exists")
                return }
      const linkToAdd = { from: fromNode.key, to: toNode.key };
      this.setState({
          ...this.state,
          model: {
              ...this.state.model,
              nodeDataArray: [
                  ...this.state.model.nodeDataArray
              ],
              linkDataArray:
                 [...this.state.model.linkDataArray].concat(linkToAdd),
              scenarios:
                [...this.state.model.scenarios]
          }
      });
  }


  removeNode(nodeKey) {
      const nodeToRemoveIndex = this.state.model.nodeDataArray.findIndex(node => node.key === nodeKey);
      if (nodeToRemoveIndex === -1) {
          return;
      }
      this.setState({
          ...this.state,
          model: {
              ...this.state.model,
              nodeDataArray: [
                  ...this.state.model.nodeDataArray.slice(0, nodeToRemoveIndex),
                  ...this.state.model.nodeDataArray.slice(nodeToRemoveIndex + 1)
              ]
          }
      });
  }

  removeLink(linKToRemove) {
      const linkToRemoveIndex = this.state.model.linkDataArray.findIndex(
          link => link.from === linKToRemove.from && link.to === linKToRemove.to
      );
      if (linkToRemoveIndex === -1) {
          return;
      }
      return {
          ...this.state,
          model: {
              ...this.state.model,
              linkDataArray: [
                  ...this.state.model.linkDataArray.slice(0, linkToRemoveIndex),
                  ...this.state.model.linkDataArray.slice(linkToRemoveIndex + 1)
              ]
          }
      };
  }

  nodeSelectionHandler(nodeKey, isSelected) {
      const selectedNodeIndex = this.state.model.nodeDataArray.findIndex(node => node.key === nodeKey);
      const selectedNode = this.state.model.nodeDataArray[selectedNodeIndex];
      if (isSelected) {
          this.setState({
              ...this.state,
              selectedNodes: [...this.state.selectedNodes, {key: selectedNode.key,
                                                            text: selectedNode.text,
                                                            uiLocator: selectedNode.uiLocator,
                                                            uiAction: selectedNode.uiAction} ]
          });
      } else {
          const nodeIndexToRemove = this.state.selectedNodes.findIndex(nodeDetails => nodeDetails.key === nodeKey);
          if (nodeIndexToRemove === -1) {
              return;
          }
          this.setState({
              ...this.state,
              selectedNodes: [
                  ...this.state.selectedNodes.slice(0, nodeIndexToRemove),
                  ...this.state.selectedNodes.slice(nodeIndexToRemove + 1)
              ]
          });
      }
//      this.state.sidebarOpen = true
  }

  modelChangeHandler(event) {
      switch (event.eventType) {
          case ModelChangeEventType.Remove:
              if (event.nodeData) {
                  this.removeNode(event.nodeData.key);
              }
              if (event.linkData) {
                  this.removeLink(event.linkData);
              }
              break;
          default:
              break;
      }
  }

  updateNodeText(nodeKey, editedText) {
      const nodeToUpdateIndex = this.state.model.nodeDataArray.findIndex(node => node.key === nodeKey);
      if (nodeToUpdateIndex === -1) {
          return;
      }
      this.setState({
          ...this.state,
          model: {
              ...this.state.model,
              nodeDataArray: [
                  ...this.state.model.nodeDataArray.slice(0, nodeToUpdateIndex),
                  {
                      ...this.state.model.nodeDataArray[nodeToUpdateIndex],
                      text: editedText
                  },
                  ...this.state.model.nodeDataArray.slice(nodeToUpdateIndex + 1)
              ]
          }
      });
  }



  onTextEdited(e) {
      const tb = e.subject;
      if (tb === null) {
          return;
      }
      const node = tb.part;
      if (node instanceof go.Node) {
          this.updateNodeText(node.key, tb.text);
      }
//    console.log("onTextEdited called!")
  }

  render() {
    return (
        <div>
          <h1>simple react based uml creation system</h1>
          <ShapeBank onAddNode={this.addNode}/>
          <WorkArea model={this.state.model} nodeSelectionHandler={this.nodeSelectionHandler} onTextEdited={this.onTextEdited} modelChangeHandler={this.modelChangeHandler} onAddLink={this.addLink}/>
          {this.state.selectedNodes.length > 0 ? <AtomTestSidebar isOpen={this.state.sidebarOpen} nodeSelected={this.state.selectedNodes[0]}/> : null }
         </div>
    );
  }
}

export default App;