from jinja2 import Environment, FileSystemLoader
import os

# Given a scenario (list of node keys) and the nodes, this file uses a templating engine to create a selenium file for the scenario sequence

def create_steps_for_scenario(scenario_steps, nodes, j2_env):
    steps = []
    for step in scenario_steps:
        nodeForKey = get_node_with_key(nodes, step)
        nodeForKey['target'] = nodeForKey['uiLocators'][0][0] if len(nodeForKey['uiLocators']) > 0 else ''
        stepObj = eval(j2_env.get_template('stepTemplate.json').render(nodeForKey))
        steps.append(stepObj)

    return steps

def get_aggregated_scenarios(scenarios, nodes, j2_env):
    selenium_scenarios = []

    for scenario in scenarios:
        test_steps = create_steps_for_scenario(scenario['value'], nodes, j2_env)
        scenarioObj = eval(j2_env.get_template('scenarioTemplate.json').render(scenarioName=scenario['name'], testSteps=test_steps))
        selenium_scenarios.append(scenarioObj)

    return selenium_scenarios


def create_seleniums_for_scenarios(scenarios, nodes):
    # Capture our current directory
    THIS_DIR = os.path.dirname(os.path.abspath(__file__))
    j2_env = Environment(loader=FileSystemLoader(THIS_DIR + '/templates'), trim_blocks=True)

    selenium_scenarios = get_aggregated_scenarios(scenarios, nodes, j2_env)

    scenario_ids = list(map(lambda sc: sc['name'], scenarios))
    selenium_script = j2_env.get_template('suiteTemplate.json').render(scenarios=selenium_scenarios, scenarioIds=scenario_ids)

    return eval(selenium_script)


def get_node_with_key(nodes, step):
    for node in nodes:
        if node['key'] == step:
            return node