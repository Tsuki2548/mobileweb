import { Student } from "./models/Student.js";
import { StudentManager } from "./managers/StudentManager.js";
import { showList } from "./utils/showList.js"

const manager = new StudentManager();
manager.loadFromLocalStorage();

function renderTable(elementId: string = "studentTableBody"): void {
    const tableBody = document.getElementById(elementId)!;
    tableBody.innerHTML = "";
    const students = manager.getAllStudent();
    
    students.forEach((s) => {
        tableBody.innerHTML += `
        <tr>
            <td>${s.id}</td>
            <td>${s.title_name}</td>
            <td>${s.first_name}</td>
            <td>${s.last_name}</td>
            <td>${s.email}</td>
            <td>${s.year}</td>
            <td>${s.major}</td>
        </tr>
        `;
    });
}

(document.getElementById("addBtn") as HTMLButtonElement).onclick = () => {
    const id = (document.getElementById("id") as HTMLInputElement).value;
    const year = Number((document.getElementById("year") as HTMLInputElement).value);
    const major = (document.getElementById("major") as HTMLInputElement).value;
    const title_name = (document.getElementById("title_name") as HTMLInputElement).value;
    const first_name = (document.getElementById("first_name") as HTMLInputElement).value;
    const last_name = (document.getElementById("last_name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    
    const student: Student = { id, year, major, title_name, first_name, last_name, email };
    manager.addStudent(student);
    renderTable();
};


(document.getElementById("searchFirstNameBtn") as HTMLButtonElement).onclick = () => {
    const keyword = (document.getElementById("searchFirstName") as HTMLInputElement).value;
    const results = manager.findStudentsByFirstName(keyword);
    showList<Student>(results);
    alert(`ผลการค้นหา: ${results.length} คน`);
};

(document.getElementById("searchMajorBtn") as HTMLButtonElement).onclick = () => {
    const keyword = (document.getElementById("searchMajor") as HTMLInputElement).value;
    const results = manager.findStudentByMajor(keyword);
    showList<Student>(results);
    alert(`พบในสาขา: ${results.length} คน`);
};

(document.getElementById("searchEmailBtn") as HTMLButtonElement).onclick = () => {
    const keyword = (document.getElementById("searchEmail") as HTMLInputElement).value;
    const results = manager.findStudentsByEmail(keyword);
    showList<Student>(results);
    alert(`พบอีเมล: ${results.length} คน`);
};

renderTable("studentTableBody");
