"""Simple private Ethereum network with 3 Geth nodes."""

def run(plan):
    """Main function to set up the private Ethereum network."""
    
    plan.print("🔧 Setting up private Ethereum network...")
    
    # Add 3 Geth nodes with basic configuration
    plan.print("🖥️  Adding 3 Geth nodes...")
    
    # Geth Node 1
    plan.add_service(
        name="geth-1",
        config=ServiceConfig(
            image="ethereum/client-go:v1.13.5",
            ports={
                "http": PortSpec(8545, transport_protocol="TCP"),
                "ws": PortSpec(8546, transport_protocol="TCP"),
            },
            cmd=[
                "--http",
                "--http.addr", "0.0.0.0",
                "--http.port", "8545",
                "--http.api", "eth,net,web3,personal,admin,miner",
                "--ws",
                "--ws.addr", "0.0.0.0", 
                "--ws.port", "8546",
                "--ws.api", "eth,net,web3,personal,admin,miner",
                "--networkid", "3151908",
                "--dev",
                "--dev.period", "12",
                "--allow-insecure-unlock",
                "--mine",
            ],
        ),
    )
    
    # Geth Node 2
    plan.add_service(
        name="geth-2", 
        config=ServiceConfig(
            image="ethereum/client-go:v1.13.5",
            ports={
                "http": PortSpec(8547, transport_protocol="TCP"),
                "ws": PortSpec(8548, transport_protocol="TCP"),
            },
            cmd=[
                "--http",
                "--http.addr", "0.0.0.0",
                "--http.port", "8547",
                "--http.api", "eth,net,web3,personal,admin,miner",
                "--ws",
                "--ws.addr", "0.0.0.0",
                "--ws.port", "8548", 
                "--ws.api", "eth,net,web3,personal,admin,miner",
                "--networkid", "3151908",
                "--dev",
                "--dev.period", "12",
                "--allow-insecure-unlock",
                "--mine",
            ],
        ),
    )
    
    # Geth Node 3
    plan.add_service(
        name="geth-3",
        config=ServiceConfig(
            image="ethereum/client-go:v1.13.5", 
            ports={
                "http": PortSpec(8549, transport_protocol="TCP"),
                "ws": PortSpec(8550, transport_protocol="TCP"),
            },
            cmd=[
                "--http",
                "--http.addr", "0.0.0.0",
                "--http.port", "8549",
                "--http.api", "eth,net,web3,personal,admin,miner",
                "--ws",
                "--ws.addr", "0.0.0.0",
                "--ws.port", "8550",
                "--ws.api", "eth,net,web3,personal,admin,miner", 
                "--networkid", "3151908",
                "--dev",
                "--dev.period", "12",
                "--allow-insecure-unlock",
                "--mine",
            ],
        ),
    )
    
    # Note: Block explorers can be added separately if needed
    plan.print("💡 Block explorers can be added separately using external tools")
    
    plan.print("✅ Private Ethereum network setup complete!")
    plan.print("🌐 Network ID: 3151908")
    plan.print("🖥️  3 Geth nodes running:")
    plan.print("   - geth-1: http://localhost:8545, ws://localhost:8546")
    plan.print("   - geth-2: http://localhost:8547, ws://localhost:8548") 
    plan.print("   - geth-3: http://localhost:8549, ws://localhost:8550")
    plan.print("💡 Use external tools like Remix IDE or MetaMask to interact with the network")
    plan.print("🚀 Network ready for smart contract development!")
    plan.print("💡 All nodes are pre-funded and mining with 12-second block times")
    plan.print("🔑 Default account is unlocked for testing")