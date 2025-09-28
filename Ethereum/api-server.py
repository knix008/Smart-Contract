#!/usr/bin/env python3
"""
Simple API server to fetch Ethereum node data and serve it to the browser
This bypasses CORS restrictions by acting as a server-side proxy
"""

import json
import requests
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading

class APIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests for API endpoints"""
        if self.path.startswith('/api/'):
            try:
                # Parse the API endpoint
                endpoint = self.path[5:]  # Remove '/api/' prefix
                
                if endpoint == 'net_version/32801':
                    result = self.fetch_from_node('http://localhost:32801', 'net_version', [])
                elif endpoint == 'net_version/32803':
                    result = self.fetch_from_node('http://localhost:32803', 'net_version', [])
                elif endpoint == 'net_version/32805':
                    result = self.fetch_from_node('http://localhost:32805', 'net_version', [])
                elif endpoint == 'latest_block/32801':
                    result = self.fetch_from_node('http://localhost:32801', 'eth_getBlockByNumber', ['latest', False])
                elif endpoint == 'latest_block/32803':
                    result = self.fetch_from_node('http://localhost:32803', 'eth_getBlockByNumber', ['latest', False])
                elif endpoint == 'latest_block/32805':
                    result = self.fetch_from_node('http://localhost:32805', 'eth_getBlockByNumber', ['latest', False])
                else:
                    result = {"error": "Unknown endpoint"}
                
                # Send response with CORS headers
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode())
                
            except Exception as e:
                # Send error response
                self.send_response(500)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                error_response = {"error": f"Internal error: {str(e)}"}
                self.wfile.write(json.dumps(error_response).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Max-Age', '86400')
        self.end_headers()

    def fetch_from_node(self, node_url, method, params):
        """Fetch data from Ethereum node"""
        try:
            response = requests.post(
                node_url,
                json={
                    "jsonrpc": "2.0",
                    "method": method,
                    "params": params,
                    "id": 1
                },
                timeout=5
            )
            response.raise_for_status()
            data = response.json()
            return data
        except requests.exceptions.RequestException as e:
            return {"error": f"Node request failed: {str(e)}"}
        except json.JSONDecodeError as e:
            return {"error": f"Invalid JSON response: {str(e)}"}

def run_api_server(port=8082):
    """Run the API server"""
    server = HTTPServer(('localhost', port), APIHandler)
    print(f"API server running on http://localhost:{port}")
    print("Available endpoints:")
    print("  GET /api/net_version/32801 - Get network ID from node 1")
    print("  GET /api/net_version/32803 - Get network ID from node 2") 
    print("  GET /api/net_version/32805 - Get network ID from node 3")
    print("  GET /api/latest_block/32801 - Get latest block from node 1")
    print("  GET /api/latest_block/32803 - Get latest block from node 2")
    print("  GET /api/latest_block/32805 - Get latest block from node 3")
    server.serve_forever()

if __name__ == '__main__':
    run_api_server()
