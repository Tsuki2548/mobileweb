export class StudentManager {
    constructor() {
        this.students = [];
    }
    addStudent(student) {
        this.students.push(student);
        this.saveToLocalStorage();
    }
    getAllStudent() {
        return this.students;
    }
    findStudentByID(id) {
        return this.students.find(s => s.id === id);
    }
    findStudentsByFirstName(first_name) {
        return this.students.filter(s => s.first_name.toLowerCase().includes(first_name.toLowerCase()));
    }
    findStudentsByEmail(email) {
        return this.students.filter(s => s.email.toLowerCase().includes(email.toLowerCase()));
    }
    findStudentByMajor(major) {
        return this.students.filter(s => s.major.toLowerCase().includes(major.toLocaleLowerCase()));
    }
    saveToLocalStorage() {
        localStorage.setItem("students", JSON.stringify(this.students));
    }
    loadFromLocalStorage() {
        const data = localStorage.getItem("students");
        if (data) {
            this.students = JSON.parse(data);
        }
    }
    clearLocalStorage() {
        localStorage.removeItem("students");
        this.students = [];
    }
}
