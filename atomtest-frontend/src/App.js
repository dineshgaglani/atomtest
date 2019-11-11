import React, { Component } from 'react';
import { render } from 'react-dom';
import ShapeBank from './components/ShapeBank';
import WorkArea from './components/WorkAreaCanvas.js';
import AtomTestSidebar from './components/Sidebar.js';
import { Combobox } from 'react-widgets'


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
    this.scenarioSelectionHandler = this.scenarioSelectionHandler.bind(this);
    this.onSubmitUiLocatorsChange = this.onSubmitUiLocatorsChange.bind(this);

    this.onGenerateDummyData = this.onGenerateDummyData.bind(this);

    this.state = {
        selectedNodes: [],
        model: {
            nodeDataArray: [],
            linkDataArray: [],
            scenarios:  [ {name: 's1', value:[1, 2, 4, 5]}, {name: 's2', value: [1, 3, 4, 5]} ]
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
                   { key: this.nodeId, text: 'node: ' + this.nodeId, fill: 'red', uiAction: '', uiLocators: [], uiValue: '', target: '' }
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
                                                            uiLocators: selectedNode.uiLocators,
                                                            uiAction: selectedNode.uiAction,
                                                            target: selectedNode.target,
                                                            uiValue: selectedNode.uiValue } ]
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


  scenarioSelectionHandler(selectedValues) {

    const nodesToColor = this.state.model.scenarios.find(s => s.name === selectedValues).value;

    var newNodeDataArray = this.state.model.nodeDataArray.map(node => {
        var changedColor = 'red'
        if(nodesToColor.includes(node.key)) {
           console.log("coloring node with key: " + node.key)
           changedColor = 'yellow'
        }
        var changed = {...node}
        changed.fill = changedColor
        return changed
    } )

    console.log("updated state: " + JSON.stringify(newNodeDataArray))

     this.setState({
       ...this.state,
       model: {
          ...this.state.model,
          nodeDataArray: newNodeDataArray
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

  onGenerateDummyData() {
    const newModel =   {
                         "nodeDataArray": [
                           {
                             "key": 1,
                             "text": "Go to wikipedia",
                             "fill": "red",
                             "uiAction": "open",
                             "uiLocators": [['loc1', 'linkText'], ['loc2', 'linkText'], ['loc3', 'linkText'], ['loc4', 'linkText']],
                             "target": '',
                             "uiValue": ''
                           },
                           {
                             "key": 2,
                             "text": "Click on search bar",
                             "fill": "red",
                             "uiAction": "",
                             "uiLocators": [],
                             "target": '',
                             "uiValue": ''
                           },
                           {
                             "key": 3,
                             "text": "Search for test automation",
                             "fill": "red",
                             "uiAction": "",
                             "uiLocators": [],
                             "target": '',
                             "uiValue": ''
                           },
                           {
                             "key": 4,
                             "text": "Search for devops",
                             "fill": "red",
                             "uiAction": "",
                             "uiLocators": [],
                             "target": '',
                             "uiValue": ''
                           },
                           {
                             "key": 5,
                             "text": "Check that the test automation page is displayed",
                             "fill": "red",
                             "uiAction": "",
                             "uiLocators": [],
                             "target": '',
                             "uiValue": ''
                           },
                           {
                             "key": 6,
                             "text": "Check that the devops page is displayed",
                             "fill": "red",
                             "uiAction": "",
                             "uiLocators": [],
                             "target": '',
                             "uiValue": ''
                           },
                           {
                             "key": 7,
                             "text": "Click on search bar",
                             "fill": "red",
                             "uiAction": "",
                             "uiLocators": [],
                             "target": '',
                             "uiValue": ''
                           },
                           {
                             "key": 8,
                             "text": "Search for India",
                             "fill": "red",
                             "uiAction": "",
                             "uiLocators": [],
                             "target": '',
                             "uiValue": ''
                           },
                           {
                             "key": 9,
                             "text": "Check that the india page is displayed",
                             "fill": "red",
                             "uiAction": "",
                             "uiLocators": [],
                             "target": '',
                             "uiValue": ''
                           }
                         ],
                         "linkDataArray": [
                           {
                             "from": 1,
                             "to": 2
                           },
                           {
                             "from": 2,
                             "to": 3
                           },
                           {
                             "from": 2,
                             "to": 4
                           },
                           {
                             "from": 3,
                             "to": 5
                           },
                           {
                             "from": 4,
                             "to": 6
                           },
                           {
                             "from": 5,
                             "to": 7
                           },
                           {
                             "from": 6,
                             "to": 7
                           },
                           {
                             "from": 7,
                             "to": 8
                           },
                           {
                             "from": 8,
                             "to": 9
                           }
                         ],
                         "scenarios": [ {"name": "s1", value:[1, 2, 3, 5, 7, 8, 9]}, {"name": "s2", value: [1, 2, 4, 6, 7, 8, 9]} ]
                       }


    console.log("Generating dummy data!")
    this.setState({
       ...this.state,
       model: newModel
     })
  }

  onGenerateSeleniumParsedData() {
    const seleniumFileGeneratedData = {
                                        "nodeDataArray": [
                                          {
                                            "key": 0,
                                            "text": "Go to wikipedia main page",
                                            "fill": "red",
                                            "uiAction": "open",
                                            "uiLocators": [],
                                            "uiValue": "",
                                            "target": "/wiki/Main_Page"
                                          },
                                          {
                                            "key": 1,
                                            "text": "Maximize window",
                                            "fill": "red",
                                            "uiAction": "setWindowSize",
                                            "uiLocators": [],
                                            "uiValue": "",
                                            "target": "1536x824"
                                          },
                                          {
                                            "key": 2,
                                            "text": "Navigate to FeaturedContent",
                                            "fill": "red",
                                            "uiAction": "click",
                                            "uiLocators": [
                                              [
                                                "linkText=Feat ured content",
                                                "linkText"
                                              ],
                                              [
                                                "css=#n-featuredcontent > a",
                                                "css:finder"
                                              ],
                                              [
                                                "xpath=//a[contains(text(),'Featured content')]",
                                                "xpath:link"
                                              ],
                                              [
                                                "xpath=//li[@id='n-featuredcontent']/a",
                                                "xpath:idRelative"
                                              ],
                                              [
                                                "x path=//a[contains(@href, '/wiki/Portal:Featured_content')]",
                                                "xpath:href"
                                              ],
                                              [
                                                "xpath=//div[5]/div[2]/div[2]/div/ul/li[3]/a",
                                                "xpath:position"
                                              ],
                                              [
                                                "xpath=//a[contains(.,'Featured content')]",
                                                "xpath:innerText"
                                              ]
                                            ],
                                            "uiValue": "",
                                            "target": "linkText=Featured content"
                                          },
                                          {
                                            "key": 3,
                                            "text": "Navigate to Current events",
                                            "fill": "red",
                                            "uiAction": "click",
                                            "uiLocators": [
                                              [
                                                "css=#n-currentevents > a",
                                                "css:finder"
                                              ],
                                              [
                                                "xpath =(//a[contains(text(),'Current events')])[2]",
                                                "xpath:link"
                                              ],
                                              [
                                                "xpath=//li[@id='n-currentevents']/a",
                                                "xpath:idRelative"
                                              ],
                                              [
                                                "xpath=(//a[contains(@href, '/wiki/Portal:Current_events')])[2]",
                                                "xpath:href"
                                              ],
                                              [
                                                "xpath=//div[2]/div/ul/li[4]/a",
                                                "xpath:position"
                                              ]
                                            ],
                                            "uiValue": "",
                                            "target": "css=#n-currentevents > a"
                                          },
                                          {
                                            "key": 4,
                                            "text": "Naviagate to wikipedia store",
                                            "fill": "red",
                                            "uiAction": "click",
                                            "uiLocators": [
                                              [
                                                "linkText=Wikipedia store",
                                                "linkText"
                                              ],
                                              [
                                                "css=#n-shoplink > a",
                                                "css:finder"
                                              ],
                                              [
                                                "xpath=//a[contains(text(),'Wikipedia store')]",
                                                "xpath:link"
                                              ],
                                              [
                                                "xpath=//li[@id='n-shoplink']/a",
                                                "xpath:idRelative"
                                              ],
                                              [
                                                "x path=//a[contains(@href, '//shop.wikimedia.org')]",
                                                "xpath:href"
                                              ],
                                              [
                                                "xpath=//div[2]/div/ul/li[7]/a",
                                                "xpath:position"
                                              ],
                                              [
                                                "xpath=//a[contains(.,'Wikipedia store')]",
                                                "xpath:innerText"
                                              ]
                                            ],
                                            "uiValue": "",
                                            "targ et": "linkText=Wikipedia store"
                                          },
                                          {
                                            "key": 5,
                                            "text": "Perform action: click on locator: linkText=Random article, css=#n-randompage > a, xpath=//a[contains(text(),'Random article')], xpath=//li[@id='n-randomp age']/a, xpath=//a[contains(@href, '/wiki/Special:Random')], xpath=//div[2]/div/ul/li[5]/a, xpath=//a[contains(.,'Random article')] with value: ",
                                            "fill": "red",
                                            "uiAction": "click",
                                            "uiLocators": [
                                              [
                                                "linkT ext=Random article",
                                                "linkText"
                                              ],
                                              [
                                                "css=#n-randompage > a",
                                                "css:finder"
                                              ],
                                              [
                                                "xpath=//a[contains(text(),'Random article')]",
                                                "xpath:link"
                                              ],
                                              [
                                                "xpath=//li[@id='n-randompage']/a",
                                                "xpath:idRelative"
                                              ],
                                              [
                                                "xpath=/ /a[contains(@href, '/wiki/Special:Random')]",
                                                "xpath:href"
                                              ],
                                              [
                                                "xpath=//div[2]/div/ul/li[5]/a",
                                                "xpath:position"
                                              ],
                                              [
                                                "xpath=//a[contains(.,'Random article')]",
                                                "xpath:innerText"
                                              ]
                                            ],
                                            "uiValue": "",
                                            "target": "l inkText=Random article"
                                          }
                                        ],
                                        "linkDataArray": [
                                          {
                                            "from": 3,
                                            "to": 4
                                          },
                                          {
                                            "from": 2,
                                            "to": 3
                                          },
                                          {
                                            "from": 1,
                                            "to": 2
                                          },
                                          {
                                            "from": 0,
                                            "to": 1
                                          },
                                          {
                                            "from": 5,
                                            "to": 4
                                          },
                                          {
                                            "from": 2,
                                            "to": 5
                                          },
                                          {
                                            "from": 1,
                                            "to": 2
                                          },
                                          {
                                            "from": 0,
                                            "to": 1
                                          }
                                        ],
                                        "scenarios": []
                                      }

    console.log("Generating selenium data!")
        this.setState({
           ...this.state,
           model: seleniumFileGeneratedData
         })
  }

  onSubmitUiLocatorsChange(nodeKey, newUiLocators, newUiAction, newUiValue, newUiTarget) {
    console.log("Will replace UI Locators with: " + newUiLocators + " on node: " + nodeKey)
    const nodeToUpdateIndex = this.state.model.nodeDataArray.findIndex(node => node.key === nodeKey);
    this.setState({
      ...this.state,
      model: {
          ...this.state.model,
          nodeDataArray: [
              ...this.state.model.nodeDataArray.slice(0, nodeToUpdateIndex),
              {
                  ...this.state.model.nodeDataArray[nodeToUpdateIndex],
                  uiLocators: newUiLocators,
                  uiAction: newUiAction,
                  target: newUiTarget,
                  uiValue: newUiValue
              },
              ...this.state.model.nodeDataArray.slice(nodeToUpdateIndex + 1)
          ]
      }
    });
  }

  render() {
    return (
        <div>
          <h1>simple react based uml creation system</h1>
          <ShapeBank onAddNode={this.addNode}/>
          <WorkArea model={this.state.model} nodeSelectionHandler={this.nodeSelectionHandler} onTextEdited={this.onTextEdited} modelChangeHandler={this.modelChangeHandler} onAddLink={this.addLink}/>
          <Combobox data={this.state.model.scenarios.map(s => s.name)} onChange={this.scenarioSelectionHandler} />
          <button onClick={() => this.onGenerateDummyData()}>Generate dummy data</button>
          <button onClick={() => this.onGenerateSeleniumParsedData()}>Generate Selenium Parsed data</button>
          {this.state.selectedNodes.length > 0 ? <AtomTestSidebar isOpen={this.state.sidebarOpen} nodeSelected={this.state.selectedNodes[0]} onSubmitUiLocatorsChange={this.onSubmitUiLocatorsChange} /> : null }
         </div>
    );
  }
}

export default App;