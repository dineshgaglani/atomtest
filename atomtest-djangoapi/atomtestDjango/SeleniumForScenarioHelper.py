from jinja2 import Environment, FileSystemLoader
import os

# Given a scenario (list of node keys) and the nodes, this file uses a templating engine to create a selenium file for the scenario sequence

def create_steps_for_scenario(scenarioSteps, nodes, j2_env):
    steps = []
    for step in scenario:
        nodeForKey = get_node_with_key(nodes, step)
        steps.append(j2_env.get_template('stepTemplate.jsont').render(nodeForKey))

    return steps

def create_seleniums_for_scenarios(scenarios, nodes):
    # Capture our current directory
    THIS_DIR = os.path.dirname(os.path.abspath(__file__))
    j2_env = Environment(loader=FileSystemLoader(THIS_DIR + '/templates'), trim_blocks=True)
    selenium_scenarios = []

    for scenario in scenarios:
        test_steps = create_steps_for_scenario(scenario['value'], nodes, j2_env)
        selenium_scenarios.append(j2_env.get_template('scenarioTemplate.jsont').render(scenarioName=scenario['name'], testSteps=test_steps))

    scenario_ids = list(map(lambda sc: sc['name'], scenarios))
    return j2_env.get_template('suiteTemplate.jsont').render(scenarios=selenium_scenarios, scenarioIds=scenario_ids)


def get_node_with_key(nodes, step):
    for node in nodes:
        if node['key'] == step:
            return node