
def create_node_data(key, text, uiAction, uiLocators, uiValue, target):
    return {'key': key, 'text': text, 'fill': 'red', 'uiAction': uiAction, 'uiLocators': uiLocators, 'uiValue': uiValue, 'target': target}

def create_link_data(nodeFromId, nodeToId):
    if nodeToId is not None:
        return {'from': nodeFromId, 'to': nodeToId}

def get_node_for_test_step(nodes, test_step):
    for node in nodes:
        if (
                (node['uiAction'] == test_step['command'])
                and (node['uiValue'] == test_step['value'])
                and ( (len(intersection(node['uiLocators'], test_step['targets'])) > 0) or node['target'] == test_step['target'] )
            ):
            print("found match, NOT creating node for step ", test_step)
            return node

    return None

def intersection(l1, l2):
    print('l1: ', l1, " l2: ", l2)
    intersection_arr = [value for value in l1 if value in l2]
    print("intersection len: ", len(intersection_arr))
    return intersection_arr

def create_graph(existing_graph, test_steps_cons):

    if len(test_steps_cons) != 0:
        current_test_step = test_steps_cons[0]
        node_data = get_node_for_test_step(existing_graph['nodeDataArray'], current_test_step)
        if node_data is None:
            # Node with the test step properties does not exist, create a new one
            test_step_desc = current_test_step['comment']
            command = current_test_step['command']
            targets = current_test_step['targets']
            target = current_test_step['target']
            value = current_test_step['value']
            if (len(test_step_desc) == 0):
                loc_str = ', '.join(item[0] for item in targets)
                test_step_desc = 'Perform action: ' + command + ' on locator: ' + loc_str + ' with value: ' + value
            node_data = create_node_data(len(existing_graph['nodeDataArray']), test_step_desc, command, targets, value, target)
            existing_graph['nodeDataArray'].append(node_data)

        try:
            # print('next call invoked with: ', test_steps_cons[1:len(test_steps_cons)])
            new_node_id = create_graph(existing_graph, test_steps_cons[1:len(test_steps_cons)])
            if new_node_id != -1:
                new_link = create_link_data(node_data['key'], new_node_id)
                if new_link is not None:
                    existing_graph['linkDataArray'].append(new_link)
            return node_data['key']
        except TypeError:
            # print('exiting node: ', existing_nodes)
            raise
            return -1