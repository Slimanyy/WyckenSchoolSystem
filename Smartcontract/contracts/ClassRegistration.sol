// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ClassRegistration {
    address public admin;
    
    struct Student {
        uint256 id;
        string name;
        bool isRegistered;
    }

    mapping(uint256 => Student) private students;
    uint256[] private studentIds;

    event StudentRegistered(uint256 indexed studentId, string name);
    event StudentRemoved(uint256 indexed studentId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "You are not the admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerStudent(uint256 _id, string calldata _name) external onlyAdmin {
        require(!students[_id].isRegistered, "Student already registered");

        students[_id] = Student(_id, _name, true);
        studentIds.push(_id);
        
        emit StudentRegistered(_id, _name);
    }

    function removeStudent(uint256 _id) external onlyAdmin {
        require(students[_id].isRegistered, "Student not found");

        delete students[_id];

        for (uint256 i = 0; i < studentIds.length; i++) {
            if (studentIds[i] == _id) {
                studentIds[i] = studentIds[studentIds.length - 1];
                studentIds.pop();
                break;
            }
        }

        emit StudentRemoved(_id);
    }

    function getStudentbyId(uint256 _id) external view returns (string memory name, bool isRegistered) {
        require(students[_id].isRegistered, "There is no student with this Id");
        return (students[_id].name, students[_id].isRegistered);
    }

    function getStudents() external view returns (Student[] memory) {
        Student[] memory allStudents = new Student[](studentIds.length);
        for (uint256 i = 0; i < studentIds.length; i++) {
            allStudents[i] = students[studentIds[i]];
        }
        return allStudents;
    }
}
