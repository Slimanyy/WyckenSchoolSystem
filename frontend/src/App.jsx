import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from './abi.json';
import './App.css';

function App() {
  const contractAddress = "0xF24601c059D3583B43341131d368091CB8dEc2e6";
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [removeStudentId, setRemoveStudentId] = useState(""); // New state for student ID to remove
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function requestAccounts() {
    //console.log("Requesting accounts...");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    // console.log("Accounts requested.");
  }

  async function connectContract() {
    // console.log("Connecting to contract...");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    // console.log("Signer obtained:", signer);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    // console.log("Contract connected:", contract);
    return contract;
  }

  async function registerStudent() {
    // console.log("Attempting to register student...");
    if (!studentId || !studentName) {
      setError("Please enter a valid Student ID and Name.");
      // console.error("Invalid student ID or name.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      // console.log("Requesting accounts for registration...");
      await requestAccounts();
      const contract = await connectContract();
      // console.log("Calling registerStudent with ID:", studentId, "Name:", studentName);
      const tx = await contract.registerStudent(Number(studentId), studentName);
      // console.log("Transaction sent, awaiting confirmation...");
      await tx.wait();
      // console.log("Transaction confirmed.");
      setStudentId("");
      setStudentName("");
      fetchStudents();
    } catch (err) {
      setError(err.message);
      // console.error("Error registering student:", err);
    } finally {
      setLoading(false);
    }
  }

  async function removeStudent() {
    // console.log("Attempting to remove student with ID:", removeStudentId);
    if (!removeStudentId) {
      setError("Please enter a valid Student ID to remove.");
      // console.error("Invalid student ID for removal.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      // console.log("Requesting accounts for removal...");
      await requestAccounts();
      const contract = await connectContract();
      // console.log("Calling removeStudent with ID:", removeStudentId);
      const tx = await contract.removeStudent(Number(removeStudentId)); // Ensure the contract has this function
      // console.log("Transaction sent, awaiting confirmation...");
      await tx.wait();
      // console.log("Student removed, transaction confirmed.");
      setRemoveStudentId(""); // Clear the input after removal
      fetchStudents();
    } catch (err) {
      setError(err.message);
      // console.error("Error removing student:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStudents() {
    // console.log("Fetching students...");
    try {
      setLoading(true);
      setError("");
      // console.log("Requesting accounts for fetching students...");
      await requestAccounts();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      // console.log("Contract for fetching students:", contract);
      const studentList = await contract.getStudents();
      // console.log("Students fetched:", studentList);
      setStudents(studentList);
    } catch (err) {
      setError(err.message);
      // console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="App">
      <h1>Class Registration System</h1>

      {/* {error && <p className="error-message" style={{ color: "red" }}>{error}</p>} */}

      <div>
        <h2>Register Student</h2>
        <input
          type="text"
          placeholder="Student ID, Number Only"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          disabled={loading}
        />
        <button onClick={registerStudent} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </div>

      <div>
        <h2>Remove Student</h2>
        <input
          type="text"
          placeholder="Student ID, Number Only"
          value={removeStudentId}
          onChange={(e) => setRemoveStudentId(e.target.value)}
          disabled={loading}
        />
        <button onClick={removeStudent} disabled={loading}>
          {loading ? "Removing..." : "Remove"}
        </button>
      </div>

      <div>
        <h2>Registered Students</h2>
        <button onClick={fetchStudents} disabled={loading}>
          {loading ? "Fetching..." : "Refresh List"}
        </button>
        <ul>
          {students.map((student, index) => (
            <li key={index}>
              {student.id.toString()} - {student.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
