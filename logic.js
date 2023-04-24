const courses = getCourses();
const services = getServices();
const busyDays = getBusyDays();
const classrooms = getClassrooms();

const daysArr = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const dayTimeArr = ["Morning", "Afternoon"];

const ALL_DAYS = {
  Monday: { Morning: {}, Afternoon: {} },
  Tuesday: { Morning: {}, Afternoon: {} },
  Wednesday: { Morning: {}, Afternoon: {} },
  Thursday: { Morning: {}, Afternoon: {} },
  Friday: { Morning: {}, Afternoon: {} },
};

const setServiceLessons = () => {
  services.filter((service) => {
    const serviceCourse = courses.find((course) => course.courseCode === service.courseCode);
    serviceCourse.day = service.day;
    serviceCourse.dayTime = service.dayTime;
    const selectedClass = selectClassroom(serviceCourse, service.day, service.dayTime);
    if (!selectedClass) {
      throw new Error("There is no way to make a schedule for the department.");
    }
    serviceCourse.class = selectedClass.classId;
    ALL_DAYS[serviceCourse.day][serviceCourse.dayTime][selectedClass.classId] = serviceCourse;
  });
};

const setCourses = (course) => {
  if (!course.day) {
    for (let i = 0; i < daysArr.length; i++) {
      for (let j = 0; j < dayTimeArr.length; j++) {
        if (
          course.day ||
          checkInstructor(course, daysArr[i], dayTimeArr[j]) ||
          checkDay(course, daysArr[i], dayTimeArr[j])
        )
          continue;
        selectedClass = selectClassroom(course, daysArr[i], dayTimeArr[j]);
        if (selectedClass) {
          course.day = daysArr[i];
          course.dayTime = dayTimeArr[j];
          course.class = selectedClass.classId;
          ALL_DAYS[daysArr[i]][dayTimeArr[j]][selectedClass.classId] = course;
        }
      }
    }
  }
};

const selectClassroom = (course, day, dayTime) => {
  let selectedClass = null;
  for (let _class of classrooms) {
    if (!ALL_DAYS[day][dayTime][_class.classId] && course.studentsNumber <= _class.capacity) {
      if (!selectedClass) {
        selectedClass = _class;
      } else if (selectedClass.capacity > _class.capacity) {
        selectedClass = _class;
      }
    }
  }
  return selectedClass;
};

const checkDay = (course, day, dayTime) => {
  let isSameDayTime = false;
  const sameDayCourses = Object.values(ALL_DAYS[day][dayTime]);
  sameDayCourses.forEach((_anotherSameDayCourse) => {
    if (course.year === _anotherSameDayCourse.year || course.instructorName === _anotherSameDayCourse.instructorName) {
      isSameDayTime = true;
    }
  });
  return isSameDayTime;
};

const checkInstructor = (course, day, dayTime) => {
  let isBusyDayTime = false;
  busyDays.forEach((busyDay) => {
    if (course.instructorName === busyDay.instructorName && day === busyDay.day && dayTime === busyDay.dayTime) {
      isBusyDayTime = true;
    }
  });
  return isBusyDayTime;
};

// SHOW LESSONS
let timeSelector;
function getOrderedLessons() {
  for (let i = 0; i < daysArr.length; i++) {
    for (let j = 0; j < dayTimeArr.length; j++) {
      timeSelector = `${daysArr[i].toLowerCase()}-${dayTimeArr[j].toLowerCase()}`;
      classrooms.forEach((classroom) => {
        const course = ALL_DAYS[daysArr[i]][dayTimeArr[j]][classroom.classId];
        let html = ``;
        console.log(timeSelector);
        if (course) {
          html += `
            <td>
              <button class="non-bordered" id="${course.courseCode}">${course.courseCode}</button>
            </td>
          `;
        } else {
          html += `
          <td></td>`;
        }
        document.getElementById(timeSelector).innerHTML += html;
      });
    }
  }
}

function getCourse(courseCode) {
  return courses.filter((_course) => courseCode === _course.courseCode);
}

window.addEventListener("click", (event) => {
  console.log(getCourse(event.target.id)[0]);
});
