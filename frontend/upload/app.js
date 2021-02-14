const apiEndpoint = "http://localhost:3000";

window.onload = function () {
  const params = new URLSearchParams(window.location.search);

  load();

  document.getElementById("addNew").onclick = function () {
      addNewRow();
  };

  document.getElementById("deleteAll").onclick = function () {
      document.getElementById("tableBody").innerHTML = "";
  };

  let fileInput = document.getElementById("fileInputButton");
  fileInput.onchange = function () {
    console.log(fileInput.files.length);

    if (fileInput.files.length == 0) {
      document.getElementById("autofillButton").disabled = true;
    } else {
      document.getElementById("autofillButton").disabled = false;
    }
  };

  document.getElementById("autofillButton").onclick = async function () {
      const file = document.getElementById("fileInputButton").files[0];
      if (file != null) {
          const assessments = await postPDF(file);
          assessments.forEach((a) => {
              addNewRow(a.item, formatDate(a.date), a.weight);
          });
      }
  };

  function load() {
    document.getElementById("courseName").value = params.get('courseName') || '';
    document.getElementById("courseCode").value = params.get('courseCode') || '';
    document.getElementById("university").value = params.get('university') || '';
    document.getElementById("term").value = params.get('term') || '';

    let id = params.get('id');
    if (id) {
      fetch(`${apiEndpoint}/assessments/${id}`).then(res => {
        return res.json();
      }).then(data => {
        console.log(data);
        for (const a of data) {
          addNewRow(a.item, formatDate(a.date), a.weight);
        }
      }).catch(e => console.error(e))
    }
  }

  function formatDate(date) {
      var d = new Date(date),
          month = "" + (d.getMonth() + 1),
          day = "" + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
  }

  async function postPDF(file) {
      // Default options are marked with *
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${apiEndpoint}/uploadSyllabus`, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          body: formData,
      });
      return response.json(); // parses JSON response into native JavaScript objects
  }

  function addNewRow(name, deadline, weight = 1) {
      let newEl = document.createElement("TR");
      newEl.classList.add("tableRow");
      newEl.innerHTML = `
      <td class="tableCell name">
        <input class="tableInput" type="text" value="${name}" />
      </td>
      <td class="tableCell deadline">
        <input class="tableInput" type="date" value="${deadline}" />
      </td>
      <td class="tableCell weight">
        <input class="tableInput percent" type="number" min="1" max="100" value="${weight}" />
      </td>
      <td><img src="../assets/trash.svg" class="delete" /></td>
    `;

      document.getElementById("tableBody").appendChild(newEl);

      let deletebtns = document.getElementsByClassName("delete");
      for (const i in deletebtns) {
          deletebtns[i].onclick = function () {
              deleteRow(i);
          };
      }
  }

  function deleteRow(i) {
      console.log(i);
      let el = document.getElementById("tableBody");
      el.removeChild(el.childNodes[i]);

      let deletebtns = document.getElementsByClassName("delete");
      for (const i in deletebtns) {
          deletebtns[i].onclick = function () {
              deleteRow(i);
          };
      }
  }
};