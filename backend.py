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
PREFIX nob: <http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT * 
WHERE {{
  ?winner rdf:type nob:PersonWinner .
  ?winner nob:name ?winnerName .
  ?winner nob:WonPrize ?prize .
  ?prize rdf:type ?prizeClass .
  ?prizeClass rdfs:subClassOf nob:Prize .
  ?prize nob:yearWon ?year .
  FILTER (?year = "{year}"^^xsd:int) .
  BIND (STR(?prizeClass) AS ?prizeType)
}}
"""
        results = run_sparql_query(query)
        name = get_sorted_results(results, "winnerName")
        prize = get_sorted_results(results, "prize")
        year = get_sorted_results(results, "year")
        # use results or above variables depeding on ease of use - results is one json per person with all details
        return jsonify(results)


class NobelByNation(Resource):
    def get(self, nation):
        query_nation = f"""
PREFIX nob: <http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?winnerName ?prizeType ?year ?nation
WHERE {{
  ?winner rdf:type nob:PersonWinner .
  ?winner nob:name ?winnerName .
  ?winner nob:nationality ?nation .
  FILTER (CONTAINS(?nation, "{nation}")) .
  ?winner nob:WonPrize ?prize .
  ?prize rdf:type ?prizeClass .
  ?prizeClass rdfs:subClassOf nob:Prize .
  ?prize nob:yearWon ?year .
  BIND (STR(?prizeClass) AS ?prizeType)
}}
"""
        results = run_sparql_query(query_nation)
        winners = get_sorted_results(results, "winnerName")
        # Same just choose how you want the results to be shown
        return jsonify(results)


class NobelByCategory(Resource):
    def get(self, category):
        query_category = f"""
PREFIX nob: <http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?winnerName ?prizeType ?year 
WHERE {{
  ?winner rdf:type nob:PersonWinner .
  ?winner nob:name ?winnerName .
  ?winner nob:WonPrize ?prize .
  ?prize rdf:type ?prizeClass .
  ?prizeClass rdfs:subClassOf nob:Prize .
  ?prize nob:yearWon ?year .
  BIND (STR(?prizeClass) AS ?prizeType) .
  FILTER (CONTAINS(?prizeType, "{category}")) .
}}
"""

        results_category = run_sparql_query(query_category)
        winners_category = get_sorted_results(results_category, "winnerName")
        return jsonify(results_category)


class NobelByYearAndCategory(Resource):
    def get(self, year, category):
        query_year_category = f"""
PREFIX nob: <http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?winnerName ?prizeType ?year 
WHERE {{
  ?winner rdf:type nob:PersonWinner .
  ?winner nob:name ?winnerName .
  ?winner nob:WonPrize ?prize .
  ?prize rdf:type ?prizeClass .
  ?prizeClass rdfs:subClassOf nob:Prize .
  ?prize nob:yearWon ?year .
  FILTER (?year = "{year}"^^xsd:int) .
  BIND (STR(?prizeClass) AS ?prizeType) .
  FILTER (CONTAINS(?prizeType, "{category}")) .
}}
"""

        results_year_category = run_sparql_query(query_year_category)
        winners_year_category = get_sorted_results(
            results_year_category, "winnerName")
        # eg. http://127.0.0.1:5000/nobel/year/1918/category/Physics
        return jsonify(results_year_category)


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
