
def create_node_data(key, text, uiAction, uiLocators, uiValue):
    return {'key': key, 'text': text, 'fill': 'red', 'uiAction': uiAction, 'uiLocators': uiLocators, 'uiValue': uiValue}

def create_link_data(nodeFromId, nodeToId):
    if nodeToId is not None:
        return {'from': nodeFromId, 'to': nodeToId}

def get_node_for_test_step(nodes, test_step):
    for node in nodes:
        #print("node: ", node)
        if (
                (node['uiAction'] == test_step['command'])
                & (node['uiValue'] == test_step['value'])
                & (len(intersection(node['uiLocators'], test_step['targets'])) > 0)
            ):
            return node
        else:
            return None

def intersection(l1, l2):
    # print('l1: ', l1, " l2: ", l2)
    return [value for value in l1 if value in l2]

class GraphCreator:
    graph = { "nodeDataArray": [], "linkDataArray": [] }

    def create_graph(self, existing_nodes, test_steps_cons):

        if len(test_steps_cons) != 0:
            current_test_step = test_steps_cons[0]
            node_data = get_node_for_test_step(existing_nodes, current_test_step)
            if node_data is None:
                # Node with the test step properties does not exist, create a new one
                test_step_desc = current_test_step['comment']
                command = current_test_step['command']
                targets = current_test_step['targets']
                value = current_test_step['value']
                if (len(test_step_desc) == 0):
                    test_step_desc = 'Perform action: ' + command + ' on locator: ' + targets + ' with value: ' + value
                node_data = create_node_data(len(existing_nodes), test_step_desc, command, targets, value)
                self.graph['nodeDataArray'].append(node_data)
                existing_nodes.append(node_data)

            try:
                # print('next call invoked with: ', test_steps_cons[1:len(test_steps_cons)])
                new_node_id = self.create_graph(existing_nodes, test_steps_cons[1:len(test_steps_cons)])
                if new_node_id != -1:
                    new_link = create_link_data(node_data['key'], new_node_id)
                    if new_link is not None:
                        self.graph['linkDataArray'].append(new_link)
                return node_data['key']
            except TypeError:
                # print('exiting node: ', existing_nodes)
                raise
                return -1