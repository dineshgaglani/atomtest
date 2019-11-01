# Given a scenario (list of node keys) and the nodes, this file uses a templating engine to create a selenium file for the scenario sequence

def create_selenium_for_scenario(scenario, nodes):
    selenium = []
    for step in scenario:
        nodeForKey = get_node_with_key(nodes, step)
        selenium.concat({'uiAction': nodeForKey['uiAction'], 'uiLocator': nodeForKey['uiLocator']})

    return selenium

def create_seleniums_for_scenarios(scenarios, nodes):
    seleniumSequences = []
    for scenario in scenarios:
        seleniumSequences.concat[create_selenium_for_scenario(scenario, nodes)]


def get_node_with_key(nodes, step):
    for node in nodes:
        if node['key'] == step:
            return node