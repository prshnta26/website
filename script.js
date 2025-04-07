document.addEventListener('DOMContentLoaded', () => {
    const dobInput = document.getElementById('dobInput');
    const tobInput = document.getElementById('tobInput'); // Get Time of Birth input
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsDiv = document.getElementById('results');
    const errorDiv = document.getElementById('error');

    // Result Spans
    const ageInDaysSpan = document.getElementById('ageInDays');
    const ageInHoursSpan = document.getElementById('ageInHours');
    const ageInMinutesSpan = document.getElementById('ageInMinutes');
    const ageInSecondsSpan = document.getElementById('ageInSeconds');

    // Milestone ULs
    const daysMilestonesUl = document.getElementById('daysMilestones');
    const hoursMilestonesUl = document.getElementById('hoursMilestones');
    const minutesMilestonesUl = document.getElementById('minutesMilestones');
    const secondsMilestonesUl = document.getElementById('secondsMilestones');

    // Define Milestones
    const dayMilestones = [100, 500, 1000, 5000, 7777, 10000, 15000, 20000, 25000, 30000];
    const hourMilestones = [10000, 50000, 100000, 250000, 500000, 750000, 1000000];
    const minuteMilestones = [100000, 500000, 1000000, 5000000, 10000000, 25000000, 50000000];
    const secondMilestones = [10000000, 50000000, 100000000, 500000000, 1000000000, 2000000000, 3000000000];

    calculateBtn.addEventListener('click', () => {
        const dobValue = dobInput.value; // Format: YYYY-MM-DD
        const tobValue = tobInput.value; // Format: HH:MM or HH:MM:SS

        if (!dobValue) {
            showError("Please select your date of birth.");
            return;
        }

        // Construct the full date/time string for the Date object
        let dateTimeString;
        if (tobValue) {
            dateTimeString = `${dobValue}T${tobValue}`;
        } else {
            dateTimeString = `${dobValue}T00:00:00`;
        }

        const dob = new Date(dateTimeString);
        const now = new Date(); // Current date and time

        // --- Validation ---
        if (isNaN(dob.getTime())) {
            showError("Invalid date or time entered. Please check your input.");
            return;
        }
        if (dob > now) {
            showError("Date and time of birth cannot be in the future.");
            return;
        }
        // --- End Validation ---

        hideError();
        calculateAndDisplayResults(dob, now);
        resultsDiv.classList.remove('hidden');
    });

    function calculateAndDisplayResults(dob, now) {
        const diffTime = now.getTime() - dob.getTime();

        const totalSeconds = Math.floor(diffTime / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);

        ageInDaysSpan.textContent = totalDays.toLocaleString();
        ageInHoursSpan.textContent = totalHours.toLocaleString();
        ageInMinutesSpan.textContent = totalMinutes.toLocaleString();
        ageInSecondsSpan.textContent = totalSeconds.toLocaleString();

        clearMilestones();

        calculateMilestones(dob, now, dayMilestones, 'days', daysMilestonesUl);
        calculateMilestones(dob, now, hourMilestones, 'hours', hoursMilestonesUl);
        calculateMilestones(dob, now, minuteMilestones, 'minutes', minutesMilestonesUl);
        calculateMilestones(dob, now, secondMilestones, 'seconds', secondsMilestonesUl);
    }

    function calculateMilestones(dob, now, milestones, unit, ulElement) {
         const dobMillis = dob.getTime();

        milestones.forEach(value => {
            let milestoneMillisToAdd = 0;

            switch(unit) {
                case 'days':
                    milestoneMillisToAdd = value * 24 * 60 * 60 * 1000;
                    break;
                case 'hours':
                    milestoneMillisToAdd = value * 60 * 60 * 1000;
                    break;
                case 'minutes':
                    milestoneMillisToAdd = value * 60 * 1000;
                    break;
                case 'seconds':
                    milestoneMillisToAdd = value * 1000;
                    break;
            }

            const milestoneDate = new Date(dobMillis + milestoneMillisToAdd);
            addMilestoneToList(ulElement, value, unit, milestoneDate, now);
        });
    }

    function addMilestoneToList(ulElement, value, unit, milestoneDate, now) {
        const li = document.createElement('li');

        // --- MODIFICATION HERE ---
        // Change 'month: "numeric"' or default to 'month: "long"'
        const dateFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        // --- END MODIFICATION ---

        const dateString = milestoneDate.toLocaleDateString(undefined, dateFormatOptions); // e.g., April 7, 2025

        const timeFormatOptions = { hour: '2-digit', minute: '2-digit' }; // e.g., 11:30 AM / 23:30
        const timeString = milestoneDate.toLocaleTimeString(undefined, timeFormatOptions);

        const status = milestoneDate < now ? '<span class="passed">(Passed)</span>' : '<span class="upcoming">(Upcoming)</span>';

        li.innerHTML = `Your <span class="value">${value.toLocaleString()}</span> ${unit} milestone ${milestoneDate < now ? 'was' : 'is'} on: <span class="datetime">${dateString} at ${timeString}</span> ${status}`;
        ulElement.appendChild(li);
    }

     function clearMilestones() {
        daysMilestonesUl.innerHTML = '';
        hoursMilestonesUl.innerHTML = '';
        minutesMilestonesUl.innerHTML = '';
        secondsMilestonesUl.innerHTML = '';
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        resultsDiv.classList.add('hidden');
    }

    function hideError() {
        errorDiv.classList.add('hidden');
    }
});