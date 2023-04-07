const autocompleteInput = document.getElementById('autocomplete');
const suggestionsList = document.getElementById('suggestions');
const remainingDaysElement = document.getElementById('remaining-days');

const handleSearchAutocomplete = () => {
	const searchTerm = autocompleteInput.value.trim();

	// Clear previous suggestions
	suggestionsList.innerHTML = '';

	if (searchTerm.length < 3) {
		remainingDaysElement.innerHTML = '';
		return;
	}

	// Make XMLHttpRequest to retrieve autocomplete information from results.json
	const request = new XMLHttpRequest();
	request.open('GET', './db/birthdays.json');
	request.responseType = 'json';
	request.send();
	request.onload = () => {
		const results = request.response;
		// Filter results by name or birth month
		const matchedResults = results.filter(
			(result) =>
				result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				new Date(result.birth_date)
					.toLocaleString('it-IT', { month: 'long' })
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
		);

		// Display "Nulla da mostrare" if there are no matched results
		if (matchedResults.length === 0) {
			const nothingToShow = document.createElement('li');
			nothingToShow.textContent = 'Nulla da mostrare';
			suggestionsList.appendChild(nothingToShow);
			return;
		}

		// Display matched results
		matchedResults.forEach((result) => {
			const birth_date = new Date(result.birth_date);
			const suggestion = document.createElement('li');
			suggestion.textContent = `${
				result.name
			} - ${birth_date.toLocaleDateString('it-IT', {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			})}`;
			suggestion.addEventListener('click', () =>
				handleSuggestionClick(result)
			);
			suggestionsList.appendChild(suggestion);
		});
	};
};

// adds the selected suggestion to the input field and displays the remaining days
const handleSuggestionClick = (result) => {
	suggestionsList.innerHTML = '';
	autocompleteInput.value = result.name;
	birthdayCalculator(result);
};

const birthdayCalculator = (result) => {
	const birthDate = new Date(result.birth_date);
	const today = new Date();
	// The next lines of code, I found on StackOverflow :) https://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
	birthDate.setFullYear(today.getFullYear());
	if (birthDate < today) {
		birthDate.setFullYear(today.getFullYear() + 1);
	}
	const timeDiff = birthDate.getTime() - today.getTime();
	const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

	if (daysDiff === 0 || daysDiff === 365) {
		remainingDaysElement.innerHTML = `<strong class="animate">È il compleanno di ${result.name} 🎉</strong>`;
	} else if (daysDiff === 1) {
		remainingDaysElement.innerHTML = `Mancano <strong class="animate">${daysDiff} giorno per il compleanno di <strong class="animate">${result.name}</strong> 🎉</strong>`;
	} else {
		remainingDaysElement.innerHTML = `Mancano <strong class="animate">${daysDiff}</strong> giorni per il compleanno di <strong class="animate">${result.name}</strong>`;
	}
};

autocompleteInput.addEventListener('input', handleSearchAutocomplete);
