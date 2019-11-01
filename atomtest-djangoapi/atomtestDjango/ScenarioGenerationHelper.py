import networkx as nx

def generate_all_scenarios(model, startNode, endNode):
    modelObj = eval(model)
    G = nx.Graph()
    for node in modelObj['nodeDataArray']:
        G.add_node(node['key'], text=node['text'])

    for linkData in modelObj['linkDataArray']:
        G.add_edge(linkData['from'], linkData['to'])

    return nx.all_simple_paths(G, source=startNode, target=endNode)


