async function readSingleFile(event) {
  //Retrieve the first (and only!) File from the FileList object
  const file = event.target.files[0];
  switch (file.name.toLowerCase()) {
    case "service.csv":
      Papa.parse(file, {
        delimiter: ";",
        complete: (results) => {
          const services = [];
          for (const result of results.data) {
            services.push(
              new Object({
                courseCode: result[0],
                day: result[1],
                dayTime: result[2],
              })
            );
          }
          localStorage.setItem("services", JSON.stringify(services));
          routeToCourses();
        },
      });
      break;
    case "courses.csv":
      Papa.parse(file, {
        delimiter: ";",
        complete: (results) => {
          const courses = [];
          for (const result of results.data) {
            courses.push(
              new Object({
                courseCode: result[0],
                courseName: result[1],
                year: result[2],
                credit: result[3],
                compulsaryOrElective: result[4],
                departmentOrService: result[5],
                studentsNumber: parseInt(result[6]),
                instructorName: result[7],
              })
            );
          }
          localStorage.setItem("courses", JSON.stringify(courses));
          routeToCourses();
        },
      });

      break;
    case "classroom.csv":
      Papa.parse(file, {
        delimiter: ";",
        complete: (results) => {
          const classrooms = [];
          for (const result of results.data) {
            classrooms.push(
              new Object({
                classId: result[0],
                capacity: parseInt(result[1]),
                selected: false,
              })
            );
          }
          localStorage.setItem("classrooms", JSON.stringify(classrooms));
          routeToCourses();
        },
      });
      break;
    case "busy.csv":
      Papa.parse(file, {
        delimiter: ";",
        complete: (results) => {
          const busyDays = [];
          for (const result of results.data) {
            busyDays.push(
              new Object({
                instructorName: result[0],
                day: result[1],
                dayTime: result[2],
              })
            );
          }
          localStorage.setItem("busyDays", JSON.stringify(busyDays));
          routeToCourses();
        },
      });
      break;
    default:
      alert("You should submit services.csv, courses.csv, classroom.csv, busy.csv");
  }
}

function getServices() {
  const _services = JSON.parse(localStorage.getItem("services"));
  return _services;
}

function getCourses() {
  const _courses = JSON.parse(localStorage.getItem("courses"));
  return _courses;
}

function getBusyDays() {
  const _busyDays = JSON.parse(localStorage.getItem("busyDays"));
  return _busyDays;
}

function getClassrooms() {
  const _classrooms = JSON.parse(localStorage.getItem("classrooms"));
  return _classrooms;
}

function routeToCourses() {
  if (getServices() && getCourses() && getBusyDays() && getClassrooms()) {
    location.href = "/courses.html";
  }
}

function routeToHomepage() {
  if (!getServices() || !getCourses() || !getBusyDays() || !getClassrooms()) {
    location.href = "/";
  } else {
    setServiceLessons();
    courses.forEach((course) => setCourses(course));
  }
}

document.getElementById("file-upload").addEventListener("change", readSingleFile);
