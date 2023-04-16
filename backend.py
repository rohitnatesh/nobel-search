from flask import Flask, jsonify
from flask_restful import Api, Resource
import rdflib
import json
import rdflib.plugins.sparql.results.jsonresults as jsonresults


app = Flask(__name__)
api = Api(app)

graph = rdflib.Graph()
graph.parse("./data/nobel.owl", format="xml")
graph.parse("./data/nobeldata.owl", format="xml")


def run_sparql_query(query):
    results = graph.query(query)
    serialized_results = results.serialize(format="json")
    return json.loads(serialized_results.decode('utf-8'))


def get_sorted_results(results, key):
    return sorted([r[key]['value'] for r in results['results']['bindings']])


class Nations(Resource):
    def get(self):
        query = """
        PREFIX nob: <http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>

SELECT DISTINCT ?country_name
WHERE {
  ?winner nob:nationality ?nation.
  BIND (STR(?nation) AS ?nation_str)
  BIND (REPLACE(?nation_str, "http://dbpedia.org/resource/", "") AS ?country_name)
}
ORDER BY ?country_name
        """
        results = run_sparql_query(query)
        nations = get_sorted_results(results, "country_name")
        return jsonify(nations)


class Categories(Resource):
    def get(self):
        query = """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX nob: <http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>

SELECT ?category_name
WHERE {
  ?category rdfs:subClassOf nob:Prize .
  BIND (STR(?category) AS ?category_str)
  BIND (REPLACE(?category_str, "http://swat.cse.lehigh.edu/resources/onto/nobel.owl#", "") AS ?category_name)
}
ORDER BY ?category_name
        """
        results = run_sparql_query(query)
        categories = get_sorted_results(results, "category_name")
        return jsonify(categories)


class Years(Resource):
    def get(self):
        query = """
        PREFIX nob: <http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>
SELECT DISTINCT ?year
WHERE {
    ?prize nob:yearWon ?year .
}
ORDER BY ASC(?year)
        """
        results = run_sparql_query(query)
        years = get_sorted_results(results, "year")
        return jsonify(years)


class NobelByYear(Resource):
    def get(self, year):
        query = f"""
        SELECT ?winner
        WHERE {{
          ?winner nob:year "{year}".
        }}
        """
        results = run_sparql_query(query)
        winners = get_sorted_results(results, "winner")
        print(winners)
        return jsonify(winners)


class NobelByNation(Resource):
    def get(self, nation):
        query = f"""
        SELECT ?winner
        WHERE {{
          ?winner nob:nationality "{nation}".
        }}
        """
        results = run_sparql_query(query)
        winners = get_sorted_results(results, "winner")
        return jsonify(winners)


class NobelByCategory(Resource):
    def get(self, category):
        query = f"""
        SELECT ?winner
        WHERE {{
          ?winner nob:category "{category}".
        }}
        """
        results = run_sparql_query(query)
        winners = get_sorted_results(results, "winner")
        return jsonify(winners)


class NobelByYearAndCategory(Resource):
    def get(self, year, category):
        query = f"""
        SELECT ?winner
        WHERE {{
          ?winner nob:year "{year}".
          ?winner nob:category "{category}".
        }}
        """
        results = run_sparql_query(query)
        winners = get_sorted_results(results, "winner")
        return jsonify(winners)


# Add endpoints for the new classes
api.add_resource(Nations, "/nobel/nations")
api.add_resource(Categories, '/nobel/categories')
api.add_resource(Years, '/nobel/years')
api.add_resource(NobelByYear, '/nobel/year/<string:year>')
api.add_resource(NobelByNation, '/nobel/nation/<string:nation>')
api.add_resource(NobelByCategory, '/nobel/category/<string:category>')
api.add_resource(NobelByYearAndCategory,
                 '/nobel/year/<string:year>/category/<string:category>')


if __name__ == "__main__":
    app.run(debug=True)
