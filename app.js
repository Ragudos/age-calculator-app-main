
function setError(item, errorMsg) {
    const inputContainer = document.getElementById(`${item}-input-container`);
    const errorElement = document.getElementById(`${item}-error`);

    inputContainer.setAttribute("data-error", "true");
    errorElement.textContent = errorMsg;
}

function isMultiple(num, multipleOf) {
    return num % multipleOf == 0;
}

function isNumberLeapYear(num) {
    const isMultipleOfFour = isMultiple(num, 4);
    const isMultipleOfOneHundred = isMultiple(num, 100);
    const isMultipleOfFourHundred = isMultiple(num, 400);

    if (isMultipleOfFourHundred) {
        return true;
    }

    return isMultipleOfFour && !isMultipleOfOneHundred;
}

window.addEventListener("DOMContentLoaded", () => {
    const allInputs = document.querySelectorAll(".section-of-inputs input");
    const submitBtn = document.getElementById("submit-btn");

    const keys = ["year", "month", "day"];
    const userBirthday = {};

    const numToMonthValuePair = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
    };

    const monthToDaysPair = {
        January: 31,
        February: {
            leapYear: 29,
            nonLeapYear: 28
        },
        March: 31,
        April: 30,
        May: 31,
        June: 30,
        July: 31,
        August: 31,
        September: 30,
        October: 31,
        November: 30,
        December: 31,
    }

    allInputs.forEach((el) => {
        el.addEventListener("change", (e) => {
            if (e.target.value.length == 1) {
                e.target.value = `0${e.target.value}`;
            }
            const name = e.target.getAttribute("name");
            const inputContainer = document.getElementById(`${name}-input-container`);
            const errorElement = document.getElementById(`${name}-error`);

            inputContainer.removeAttribute("data-error");
            errorElement.textContent = "";
            userBirthday[name] = e.target.value;
        });

        el.addEventListener("keyup", (e) => {
            const name = e.target.getAttribute("name");
            const inputContainer = document.getElementById(`${name}-input-container`);
            const errorElement = document.getElementById(`${name}-error`);

            inputContainer.removeAttribute("data-error");
            errorElement.textContent = "";

            userBirthday[name] = e.target.value;
        });
    });

    submitBtn.addEventListener("click", () => {
        let didErrorOccur = false;
        const currentDate = new Date()

        for (const item of keys) {
            if (!userBirthday[item]) {
                setError(item, "This field is required.");

                didErrorOccur = true;
            } else {
                if (item == "year") {
                    const currentYear = currentDate.getFullYear();
                    const insertedYear = +userBirthday[item];

                    if (insertedYear > currentYear) {
                        setError(item, "Must be in the past.");

                        didErrorOccur = true;
                    }
                } else if (item == "month") {
                    const insertedMonth = +userBirthday[item];
                    const insertedYear = +userBirthday["year"];

                    if (insertedYear && insertedYear - currentDate.getFullYear() == 0) {
                        if (insertedMonth > (currentDate.getMonth() + 1)) {
                            setError(item, "Must be a valid month.");

                            didErrorOccur = true;

                            continue;
                        }
                    }

                    if (insertedMonth > 12) {
                        setError(item, "Must be a valid month.");

                        didErrorOccur = true;
                    }
                } else if (item == "day") {
                    const currentYear = currentDate.getFullYear();
                    const insertedYear = +userBirthday.year;

                    if (insertedYear > currentYear) {
                        continue;
                    }

                    const insertedMonth = +userBirthday.month;
                    const insertedDay = +userBirthday[item];

                    if (currentYear - insertedYear == 0) {
                        if ((currentDate.getMonth() + 1) - insertedMonth == 0) {
                            if (insertedDay > currentDate.getDate()) {
                                setError(item, "Must be a valid day.");

                                didErrorOccur = true;

                                continue;
                            }
                        }
                    }

                    if (insertedMonth > 12) {
                        continue;
                    }

                    const textMonth = numToMonthValuePair[insertedMonth];
                    const daysInTheMonth = monthToDaysPair[textMonth];

                    if (textMonth == "February" && insertedYear) {
                        if (isNumberLeapYear(insertedYear) && insertedDay > daysInTheMonth.leapYear) {
                            setError(item, "Must be a valid day.");

                            didErrorOccur = true;
                        } else if (!isNumberLeapYear(insertedYear) && insertedDay > daysInTheMonth.nonLeapYear) {
                            setError(item, "Must be a valid day.");

                            didErrorOccur = true;
                        }
                    } else {
                        if (insertedDay > daysInTheMonth) {
                            setError(item, "Must be a valid day.");

                            didErrorOccur = true;
                        }
                    }

                }
            }
        }

        if (didErrorOccur) {
            return;
        }

        const inputContainers = document.querySelectorAll(".input-container[data-error='true']");
        const errorElements = document.querySelectorAll(".error");

        inputContainers.forEach((container) => {
            container.removeAttribute("data-error");
        });

        errorElements.forEach((el) => {
            el.textContent = "";
        });

        const insertedYear = +userBirthday.year;
        const insertedMonth = +userBirthday.month;
        const insertedDay = +userBirthday.day;
      
        let years = currentDate.getFullYear() - insertedYear;
        let months = currentDate.getMonth() - (insertedMonth - 1);
        let days = currentDate.getDate() - insertedDay;
      
        if (days < 0) {
          months--;
          const lastMonthDate = new Date(currentDate);
          lastMonthDate.setDate(0); // Go back to the last day of the previous month
        
          days += lastMonthDate.getDate();
        }
      
        if (months < 0) {
          years--;
          months += 12;
        }

        const yearResult = document.getElementById("year-result");
        const monthResult = document.getElementById("month-result");
        const dayResult = document.getElementById("day-result");

        document.querySelectorAll(".result").forEach((el) => {
            el.removeAttribute("data-empty");
        });

        yearResult.textContent = years < 10 ? `0${years}` : years;
        monthResult.textContent = months < 10 ? `0${months}` : months;
        dayResult.textContent = days < 10 ? `0${days}` : days;
    });
});
