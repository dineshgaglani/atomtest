from django.test import TestCase
import atomtestDjango.ScenarioGenerationHelper as scenarioGenHelper
import atomtestDjango.SeleniumForScenarioHelper as scenarioSeleniumHelper


class TestScenarioGeneration(TestCase):

    model = """{ 'nodeDataArray': [ { 'key': 1, 'text': 'Go to wikipedia', 'color': 'red', 'uiAction': 'open', 'uiLocators': [['loc1', 'linkText'], ['loc2', 'linkText'], ['loc3', 'linkText'], ['loc4', 'linkText']] }, { 'key': 2, 'text': 'Click on search bar', 'color': 'red', 'uiAction': '', 'uiLocators': [] }, { 'key': 3, 'text': 'Search for test automation', 'color': 'red', 'uiAction': '', 'uiLocators': [] }, { 'key': 4, 'text': 'Search for devops', 'color': 'red', 'uiAction': '', 'uiLocators': [] }, { 'key': 5, 'text': 'Check that the test automation page is displayed', 'color': 'red', 'uiAction': '', 'uiLocators': [] }, { 'key': 6, 'text': 'Check that the devops page is displayed', 'color': 'red', 'uiAction': '', 'uiLocators': [] }, { 'key': 7, 'text': 'Click on search bar', 'color': 'red', 'uiAction': '', 'uiLocators': [] }, { 'key': 8, 'text': 'Search for India', 'color': 'red', 'uiAction': '', 'uiLocators': [] }, { 'key': 9, 'text': 'Check that the india page is displayed', 'color': 'red', 'uiAction': '', 'uiLocators': [] } ], 'linkDataArray': [ { 'from': 1, 'to': 2 }, { 'from': 2, 'to': 3 }, { 'from': 2, 'to': 4 }, { 'from': 3, 'to': 5 }, { 'from': 4, 'to': 6 }, { 'from': 5, 'to': 7 }, { 'from': 6, 'to': 7 }, { 'from': 7, 'to': 8 }, { 'from': 8, 'to': 9 } ], 'scenarios': [ {'name': 's1', 'value':[1, 2, 3, 5, 7, 8, 9]}, {'name': 's2', 'value': [1, 2, 4, 6, 7, 8, 9]} ] }"""

    def test_generate_scenarios(self):
        scenarios = scenarioGenHelper.generate_all_scenarios(model, "1", "9")
        # Should be similar to this -
        # self.assertEqual(scenarios , [
        #                                [ {"key": 1, "text": "Go to wikipedia"}, {"key": 2, "text": "Click on search bar"}, {"key": 3, "text": "Search for test automation"}, {"key": 5, "text": "Check that the test automation page is displayed"}, {"key": 7, "text": "Click on search bar"}, {"key": 8, "text": "Search for India"}, {"key": 9, "text": "Check that the india page is displayed"} ],
        #                                [ {"key": 1, "text": "Go to wikipedia"}, {"key": 2, "text": "Click on search bar"}, {"key": 4, "text": "Search for devops"}, {"key": 6, "text": "Check that the devops page is displayed"}, {"key": 7, "text": "Click on search bar"}, {"key": 8, "text": "Search for India"}, {"key": 9, "text": "Check that the india page is displayed"} ]
        #                              ]
        #                  )

        #Expected return form of scenarios = {name: 's1', value:[1, 2, 4, 5]}, {name: 's2', value: [1, 3, 4, 5]}
        self.assertEqual(scenarios ,[ {'name': 's1', 'value': [1, 2, 3, 5, 7, 8, 9] }, {'name': 's2', 'value':[1, 2, 4, 6, 7, 8, 9] } ] )

    def test_selenium_generation(self):
        stepsList = scenarioSeleniumHelper.create_steps_for_scenario([1, 2, 3, 5, 7, 8, 9], model['nodeDataArray'])
        #TODO - fix assertion
        self.assertEqual(stepsList, [{
            "id": "1",
            "comment": "Go to wikipedia",
            "command": "open",
            "target": "loc1",
            "targets": [['loc1', 'linkText'], ['loc2', 'linkText'], ['loc3', 'linkText'], ['loc4', 'linkText']],
            "value": ""
        },{
            "id": "2",
            "comment": "Click on search bar",
            "command": "",
            "target": "",
            "targets": [],
            "value": ""
        },{
            "id": "3",
            "comment": "Search for test automation",
            "command": "",
            "target": "",
            "targets": [],
            "value": ""
        },{
            "id": "5",
            "comment": "",
            "command": "Check that the test automation page is displayed",
            "target": "",
            "targets": [],
            "value": ""
        },{
            "id": "7",
            "comment": "",
            "command": "Click on search bar",
            "target": "",
            "targets": "[]",
            "value": ""
        },{
            "id": "8",
            "comment": "Search for India",
            "command": "",
            "target": "",
            "targets": [],
            "value": ""
        },{
            "id": "9",
            "comment": "Check that the india page is displayed",
            "command": "",
            "target": "",
            "targets": [],
            "value": ""
        }])

    def test_full_suite_generation(self):
        res = scenarioSeleniumHelper.create_seleniums_for_scenarios(model['scenarios'], model['nodeDataArray'])
        self.assertEqual(res, "")
