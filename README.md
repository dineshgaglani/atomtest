# atomtest

## UML To Selenium IDE ##

Tool that can automatically generate selenium ide scripts given a flow diagram

A flow diagram such as the one below is created on a web canvas
![alt text](https://github.com/dineshgaglani/atomtest/blob/master/DocumentationImages/graph.JPG)

every node on the flow diagram may have it's corresponding "action", "target"/"locator" and "value"
![alt text](https://github.com/dineshgaglani/atomtest/blob/master/DocumentationImages/NodeProperties.JPG)


Scenarios for the flow diagram are requested
- Button to be completed

The scenarios can then be viewed by clicking on them, on click of a scenario, the steps/nodes corresponding to it are
highlighted in Yellow.
![alt text](https://github.com/dineshgaglani/atomtest/blob/master/DocumentationImages/S1Scenario.JPG)
![alt text](https://github.com/dineshgaglani/atomtest/blob/master/DocumentationImages/S2Scenario.JPG)

The user can delete un-needed and invalid scenarios and request for selenium-ide scripts to be created for selected scenarios.
- Button to be completed

The .side file gets downloaded and can be opened on the user's selenium ide tool.
![alt text](https://github.com/dineshgaglani/atomtest/blob/master/DocumentationImages/S1Side.JPG)
![alt text](https://github.com/dineshgaglani/atomtest/blob/master/DocumentationImages/S2Side.JPG)


## Selenium IDE to UML ##

You could also go the other way by recording selenium IDE tests and importing them to the system (button to be completed)

The system first creates the nodes for the first scenario and then for subsequent scenarios, the nodes with the same selenium 'command', 'value' are merged

------Screenshots in progress----


In progress:
1. Node change detection and identification of shortest path to test changed nodes
2. Execution on server side and result metrics (such as scenarios failing most often)
3. Modularizing flows and scenarios so they can be repeated in multiple flow diagrams
4. Global properties that can be resolved and used in multiple nodes.
5. Data driven / parametrized flows
6. Conditional branching
7. Load and save graphs
8. Script Nodes types
9. Read from .side and create single graph for all test case files
10. Record user actions and create graph automatically

