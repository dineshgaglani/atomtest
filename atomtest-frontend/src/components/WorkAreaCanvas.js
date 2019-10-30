import React, { Component } from 'react';
import { render } from 'react-dom';

import go from 'gojs';
import { Diagram, ToolManager } from 'gojs';
import { DiagramModel, LinkModel, GojsDiagram, ModelChangeEvent } from 'react-gojs';
import './myDiagram.css';

class WorkArea extends Component {

    constructor(props) {
        super(props);
        this.createDiagram = this.createDiagram.bind(this)
        this.addLinkImpl = this.addLinkImpl.bind(this)
    }

    addLinkImpl(fromnode, fromport, tonode, toport, link) {
       console.log("Link linking called with args: fromNode: " + fromnode + ", fromPort: " + fromport
           + ", toNode: " + tonode + ", toPort: " + toport + ", link: " + link);
       this.props.onAddLink(fromnode, tonode)
       return true
    }


     createDiagram(diagramId) {
            const $ = go.GraphObject.make;

            const myDiagram = $(go.Diagram, diagramId, {
//                initialContentAlignment: go.Spot.LeftCenter,
                isReadOnly: false,
                allowHorizontalScroll: true,
                allowVerticalScroll: true,
                allowZoom: false,
                allowSelect: true,
                autoScale: Diagram.Uniform,
                contentAlignment: go.Spot.LeftCenter,
                TextEdited: (e) => { this.props.onTextEdited(e) },
                "draggingTool.dragsLink": true
            });

          // Define a function for creating a "port" that is normally transparent.
          // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
          // and where the port is positioned on the node, and the boolean "output" and "input" arguments
          // control whether the user can draw links from or to the port.
          function makePort(name, spot, output, input) {
            // the port is basically just a small transparent square
            return $(go.Shape, "Circle",
              {
                fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
                stroke: null,
                desiredSize: new go.Size(7, 7),
                alignment: spot,  // align the port on the main Shape
                alignmentFocus: spot,  // just inside the Shape
                portId: name,  // declare this object to be a "port"
                fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                cursor: "pointer"  // show a different cursor to indicate potential link point
              });
          }

            var nodeResizeAdornmentTemplate =
                    $(go.Adornment, "Spot",
                      { locationSpot: go.Spot.Right },
                      $(go.Placeholder),
                      $(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                      $(go.Shape, { alignment: go.Spot.Top, cursor: "n-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                      $(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

                      $(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                      $(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

                      $(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                      $(go.Shape, { alignment: go.Spot.Bottom, cursor: "s-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                      $(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
                    );

                  var nodeRotateAdornmentTemplate =
                    $(go.Adornment,
                      { locationSpot: go.Spot.Center, locationObjectName: "CIRCLE" },
                      $(go.Shape, "Circle", { name: "CIRCLE", cursor: "pointer", desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
                      $(go.Shape, { geometryString: "M3.5 7 L3.5 30", isGeometryPositioned: true, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] })
                    );

                var nodeSelectionAdornmentTemplate =
                        $(go.Adornment, "Auto",
                          $(go.Shape, { fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] }),
                          $(go.Placeholder)
                        );

                  myDiagram.nodeTemplate =
                    $(go.Node, "Spot",
                      { locationSpot: go.Spot.Center,
                        selectionChanged: node => this.props.nodeSelectionHandler(node.key, node.isSelected)},
                      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                      { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
                      { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
                      { rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate },
                      new go.Binding("angle").makeTwoWay(),
                      // the main object is a Panel that surrounds a TextBlock with a Shape
                      $(go.Panel, "Auto",
                        { name: "PANEL" },
                        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                        $(go.Shape, "Rectangle",  // default figure
                          {
//                            portId: "", // the default port: if no spot on link data, use closest side
                            fromLinkable: true, toLinkable: true, cursor: "pointer",
                            fill: "white",  // default color
                            strokeWidth: 2
                          },
                          new go.Binding("figure"),
                          new go.Binding("fill")),
                        $(go.TextBlock,
                          {
                            font: "bold 11pt Helvetica, Arial, sans-serif",
                            margin: 8,
                            maxSize: new go.Size(160, NaN),
                            wrap: go.TextBlock.WrapFit,
                            editable: true
                          },
                          new go.Binding("text").makeTwoWay())
                      ),
                      // four small named ports, one on each side:
                      makePort("T", go.Spot.Top, false, true),
//                      makePort("L", go.Spot.Left, true, true),
//                      makePort("R", go.Spot.Right, true, true),
                      makePort("B", go.Spot.Bottom, true, false),
                      { // handle mouse enter/leave events to show/hide the ports
                        mouseEnter: function(e, node) { showSmallPorts(node, true); },
                        mouseLeave: function(e, node) { showSmallPorts(node, false); }
                      }
                    );

                  function showSmallPorts(node, show) {
                    node.ports.each(function(port) {
                      if (port.portId !== "") {  // don't change the default port, which is the big shape
                        port.fill = show ? "rgba(0,0,0,.3)" : null;
                      }
                    });
                  }

            var linkSelectionAdornmentTemplate =
                    $(go.Adornment, "Link",
                      $(go.Shape,
                        // isPanelMain declares that this Shape shares the Link.geometry
                        { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 })  // use selection object's strokeWidth
                    );

            myDiagram.linkTemplate =
                    $(go.Link,  // the whole link panel
                      { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
                      { relinkableFrom: true, relinkableTo: true, reshapable: true },
                      {
                        routing: go.Link.AvoidsNodes,
                        curve: go.Link.JumpOver,
                        corner: 5,
                        toShortLength: 4
                      },
                      new go.Binding("points").makeTwoWay(),
                      $(go.Shape),
                      $(go.Shape,  // the arrowhead
                        { toArrow: "Standard", stroke: null }),
                      $(go.Panel, "Auto",
                        new go.Binding("visible", "isSelected").ofObject(),
                        $(go.Shape, "RoundedRectangle",  // the link shape
                          { fill: "#F8F8F8", stroke: null }),
                        $(go.TextBlock,
                          {
                            textAlign: "center",
                            font: "10pt helvetica, arial, sans-serif",
                            stroke: "#919191",
                            margin: 2,
                            minSize: new go.Size(10, NaN),
                            editable: true
                          },
                          new go.Binding("text").makeTwoWay())
                      )
                    );

            myDiagram.toolManager.linkingTool.linkValidation = this.addLinkImpl

            myDiagram.toolManager.relinkingTool.linkValidation = this.addLinkImpl

            //TODO - command handler for link and node delete

            return myDiagram;
        };

    render() {

        return ( <div>
            <p>The nodes will be generated here!</p>
            <GojsDiagram
                diagramId="myDiagramDiv"
                model={this.props.model}
                createDiagram={this.createDiagram}
                className="myDiagram"
                onModelChange={(e) => this.props.modelChangeHandler(e)}
            />
        </div> )
    }
}

export default WorkArea