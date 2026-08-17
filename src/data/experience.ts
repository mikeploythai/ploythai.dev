type Experience = {
	organization: string;
	url?: string;
	startDate: Date;
	endDate?: Date;
	title: string;
};

export const experiences: Experience[] = [
	{
		organization: "Pacific HealthWorks",
		url: "https://pacifichealthworks.com",
		startDate: new Date(2024, 5),
		title: "UI/UX Developer",
	},
	{
		organization: "California State University, Fullerton",
		url: "https://fullerton.edu",
		startDate: new Date(2019, 7),
		endDate: new Date(2023, 5),
		title: "Computer Science Major",
	},
];
