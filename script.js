let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let editIndex = -1;
let chart;

displaySubjects();
calculateGPA();

/* Add Subject */

function addSubject(){

    let subjectName = document.getElementById("subject").value;
    let credit = parseFloat(document.getElementById("credit").value);

    let gradeSelect = document.getElementById("grade");

    if(gradeSelect.value === ""){
        alert("Please select a grade");
        return;
    }

    let gradeLetter =
    gradeSelect.options[gradeSelect.selectedIndex].text;

    let gradePoint =
    parseFloat(gradeSelect.value);

    

    if(subjectName === "" || isNaN(credit)){

        alert("Please fill all fields");
        return;

    }

    let subject = {

        name: subjectName,
        credit: credit,
        gradeLetter: gradeLetter,
        gradePoint: gradePoint

    };

    if(editIndex === -1){
        subjects.push(subject);
    }
    else{
        subjects[editIndex] = subject;
        editIndex = -1;
        document.getElementById("addBtn").innerText = "Add Subject";
    }

    saveData();

    displaySubjects();

    calculateGPA();

    renderChart();

    clearFields();

}

/* Display Subjects */

function displaySubjects(){

    let table = document.getElementById("subjectList");

    table.innerHTML = "";

    subjects.forEach((sub,index)=>{

        table.innerHTML += `

        <tr>

            <td>${sub.name}</td>
            <td>${sub.credit}</td>
            <td>${sub.gradeLetter}</td>
            <td>${sub.gradePoint}</td>

            <td>

                <button class="delete-btn"
                onclick="deleteSubject(${index})">

                Delete

                </button>

            </td>

        </tr>

        `;

    });

    document.getElementById("totalSubjects").innerText =
    subjects.length;

}

/* Delete Subject */

function deleteSubject(index){

    subjects.splice(index,1);

    saveData();

    displaySubjects();

    calculateGPA();

    renderChart();

}
function editSubject(index){
    let sub = subjects[index];

    document.getElementById("subject").value = sub.name;
    document.getElementById("credit").value = sub.credit;
    document.getElementById("grade").value = sub.gradePoint;

    editIndex = index;
    document.getElementById("addBtn").innerText = "Update Subject";

}

/* GPA Calculation */

function calculateGPA(){

    let totalCredits = 0;

    let totalPoints = 0;

    subjects.forEach(sub => {

        totalCredits += sub.credit;

        totalPoints +=
        sub.credit * sub.gradePoint;

    });

    let gpa = totalPoints / totalCredits;

    if(isNaN(gpa)){

        gpa = 0;

    }

    document.getElementById("gpaValue").innerText =
    gpa.toFixed(2);

    document.getElementById("totalCredits").innerText =
    totalCredits;

    updateAcademicStatus(gpa);

}

/* Academic Status */

function updateAcademicStatus(gpa){

    let status = "";

    if(gpa >= 3.7){

        status = "Excellent";

    }

    else if(gpa >= 3.0){

        status = "Good";

    }

    else if(gpa >= 2.0){

        status = "Average";

    }

    else{

        status = "Needs Improvement";

    }

    document.getElementById("academicStatus").innerText =
    status;

}

/* Save Data */

function saveData(){

    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );

}

/* Clear Fields */

function clearFields(){

    document.getElementById("subject").value = "";
    document.getElementById("credit").value = "";
    document.getElementById("grade").selectedIndex = 0;

    document.getElementById("addBtn").innerText = "Add Subject";
    document.getElementById("addBtn").disabled = true;
}

displaySubjects();
calculateGPA();
renderChart();

function renderChart(){

    let gradeCount = {};

    subjects.forEach(sub => {

        if(sub.gradeLetter){

            if(gradeCount[sub.gradeLetter]){
                gradeCount[sub.gradeLetter]++;
            } else {
                gradeCount[sub.gradeLetter] = 1;
            }

        }

    });

    let labels = Object.keys(gradeCount);
    let data = Object.values(gradeCount);

    let ctx = document.getElementById("gradeChart");

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type: "pie",

        data: {
            labels: labels,
            datasets: [{
                data: data
            }]
        }

    });
}
let links = document.querySelectorAll(".sidebar a");

links.forEach(link => {

    link.addEventListener("click", function(){

        links.forEach(l => l.classList.remove("active"));

        this.classList.add("active");

    });

});

function checkForm(){

    const subject = document.getElementById("subject").value.trim();
    const credit = document.getElementById("credit").value;
    const grade = document.getElementById("grade").value;

    const btn = document.getElementById("addBtn");

    btn.disabled = !(subject && credit && grade);

}

document.getElementById("subject").addEventListener("input", checkForm);
document.getElementById("credit").addEventListener("input", checkForm);
document.getElementById("grade").addEventListener("change", checkForm);

function toggleSidebar(){
    document.querySelector(".sidebar").classList.toggle("hide");
}

async function sendMessage(){

    let input = document.getElementById("chatInput");

    let message = input.value.trim();

    if(message === "") return;

    addMessage("You", message);

    addMessage("AI", "Typing...");

    let response = await getAIResponse(message);

    let chatBox = document.getElementById("chatBox");

    chatBox.lastElementChild.remove();

    addMessage("AI", response);

    input.value = "";

}

function addMessage(sender, text){

    let chatBox = document.getElementById("chatBox");

    chatBox.innerHTML += `
        <p><b>${sender}:</b> ${text}</p>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;
}
async function getAIResponse(message){

    const apiKey = "AIzaSyBQ4YOyZ_XXFRCIB5Ut8H7FCRp4U0yrF_U";

    try {

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBQ4YOyZ_XXFRCIB5Ut8H7FCRp4U0yrF_U`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: message
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log(data);

        if(data.candidates){

            return data.candidates[0].content.parts[0].text;

        } else {

            return JSON.stringify(data);

        }

    }

    catch(error){

        console.error(error);

        return "Connection failed.";

    }

}
document.addEventListener("DOMContentLoaded", function(){

    document.getElementById("subject").addEventListener("input", checkForm);
    document.getElementById("credit").addEventListener("input", checkForm);
    document.getElementById("grade").addEventListener("change", checkForm);

    checkForm(); // run once on load

});