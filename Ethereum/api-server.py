#!/usr/bin/env python3
"""
Ethereum Private Network API Server
A Flask-based API server for interacting with the Kurtosis Ethereum network
"""

import json
import requests
import subprocess
import sys
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_enclave_info():
    """Get information about running Kurtosis enclaves"""
    try:
        result = subprocess.run(['kurtosis', 'enclave', 'ls', '--format', 'json'], 
                              capture_output=True, text=True, check=True)
        enclaves = json.loads(result.stdout)
        return [env for env in enclaves if env.get('status') == 'RUNNING']
    except (subprocess.CalledProcessError, json.JSONDecodeError, FileNotFoundError):
        return []

def get_rpc_endpoint(enclave_name):
    """Get RPC endpoint for the first Geth node in an enclave"""
    try:
        result = subprocess.run(['kurtosis', 'service', 'inspect', enclave_name, 'el-1-geth-lighthouse', 
                               '--format', 'json'], capture_output=True, text=True, check=True)
        service_info = json.loads(result.stdout)
        
        for port in service_info.get('ports', []):
            if port.get('name') == 'rpc':
                return port.get('url')
        return None
    except (subprocess.CalledProcessError, json.JSONDecodeError, FileNotFoundError):
        return None

def get_dora_endpoint(enclave_name):
    """Get Dora block explorer endpoint"""
    try:
        result = subprocess.run(['kurtosis', 'service', 'inspect', enclave_name, 'dora', 
                               '--format', 'json'], capture_output=True, text=True, check=True)
        service_info = json.loads(result.stdout)
        
        for port in service_info.get('ports', []):
            if port.get('name') == 'http':
                return port.get('url')
        return None
    except (subprocess.CalledProcessError, json.JSONDecodeError, FileNotFoundError):
        return None

def make_rpc_call(rpc_url, method, params=None):
    """Make an RPC call to the Ethereum node"""
    payload = {
        "jsonrpc": "2.0",
        "method": method,
        "params": params or [],
        "id": 1
    }
    
    try:
        response = requests.post(rpc_url, json=payload, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": str(e)}

@app.route('/')
def index():
    """API server information"""
    return jsonify({
        "name": "Ethereum Private Network API",
        "version": "1.0.0",
        "description": "API server for interacting with Kurtosis Ethereum network",
        "endpoints": {
            "/": "This information",
            "/status": "Network status",
            "/enclaves": "List running enclaves",
            "/rpc/<method>": "Make RPC calls",
            "/block/<number>": "Get block information",
            "/transaction/<hash>": "Get transaction information",
            "/explorer": "Get block explorer URL"
        }
    })

@app.route('/status')
def status():
    """Get network status"""
    enclaves = get_enclave_info()
    
    if not enclaves:
        return jsonify({
            "status": "no_enclaves",
            "message": "No running enclaves found",
            "enclaves": []
        })
    
    enclave = enclaves[0]
    rpc_url = get_rpc_endpoint(enclave['name'])
    dora_url = get_dora_endpoint(enclave['name'])
    
    # Get basic network info
    network_info = {}
    if rpc_url:
        # Get current block
        block_result = make_rpc_call(rpc_url, "eth_blockNumber")
        if 'result' in block_result:
            network_info['current_block'] = int(block_result['result'], 16)
        
        # Get network ID
        net_result = make_rpc_call(rpc_url, "net_version")
        if 'result' in net_result:
            network_info['network_id'] = net_result['result']
        
        # Get peer count
        peer_result = make_rpc_call(rpc_url, "net_peerCount")
        if 'result' in peer_result:
            network_info['peer_count'] = int(peer_result['result'], 16)
    
    return jsonify({
        "status": "running",
        "enclave": enclave['name'],
        "rpc_url": rpc_url,
        "dora_url": dora_url,
        "network_info": network_info
    })

@app.route('/enclaves')
def enclaves():
    """List all running enclaves"""
    enclaves = get_enclave_info()
    return jsonify({
        "enclaves": enclaves,
        "count": len(enclaves)
    })

@app.route('/rpc/<method>')
def rpc_call(method):
    """Make an RPC call to the Ethereum node"""
    enclaves = get_enclave_info()
    if not enclaves:
        return jsonify({"error": "No running enclaves found"}), 404
    
    rpc_url = get_rpc_endpoint(enclaves[0]['name'])
    if not rpc_url:
        return jsonify({"error": "RPC endpoint not found"}), 404
    
    # Get parameters from query string
    params = request.args.getlist('params')
    if params:
        try:
            params = [json.loads(p) for p in params]
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON in parameters"}), 400
    
    result = make_rpc_call(rpc_url, method, params)
    return jsonify(result)

@app.route('/block/<int:block_number>')
def get_block(block_number):
    """Get block information"""
    enclaves = get_enclave_info()
    if not enclaves:
        return jsonify({"error": "No running enclaves found"}), 404
    
    rpc_url = get_rpc_endpoint(enclaves[0]['name'])
    if not rpc_url:
        return jsonify({"error": "RPC endpoint not found"}), 404
    
    # Convert block number to hex
    block_hex = hex(block_number)
    result = make_rpc_call(rpc_url, "eth_getBlockByNumber", [block_hex, True])
    return jsonify(result)

@app.route('/transaction/<tx_hash>')
def get_transaction(tx_hash):
    """Get transaction information"""
    enclaves = get_enclave_info()
    if not enclaves:
        return jsonify({"error": "No running enclaves found"}), 404
    
    rpc_url = get_rpc_endpoint(enclaves[0]['name'])
    if not rpc_url:
        return jsonify({"error": "RPC endpoint not found"}), 404
    
    result = make_rpc_call(rpc_url, "eth_getTransactionByHash", [tx_hash])
    return jsonify(result)

@app.route('/explorer')
def get_explorer():
    """Get block explorer URL"""
    enclaves = get_enclave_info()
    if not enclaves:
        return jsonify({"error": "No running enclaves found"}), 404
    
    dora_url = get_dora_endpoint(enclaves[0]['name'])
    if not dora_url:
        return jsonify({"error": "Block explorer not found"}), 404
    
    return jsonify({"explorer_url": dora_url})

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    print("🚀 Starting Ethereum Private Network API Server...")
    print("📡 Server will be available at: http://localhost:5000")
    print("📖 API documentation available at: http://localhost:5000")
    print("🛑 Press Ctrl+C to stop the server")
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        sys.exit(0)
