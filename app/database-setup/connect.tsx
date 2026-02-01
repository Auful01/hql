"use client";

import { useState } from "react";
import { Database, Wifi, ChevronLeft } from "lucide-react";
import axios from "axios";


export default function ConnectDatabase() {
  const [dbType, setDbType] = useState("mysql");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [databaseName, setDatabaseName] = useState("");
  const [testConnection, setTestConnection] = useState("");

  const handleConnect = async () => {
    try {
        const response = await axios.post("https://n8n.apergu.co.id/webhook-test/save-db", {
            "db_name": databaseName,
            "db_type": dbType,
            "db_host": host,
            "db_port": port,
            "db_username": username,    
            "db_password": password,
        });
        console.log("Database connected successfully:", response.data);
    } catch (error) {
        console.error("Error connecting to database:", error);
        // Optionally, you can set an error state here to display an error message in the UI
    }
  };

  const handleTestConnection = async () => {
    setTestConnection("loading");
    try {
      const response = await axios.post("https://n8n.apergu.co.id/webhook/test-db", {
        "db_name": databaseName,
        "db_type": dbType,
        "db_host": host,
        "db_port": port,
        "db_username": username,    
        "db_password": password,
      });
      console.log("Connection successful:", response.data);
      setTestConnection("true");
    } catch (error) {
        setTestConnection("false");
      console.error("Connection failed:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Connect to Database</h2>
      <div className="grid grid-cols-12 gap-4 mb-4">
        {/* Alert */}
        {
            testConnection == "true" ? (
            <div className="col-span-12 bg-green-100 text-green-800 p-4 rounded mb-4">
              <p className="text-sm">Connection successful!</p>
            </div>
            ) : testConnection == "false" ? (
            <div className="col-span-12 bg-red-100 text-red-800 p-4 rounded mb-4">
              <p className="text-sm">Connection failed. Please check your credentials.</p>
            </div>
            ) : testConnection == "loading" ? (
            <div className="col-span-12 bg-yellow-100 text-yellow-800 p-4 rounded mb-4">
              <p className="text-sm">Testing connection...</p>
            </div>
            ) : null
            
        }
        <div className="col-span-6 lg:col-span-6 mb-4">
            <div className="mb-4 ">
                <label className="block mb-2">Database Type</label>
                <select
                value={dbType}
                onChange={(e) => setDbType(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded"
                >
                <option value="mysql">MySQL</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="sqlite">SQLite</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded"
                />
                </div>
            <div className="mb-4">
                <label className="block mb-2">Host</label>
                <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Port</label>
                <input
                type="text"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded"
                />
            </div>
        </div>
        <div className="col-span-6 lg:col-span-6 mb-4">
            <div className="mb-4">
                <label className="block mb-2">Username</label>
                <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Password</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded"
                />
                </div>
                <div className="mb-4">
                <label className="block mb-2">Database Name</label>
                <input
                type="text"
                value={databaseName}
                onChange={(e) => setDatabaseName(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded"
                />
                </div>
        </div>
      </div>


    <div className="flex justify-between">
            <button
                onClick={() => console.log("Going back...")}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2"
            >
                <ChevronLeft className="inline mr-2" size={20} />
                Back
            </button>

        <div className="flex justify-end">
            {/* Button Test */}
            <button
                onClick={handleTestConnection}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2"
            >
                <Wifi className="inline mr-2" size={20} />
                Test Connection
            </button>

            <button
                onClick={handleConnect}
                className=" bg-[#326358] px-4 hover:bg-purple-700 text-white py-2 rounded"
            >
                <Database className="inline mr-2" size={20} />
                Connect to Database
            </button>
        </div>
    </div>
    </div>
    );
}