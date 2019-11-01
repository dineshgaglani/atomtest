from django.test import TestCase
import atomtestDjango.ScenarioHemerationHelper as scenarioGenHelper


class TestScenarioGeneration(TestCase):

    def test_generate_scenarios(self):
        model = """{ 'nodeDataArray': [ { 'key': 1, 'text': 'Go to wikipedia', 'color'
                    : 'red', 'uiAction': '', 'uiLocator': '' }, { 'key': 2, 'text': 'Click on search
                    bar', 'color': 'red', 'uiAction': '', 'uiLocator': '' }, { 'key': 3, 'text': 'S
                    earch for test automation', 'color': 'red', 'uiAction': '', 'uiLocator': '' }, {
                    'key': 4, 'text': 'Search for devops', 'color': 'red', 'uiAction': '', 'uiLocat
                    or': '' }, { 'key': 5, 'text': 'Check that the test automation page is displayed
                    ', 'color': 'red', 'uiAction': '', 'uiLocator': '' }, { 'key': 6, 'text': 'Check
                    that the devops page is displayed', 'color': 'red', 'uiAction': '', 'uiLocator'
                    : '' }, { 'key': 7, 'text': 'Click on search bar', 'color': 'red', 'uiAction': '
                    ', 'uiLocator': '' }, { 'key': 8, 'text': 'Search for India', 'color': 'red', 'u
                    iAction': '', 'uiLocator': '' }, { 'key': 9, 'text': 'Check that the india page
                    is displayed', 'color': 'red', 'uiAction': '', 'uiLocator': '' } ], 'linkDataArr
                    ay': [ { 'from': 1, 'to': 2 }, { 'from': 2, 'to': 3 }, { 'from': 2, 'to': 4 }, {
                    'from': 3, 'to': 5 }, { 'from': 4, 'to': 6 }, { 'from': 5, 'to': 7 }, { 'from':
                    6, 'to': 7 }, { 'from': 7, 'to': 8 }, { 'from': 8, 'to': 9 } ], 'scenarios': 'Array[0]' 
                }"""
        scenarios = scenarioGenHelper.generate_all_scenarios(model, "1", "9")
        # Should be similar to this -
        # self.assertEqual(scenarios , [
        #                                [ {"key": 1, "text": "Go to wikipedia"}, {"key": 2, "text": "Click on search bar"}, {"key": 3, "text": "Search for test automation"}, {"key": 5, "text": "Check that the test automation page is displayed"}, {"key": 7, "text": "Click on search bar"}, {"key": 8, "text": "Search for India"}, {"key": 9, "text": "Check that the india page is displayed"} ],
        #                                [ {"key": 1, "text": "Go to wikipedia"}, {"key": 2, "text": "Click on search bar"}, {"key": 4, "text": "Search for devops"}, {"key": 6, "text": "Check that the devops page is displayed"}, {"key": 7, "text": "Click on search bar"}, {"key": 8, "text": "Search for India"}, {"key": 9, "text": "Check that the india page is displayed"} ]
        #                              ]
        #                  )

        #Expected return form of scenarios = {name: 's1', value:[1, 2, 4, 5]}, {name: 's2', value: [1, 3, 4, 5]}
        self.assertEqual(scenarios ,[
          [1, 2, 3, 5, 7, 8, 9],
          [1, 2, 4, 6, 7, 8, 9]
        ] )


