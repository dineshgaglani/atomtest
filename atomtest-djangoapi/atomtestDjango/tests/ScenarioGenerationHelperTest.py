from django.test import TestCase
import atomtestDjango.ScenarioGenerationHelper as scenarioGenHelper
import atomtestDjango.SeleniumForScenarioHelper as scenarioSeleniumHelper
from atomtestDjango.GraphForSeleniumHelper import GraphCreator


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
        modelObj = eval(model)
        res = scenarioSeleniumHelper.create_seleniums_for_scenarios(modelObj['scenarios'], modelObj['nodeDataArray'])
        self.assertEqual(res, eval('{"id": "7624e603-939b-4c75-a635-18251f382a57", "version": "2.0", "name": "UmlToSeleniumDemo", "url": "https://en.wikipedia.org", "tests": [{"id": "s1", "name": "s1", "commands": [{"id": "1", "comment": "Go to wikipedia", "command": "open", "target": "loc1", "targets": [["loc1", "linkText"], ["loc2", "linkText"], ["loc3", "linkText"], ["loc4", "linkText"]], "value": ""}, {"id": "2", "comment": "Click on search bar", "command": "", "target": "", "targets": [], "value": ""}, {"id": "3", "comment": "Search for test automation", "command": "", "target": "", "targets": [], "value": ""}, {"id": "5", "comment": "Check that the test automation page is displayed", "command": "", "target": "", "targets": [], "value": ""}, {"id": "7", "comment": "Click on search bar", "command": "", "target": "", "targets": [], "value": ""}, {"id": "8", "comment": "Search for India", "command": "", "target": "", "targets": [], "value": ""}, {"id": "9", "comment": "Check that the india page is displayed", "command": "", "target": "", "targets": [], "value": ""}]},{"id": "s2", "name": "s2", "commands": [{"id": "1", "comment": "Go to wikipedia", "command": "open", "target": "loc1", "targets": [["loc1", "linkText"], ["loc2", "linkText"], ["loc3", "linkText"], ["loc4", "linkText"]], "value": ""}, {"id": "2", "comment": "Click on search bar", "command": "", "target": "", "targets": [], "value": ""}, {"id": "4", "comment": "Search for devops", "command": "", "target": "", "targets": [], "value": ""}, {"id": "6", "comment": "Check that the devops page is displayed", "command": "", "target": "", "targets": [], "value": ""}, {"id": "7", "comment": "Click on search bar", "command": "", "target": "", "targets": [], "value": ""}, {"id": "8", "comment": "Search for India", "command": "", "target": "", "targets": [], "value": ""}, {"id": "9", "comment": "Check that the india page is displayed", "command": "", "target": "", "targets": [], "value": ""}]}], "suites": [{"id": "b5ef9c90-a3e0-4f4a-9227-a600fe74c157", "name": "Default Suite", "persistSession": "false", "parallel": "false", "timeout": 300, "tests": ["s1", "s2"]}], "urls": ["https://en.wikipedia.org/"], "plugins": []}'))

def test_selenium_to_graph_no_existing_nodes(self):
    selenium_single_test_suite = { "id": "be1dc4c6-660e-4117-acbb-27cbc850c66e", "version": "2.0", "name": "CreateNodesFromSeleniumSuite", "url": "https://en.wikipedia.org", "tests": [{ "id": "0261e1ac-c8fb-4ae8-858e-fda3a623b324", "name": "SidebarNavigationS1", "commands": [{ "id": "c638fbb4-46f3-43db-8181-b516a422826a", "comment": "Go to wikipedia main page", "command": "open", "target": "/wiki/Main_Page", "targets": [], "value": "" }, { "id": "32d40a67-769c-4856-955c-60f58848a00f", "comment": "Maximize window", "command": "setWindowSize", "target": "1536x824", "targets": [], "value": "" }, { "id": "fa83411b-06bb-4e5b-8ecf-94546ac0a452", "comment": "Navigate to FeaturedContent", "command": "click", "target": "linkText=Featured content", "targets": [ ["linkText=Featured content", "linkText"], ["css=#n-featuredcontent > a", "css:finder"], ["xpath=//a[contains(text(),'Featured content')]", "xpath:link"], ["xpath=//li[@id='n-featuredcontent']/a", "xpath:idRelative"], ["xpath=//a[contains(@href, '/wiki/Portal:Featured_content')]", "xpath:href"], ["xpath=//div[5]/div[2]/div[2]/div/ul/li[3]/a", "xpath:position"], ["xpath=//a[contains(.,'Featured content')]", "xpath:innerText"] ], "value": "" }, { "id": "6b3463b0-9a9a-4cb0-91b7-74a966b8cc4b", "comment": "Navigate to Current events", "command": "click", "target": "css=#n-currentevents > a", "targets": [ ["css=#n-currentevents > a", "css:finder"], ["xpath=(//a[contains(text(),'Current events')])[2]", "xpath:link"], ["xpath=//li[@id='n-currentevents']/a", "xpath:idRelative"], ["xpath=(//a[contains(@href, '/wiki/Portal:Current_events')])[2]", "xpath:href"], ["xpath=//div[2]/div/ul/li[4]/a", "xpath:position"] ], "value": "" }, { "id": "3f07dcba-57f3-474f-8d06-f56f4d9a3c78", "comment": "Naviagate to wikipedia store", "command": "click", "target": "linkText=Wikipedia store", "targets": [ ["linkText=Wikipedia store", "linkText"], ["css=#n-shoplink > a", "css:finder"], ["xpath=//a[contains(text(),'Wikipedia store')]", "xpath:link"], ["xpath=//li[@id='n-shoplink']/a", "xpath:idRelative"], ["xpath=//a[contains(@href, '//shop.wikimedia.org')]", "xpath:href"], ["xpath=//div[2]/div/ul/li[7]/a", "xpath:position"], ["xpath=//a[contains(.,'Wikipedia store')]", "xpath:innerText"] ], "value": "" }] }], "suites": [{ "id": "a8a06010-4d56-41f7-a1af-0c7a333ac400", "name": "Default Suite", "persistSession": "false", "parallel": "false", "timeout": 300, "tests": ["0261e1ac-c8fb-4ae8-858e-fda3a623b324"] }], "urls": ["https://en.wikipedia.org/"], "plugins": [] }
    graphCreator = GraphCreator()
    graphCreator.create_graph([], selenium_single_test_suite['tests'][0]['commands'])
    self.assertEqual(graphCreator.graph, {'nodeDataArray': [{'key': 0, 'text': 'Go to wikipedia main page', 'fill': 'red', 'uiAction': 'open', 'uiLocators': [], 'uiValue': ''}, {'key': 1, 'text': 'Maximize window', 'fill': 'red', 'uiAction': 'setWindo wSize', 'uiLocators': [], 'uiValue': ''}, {'key': 2, 'text': 'Navigate to FeaturedContent', 'fill': 'red', 'uiAction': 'click', 'uiLocators': [['linkText=Featured content', 'linkText'], ['css=#n-featuredcontent > a', 'css:finder'], ["xpath=//a[contains(text(),'Featured content')]", 'xpath:link'], ["xpath=//li[@id='n-featuredcontent']/a", 'xpath:idRelative'], ["xpath=//a[contains(@href, '/wiki/Portal:Featured_content' )]", 'xpath:href'], ['xpath=//div[5]/div[2]/div[2]/div/ul/li[3]/a', 'xpath:position'], ["xpath=//a[contains(.,'Featured content')]", 'xpath:innerText']], 'uiValue': ''}, {'key': 3, 'text': 'Navigate to Current events', 'fill': 'red', 'uiAction': 'click', 'uiLocators': [['css=#n-currentevents > a', 'css:finder'], ["xpath=(//a[contains(text(),'Current events')])[2]", 'xpath:link'], ["xpath=//li[@id='n-currentevents']/a ", 'xpath:idRelative'], ["xpath=(//a[contains(@href, '/wiki/Portal:Current_events')])[2]", 'xpath:href'], ['xpath=//div[2]/div/ul/li[4]/a', 'xpath:position']], 'uiValue': ''}, {'key': 4, 'text': 'Naviagate to w ikipedia store', 'fill': 'red', 'uiAction': 'click', 'uiLocators': [['linkText=Wikipedia store', 'linkText'], ['css=#n-shoplink > a', 'css:finder'], ["xpath=//a[contains(text(),'Wikipedia store')]", 'xpath:link '], ["xpath=//li[@id='n-shoplink']/a", 'xpath:idRelative'], ["xpath=//a[contains(@href, '//shop.wikimedia.org')]", 'xpath:href'], ['xpath=//div[2]/div/ul/li[7]/a', 'xpath:position'], ["xpath=//a[contains(.,'Wik ipedia store')]", 'xpath:innerText']], 'uiValue': ''}], 'linkDataArray': [{'from': 3, 'to': 4}, {'from': 2, 'to': 3}, {'from': 1, 'to': 2}, {'from': 0, 'to': 1}]} )

def test_selenium_to_graph_few_existing_nodes_no_common_nodes(self):
    pass

def test_selenium_to_graph_few_existing_nodes_few_common_nodes(self):
    pass
